import { D as DatabaseService } from './database.service_C6kdc69n.mjs';
import { H as HighLevelService } from './highlevel.service_BQje5Mta.mjs';

const BookingErrorCode = {
  // API Errors
  API_TIMEOUT: "API_TIMEOUT",
  API_RATE_LIMIT: "API_RATE_LIMIT",
  API_INVALID_RESPONSE: "API_INVALID_RESPONSE",
  API_AUTHENTICATION_FAILED: "API_AUTHENTICATION_FAILED",
  // Availability Errors
  NO_AVAILABILITY: "NO_AVAILABILITY",
  SLOT_NO_LONGER_AVAILABLE: "SLOT_NO_LONGER_AVAILABLE",
  CALENDAR_NOT_FOUND: "CALENDAR_NOT_FOUND",
  // Contact Errors
  CONTACT_CREATION_FAILED: "CONTACT_CREATION_FAILED",
  INVALID_CONTACT_DATA: "INVALID_CONTACT_DATA",
  // Appointment Errors
  APPOINTMENT_CREATION_FAILED: "APPOINTMENT_CREATION_FAILED",
  ASSIGNMENT_TIMEOUT: "ASSIGNMENT_TIMEOUT",
  WEBHOOK_TIMEOUT: "WEBHOOK_TIMEOUT",
  // Configuration Errors
  INVALID_CONFIG: "INVALID_CONFIG",
  CALENDAR_MISCONFIGURED: "CALENDAR_MISCONFIGURED",
  // Network Errors
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  // Unknown
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
};

const DEFAULT_CONFIG = {
  maxAttempts: 10,
  baseInterval: 5e3,
  // 5 seconds
  maxInterval: 6e4,
  // 1 minute
  exponentialBackoff: true
};
class AppointmentPoller {
  config;
  activePolls = /* @__PURE__ */ new Map();
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  /**
   * Start polling for appointment assignment
   */
  async startPolling(appointmentId, onUpdate, onError) {
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
        console.error("Polling error:", error);
        onError(error);
      }
    } finally {
      this.activePolls.delete(appointmentId);
    }
  }
  /**
   * Stop polling for specific appointment
   */
  stopPolling(appointmentId) {
    const controller = this.activePolls.get(appointmentId);
    if (controller) {
      controller.abort();
      this.activePolls.delete(appointmentId);
    }
  }
  /**
   * Stop all active polling
   */
  stopAllPolling() {
    for (const [appointmentId, controller] of this.activePolls) {
      controller.abort();
    }
    this.activePolls.clear();
  }
  /**
   * Get number of active polls
   */
  getActivePollCount() {
    return this.activePolls.size;
  }
  // ============================================
  // Private Methods
  // ============================================
  async pollWithBackoff(appointmentId, onUpdate, onError, signal) {
    const databaseService = DatabaseService.getInstance();
    let attempts = 0;
    while (attempts < this.config.maxAttempts && !signal.aborted) {
      try {
        attempts++;
        const appointment = await databaseService.getAppointment(appointmentId);
        if (!appointment) {
          throw new Error(`Appointment ${appointmentId} not found`);
        }
        await databaseService.incrementPollingAttempts(appointmentId);
        if (appointment.status === "confirmed" || appointment.status === "failed") {
          console.log(`Polling complete for ${appointmentId}: ${appointment.status}`);
          onUpdate(appointment);
          return;
        }
        if (attempts >= this.config.maxAttempts) {
          console.log(`Max polling attempts reached for ${appointmentId}, checking HighLevel API`);
          const apiResult = await this.checkHighLevelAPI(appointment);
          if (apiResult) {
            onUpdate(apiResult);
            return;
          } else {
            const failedAppointment = await databaseService.updateAppointment(appointmentId, {
              status: "failed",
              webhookPayload: {
                polling_timeout: true,
                max_attempts_reached: attempts,
                timeout_at: (/* @__PURE__ */ new Date()).toISOString()
              },
              webhookReceivedAt: /* @__PURE__ */ new Date()
            });
            if (failedAppointment) {
              onUpdate(failedAppointment);
            }
            return;
          }
        }
        const interval = this.calculateNextInterval(attempts);
        console.log(`Polling attempt ${attempts}/${this.config.maxAttempts} for ${appointmentId}, next check in ${interval}ms`);
        await this.sleep(interval, signal);
      } catch (error) {
        console.error(`Polling attempt ${attempts} failed for ${appointmentId}:`, error);
        if (attempts >= this.config.maxAttempts) {
          onError(error);
          return;
        }
        await this.sleep(this.config.baseInterval, signal);
      }
    }
  }
  async checkHighLevelAPI(appointment) {
    try {
      const highlevelService = new HighLevelService();
      const apiAppointment = await highlevelService.getAppointmentStatus(
        appointment.highlevelAppointmentId
      );
      if (!apiAppointment) {
        return null;
      }
      const hasAssignment = apiAppointment.assignedUserId && apiAppointment.appointmentStatus === "confirmed";
      if (hasAssignment) {
        const databaseService = DatabaseService.getInstance();
        return await databaseService.updateAppointment(appointment.id, {
          status: "confirmed",
          assignedSpecialistId: apiAppointment.assignedUserId,
          assignedSpecialistName: apiAppointment.assignedUserName || "Assigned Specialist",
          meetingLocation: apiAppointment.meetingLocation,
          webhookPayload: {
            api_polling_result: true,
            api_response: apiAppointment
          },
          webhookReceivedAt: /* @__PURE__ */ new Date()
        });
      }
      return null;
    } catch (error) {
      console.error("Error checking HighLevel API:", error);
      return null;
    }
  }
  calculateNextInterval(attempt) {
    if (!this.config.exponentialBackoff) {
      return this.config.baseInterval;
    }
    const exponentialInterval = this.config.baseInterval * Math.pow(2, attempt - 1);
    return Math.min(exponentialInterval, this.config.maxInterval);
  }
  sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Polling aborted"));
        return;
      }
      const timeout = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Polling aborted"));
        });
      }
    });
  }
}
let pollerInstance = null;
function getAppointmentPoller(config) {
  if (!pollerInstance) {
    pollerInstance = new AppointmentPoller(config);
  }
  return pollerInstance;
}

