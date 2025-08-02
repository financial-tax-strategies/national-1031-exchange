import { DatabaseService } from './database.service';
import type { Appointment } from '../types/database.types';

/**
 * Appointment Service - Handles appointment booking and management
 * Integrates with HighLevel CRM for calendar synchronization
 */
export class AppointmentService {
  private db: DatabaseService;
  
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  
  /**
   * Create a new appointment
   */
  async createAppointment(params: {
    leadId: string;
    appointmentDate: string;
    appointmentTime: string;
    timezone?: string;
    durationMinutes?: number;
    bookingSource?: string;
    taxSavingsAmount?: number;
    propertySalePrice?: number;
    propertyType?: string;
    exchangeTimeline?: string;
    sourceUrl?: string;
    formData?: Record<string, any>;
  }): Promise<Appointment> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .insert({
          lead_id: params.leadId,
          appointment_date: params.appointmentDate,
          appointment_time: params.appointmentTime,
          timezone: params.timezone || 'America/New_York',
          duration_minutes: params.durationMinutes || 30,
          booking_source: params.bookingSource,
          tax_savings_amount: params.taxSavingsAmount,
          property_sale_price: params.propertySalePrice,
          property_type: params.propertyType,
          exchange_timeline: params.exchangeTimeline,
          source_url: params.sourceUrl,
          form_data: params.formData || {},
          status: 'scheduled'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Appointment creation failed');
    }
  }
  
  /**
   * Update appointment with HighLevel correlation
   */
  async updateAppointmentWithHighLevel(
    appointmentId: string,
    highLevelData: {
      highlevelAppointmentId: string;
      highlevelContactId?: string;
      assignedSpecialistId?: string;
      assignedSpecialistName?: string;
      meetingLocation?: string;
    }
  ): Promise<Appointment> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .update({
          highlevel_appointment_id: highLevelData.highlevelAppointmentId,
          highlevel_contact_id: highLevelData.highlevelContactId,
          assigned_specialist_id: highLevelData.assignedSpecialistId,
          assigned_specialist_name: highLevelData.assignedSpecialistName,
          meeting_location: highLevelData.meetingLocation
        })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Appointment update failed');
    }
  }
  
  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    appointmentId: string,
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  ): Promise<Appointment> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Appointment status update failed');
    }
  }
  
  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      throw this.db.handleError(error, 'Appointment fetch failed');
    }
  }
  
  /**
   * Get appointments by lead ID
   */
  async getAppointmentsByLead(leadId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .select('*')
        .eq('lead_id', leadId)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, 'Lead appointments fetch failed');
    }
  }
  
  /**
   * Get appointments by date range
   */
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    status?: string
  ): Promise<Appointment[]> {
    try {
      let query = this.db.getTable('appointments')
        .select('*')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, 'Date range appointments fetch failed');
    }
  }
  
  /**
   * Get appointments needing specialist assignment
   */
  async getUnassignedAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await this.db.getTable('appointments')
        .select('*')
        .is('assigned_specialist_id', null)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, 'Unassigned appointments fetch failed');
    }
  }
  
  /**
   * Process webhook data from HighLevel
   */
  async processHighLevelWebhook(webhookData: {
    appointmentId?: string;
    contactId?: string;
    status?: string;
    assignedUserId?: string;
    assignedUserName?: string;
    meetingLocation?: string;
  }): Promise<void> {
    try {
      if (!webhookData.appointmentId) return;
      
      // Find appointment by HighLevel ID
      const { data: appointment } = await this.db.getTable('appointments')
        .select('*')
        .eq('highlevel_appointment_id', webhookData.appointmentId)
        .single();
      
      if (appointment) {
        // Update appointment with webhook data
        const updates: Partial<Appointment> = {
          webhook_received_at: new Date().toISOString()
        };
        
        if (webhookData.status) updates.status = webhookData.status as any;
        if (webhookData.assignedUserId) updates.assigned_specialist_id = webhookData.assignedUserId;
        if (webhookData.assignedUserName) updates.assigned_specialist_name = webhookData.assignedUserName;
        if (webhookData.meetingLocation) updates.meeting_location = webhookData.meetingLocation;
        
        await this.db.getTable('appointments')
          .update(updates)
          .eq('id', appointment.id);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Don't throw - log and continue
    }
  }
  
  /**
   * Get availability cache
   */
  async getAvailabilityCache(
    calendarId: string,
    date: string,
    timezone: string
  ): Promise<any | null> {
    try {
      const cacheKey = `${calendarId}:${date}:${timezone}`;
      
      const { data, error } = await this.db.getTable('availability_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.slots || null;
    } catch (error) {
      throw this.db.handleError(error, 'Availability cache fetch failed');
    }
  }
  
  /**
   * Save availability cache
   */
  async saveAvailabilityCache(
    calendarId: string,
    date: string,
    timezone: string,
    slots: any[],
    expiresInMinutes = 30
  ): Promise<void> {
    try {
      const cacheKey = `${calendarId}:${date}:${timezone}`;
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
      
      await this.db.getTable('availability_cache')
        .upsert({
          cache_key: cacheKey,
          calendar_id: calendarId,
          date: date,
          timezone: timezone,
          slots: slots,
          expires_at: expiresAt
        }, {
          onConflict: 'cache_key'
        });
    } catch (error) {
      // Don't throw for cache errors - just log
      console.error('Availability cache save error:', error);
    }
  }
}