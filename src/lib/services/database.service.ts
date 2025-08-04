import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

/**
 * Database Service - Core database operations and connection management
 * Provides type-safe access to Supabase with error handling and retry logic
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient<Database>;
  
  private constructor() {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    // During build time, we might not have environment variables
    // This allows the build to complete successfully
    if (!supabaseUrl || !supabaseAnonKey) {
      if (import.meta.env.MODE === 'production' && typeof window !== 'undefined') {
        // Only throw error in production when running in browser
        throw new Error('Supabase configuration missing. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.');
      }
      // For build time or development, create a dummy client
      // This will fail if actually used, but allows static build to complete
      console.warn('Supabase environment variables not found. Database operations will fail.');
      this.supabase = {} as SupabaseClient<Database>;
      return;
    }
    
    console.log('Initializing Supabase client with URL:', supabaseUrl);
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    });
  }
  
  /**
   * Get singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  /**
   * Get Supabase client instance
   */
  public getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
  
  /**
   * Execute a database function with error handling
   */
  public async executeFunction<T = any>(
    functionName: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const { data, error } = await this.supabase.rpc(functionName, params);
      
      if (error) {
        console.error(`Error executing function ${functionName}:`, error);
        throw error;
      }
      
      return data as T;
    } catch (error) {
      console.error('Database function execution error:', error);
      throw error;
    }
  }
  
  /**
   * Health check for database connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('leads')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
  
  /**
   * Get table reference with type safety
   */
  public getTable<T extends keyof Database['public']['Tables']>(
    tableName: T
  ) {
    return this.supabase.from(tableName);
  }
  
  /**
   * Create appointment in database (with lead creation)
   */
  public async createAppointment(appointmentData: any): Promise<any> {
    try {
      console.log('[DatabaseService] Creating appointment with data:', appointmentData);
      
      // First, create or find a lead record
      const leadId = await this.createOrFindLead({
        email: appointmentData.contactEmail,
        firstName: appointmentData.contactFirstName,
        lastName: appointmentData.contactLastName,
        phone: appointmentData.contactPhone,
        highlevelContactId: appointmentData.highlevelContactId,
        sourceUrl: appointmentData.sourceUrl,
        taxSavingsAmount: appointmentData.taxSavingsAmount,
        propertySalePrice: appointmentData.propertySalePrice
      });
      
      console.log('[DatabaseService] Using lead ID:', leadId);
      
      // Map HighLevel appointment data to database schema
      const dbAppointment = {
        lead_id: leadId, // Required field!
        highlevel_appointment_id: appointmentData.highlevelAppointmentId,
        highlevel_contact_id: appointmentData.highlevelContactId,
        appointment_date: appointmentData.appointmentDate?.toISOString?.() || appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        timezone: appointmentData.timezone || 'America/New_York',
        duration_minutes: appointmentData.durationMinutes || 30,
        status: appointmentData.status || 'confirmed',
        tax_savings_amount: appointmentData.taxSavingsAmount,
        property_sale_price: appointmentData.propertySalePrice,
        source_url: appointmentData.sourceUrl,
        form_data: appointmentData.formData || {},
        polling_attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('[DatabaseService] Mapped appointment data:', dbAppointment);
      
      const { data, error } = await this.supabase
        .from('appointments')
        .insert(dbAppointment)
        .select()
        .single();
      
      if (error) {
        console.error('[DatabaseService] Error creating appointment:', error);
        throw this.handleError(error, 'createAppointment');
      }
      
      console.log('[DatabaseService] Appointment created successfully:', data);
      return data;
      
    } catch (error) {
      console.error('[DatabaseService] Error in createAppointment:', error);
      throw error;
    }
  }
  
  /**
   * Create or find lead record
   */
  private async createOrFindLead(leadData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    highlevelContactId?: string;
    sourceUrl?: string;
    taxSavingsAmount?: number;
    propertySalePrice?: number;
  }): Promise<string> {
    try {
      console.log('[DatabaseService] Creating or finding lead for email:', leadData.email);
      
      // First, try to find existing lead by email
      const { data: existingLead, error: searchError } = await this.supabase
        .from('leads')
        .select('id')
        .eq('email', leadData.email)
        .single();
      
      if (existingLead && !searchError) {
        console.log('[DatabaseService] Found existing lead:', existingLead.id);
        return existingLead.id;
      }
      
      // Create new lead
      console.log('[DatabaseService] Creating new lead');
      
      const newLead = {
        email: leadData.email,
        phone: leadData.phone,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        lead_source: 'appointment_booking',
        lead_status: 'new',
        lead_score: 50, // Default score for appointment bookings
        highlevel_contact_id: leadData.highlevelContactId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };
      
      const { data: createdLead, error: createError } = await this.supabase
        .from('leads')
        .insert(newLead)
        .select('id')
        .single();
      
      if (createError) {
        console.error('[DatabaseService] Error creating lead:', createError);
        throw this.handleError(createError, 'createOrFindLead');
      }
      
      console.log('[DatabaseService] Lead created successfully:', createdLead.id);
      return createdLead.id;
      
    } catch (error) {
      console.error('[DatabaseService] Error in createOrFindLead:', error);
      throw error;
    }
  }
  
  /**
   * Get appointment by ID
   */
  public async getAppointment(appointmentId: string): Promise<any> {
    try {
      console.log('[DatabaseService] Getting appointment:', appointmentId);
      
      const { data, error } = await this.supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();
      
      if (error) {
        console.error('[DatabaseService] Error getting appointment:', error);
        throw this.handleError(error, 'getAppointment');
      }
      
      console.log('[DatabaseService] Appointment retrieved:', data);
      return data;
      
    } catch (error) {
      console.error('[DatabaseService] Error in getAppointment:', error);
      throw error;
    }
  }

  /**
   * Increment polling attempts for an appointment
   */
  public async incrementPollingAttempts(appointmentId: string): Promise<any> {
    try {
      console.log('[DatabaseService] Incrementing polling attempts for appointment:', appointmentId);
      
      // First get current polling attempts
      const currentAppointment = await this.getAppointment(appointmentId);
      const newAttempts = (currentAppointment.polling_attempts || 0) + 1;
      
      const { data, error } = await this.supabase
        .from('appointments')
        .update({ 
          polling_attempts: newAttempts,
          last_polled_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) {
        console.error('[DatabaseService] Error incrementing polling attempts:', error);
        throw this.handleError(error, 'incrementPollingAttempts');
      }
      
      console.log('[DatabaseService] Polling attempts incremented:', data);
      return data;
      
    } catch (error) {
      console.error('[DatabaseService] Error in incrementPollingAttempts:', error);
      throw error;
    }
  }

  /**
   * Subscribe to appointment updates
   */
  public subscribeToAppointment(
    appointmentId: string,
    callback: (appointment: any) => void
  ): any {
    try {
      console.log('[DatabaseService] Setting up subscription for appointment:', appointmentId);
      
      const subscription = this.supabase
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
            console.log('[DatabaseService] Appointment updated:', payload.new);
            callback(payload.new);
          }
        )
        .subscribe();
      
      console.log('[DatabaseService] Subscription created for appointment:', appointmentId);
      return subscription;
      
    } catch (error) {
      console.error('[DatabaseService] Error setting up appointment subscription:', error);
      throw error;
    }
  }

  /**
   * Handle database errors with consistent formatting
   */
  public handleError(error: any, context: string): Error {
    const message = error?.message || 'Unknown database error';
    const code = error?.code || 'UNKNOWN';
    
    console.error(`Database error in ${context}:`, {
      message,
      code,
      details: error
    });
    
    return new Error(`${context}: ${message} (${code})`);
  }
}