// ============================================
// Database Service for HighLevel Integration
// Handles Supabase operations for appointments
// ============================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { 
  Appointment,
  AppointmentStatus,
  AvailabilityCache,
  AvailableSlot,
  WebhookLog,
  HighLevelConfig
} from '../types/highlevel';

// ============================================
// Database Service Class
// ============================================

export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ============================================
  // Configuration Management
  // ============================================

  /**
   * Get HighLevel configuration
   */
  async getHighLevelConfig(): Promise<HighLevelConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('highlevel_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching HighLevel config:', error);
        return null;
      }

      return this.mapConfigFromDb(data);
    } catch (error) {
      console.error('Database error fetching config:', error);
      return null;
    }
  }

  // ============================================
  // Appointment Management
  // ============================================

  /**
   * Create appointment record
   */
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const dbRecord = this.mapAppointmentToDb(appointment);
      
      const { data, error } = await this.supabase
        .from('appointments')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw new Error(`Failed to create appointment: ${error.message}`);
      }

      return this.mapAppointmentFromDb(data);
    } catch (error) {
      console.error('Database error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment status and assignment details
   */
  async updateAppointment(
    appointmentId: string, 
    updates: Partial<Pick<Appointment, 'status' | 'assignedSpecialistId' | 'assignedSpecialistName' | 'meetingLocation' | 'webhookPayload' | 'webhookReceivedAt'>>
  ): Promise<Appointment | null> {
    try {
      const dbUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Convert camelCase to snake_case for database
      if (updates.assignedSpecialistId !== undefined) {
        dbUpdates.assigned_specialist_id = updates.assignedSpecialistId;
        delete dbUpdates.assignedSpecialistId;
      }
      if (updates.assignedSpecialistName !== undefined) {
        dbUpdates.assigned_specialist_name = updates.assignedSpecialistName;
        delete dbUpdates.assignedSpecialistName;
      }
      if (updates.meetingLocation !== undefined) {
        dbUpdates.meeting_location = updates.meetingLocation;
        delete dbUpdates.meetingLocation;
      }
      if (updates.webhookPayload !== undefined) {
        dbUpdates.webhook_payload = updates.webhookPayload;
        delete dbUpdates.webhookPayload;
      }
      if (updates.webhookReceivedAt !== undefined) {
        dbUpdates.webhook_received_at = updates.webhookReceivedAt?.toISOString();  
        delete dbUpdates.webhookReceivedAt;
      }

      const { data, error } = await this.supabase
        .from('appointments')
        .update(dbUpdates)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return null;
      }

      return this.mapAppointmentFromDb(data);
    } catch (error) {
      console.error('Database error updating appointment:', error);
      return null;
    }
  }

  /**
   * Update appointment by HighLevel ID
   */
  async updateAppointmentByHighLevelId(
    highlevelAppointmentId: string,
    updates: Partial<Pick<Appointment, 'status' | 'assignedSpecialistId' | 'assignedSpecialistName' | 'meetingLocation' | 'webhookPayload' | 'webhookReceivedAt'>>
  ): Promise<Appointment | null> {
    try {
      // First get the appointment to find our internal ID
      const { data: existing, error: findError } = await this.supabase
        .from('appointments')
        .select('id')
        .eq('highlevel_appointment_id', highlevelAppointmentId)
        .single();

      if (findError || !existing) {
        console.error('Appointment not found:', highlevelAppointmentId);
        return null;
      }

      return this.updateAppointment(existing.id, updates);
    } catch (error) {
      console.error('Database error updating appointment by HighLevel ID:', error);
      return null;
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        return null;
      }

      return this.mapAppointmentFromDb(data);
    } catch (error) {
      console.error('Database error fetching appointment:', error);
      return null;
    }
  }

  /**
   * Get appointment by HighLevel ID
   */
  async getAppointmentByHighLevelId(highlevelAppointmentId: string): Promise<Appointment | null> {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .select('*')
        .eq('highlevel_appointment_id', highlevelAppointmentId)
        .single();

      if (error) {
        console.error('Error fetching appointment by HighLevel ID:', error);
        return null;
      }

      return this.mapAppointmentFromDb(data);
    } catch (error) {
      console.error('Database error fetching appointment by HighLevel ID:', error);
      return null;
    }
  }

  /**
   * Increment polling attempts for appointment
   */
  async incrementPollingAttempts(appointmentId: string): Promise<void> {
    try {
      await this.supabase
        .from('appointments')
        .update({
          polling_attempts: this.supabase.rpc('increment_polling', { appointment_id: appointmentId }),
          last_polled_at: new Date().toISOString()
        })
        .eq('id', appointmentId);
    } catch (error) {
      console.error('Error incrementing polling attempts:', error);
    }
  }

  // ============================================
  // Availability Caching
  // ============================================

  /**
   * Get cached availability
   */
  async getCachedAvailability(cacheKey: string): Promise<AvailableSlot[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('availability_cache')
        .select('slots')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      return data.slots as AvailableSlot[];
    } catch (error) {
      console.error('Error fetching cached availability:', error);
      return null;
    }
  }

  /**
   * Cache availability data
   */
  async cacheAvailability(
    cacheKey: string,
    calendarId: string,
    date: Date,
    timezone: string,
    slots: AvailableSlot[],
    ttlMinutes: number = 1
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + (ttlMinutes * 60 * 1000));

      await this.supabase
        .from('availability_cache')
        .upsert({
          cache_key: cacheKey,
          calendar_id: calendarId,
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          timezone,
          slots,
          expires_at: expiresAt.toISOString()
        });
    } catch (error) {
      console.error('Error caching availability:', error);
      // Don't throw - caching is nice-to-have
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache(): Promise<void> {
    try {
      await this.supabase
        .from('availability_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  // ============================================
  // Webhook Logging
  // ============================================

  /**
   * Log webhook receipt
   */
  async logWebhook(
    appointmentId: string | undefined,
    webhookType: string,
    payload: Record<string, any>,
    headers?: Record<string, any>
  ): Promise<void> {
    try {
      await this.supabase
        .from('webhook_logs')
        .insert({
          appointment_id: appointmentId,
          webhook_type: webhookType,
          payload,
          headers,
          processed: false
        });
    } catch (error) {
      console.error('Error logging webhook:', error);
    }
  }

  /**
   * Mark webhook as processed
   */
  async markWebhookProcessed(webhookLogId: string, error?: string): Promise<void> {
    try {
      await this.supabase
        .from('webhook_logs')
        .update({
          processed: true,
          processing_error: error,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhookLogId);
    } catch (error) {
      console.error('Error marking webhook processed:', error);
    }
  }

  // ============================================
  // Real-time Subscriptions  
  // ============================================

  /**
   * Subscribe to appointment updates
   */
  subscribeToAppointment(appointmentId: string, callback: (appointment: Appointment) => void) {
    return this.supabase
      .channel(`appointment-${appointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `id=eq.${appointmentId}`
        },
        (payload) => {
          const appointment = this.mapAppointmentFromDb(payload.new);
          callback(appointment);
        }
      )
      .subscribe();
  }

  // ============================================
  // Data Mapping Helpers
  // ============================================

  private mapConfigFromDb(data: any): HighLevelConfig {
    return {
      id: data.id,
      apiKey: data.api_key,
      locationId: data.location_id,
      calendarId: data.calendar_id,
      webhookSecret: data.webhook_secret,
      webhookUrl: data.webhook_url,
      timezone: data.timezone,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapAppointmentToDb(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      highlevel_appointment_id: appointment.highlevelAppointmentId,
      highlevel_contact_id: appointment.highlevelContactId,
      status: appointment.status,
      assigned_specialist_id: appointment.assignedSpecialistId,
      assigned_specialist_name: appointment.assignedSpecialistName,
      meeting_location: appointment.meetingLocation,
      appointment_date: appointment.appointmentDate.toISOString(),
      appointment_time: appointment.appointmentTime,
      timezone: appointment.timezone,
      duration_minutes: appointment.durationMinutes,
      contact_email: appointment.contactEmail,
      contact_phone: appointment.contactPhone,
      contact_first_name: appointment.contactFirstName,
      contact_last_name: appointment.contactLastName,
      tax_savings_amount: appointment.taxSavingsAmount,
      property_sale_price: appointment.propertySalePrice,
      property_type: appointment.propertyType,
      exchange_timeline: appointment.exchangeTimeline,
      source_url: appointment.sourceUrl,
      form_data: appointment.formData,
      webhook_payload: appointment.webhookPayload,
      webhook_received_at: appointment.webhookReceivedAt?.toISOString(),
      polling_attempts: appointment.pollingAttempts,
      last_polled_at: appointment.lastPolledAt?.toISOString()
    };
  }

  private mapAppointmentFromDb(data: any): Appointment {
    return {
      id: data.id,
      highlevelAppointmentId: data.highlevel_appointment_id,
      highlevelContactId: data.highlevel_contact_id,
      status: data.status as AppointmentStatus,
      assignedSpecialistId: data.assigned_specialist_id,
      assignedSpecialistName: data.assigned_specialist_name,
      meetingLocation: data.meeting_location,
      appointmentDate: new Date(data.appointment_date),
      appointmentTime: data.appointment_time,
      timezone: data.timezone,
      durationMinutes: data.duration_minutes,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      contactFirstName: data.contact_first_name,
      contactLastName: data.contact_last_name,
      taxSavingsAmount: data.tax_savings_amount,
      propertySalePrice: data.property_sale_price,
      propertyType: data.property_type,
      exchangeTimeline: data.exchange_timeline,
      sourceUrl: data.source_url,
      formData: data.form_data,
      webhookPayload: data.webhook_payload,
      webhookReceivedAt: data.webhook_received_at ? new Date(data.webhook_received_at) : undefined,
      pollingAttempts: data.polling_attempts,
      lastPolledAt: data.last_polled_at ? new Date(data.last_polled_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// ============================================
// Service Instance
// ============================================

let databaseService: DatabaseService | null = null;

/**
 * Get database service singleton
 */
export function getDatabaseService(): DatabaseService {
  if (!databaseService) {
    databaseService = new DatabaseService();
  }
  return databaseService;
}

export { DatabaseService as default };