// ============================================
// Appointment Polling Fallback Utility
// National 1031 Center - HighLevel Integration
// ============================================

import { DatabaseService } from '../services/database.service';
import { HighLevelService } from '../services/highlevel.service';
import type { Appointment, AppointmentStatus } from '../types/highlevel';

// ============================================
// Polling Configuration
// ============================================

interface PollingConfig {
  maxAttempts: number;
  baseInterval: number; // milliseconds
  maxInterval: number;   // milliseconds
  exponentialBackoff: boolean;
}

const DEFAULT_CONFIG: PollingConfig = {
  maxAttempts: 10,
  baseInterval: 5000,   // 5 seconds
  maxInterval: 60000,   // 1 minute
  exponentialBackoff: true
};

// ============================================
// Appointment Poller Class
// ============================================

export class AppointmentPoller {
  private config: PollingConfig;
  private activePolls: Map<string, AbortController> = new Map();

  constructor(config: Partial<PollingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start polling for appointment assignment
   */
  async startPolling(
    appointmentId: string,
    onUpdate: (appointment: Appointment) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // Stop any existing polling for this appointment
    this.stopPolling(appointmentId);

    const controller = new AbortController();
    this.activePolls.set(appointmentId, controller);

    try {
      await this.pollWithBackoff(
        appointmentId,
        onUpdate,
        onError,
        controller.signal
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Polling error:', error);
        onError(error as Error);
      }
    } finally {
      this.activePolls.delete(appointmentId);
    }
  }

  /**
   * Stop polling for specific appointment
   */
  stopPolling(appointmentId: string): void {
    const controller = this.activePolls.get(appointmentId);
    if (controller) {
      controller.abort();
      this.activePolls.delete(appointmentId);
    }
  }

  /**
   * Stop all active polling
   */
  stopAllPolling(): void {
    for (const [appointmentId, controller] of this.activePolls) {
      controller.abort();
    }
    this.activePolls.clear();
  }

  /**
   * Get number of active polls
   */
  getActivePollCount(): number {
    return this.activePolls.size;
  }

  // ============================================
  // Private Methods
  // ============================================

  private async pollWithBackoff(
    appointmentId: string,
    onUpdate: (appointment: Appointment) => void,
    onError: (error: Error) => void,
    signal: AbortSignal
  ): Promise<void> {
    const databaseService = DatabaseService.getInstance();
    let attempts = 0;

    while (attempts < this.config.maxAttempts && !signal.aborted) {
      try {
        attempts++;

        // Check database for updates
        const appointment = await databaseService.getAppointment(appointmentId);
        
        if (!appointment) {
          throw new Error(`Appointment ${appointmentId} not found`);
        }

        // Log polling attempt
        await databaseService.incrementPollingAttempts(appointmentId);

        // Check if appointment is now confirmed or failed
        if (appointment.status === 'confirmed' || appointment.status === 'failed') {
          console.log(`Polling complete for ${appointmentId}: ${appointment.status}`);
          onUpdate(appointment);
          return;
        }

        // If we've exhausted polling attempts, try one more check against HighLevel API
        if (attempts >= this.config.maxAttempts) {
          console.log(`Max polling attempts reached for ${appointmentId}, checking HighLevel API`);
          const apiResult = await this.checkHighLevelAPI(appointment);
          
          if (apiResult) {
            onUpdate(apiResult);
            return;
          } else {
            // Mark as failed after max attempts
            const failedAppointment = await databaseService.updateAppointment(appointmentId, {
              status: 'failed',
              webhookPayload: { 
                polling_timeout: true, 
                max_attempts_reached: attempts,
                timeout_at: new Date().toISOString()
              },
              webhookReceivedAt: new Date()
            });
            
            if (failedAppointment) {
              onUpdate(failedAppointment);
            }
            return;
          }
        }

        // Calculate next interval with exponential backoff
        const interval = this.calculateNextInterval(attempts);
        
        console.log(`Polling attempt ${attempts}/${this.config.maxAttempts} for ${appointmentId}, next check in ${interval}ms`);

        // Wait for next attempt
        await this.sleep(interval, signal);

      } catch (error) {
        console.error(`Polling attempt ${attempts} failed for ${appointmentId}:`, error);
        
        // If this was our last attempt, report the error
        if (attempts >= this.config.maxAttempts) {
          onError(error as Error);
          return;
        }

        // Otherwise, continue with next attempt after short delay
        await this.sleep(this.config.baseInterval, signal);
      }
    }
  }

  private async checkHighLevelAPI(appointment: Appointment): Promise<Appointment | null> {
    try {
      const highlevelService = new HighLevelService();
      const apiAppointment = await highlevelService.getAppointmentStatus(
        appointment.highlevelAppointmentId
      );

      if (!apiAppointment) {
        return null;
      }

      // Check if appointment has been assigned
      const hasAssignment = apiAppointment.assignedUserId && 
                           apiAppointment.appointmentStatus === 'confirmed';

      if (hasAssignment) {
        const databaseService = DatabaseService.getInstance();
        return await databaseService.updateAppointment(appointment.id, {
          status: 'confirmed',
          assignedSpecialistId: apiAppointment.assignedUserId,
          assignedSpecialistName: apiAppointment.assignedUserName || 'Assigned Specialist',
          meetingLocation: apiAppointment.meetingLocation,
          webhookPayload: {
            api_polling_result: true,
            api_response: apiAppointment
          },
          webhookReceivedAt: new Date()
        });
      }

      return null;
    } catch (error) {
      console.error('Error checking HighLevel API:', error);
      return null;
    }
  }

  private calculateNextInterval(attempt: number): number {
    if (!this.config.exponentialBackoff) {
      return this.config.baseInterval;
    }

    // Exponential backoff: baseInterval * 2^(attempt-1)
    const exponentialInterval = this.config.baseInterval * Math.pow(2, attempt - 1);
    
    // Cap at maxInterval
    return Math.min(exponentialInterval, this.config.maxInterval);
  }

  private sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error('Polling aborted'));
        return;
      }

      const timeout = setTimeout(resolve, ms);
      
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Polling aborted'));
        });
      }
    });
  }
}

