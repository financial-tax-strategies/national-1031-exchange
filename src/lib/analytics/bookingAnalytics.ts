// ============================================
// Booking Analytics Tracking Utility
// National 1031 Center - Extended Event Tracking
// ============================================

import type { Appointment, BookingError, AvailableSlot } from '../types/highlevel';

// ============================================
// Booking Event Types
// ============================================

export interface BookingAnalyticsEvent {
  eventName: string;
  eventCategory: 'booking_flow' | 'appointment' | 'booking_error' | 'booking_funnel';
  eventLabel?: string;
  value?: number;
  appointmentData?: Partial<Appointment>;
  errorData?: Partial<BookingError>;
  customData?: Record<string, any>;
}

// ============================================
// Booking Analytics Class
// ============================================

export class BookingAnalytics {
  private readonly debugMode: boolean;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  // ============================================
  // Booking Flow Events
  // ============================================

  /**
   * Track when booking flow is initiated
   */
  trackBookingFlowStart(leadData: {
    taxSavingsAmount?: number;
    propertySalePrice?: number;
    source?: string;
  }): void {
    this.trackEvent({
      eventName: 'booking_flow_started',
      eventCategory: 'booking_flow',
      eventLabel: leadData.source || 'tax_calculator',
      value: leadData.taxSavingsAmount || 0,
      customData: {
        property_sale_price: leadData.propertySalePrice,
        tax_savings_amount: leadData.taxSavingsAmount
      }
    });

    // Track booking funnel entry
    this.trackBookingFunnelStep('initiated', {
      lead_value: leadData.taxSavingsAmount || 0,
      property_value: leadData.propertySalePrice || 0
    });
  }

