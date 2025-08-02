import { DatabaseService } from './database.service';
import type { Lead, LeadActivity, CalculatorSubmission, OrderFormSubmission } from '../types/database.types';

/**
 * Lead Service - Comprehensive lead management with deduplication and scoring
 * Handles all lead-related operations including activities and submissions
 */
export class LeadService {
  private db: DatabaseService;
  
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  
  /**
   * Find or create a lead by email (deduplication)
   */
  async findOrCreateLead(params: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    leadSource?: string;
  }): Promise<Lead> {
    try {
      // Use the database function for deduplication
      const leadId = await this.db.executeFunction<string>('find_or_create_lead', {
        p_email: params.email,
        p_phone: params.phone || null,
        p_first_name: params.firstName || null,
        p_last_name: params.lastName || null,
        p_lead_source: params.leadSource || 'unknown'
      });
      
      // Fetch the complete lead record
      const { data, error } = await this.db.getTable('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Lead creation/lookup failed');
    }
  }
  
  /**
   * Update lead information
   */
  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const { data, error } = await this.db.getTable('leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Lead update failed');
    }
  }
  
  /**
   * Track lead activity
   */
  async trackActivity(params: {
    leadId: string;
    activityType: string;
    activityData?: Record<string, any>;
    sessionId?: string;
    sourceUrl?: string;
    referrerUrl?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
  }): Promise<LeadActivity> {
    try {
      const { data, error } = await this.db.getTable('lead_activities')
        .insert({
          lead_id: params.leadId,
          activity_type: params.activityType,
          activity_data: params.activityData || {},
          session_id: params.sessionId,
          source_url: params.sourceUrl,
          referrer_url: params.referrerUrl,
          ip_address: params.ipAddress,
          user_agent: params.userAgent,
          device_type: params.deviceType
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Activity tracking failed');
    }
  }
  
  /**
   * Save calculator submission
   */
  async saveCalculatorSubmission(params: {
    leadId: string;
    propertySalePrice: number;
    currentBasis: number;
    depreciationTaken: number;
    calculatedCapitalGains: number;
    calculatedTaxSavings: number;
    propertyType?: string;
    propertyState?: string;
    submissionData?: Record<string, any>;
  }): Promise<CalculatorSubmission> {
    try {
      const { data, error } = await this.db.getTable('calculator_submissions')
        .insert({
          lead_id: params.leadId,
          property_sale_price: params.propertySalePrice,
          current_basis: params.currentBasis,
          depreciation_taken: params.depreciationTaken,
          calculated_capital_gains: params.calculatedCapitalGains,
          calculated_tax_savings: params.calculatedTaxSavings,
          property_type: params.propertyType,
          property_state: params.propertyState,
          submission_data: params.submissionData || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Track the calculator completion activity
      await this.trackActivity({
        leadId: params.leadId,
        activityType: 'calculator_complete',
        activityData: {
          tax_savings: params.calculatedTaxSavings,
          property_type: params.propertyType
        }
      });
      
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Calculator submission failed');
    }
  }
  
  /**
   * Create or update order form submission
   */
  async upsertOrderFormSubmission(params: {
    leadId: string;
    stepCompleted: number;
    completionStatus?: string;
    urgencyLevel?: string;
    exchangeType?: string;
    propertySalePrice?: number;
    formData: Record<string, any>;
  }): Promise<OrderFormSubmission> {
    try {
      // Check if submission exists
      const { data: existing } = await this.db.getTable('order_form_submissions')
        .select('id')
        .eq('lead_id', params.leadId)
        .single();
      
      if (existing) {
        // Update existing submission
        const { data, error } = await this.db.getTable('order_form_submissions')
          .update({
            step_completed: params.stepCompleted,
            completion_status: params.completionStatus || 'in_progress',
            urgency_level: params.urgencyLevel,
            exchange_type: params.exchangeType,
            property_sale_price: params.propertySalePrice,
            form_data: params.formData,
            completed_at: params.completionStatus === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new submission
        const { data, error } = await this.db.getTable('order_form_submissions')
          .insert({
            lead_id: params.leadId,
            step_completed: params.stepCompleted,
            completion_status: params.completionStatus || 'in_progress',
            urgency_level: params.urgencyLevel,
            exchange_type: params.exchangeType,
            property_sale_price: params.propertySalePrice,
            form_data: params.formData
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      throw this.db.handleError(error, 'Order form submission failed');
    }
  }
  
  /**
   * Get lead by email
   */
  async getLeadByEmail(email: string): Promise<Lead | null> {
    try {
      const { data, error } = await this.db.getTable('leads')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data || null;
    } catch (error) {
      throw this.db.handleError(error, 'Lead lookup failed');
    }
  }
  
  /**
   * Get lead with all related data
   */
  async getLeadWithDetails(leadId: string) {
    try {
      const [lead, calculator, orderForm, appointments, activities] = await Promise.all([
        // Get lead
        this.db.getTable('leads')
          .select('*')
          .eq('id', leadId)
          .single(),
        
        // Get calculator submissions
        this.db.getTable('calculator_submissions')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false }),
        
        // Get order form submission
        this.db.getTable('order_form_submissions')
          .select('*')
          .eq('lead_id', leadId)
          .single(),
        
        // Get appointments
        this.db.getTable('appointments')
          .select('*')
          .eq('lead_id', leadId)
          .order('appointment_date', { ascending: false }),
        
        // Get recent activities
        this.db.getTable('lead_activities')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);
      
      if (lead.error && lead.error.code !== 'PGRST116') throw lead.error;
      
      return {
        lead: lead.data,
        calculator_submissions: calculator.data || [],
        order_form: orderForm.data,
        appointments: appointments.data || [],
        activities: activities.data || []
      };
    } catch (error) {
      throw this.db.handleError(error, 'Lead details fetch failed');
    }
  }
  
  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: string, status: string): Promise<Lead> {
    return this.updateLead(leadId, { lead_status: status });
  }
  
  /**
   * Get leads by status
   */
  async getLeadsByStatus(status: string, limit = 100) {
    try {
      const { data, error } = await this.db.getTable('leads')
        .select('*')
        .eq('lead_status', status)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, 'Lead fetch by status failed');
    }
  }
}