// ============================================
// Singleton Instance
// ============================================

let pollerInstance: AppointmentPoller | null = null;

/**
 * Get global appointment poller instance
 */
export function getAppointmentPoller(config?: Partial<PollingConfig>): AppointmentPoller {
  if (!pollerInstance) {
    pollerInstance = new AppointmentPoller(config);
  }
  return pollerInstance;
}

/**
 * Create new poller instance (for testing or custom configurations)
 */
export function createAppointmentPoller(config?: Partial<PollingConfig>): AppointmentPoller {
  return new AppointmentPoller(config);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Start polling for multiple appointments
 */
export async function startBatchPolling(
  appointments: { id: string; onUpdate: (appointment: Appointment) => void; onError: (error: Error) => void }[],
  config?: Partial<PollingConfig>
): Promise<void> {
  const poller = getAppointmentPoller(config);
  
  const promises = appointments.map(({ id, onUpdate, onError }) =>
    poller.startPolling(id, onUpdate, onError)
  );

  await Promise.allSettled(promises);
}

/**
 * Check if appointment needs polling
 */
export function shouldStartPolling(appointment: Appointment): boolean {
  return appointment.status === 'pending_assignment' && 
         appointment.pollingAttempts < 10; // Max attempts before giving up
}

/**
 * Get polling status for appointment
 */
export function getPollingStatus(appointment: Appointment): {
  needsPolling: boolean;
  attemptsRemaining: number;
  nextAttemptIn?: number;
} {
  const needsPolling = shouldStartPolling(appointment);
  const attemptsRemaining = Math.max(0, 10 - appointment.pollingAttempts);
  
  let nextAttemptIn: number | undefined;
  if (needsPolling && appointment.lastPolledAt) {
    const timeSinceLastPoll = Date.now() - appointment.lastPolledAt.getTime();
    const baseInterval = 5000 * Math.pow(2, appointment.pollingAttempts);
    nextAttemptIn = Math.max(0, baseInterval - timeSinceLastPoll);
  }

  return {
    needsPolling,
    attemptsRemaining,
    nextAttemptIn
  };
}

export default AppointmentPoller;