class BookingAnalytics {
  debugMode;
  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }
  // ============================================
  // Booking Flow Events
  // ============================================
  /**
   * Track when booking flow is initiated
   */
  trackBookingFlowStart(leadData) {
    this.trackEvent({
      eventName: "booking_flow_started",
      eventCategory: "booking_flow",
      eventLabel: leadData.source || "tax_calculator",
      value: leadData.taxSavingsAmount || 0,
      customData: {
        property_sale_price: leadData.propertySalePrice,
        tax_savings_amount: leadData.taxSavingsAmount
      }
    });
    this.trackBookingFunnelStep("initiated", {
      lead_value: leadData.taxSavingsAmount || 0,
      property_value: leadData.propertySalePrice || 0
    });
  }
  /**
   * Track date selection
   */
  trackDateSelected(selectedDate, availableDates) {
    this.trackEvent({
      eventName: "booking_date_selected",
      eventCategory: "booking_flow",
      eventLabel: selectedDate.toISOString().split("T")[0],
      customData: {
        selected_date: selectedDate.toISOString().split("T")[0],
        available_dates_count: availableDates.length,
        day_of_week: selectedDate.toLocaleDateString("en-US", { weekday: "long" }),
        days_from_now: Math.ceil((selectedDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24))
      }
    });
    this.trackBookingFunnelStep("date_selected", {
      selected_date: selectedDate.toISOString().split("T")[0],
      booking_advance_days: Math.ceil((selectedDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24))
    });
  }
  /**
   * Track time slot selection
   */
  trackTimeSelected(selectedSlot, availableSlots) {
    const selectedTime = new Date(selectedSlot.time);
    this.trackEvent({
      eventName: "booking_time_selected",
      eventCategory: "booking_flow",
      eventLabel: selectedSlot.displayTime || selectedTime.toLocaleTimeString(),
      customData: {
        selected_time: selectedSlot.time,
        display_time: selectedSlot.displayTime,
        available_slots_count: availableSlots.length,
        hour_of_day: selectedTime.getHours(),
        duration_minutes: selectedSlot.duration || 30
      }
    });
    this.trackBookingFunnelStep("time_selected", {
      selected_time: selectedSlot.time,
      hour_preference: this.categorizeTimeOfDay(selectedTime.getHours())
    });
  }
  /**
   * Track booking confirmation
   */
  trackBookingConfirmed(appointment) {
    this.trackEvent({
      eventName: "booking_confirmed",
      eventCategory: "booking_flow",
      eventLabel: "appointment_details_confirmed",
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
    this.trackBookingFunnelStep("confirmed", {
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
  trackAppointmentCreated(appointment) {
    this.trackEvent({
      eventName: "appointment_created",
      eventCategory: "appointment",
      eventLabel: "highlevel_appointment_created",
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment
    });
    this.trackHighLevelEvent("appointment_created", {
      source: "1031 Tax Calculator",
      appointmentId: appointment.highlevelAppointmentId,
      contactId: appointment.highlevelContactId,
      value: appointment.taxSavingsAmount || 0,
      type: "appointment_booking",
      propertyValue: appointment.propertySalePrice,
      exchangeTimeline: appointment.exchangeTimeline
    });
    this.trackBookingFunnelStep("appointment_created", {
      appointment_id: appointment.highlevelAppointmentId,
      status: appointment.status
    });
  }
  /**
   * Track appointment assignment (webhook received)
   */
  trackAppointmentAssigned(appointment) {
    this.trackEvent({
      eventName: "appointment_assigned",
      eventCategory: "appointment",
      eventLabel: "specialist_assigned",
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment,
      customData: {
        specialist_id: appointment.assignedSpecialistId,
        specialist_name: appointment.assignedSpecialistName,
        meeting_location: appointment.meetingLocation,
        assignment_method: appointment.webhookReceivedAt ? "webhook" : "polling"
      }
    });
    this.trackHighLevelEvent("appointment_assigned", {
      appointmentId: appointment.highlevelAppointmentId,
      specialistId: appointment.assignedSpecialistId,
      specialistName: appointment.assignedSpecialistName,
      assignmentMethod: appointment.webhookReceivedAt ? "webhook" : "polling"
    });
    this.trackBookingFunnelStep("assigned", {
      appointment_id: appointment.highlevelAppointmentId,
      specialist_assigned: true
    });
  }
  /**
   * Track successful booking completion
   */
  trackBookingCompleted(appointment) {
    this.trackEvent({
      eventName: "booking_completed",
      eventCategory: "appointment",
      eventLabel: "booking_flow_completed",
      value: appointment.taxSavingsAmount || 0,
      appointmentData: appointment
    });
    this.trackConversion("appointment_booking", appointment.taxSavingsAmount || 0);
    this.trackLeadValue("1031 Tax Calculator Booking", appointment.taxSavingsAmount || 0);
    this.trackBookingFunnelStep("completed", {
      appointment_id: appointment.highlevelAppointmentId,
      final_value: appointment.taxSavingsAmount || 0,
      completion_time: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  // ============================================
  // Error Tracking
  // ============================================
  /**
   * Track booking errors
   */
  trackBookingError(error, context) {
    this.trackEvent({
      eventName: "booking_error",
      eventCategory: "booking_error",
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
    this.trackHighLevelEvent("booking_error", {
      errorCode: error.code,
      errorMessage: error.message,
      retryable: error.retryable,
      context
    });
  }
  /**
   * Track booking abandonment
   */
  trackBookingAbandoned(step, reason) {
    this.trackEvent({
      eventName: "booking_abandoned",
      eventCategory: "booking_flow",
      eventLabel: step,
      customData: {
        abandoned_step: step,
        abandonment_reason: reason || "user_exit"
      }
    });
    this.trackBookingFunnelStep("abandoned", {
      abandoned_at_step: step,
      reason
    });
  }
  // ============================================
  // Performance Tracking
  // ============================================
  /**
   * Track availability loading performance
   */
  trackAvailabilityLoading(duration, slotCount, cached) {
    this.trackEvent({
      eventName: "availability_loaded",
      eventCategory: "booking_flow",
      eventLabel: cached ? "cached" : "fresh",
      value: duration,
      customData: {
        loading_duration_ms: duration,
        slots_count: slotCount,
        cached,
        performance_category: this.categorizePerformance(duration)
      }
    });
  }
  /**
   * Track booking submission performance
   */
  trackBookingSubmissionPerformance(duration, success) {
    this.trackEvent({
      eventName: "booking_submission_performance",
      eventCategory: "booking_flow",
      eventLabel: success ? "success" : "failure",
      value: duration,
      customData: {
        submission_duration_ms: duration,
        success,
        performance_category: this.categorizePerformance(duration)
      }
    });
  }
  // ============================================
  // Private Helper Methods
  // ============================================
  trackEvent(event) {
    if (this.debugMode) {
      console.log("Booking Analytics Event:", event);
    }
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement(event.eventName, event.eventLabel || "");
    }
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event.eventName, {
        event_category: event.eventCategory,
        event_label: event.eventLabel,
        value: event.value,
        custom_data: event.customData
      });
    }
  }
  trackBookingFunnelStep(step, data) {
    if (typeof window !== "undefined" && window.trackCalculatorStep) {
      window.trackCalculatorStep(`booking_${step}`, data);
    }
  }
  trackHighLevelEvent(eventName, data) {
    if (typeof window !== "undefined" && window.trackHighLevelEvent) {
      window.trackHighLevelEvent(eventName, data);
    }
  }
  trackConversion(conversionType, value) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-CONVERSION_ID/appointment_booking",
        value,
        currency: "USD",
        transaction_id: `booking_${Date.now()}`
      });
    }
  }
  trackLeadValue(source, value) {
    if (typeof window !== "undefined" && window.trackLeadValue) {
      window.trackLeadValue(source, value);
    }
  }
  categorizeTimeOfDay(hour) {
    if (hour < 9) return "early_morning";
    if (hour < 12) return "morning";
    if (hour < 15) return "early_afternoon";
    if (hour < 18) return "afternoon";
    return "evening";
  }
  categorizePerformance(duration) {
    if (duration < 1e3) return "fast";
    if (duration < 3e3) return "acceptable";
    if (duration < 5e3) return "slow";
    return "very_slow";
  }
}
let bookingAnalyticsInstance = null;
function getBookingAnalytics() {
  if (!bookingAnalyticsInstance) {
    const debugMode = typeof window !== "undefined" && !window.location.hostname.includes("the1031center.com");
    bookingAnalyticsInstance = new BookingAnalytics(debugMode);
  }
  return bookingAnalyticsInstance;
}
const trackBookingEvent = {
  flowStart: (leadData) => getBookingAnalytics().trackBookingFlowStart(leadData),
  dateSelected: (date, availableDates) => getBookingAnalytics().trackDateSelected(date, availableDates),
  timeSelected: (slot, availableSlots) => getBookingAnalytics().trackTimeSelected(slot, availableSlots),
  bookingConfirmed: (appointment) => getBookingAnalytics().trackBookingConfirmed(appointment),
  appointmentCreated: (appointment) => getBookingAnalytics().trackAppointmentCreated(appointment),
  appointmentAssigned: (appointment) => getBookingAnalytics().trackAppointmentAssigned(appointment),
  bookingCompleted: (appointment) => getBookingAnalytics().trackBookingCompleted(appointment),
  bookingError: (error, context) => getBookingAnalytics().trackBookingError(error, context),
  bookingAbandoned: (step, reason) => getBookingAnalytics().trackBookingAbandoned(step, reason),
  availabilityLoaded: (duration, slotCount, cached) => getBookingAnalytics().trackAvailabilityLoading(duration, slotCount, cached),
  submissionPerformance: (duration, success) => getBookingAnalytics().trackBookingSubmissionPerformance(duration, success)
};

export { BookingErrorCode as B, getAppointmentPoller as g, trackBookingEvent as t };
