// ============================================
// Appointment Booking Component
// National 1031 Center - HighLevel Integration
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import type { 
  BookingFlowProps, 
  BookingState, 
  AvailableSlot, 
  Appointment,
  BookingError
} from '../../lib/types/highlevel';
import { BookingErrorCode } from '../../lib/types/highlevel';
import { getHighLevelService } from '../../lib/services/HighLevelService';
import { getDatabaseService } from '../../lib/services/DatabaseService';
import { getAppointmentPoller } from '../../lib/utils/appointmentPoller';
import { trackBookingEvent } from '../../lib/analytics/bookingAnalytics';

// ============================================
// Main Booking Component
// ============================================

export const AppointmentBooking: React.FC<BookingFlowProps> = ({
  leadData,
  onSuccess,
  onError,
  onCancel,
  options = {}
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<BookingState>('idle');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<BookingError | null>(null);
  const [loading, setLoading] = useState(false);

  // Services
  const highlevelService = useRef<any>(null);
  const databaseService = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const pollerRef = useRef<any>(null);

  // Options with defaults
  const {
    timezone = 'America/New_York',
    prefetchDays = 14,
    minBookingHours = 2,
    maxBookingDays = 30, // HighLevel API limit is 31 days
    debugMode = false
  } = options;

  // ============================================
  // Initialization
  // ============================================

  useEffect(() => {
    initializeServices();
    return () => {
      // Cleanup subscription and polling on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (pollerRef.current && appointment?.id) {
        pollerRef.current.stopPolling(appointment.id);
      }
    };
  }, []);

  const initializeServices = async () => {
    try {
      highlevelService.current = await getHighLevelService();
      databaseService.current = getDatabaseService();
      pollerRef.current = getAppointmentPoller();
      
      // Track booking flow start safely
      try {
        if (trackBookingEvent && typeof trackBookingEvent.flowStart === 'function') {
          trackBookingEvent.flowStart({
            taxSavingsAmount: leadData.taxSavingsAmount,
            propertySalePrice: leadData.propertySalePrice,
            source: '1031_tax_calculator'
          });
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }
      
      setCurrentStep('loading-availability');
      await loadAvailableDates();
    } catch (error) {
      console.error('Error initializing services:', error);
      handleError({
        code: BookingErrorCode.INVALID_CONFIG,
        message: 'Failed to initialize booking system',
        details: error,
        userMessage: 'Unable to load booking system. Please try refreshing the page.',
        retryable: true
      });
    }
  };

  // ============================================
  // Availability Loading
  // ============================================

  const loadAvailableDates = async () => {
    const startTime = performance.now();
    
    try {
      setLoading(true);
      
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + minBookingHours); // Minimum booking time
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + maxBookingDays);

      const response = await highlevelService.current.getAvailability({
        calendarId: highlevelService.current.getCalendarId(),
        startDate: startDate.getTime().toString(),
        endDate: endDate.getTime().toString(),
        timezone
      });

      // Debug: Log the raw response
      console.log('AppointmentBooking - Raw API response:', {
        slotsLength: response.slots?.length || 0,
        firstSlot: response.slots?.[0],
        allSlots: response.slots
      });

      // Group slots by date
      const dateSlotMap = new Map<string, AvailableSlot[]>();
      const validSlots: AvailableSlot[] = [];
      
      response.slots.forEach((slot: AvailableSlot, index: number) => {
        console.log(`Processing slot ${index}:`, slot);
        
        if (!slot.time) {
          console.warn(`Slot ${index} has no time property`, slot);
          return;
        }
        
        const slotDate = new Date(slot.time);
        if (isNaN(slotDate.getTime())) {
          console.warn(`Slot ${index} has invalid time:`, slot.time);
          return;
        }
        
        validSlots.push(slot);
        const dateKey = slotDate.toISOString().split('T')[0];
        
        if (!dateSlotMap.has(dateKey)) {
          dateSlotMap.set(dateKey, []);
        }
        dateSlotMap.get(dateKey)!.push(slot);
      });

      console.log('Date grouping results:', {
        totalSlots: response.slots.length,
        validSlots: validSlots.length,
        uniqueDates: dateSlotMap.size,
        dateKeys: Array.from(dateSlotMap.keys())
      });

      // Convert to available dates array
      const dates = Array.from(dateSlotMap.keys())
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => a.getTime() - b.getTime());

      setAvailableDates(dates);
      setCurrentStep('selecting-date');

      // Track availability loading performance
      const duration = performance.now() - startTime;
      
      try {
        if (trackBookingEvent && typeof trackBookingEvent.availabilityLoaded === 'function') {
          trackBookingEvent.availabilityLoaded(duration, response.slots.length, response.cached || false);
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }

      console.log('Final available dates:', dates);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      handleError(error as BookingError);
    } finally {
      setLoading(false);
    }
  };

  const loadSlotsForDate = async (date: Date) => {
    try {
      setLoading(true);
      
      const response = await highlevelService.current.getAvailability({
        calendarId: highlevelService.current.getCalendarId(),
        startDate: date.getTime().toString(),
        endDate: date.getTime().toString(),
        timezone
      });

      const dateSlots = response.slots.filter((slot: AvailableSlot) => {
        const slotDate = new Date(slot.time);
        return slotDate.toDateString() === date.toDateString();
      });

      setAvailableSlots(dateSlots);
      setCurrentStep('selecting-time');

      if (debugMode) {
        console.log('Loaded slots for date:', date, dateSlots);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      handleError(error as BookingError);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Booking Flow
  // ============================================

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    // Track date selection
    trackBookingEvent.dateSelected(date, availableDates);
    
    loadSlotsForDate(date);
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    
    // Track time selection
    trackBookingEvent.timeSelected(slot, availableSlots);
    
    setCurrentStep('confirming-details');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    const startTime = performance.now();

    try {
      setCurrentStep('creating-appointment');
      setLoading(true);

      // Create appointment object for tracking
      const appointmentData: Appointment = {
        id: '',
        highlevelAppointmentId: '',
        highlevelContactId: '',
        status: 'pending_assignment',
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.time,
        timezone,
        durationMinutes: 30,
        contactEmail: leadData.email,
        contactPhone: leadData.phone,
        contactFirstName: leadData.firstName,
        contactLastName: leadData.lastName,
        taxSavingsAmount: leadData.taxSavingsAmount,
        propertySalePrice: leadData.propertySalePrice,
        sourceUrl: window.location.href,
        pollingAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Track booking confirmation
      trackBookingEvent.bookingConfirmed(appointmentData);

      // Create appointment in HighLevel
      const appointmentRequest = {
        email: leadData.email,
        phone: leadData.phone,
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        appointmentDate: selectedSlot.time,
        timezone,
        taxSavingsAmount: leadData.taxSavingsAmount,
        propertySalePrice: leadData.propertySalePrice,
        sourceUrl: window.location.href,
        formData: leadData.propertyDetails
      };

      const newAppointment = await highlevelService.current.createAppointment(appointmentRequest);
      
      // Save to our database
      const savedAppointment = await databaseService.current.createAppointment(newAppointment);
      
      setAppointment(savedAppointment);
      setCurrentStep('pending-assignment');

      // Track appointment creation
      trackBookingEvent.appointmentCreated(savedAppointment);

      // Track submission performance
      const duration = performance.now() - startTime;
      trackBookingEvent.submissionPerformance(duration, true);

      // Set up real-time subscription for assignment updates
      subscribeToAppointmentUpdates(savedAppointment.id);

      // Start polling fallback immediately (poller has its own delays)
      pollerRef.current.startPolling(
        savedAppointment.id,
        (updatedAppointment: Appointment) => {
          console.log('Polling update received:', updatedAppointment);
          setAppointment(updatedAppointment);
          
          if (updatedAppointment.status === 'confirmed') {
            // Track appointment assignment
            trackBookingEvent.appointmentAssigned(updatedAppointment);
            // Track booking completion
            trackBookingEvent.bookingCompleted(updatedAppointment);
            
            setCurrentStep('confirmed');
            onSuccess(updatedAppointment);
          } else if (updatedAppointment.status === 'failed') {
            const error = {
              code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
              message: 'Appointment assignment failed after polling',
              details: updatedAppointment,
              userMessage: 'Unable to assign your appointment. Please try again or call us directly.',
              retryable: true
            };
            
            // Track booking error
            trackBookingEvent.bookingError(error, { source: 'polling_fallback' });
            
            handleError(error);
          }
        },
        (error: Error) => {
          console.error('Polling error:', error);
          handleError({
            code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
            message: 'Polling failed',
            details: error,
            userMessage: 'Unable to confirm appointment assignment. Please try again or call us directly.',
            retryable: true
          });
        }
      );

    } catch (error) {
      console.error('Error creating appointment:', error);
      handleError(error as BookingError);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Real-time Updates & Polling
  // ============================================

  const subscribeToAppointmentUpdates = (appointmentId: string) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = databaseService.current.subscribeToAppointment(
      appointmentId,
      (updatedAppointment: Appointment) => {
        setAppointment(updatedAppointment);
        
        if (updatedAppointment.status === 'confirmed' && updatedAppointment.assignedSpecialistId) {
          setCurrentStep('confirmed');
          
          // Track successful assignment
          if (typeof window !== 'undefined' && window.trackContentEngagement) {
            window.trackContentEngagement('appointment_confirmed', 'appointment_booking');
          }
          
          onSuccess(updatedAppointment);
        } else if (updatedAppointment.status === 'failed') {
          handleError({
            code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
            message: 'Appointment assignment failed',
            details: updatedAppointment,
            userMessage: 'Unable to assign appointment. Please try again or call us directly.',
            retryable: true
          });
        }
      }
    );
  };


  // ============================================
  // Error Handling
  // ============================================

  const handleError = (bookingError: BookingError) => {
    // Track booking error safely
    try {
      if (trackBookingEvent && typeof trackBookingEvent.bookingError === 'function') {
        trackBookingEvent.bookingError(bookingError, { 
          step: currentStep,
          timestamp: new Date().toISOString()
        });
      }
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }
    
    setError(bookingError);
    setCurrentStep('error');
    setLoading(false);
    onError(bookingError);
  };

  const handleRetry = () => {
    // Stop any active polling
    if (pollerRef.current && appointment?.id) {
      pollerRef.current.stopPolling(appointment.id);
    }
    
    setError(null);
    setCurrentStep('idle');
    initializeServices();
  };

  const handleBackToDateSelection = () => {
    setSelectedSlot(null);
    setCurrentStep('selecting-time');
  };

  const handleBackToTimeSelection = () => {
    setCurrentStep('selecting-date');
  };

  // ============================================
  // Render Methods
  // ============================================

  const renderDateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Schedule Your 1031 Exchange Consultation
        </h3>
        <p className="text-gray-600">
          Select a date for your free consultation with one of our 1031 exchange specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableDates.length > 0 ? (
          availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900">
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600 mb-2">No available dates found.</p>
            <p className="text-sm text-gray-500">
              Please check the browser console for debugging information.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Debug: {availableDates.length} dates loaded
            </p>
          </div>
        )}
      </div>

      {onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );

  const renderTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Time
        </h3>
        <p className="text-gray-600">
          Available times for {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotSelect(slot)}
            className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center font-medium"
          >
            {slot.displayTime || new Date(slot.time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: timezone
            })}
          </button>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleBackToTimeSelection}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Dates
        </button>
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Confirm Your Appointment
        </h3>
        <p className="text-gray-600">
          Please review your appointment details below.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900">Contact Information</h4>
          <p className="text-gray-600">
            {leadData.firstName} {leadData.lastName}<br />
            {leadData.email}<br />
            {leadData.phone}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">Appointment Details</h4>
          <p className="text-gray-600">
            {selectedDate?.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}<br />
            {selectedSlot?.displayTime || new Date(selectedSlot!.time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: timezone
            })} ({timezone})
          </p>
        </div>

        {leadData.taxSavingsAmount && (
          <div>
            <h4 className="font-semibold text-gray-900">Tax Savings Opportunity</h4>
            <p className="text-green-600 font-semibold">
              ${leadData.taxSavingsAmount.toLocaleString()} in potential tax savings
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleBackToDateSelection}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Times
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Scheduling...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  );

  const renderPendingAssignment = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Confirming Your Appointment
        </h3>
        <p className="text-gray-600">
          We're assigning you to one of our 1031 exchange specialists. 
          This usually takes just a few seconds.
        </p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Your appointment is being processed.</strong><br />
          You'll receive a confirmation email shortly with meeting details.
        </p>
      </div>
    </div>
  );

  const renderConfirmed = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Appointment Confirmed!
        </h3>
        <p className="text-gray-600">
          Your consultation has been scheduled successfully.
        </p>
      </div>

      {appointment && (
        <div className="bg-green-50 p-6 rounded-lg text-left space-y-3">
          <h4 className="font-semibold text-green-900">Appointment Details</h4>
          <div className="text-green-800">
            <p><strong>Date:</strong> {appointment.appointmentDate.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            {appointment.assignedSpecialistName && (
              <p><strong>Specialist:</strong> {appointment.assignedSpecialistName}</p>
            )}
            {appointment.meetingLocation && (
              <p><strong>Meeting Link:</strong> 
                <a href={appointment.meetingLocation} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline ml-1">
                  Click to join
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        You'll receive a confirmation email with calendar invite and meeting details.
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-red-900 mb-2">
          Booking Error
        </h3>
        <p className="text-gray-600">
          {error?.userMessage || 'An error occurred while booking your appointment.'}
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        {error?.retryable && (
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Try Again
          </button>
        )}
        
        <a
          href="tel:+18001031TAX"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => {
            if (typeof window !== 'undefined' && window.trackPhoneCall) {
              window.trackPhoneCall('booking_error_fallback');
            }
          }}
        >
          Call Us Instead
        </a>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Available Times
        </h3>
        <p className="text-gray-600">
          Please wait while we find the best appointment times for you.
        </p>
      </div>
    </div>
  );

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {currentStep === 'idle' && renderLoadingState()}
      {currentStep === 'loading-availability' && renderLoadingState()}
      {currentStep === 'selecting-date' && renderDateSelection()}
      {currentStep === 'selecting-time' && renderTimeSelection()}
      {currentStep === 'confirming-details' && renderBookingConfirmation()}
      {currentStep === 'creating-appointment' && renderLoadingState()}
      {currentStep === 'pending-assignment' && renderPendingAssignment()}
      {currentStep === 'confirmed' && renderConfirmed()}
      {currentStep === 'error' && renderError()}
    </div>
  );
};

export default AppointmentBooking;