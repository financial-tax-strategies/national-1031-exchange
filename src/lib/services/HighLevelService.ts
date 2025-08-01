// ============================================
// HighLevel API Service
// National 1031 Center Integration
// ============================================

import type { 
  HighLevelConfig,
  HighLevelContact,
  HighLevelAppointmentRequest,
  HighLevelAppointmentResponse,
  AvailableSlot,
  AvailabilityRequest,
  AvailabilityResponse,
  CreateAppointmentRequest,
  Appointment,
  BookingError,
  BookingErrorCode
} from '../types/highlevel';

// ============================================
// HighLevel API Client
// ============================================

export class HighLevelService {
  private config: HighLevelConfig;
  private baseUrl = 'https://services.leadconnectorhq.com';
  private defaultTimeout = 30000; // 30 seconds

  constructor(config: HighLevelConfig) {
    this.config = config;
  }

  // ============================================
  // Contact Management
  // ============================================

  /**
   * Create or update contact in HighLevel
   */
  async createContact(contactData: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    taxSavingsAmount?: number;
    propertySalePrice?: number;
    source?: string;
  }): Promise<string> {
    try {
      const contact: HighLevelContact = {
        locationId: this.config.locationId,
        email: contactData.email,
        phone: contactData.phone,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        source: contactData.source || '1031 Tax Calculator',
        tags: ['1031-exchange-lead', 'tax-calculator'],
        customFields: {
          'tax_savings_amount': contactData.taxSavingsAmount?.toString(),
          'property_sale_price': contactData.propertySalePrice?.toString(),
          'lead_source': 'National 1031 Center Website',
          'calculator_completed': 'true'
        }
      };

      const response = await this.makeRequest('/contacts/', {
        method: 'POST',
        body: JSON.stringify(contact)
      });

      if (!response.contact?.id) {
        throw new Error('No contact ID returned from HighLevel');
      }

      return response.contact.id;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw this.createBookingError(
        BookingErrorCode.CONTACT_CREATION_FAILED,
        'Failed to create contact in CRM',
        error,
        'Unable to save your contact information. Please try again.'
      );
    }
  }

  /**
   * Get contact by email
   */
  async getContactByEmail(email: string): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/contacts/search?email=${encodeURIComponent(email)}`, {
        method: 'GET'
      });

      return response.contacts?.[0]?.id || null;
    } catch (error) {
      console.error('Error searching contact:', error);
      return null; // Don't throw, just return null to create new contact
    }
  }

  // ============================================
  // Calendar & Availability
  // ============================================

  /**
   * Get available time slots for calendar
   */
  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    try {
      const { calendarId, startDate, endDate, timezone } = request;
      
      const params = new URLSearchParams({
        startDate,
        endDate,
        timezone
      });

      const response = await this.makeRequest(
        `/calendars/${calendarId}/free-slots?${params}`,
        { method: 'GET' }
      );

      const slots: AvailableSlot[] = (response.freeSlots || []).map((slot: any) => ({
        time: slot.startTime,
        available: true,
        duration: 30,
        displayTime: this.formatDisplayTime(slot.startTime, timezone)
      }));

      return {
        calendarId,
        timezone,
        slots,
        cached: false
      };
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw this.createBookingError(
        BookingErrorCode.NO_AVAILABILITY,
        'Failed to load available appointment times',
        error,
        'Unable to load available appointment times. Please try again.'
      );
    }
  }

  // ============================================
  // Appointment Management
  // ============================================

  /**
   * Create appointment in HighLevel
   */
  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    try {
      // First, create or get contact
      let contactId = await this.getContactByEmail(appointmentData.email);
      
      if (!contactId) {
        contactId = await this.createContact({
          email: appointmentData.email,
          phone: appointmentData.phone,
          firstName: appointmentData.firstName,
          lastName: appointmentData.lastName,
          taxSavingsAmount: appointmentData.taxSavingsAmount,
          propertySalePrice: appointmentData.propertySalePrice,
          source: appointmentData.sourceUrl
        });
      }

      // Create appointment
      const appointmentDate = new Date(appointmentData.appointmentDate);
      const endDate = new Date(appointmentDate.getTime() + (30 * 60 * 1000)); // 30 minute appointment

      const appointmentRequest: HighLevelAppointmentRequest = {
        calendarId: this.config.calendarId,
        contactId,
        startTime: appointmentDate.toISOString(),
        endTime: endDate.toISOString(),
        timezone: appointmentData.timezone,
        title: '1031 Exchange Consultation',
        appointmentStatus: 'confirmed'
      };

      const response = await this.makeRequest('/calendars/events/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentRequest)
      });

      // Create appointment record for our database
      const appointment: Appointment = {
        id: '', // Will be set by database
        highlevelAppointmentId: response.id,
        highlevelContactId: contactId,
        status: 'pending_assignment',
        appointmentDate,
        appointmentTime: appointmentData.appointmentDate,
        timezone: appointmentData.timezone,
        durationMinutes: 30,
        contactEmail: appointmentData.email,
        contactPhone: appointmentData.phone,
        contactFirstName: appointmentData.firstName,
        contactLastName: appointmentData.lastName,
        taxSavingsAmount: appointmentData.taxSavingsAmount,
        propertySalePrice: appointmentData.propertySalePrice,
        propertyType: appointmentData.propertyType,
        exchangeTimeline: appointmentData.exchangeTimeline,
        sourceUrl: appointmentData.sourceUrl,
        formData: appointmentData.formData,
        pollingAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw this.createBookingError(
        BookingErrorCode.APPOINTMENT_CREATION_FAILED,
        'Failed to create appointment',
        error,
        'Unable to schedule your appointment. Please try again or call us directly.'
      );
    }
  }

  /**
   * Get appointment status (for polling fallback)
   */
  async getAppointmentStatus(appointmentId: string): Promise<HighLevelAppointmentResponse | null> {
    try {
      const response = await this.makeRequest(
        `/calendars/events/appointments/${appointmentId}`,
        { method: 'GET' }
      );

      return response.appointment || null;
    } catch (error) {
      console.error('Error fetching appointment status:', error);
      return null;
    }
  }

  // ============================================
  // Order Form Integration
  // ============================================

  /**
   * Create lead from order form submission with all custom fields
   */
  async createOrderFormLead(formData: any): Promise<string> {
    try {
      // Map order form fields to HighLevel custom fields
      const customFields: Record<string, string> = {};
      
      // Map all 1031x_ fields
      Object.keys(formData).forEach(key => {
        if (key.startsWith('1031x_')) {
          // Convert field values to strings
          let value = formData[key];
          if (typeof value === 'number') {
            value = value.toString();
          } else if (value instanceof Date) {
            value = value.toISOString();
          } else if (typeof value === 'boolean') {
            value = value ? 'Yes' : 'No';
          }
          
          // Store in custom fields with exact key
          customFields[key] = value || '';
        }
      });

      // Create contact with all order form data
      const contact: HighLevelContact = {
        locationId: this.config.locationId,
        email: formData['1031x_email'],
        phone: formData['1031x_phone'],
        firstName: formData['1031x_first_name'],
        lastName: formData['1031x_last_name'],
        source: 'Order Form - ' + (formData['1031x_how_heard'] || 'Website'),
        tags: [
          '1031-exchange-order-form',
          'order-form-submission',
          formData['1031x_urgency_level'] || 'standard',
          formData['1031x_exchange_type'] || 'unknown'
        ].filter(Boolean),
        customFields: {
          ...customFields,
          'order_form_submitted': new Date().toISOString(),
          'order_form_version': '1.0'
        }
      };

      // Add notes about the submission
      const notes = [];
      if (formData['1031x_urgency_level'] === 'urgent_2_weeks') {
        notes.push('URGENT: Less than 2 weeks timeline');
      }
      if (formData['1031x_has_cpa'] === 'need_referral') {
        notes.push('Needs CPA referral');
      }
      if (formData['1031x_dst_interest'] === 'interested') {
        notes.push('Interested in DST options');
      }
      if (formData['1031x_additional_notes']) {
        notes.push('Additional notes: ' + formData['1031x_additional_notes']);
      }
      
      if (notes.length > 0) {
        contact.notes = notes.join('\n\n');
      }

      const response = await this.makeRequest('/contacts/', {
        method: 'POST',
        body: JSON.stringify(contact)
      });

      if (!response.contact?.id) {
        throw new Error('No contact ID returned from HighLevel');
      }

      // Trigger automation based on urgency
      if (formData['1031x_urgency_level'] === 'urgent_2_weeks') {
        // Trigger urgent workflow
        await this.triggerWorkflow(response.contact.id, 'urgent_order_form_submission');
      } else {
        // Trigger standard workflow
        await this.triggerWorkflow(response.contact.id, 'standard_order_form_submission');
      }

      // Create calendar appointment if requested
      if (formData['1031x_consultation_preference'] !== 'email_only') {
        // This could be extended to auto-book based on preference
        await this.addContactNote(
          response.contact.id,
          `Consultation preference: ${formData['1031x_consultation_preference']}`
        );
      }

      return response.contact.id;
    } catch (error) {
      console.error('Error creating order form lead:', error);
      throw this.createBookingError(
        BookingErrorCode.CONTACT_CREATION_FAILED,
        'Failed to submit order form',
        error,
        'Unable to submit your information. Please try again or call us directly.'
      );
    }
  }

  /**
   * Trigger HighLevel workflow for contact
   */
  private async triggerWorkflow(contactId: string, workflowId: string): Promise<void> {
    try {
      await this.makeRequest(`/contacts/${contactId}/workflow/${workflowId}`, {
        method: 'POST',
        body: JSON.stringify({})
      });
    } catch (error) {
      console.error('Error triggering workflow:', error);
      // Don't throw - workflow trigger is not critical
    }
  }

  /**
   * Add note to contact
   */
  private async addContactNote(contactId: string, note: string): Promise<void> {
    try {
      await this.makeRequest(`/contacts/${contactId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ body: note })
      });
    } catch (error) {
      console.error('Error adding contact note:', error);
      // Don't throw - note addition is not critical
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Format time for display in local timezone
   */
  private formatDisplayTime(isoTime: string, timezone: string): string {
    const date = new Date(isoTime);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    }).format(date);
  }

  /**
   * Make authenticated request to HighLevel API
   */
  private async makeRequest(endpoint: string, options: RequestInit): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    const requestOptions: RequestInit = {
      ...options,
      headers,
      timeout: this.defaultTimeout
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw this.createBookingError(
          BookingErrorCode.NETWORK_ERROR,
          'Network error connecting to booking system',
          error,
          'Unable to connect to booking system. Please check your internet connection.'
        );
      }
      throw error;
    }
  }

  /**
   * Create standardized booking error
   */
  private createBookingError(
    code: BookingErrorCode,
    message: string,
    originalError?: any,
    userMessage?: string
  ): BookingError {
    return {
      code,
      message,
      details: originalError,
      userMessage: userMessage || message,
      retryable: this.isRetryableError(code)
    };
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(code: BookingErrorCode): boolean {
    const retryableCodes: BookingErrorCode[] = [
      BookingErrorCode.API_TIMEOUT,
      BookingErrorCode.API_RATE_LIMIT,
      BookingErrorCode.NETWORK_ERROR,
      BookingErrorCode.SERVICE_UNAVAILABLE
    ];
    
    return retryableCodes.includes(code);
  }
}

