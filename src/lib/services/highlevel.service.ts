import { DatabaseService } from './database.service';
import type { HighLevelIntegration, HighLevelConfig, Webhook } from '../types/database.types';

/**
 * HighLevel Service - Manages all HighLevel CRM integrations
 * Handles API calls, webhooks, and synchronization with retry logic
 */
export class HighLevelService {
  private db: DatabaseService;
  private config: HighLevelConfig | null = null;
  private baseUrl = 'https://services.leadconnectorhq.com';
  
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  
  /**
   * Get active HighLevel configuration
   */
  private async getConfig(): Promise<HighLevelConfig> {
    if (!this.config) {
      const { data, error } = await this.db.getTable('highlevel_config')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        throw new Error('HighLevel configuration not found');
      }
      
      this.config = data;
    }
    
    return this.config;
  }
  
  /**
   * Make API request to HighLevel with retry logic
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    retries = 3
  ): Promise<any> {
    const config = await this.getConfig();
    
    const headers = {
      'Authorization': `Bearer ${config.api_key}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
      ...options.headers
    };
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `HighLevel API error: ${response.status}`);
        }
        
        return data;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  
  /**
   * Log integration attempt
   */
  private async logIntegration(params: {
    leadId?: string;
    integrationType: string;
    payloadSent: any;
    responseReceived?: any;
    success: boolean;
    errorMessage?: string;
    highlevelEntityId?: string;
  }): Promise<HighLevelIntegration> {
    const { data, error } = await this.db.getTable('highlevel_integrations')
      .insert({
        lead_id: params.leadId,
        integration_type: params.integrationType,
        payload_sent: params.payloadSent,
        response_received: params.responseReceived,
        success: params.success,
        error_message: params.errorMessage,
        highlevel_entity_id: params.highlevelEntityId,
        retry_count: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Create or update contact in HighLevel
   */
  async syncContact(params: {
    leadId: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    tags?: string[];
    customFields?: Record<string, any>;
  }): Promise<string> {
    const config = await this.getConfig();
    
    const payload = {
      email: params.email,
      phone: params.phone,
      firstName: params.firstName,
      lastName: params.lastName,
      locationId: config.location_id,
      tags: params.tags || ['1031-exchange-lead'],
      customFields: params.customFields ? 
        Object.entries(params.customFields).map(([key, value]) => ({ key, value: String(value) })) : 
        []
    };
    
    let contactId: string;
    
    try {
      // Try to create contact
      const response = await this.makeRequest('/contacts/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      contactId = response.contact.id;
      
      await this.logIntegration({
        leadId: params.leadId,
        integrationType: 'contact_create',
        payloadSent: payload,
        responseReceived: response,
        success: true,
        highlevelEntityId: contactId
      });
    } catch (error: any) {
      // If contact exists, try to update
      if (error.message?.includes('already exists')) {
        try {
          // Search for contact by email
          const searchResponse = await this.makeRequest(
            `/contacts/lookup?email=${encodeURIComponent(params.email)}`,
            { method: 'GET' }
          );
          
          contactId = searchResponse.contacts[0]?.id;
          
          if (contactId) {
            // Update existing contact
            const updateResponse = await this.makeRequest(
              `/contacts/${contactId}`,
              {
                method: 'PUT',
                body: JSON.stringify(payload)
              }
            );
            
            await this.logIntegration({
              leadId: params.leadId,
              integrationType: 'contact_update',
              payloadSent: payload,
              responseReceived: updateResponse,
              success: true,
              highlevelEntityId: contactId
            });
          }
        } catch (updateError) {
          await this.logIntegration({
            leadId: params.leadId,
            integrationType: 'contact_update',
            payloadSent: payload,
            success: false,
            errorMessage: updateError.message
          });
          throw updateError;
        }
      } else {
        await this.logIntegration({
          leadId: params.leadId,
          integrationType: 'contact_create',
          payloadSent: payload,
          success: false,
          errorMessage: error.message
        });
        throw error;
      }
    }
    
    // Update lead with HighLevel contact ID
    await this.db.getTable('leads')
      .update({ highlevel_contact_id: contactId })
      .eq('id', params.leadId);
    
    return contactId;
  }
  
  /**
   * Create appointment in HighLevel
   */
  async createAppointment(params: {
    appointmentId: string;
    contactId: string;
    startTime: string;
    endTime: string;
    title?: string;
    appointmentStatus?: string;
  }): Promise<string> {
    const config = await this.getConfig();
    
    // Convert ISO date strings to Unix timestamps in seconds (HighLevel requirement)
    const startDate = new Date(params.startTime);
    const endDate = new Date(params.endTime);
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);
    
    const payload = {
      calendarId: config.calendar_id,
      contactId: params.contactId,
      startTime: startTimestamp,
      endTime: endTimestamp,
      title: params.title || '1031 Exchange Consultation',
      appointmentStatus: params.appointmentStatus || 'new'
    };
    
    try {
      const response = await this.makeRequest('/appointments/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      const highlevelAppointmentId = response.id;
      
      await this.logIntegration({
        integrationType: 'appointment_create',
        payloadSent: payload,
        responseReceived: response,
        success: true,
        highlevelEntityId: highlevelAppointmentId
      });
      
      // Update appointment with HighLevel ID
      await this.db.getTable('appointments')
        .update({ 
          highlevel_appointment_id: highlevelAppointmentId,
          highlevel_contact_id: params.contactId
        })
        .eq('id', params.appointmentId);
      
      return highlevelAppointmentId;
    } catch (error: any) {
      await this.logIntegration({
        integrationType: 'appointment_create',
        payloadSent: payload,
        success: false,
        errorMessage: error.message
      });
      throw error;
    }
  }
  
  /**
   * Process incoming webhook
   */
  async processWebhook(params: {
    type: string;
    payload: any;
    headers?: any;
  }): Promise<void> {
    // Store webhook for processing
    const { data: webhook, error } = await this.db.getTable('webhooks')
      .insert({
        webhook_type: params.type,
        payload: params.payload,
        headers: params.headers,
        processed: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    try {
      // Process based on webhook type
      switch (params.type) {
        case 'ContactCreate':
        case 'ContactUpdate':
          await this.processContactWebhook(webhook.id, params.payload);
          break;
          
        case 'AppointmentCreate':
        case 'AppointmentUpdate':
          await this.processAppointmentWebhook(webhook.id, params.payload);
          break;
          
        default:
          console.log(`Unhandled webhook type: ${params.type}`);
      }
      
      // Mark webhook as processed
      await this.db.getTable('webhooks')
        .update({ 
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhook.id);
    } catch (error: any) {
      // Log processing error
      await this.db.getTable('webhooks')
        .update({ 
          processing_error: error.message
        })
        .eq('id', webhook.id);
      
      throw error;
    }
  }
  
  /**
   * Process contact webhook
   */
  private async processContactWebhook(webhookId: string, payload: any): Promise<void> {
    const contactId = payload.id;
    const email = payload.email;
    
    if (!email) return;
    
    // Find lead by email
    const { data: lead } = await this.db.getTable('leads')
      .select('*')
      .eq('email', email)
      .single();
    
    if (lead) {
      // Update lead with HighLevel contact ID
      await this.db.getTable('leads')
        .update({ 
          highlevel_contact_id: contactId,
          phone: payload.phone || lead.phone,
          first_name: payload.firstName || lead.first_name,
          last_name: payload.lastName || lead.last_name
        })
        .eq('id', lead.id);
      
      // Update webhook with lead ID
      await this.db.getTable('webhooks')
        .update({ lead_id: lead.id })
        .eq('id', webhookId);
    }
  }
  
  /**
   * Process appointment webhook
   */
  private async processAppointmentWebhook(webhookId: string, payload: any): Promise<void> {
    const appointmentId = payload.id;
    const contactId = payload.contactId;
    
    // Find appointment by HighLevel ID
    const { data: appointment } = await this.db.getTable('appointments')
      .select('*')
      .eq('highlevel_appointment_id', appointmentId)
      .single();
    
    if (appointment) {
      // Update appointment with webhook data
      const updates: any = {
        webhook_payload: payload,
        webhook_received_at: new Date().toISOString()
      };
      
      if (payload.appointmentStatus) {
        const statusMap: Record<string, string> = {
          'showed': 'completed',
          'noshow': 'no_show',
          'cancelled': 'cancelled',
          'confirmed': 'confirmed'
        };
        
        updates.status = statusMap[payload.appointmentStatus] || payload.appointmentStatus;
      }
      
      if (payload.assignedUserId) {
        updates.assigned_specialist_id = payload.assignedUserId;
      }
      
      await this.db.getTable('appointments')
        .update(updates)
        .eq('id', appointment.id);
      
      // Update webhook with lead ID
      await this.db.getTable('webhooks')
        .update({ lead_id: appointment.lead_id })
        .eq('id', webhookId);
    }
  }
  
  /**
   * Get calendar availability
   */
  async getAvailability(params: {
    date: string;
    timezone?: string;
  }): Promise<any[]> {
    const config = await this.getConfig();
    
    try {
      // Convert ISO date to Unix timestamp in seconds (HighLevel requirement)
      const dateObj = new Date(params.date);
      const startTimestamp = Math.floor(dateObj.getTime() / 1000);
      const endTimestamp = startTimestamp + 86400; // Add 24 hours
      
      const response = await this.makeRequest(
        `/calendars/${config.calendar_id}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`,
        { method: 'GET' }
      );
      
      return response.slots || [];
    } catch (error: any) {
      console.error('Calendar API Error:', {
        message: error.message,
        calendarId: config.calendar_id,
        date: params.date,
        endpoint: 'calendars/free-slots'
      });
      
      // Return empty array for now - calendar feature needs proper endpoint discovery
      // TODO: Contact HighLevel support for correct v2 calendar endpoint
      return [];
    }
  }
}