  /**
   * Track date selection
   */
  trackDateSelected(selectedDate: Date, availableDates: Date[]): void {
    this.trackEvent({
      eventName: 'booking_date_selected',
      eventCategory: 'booking_flow',
      eventLabel: selectedDate.toISOString().split('T')[0],
      customData: {
        selected_date: selectedDate.toISOString().split('T')[0],
        available_dates_count: availableDates.length,
        day_of_week: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
        days_from_now: Math.ceil((selectedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }
    });

    this.trackBookingFunnelStep('date_selected', {
      selected_date: selectedDate.toISOString().split('T')[0],
      booking_advance_days: Math.ceil((selectedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    });
  }

  /**
   * Track time slot selection
   */
  trackTimeSelected(selectedSlot: AvailableSlot, availableSlots: AvailableSlot[]): void {
    const selectedTime = new Date(selectedSlot.time);
    
    this.trackEvent({
      eventName: 'booking_time_selected',
      eventCategory: 'booking_flow',
      eventLabel: selectedSlot.displayTime || selectedTime.toLocaleTimeString(),
      customData: {
        selected_time: selectedSlot.time,
        display_time: selectedSlot.displayTime,
        available_slots_count: availableSlots.length,
        hour_of_day: selectedTime.getHours(),
        duration_minutes: selectedSlot.duration || 30
      }
    });

    this.trackBookingFunnelStep('time_selected', {
      selected_time: selectedSlot.time,
      hour_preference: this.categorizeTimeOfDay(selectedTime.getHours())
    });
  }

  /**
   * Track booking confirmation
   */
  trackBookingConfirmed(appointment: Appointment): void {
    this.trackEvent({
      eventName: 'booking_confirmed',
      eventCategory: 'booking_flow',
      eventLabel: 'appointment_details_confirmed',
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment,
      customData: {
        contact_email: appointment.contactEmail,
        tax_savings: appointment.taxSavingsAmount,
        property_price: appointment.propertySalePrice,
        timezone: appointment.timezone,
        duration: appointment.durationMinutes,
        booking_id: appointment.highlevelAppointmentId
      }
    });

    this.trackBookingFunnelStep('confirmed', {
      appointment_id: appointment.highlevelAppointmentId,
      lead_value: appointment.taxSavingsAmount || 0
    });
  }

  // ============================================
  // Appointment Events
  // ============================================

  /**
   * Track appointment creation
   */
  trackAppointmentCreated(appointment: Appointment): void {
    this.trackEvent({
      eventName: 'appointment_created',
      eventCategory: 'appointment',
      eventLabel: 'highlevel_appointment_created',
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment
    });

    // Track as HighLevel event for CRM integration
    this.trackHighLevelEvent('appointment_created', {
      source: '1031 Tax Calculator',
      appointmentId: appointment.highlevelAppointmentId,
      contactId: appointment.highlevelContactId,
      value: appointment.taxSavingsAmount || 0,
      type: 'appointment_booking',
      propertyValue: appointment.propertySalePrice,
      exchangeTimeline: appointment.exchangeTimeline
    });

    this.trackBookingFunnelStep('appointment_created', {
      appointment_id: appointment.highlevelAppointmentId,
      status: appointment.status
    });
  }

  /**
   * Track appointment assignment (webhook received)
   */
  trackAppointmentAssigned(appointment: Appointment): void {
    this.trackEvent({
      eventName: 'appointment_assigned',
      eventCategory: 'appointment',
      eventLabel: 'specialist_assigned',
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment,
      customData: {
        specialist_id: appointment.assignedSpecialistId,
        specialist_name: appointment.assignedSpecialistName,
        meeting_location: appointment.meetingLocation,
        assignment_method: appointment.webhookReceivedAt ? 'webhook' : 'polling'
      }
    });

    this.trackHighLevelEvent('appointment_assigned', {
      appointmentId: appointment.highlevelAppointmentId,
      specialistId: appointment.assignedSpecialistId,
      specialistName: appointment.assignedSpecialistName,
      assignmentMethod: appointment.webhookReceivedAt ? 'webhook' : 'polling'
    });

    this.trackBookingFunnelStep('assigned', {
      appointment_id: appointment.highlevelAppointmentId,
      specialist_assigned: true
    });
  }

  /**
   * Track successful booking completion
   */
  trackBookingCompleted(appointment: Appointment): void {
    this.trackEvent({
      eventName: 'booking_completed',
      eventCategory: 'appointment',
      eventLabel: 'booking_flow_completed',
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment
    });

    // Track as conversion event
    this.trackConversion('appointment_booking', appointment.taxSavingsAmount || 0);

    // Track lead value for enhanced ecommerce
    this.trackLeadValue('1031 Tax Calculator Booking', appointment.taxSavingsAmount || 0);

    this.trackBookingFunnelStep('completed', {
      appointment_id: appointment.highlevelAppointmentId,
      final_value: appointment.taxSavingsAmount || 0,
      completion_time: new Date().toISOString()
    });
  }

  // ============================================
  // Error Tracking
  // ============================================

  /**
   * Track booking errors
   */
  trackBookingError(error: BookingError, context?: Record<string, any>): void {
    this.trackEvent({
      eventName: 'booking_error',
      eventCategory: 'booking_error',
      eventLabel: error.code,
      errorData: error,
      customData: {
        error_code: error.code,
        error_message: error.message,
        user_message: error.userMessage,
        retryable: error.retryable,
        context: context || {}
      }
    });

    // Track error in HighLevel for follow-up
    this.trackHighLevelEvent('booking_error', {
      errorCode: error.code,
      errorMessage: error.message,
      retryable: error.retryable,
      context: context
    });
  }

  /**
   * Track booking abandonment
   */
  trackBookingAbandoned(step: string, reason?: string): void {
    this.trackEvent({
      eventName: 'booking_abandoned',
      eventCategory: 'booking_flow',
      eventLabel: step,
      customData: {
        abandoned_step: step,
        abandonment_reason: reason || 'user_exit'
      }
    });

    this.trackBookingFunnelStep('abandoned', {
      abandoned_at_step: step,
      reason: reason
    });
  }

  // ============================================
  // Performance Tracking
  // ============================================

  /**
   * Track availability loading performance
   */
  trackAvailabilityLoading(duration: number, slotCount: number, cached: boolean): void {
    this.trackEvent({
      eventName: 'availability_loaded',
      eventCategory: 'booking_flow',
      eventLabel: cached ? 'cached' : 'fresh',
      value: duration,
      customData: {
        loading_duration_ms: duration,
        slots_count: slotCount,
        cached: cached,
        performance_category: this.categorizePerformance(duration)
      }
    });
  }

  /**
   * Track booking submission performance
   */
  trackBookingSubmissionPerformance(duration: number, success: boolean): void {
    this.trackEvent({
      eventName: 'booking_submission_performance',
      eventCategory: 'booking_flow',
      eventLabel: success ? 'success' : 'failure',
      value: duration,
      customData: {
        submission_duration_ms: duration,
        success: success,
        performance_category: this.categorizePerformance(duration)
      }
    });
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private trackEvent(event: BookingAnalyticsEvent): void {
    if (this.debugMode) {
      console.log('Booking Analytics Event:', event);
    }

    // Track in Google Analytics
    if (typeof window !== 'undefined' && window.trackContentEngagement) {
      window.trackContentEngagement(event.eventName, event.eventLabel || '');
    }

    // Track custom event in GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.eventName, {
        event_category: event.eventCategory,
        event_label: event.eventLabel,
        value: event.value,
        custom_data: event.customData
      });
    }
  }

  private trackBookingFunnelStep(step: string, data: Record<string, any>): void {
    if (typeof window !== 'undefined' && window.trackCalculatorStep) {
      window.trackCalculatorStep(`booking_${step}`, data);
    }
  }

  private trackHighLevelEvent(eventName: string, data: Record<string, any>): void {
    if (typeof window !== 'undefined' && window.trackHighLevelEvent) {
      window.trackHighLevelEvent(eventName, data);
    }
  }

  private trackConversion(conversionType: string, value: number): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/appointment_booking',
        value: value,
        currency: 'USD',
        transaction_id: `booking_${Date.now()}`
      });
    }
  }

  private trackLeadValue(source: string, value: number): void {
    if (typeof window !== 'undefined' && window.trackLeadValue) {
      window.trackLeadValue(source, value);
    }
  }

  private categorizeTimeOfDay(hour: number): string {
    if (hour < 9) return 'early_morning';
    if (hour < 12) return 'morning';
    if (hour < 15) return 'early_afternoon';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private categorizePerformance(duration: number): string {
    if (duration < 1000) return 'fast';
    if (duration < 3000) return 'acceptable';
    if (duration < 5000) return 'slow';
    return 'very_slow';
  }
}