// ============================================
// Service Factory
// ============================================

let serviceInstance: HighLevelService | null = null;

/**
 * Get or create HighLevel service instance
 */
export async function getHighLevelService(): Promise<HighLevelService> {
  if (serviceInstance) {
    return serviceInstance;
  }

  // Load configuration from environment or database
  const config = await loadHighLevelConfig();
  serviceInstance = new HighLevelService(config);
  
  return serviceInstance;
}

/**
 * Load HighLevel configuration
 */
async function loadHighLevelConfig(): Promise<HighLevelConfig> {
  // In a real implementation, this would load from Supabase
  // For now, use environment variables with Astro's import.meta.env
  const config: HighLevelConfig = {
    id: 'default',
    apiKey: import.meta.env.PUBLIC_HIGHLEVEL_API_KEY || '',
    locationId: import.meta.env.PUBLIC_HIGHLEVEL_LOCATION_ID || '',
    calendarId: import.meta.env.PUBLIC_HIGHLEVEL_CALENDAR_ID || '',
    webhookSecret: import.meta.env.HIGHLEVEL_WEBHOOK_SECRET,
    webhookUrl: import.meta.env.HIGHLEVEL_WEBHOOK_URL,
    timezone: 'America/New_York',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!config.apiKey || !config.locationId || !config.calendarId) {
    throw new Error('HighLevel configuration is incomplete. Please check environment variables.');
  }

  return config;
}

// ============================================
// Export Service
// ============================================

export { HighLevelService as default };