// ============================================
// Singleton Instance
// ============================================

let bookingAnalyticsInstance: BookingAnalytics | null = null;

/**
 * Get booking analytics singleton
 */
export function getBookingAnalytics(): BookingAnalytics {
  if (!bookingAnalyticsInstance) {
    const debugMode = typeof window !== 'undefined' && 
                     !window.location.hostname.includes('national1031center.com');
    bookingAnalyticsInstance = new BookingAnalytics(debugMode);
  }
  return bookingAnalyticsInstance;
}

/**
 * Track booking flow events with simplified interface
 */
export const trackBookingEvent = {
  flowStart: (leadData: { taxSavingsAmount?: number; propertySalePrice?: number; source?: string }) => 
    getBookingAnalytics().trackBookingFlowStart(leadData),
  
  dateSelected: (date: Date, availableDates: Date[]) => 
    getBookingAnalytics().trackDateSelected(date, availableDates),
  
  timeSelected: (slot: AvailableSlot, availableSlots: AvailableSlot[]) => 
    getBookingAnalytics().trackTimeSelected(slot, availableSlots),
  
  bookingConfirmed: (appointment: Appointment) => 
    getBookingAnalytics().trackBookingConfirmed(appointment),
  
  appointmentCreated: (appointment: Appointment) => 
    getBookingAnalytics().trackAppointmentCreated(appointment),
  
  appointmentAssigned: (appointment: Appointment) => 
    getBookingAnalytics().trackAppointmentAssigned(appointment),
  
  bookingCompleted: (appointment: Appointment) => 
    getBookingAnalytics().trackBookingCompleted(appointment),
  
  bookingError: (error: BookingError, context?: Record<string, any>) => 
    getBookingAnalytics().trackBookingError(error, context),
  
  bookingAbandoned: (step: string, reason?: string) => 
    getBookingAnalytics().trackBookingAbandoned(step, reason),
  
  availabilityLoaded: (duration: number, slotCount: number, cached: boolean) => 
    getBookingAnalytics().trackAvailabilityLoading(duration, slotCount, cached),
  
  submissionPerformance: (duration: number, success: boolean) => 
    getBookingAnalytics().trackBookingSubmissionPerformance(duration, success)
};

export default BookingAnalytics;