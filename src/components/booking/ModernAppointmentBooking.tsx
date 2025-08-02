// ============================================
// Modern Appointment Booking Component
// Professional 3-Step Wizard Design
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
import { HighLevelService } from '../../lib/services/highlevel.service';
import { DatabaseService } from '../../lib/services/database.service';
import { getAppointmentPoller } from '../../lib/utils/appointmentPoller';
import { trackBookingEvent } from '../../lib/analytics/bookingAnalytics';

// ============================================
// Step Progress Indicator Component
// ============================================

interface StepIndicatorProps {
  currentStep: 'contact' | 'datetime' | 'confirmation';
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'contact', label: 'Contact Info', icon: '👤' },
    { id: 'datetime', label: 'Date & Time', icon: '📅' },
    { id: 'confirmation', label: 'Confirmation', icon: '✅' }
  ];

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center space-x-1 sm:space-x-3 ${
            currentStep === step.id ? 'text-yellow-400' : 
            steps.findIndex(s => s.id === currentStep) > index ? 'text-green-500' : 'text-gray-400'
          }`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base ${
              currentStep === step.id ? 'bg-yellow-400' : 
              steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              {steps.findIndex(s => s.id === currentStep) > index ? '✓' : step.icon}
            </div>
            <span className="font-medium text-xs sm:text-sm md:text-base hidden sm:block">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 sm:w-12 lg:w-16 h-0.5 mx-1 sm:mx-2 lg:mx-4 ${
              steps.findIndex(s => s.id === currentStep) > index ? 'bg-yellow-400' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// Main Modern Booking Component
// ============================================

export const ModernAppointmentBooking: React.FC<BookingFlowProps> = ({
  leadData,
  onSuccess,
  onError,
  onCancel,
  options = {}
}) => {
  // State management
  const [currentWizardStep, setCurrentWizardStep] = useState<'contact' | 'datetime' | 'confirmation'>('contact');
  const [currentStep, setCurrentStep] = useState<BookingState>('idle');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<BookingError | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotsCache, setSlotsCache] = useState<Map<string, AvailableSlot[]>>(new Map());
  
  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    firstName: leadData.firstName || '',
    lastName: leadData.lastName || '',
    email: leadData.email || '',
    phone: leadData.phone || '',
    serviceConsent: false,
    marketingConsent: false
  });

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
    maxBookingDays = 30,
    debugMode = false
  } = options;

  // ============================================
  // Initialization (keep existing logic)
  // ============================================

  useEffect(() => {
    if (currentWizardStep === 'datetime' && availableDates.length === 0) {
      initializeServices();
    }
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (pollerRef.current && appointment?.id) {
        pollerRef.current.stopPolling(appointment.id);
      }
    };
  }, [currentWizardStep]);

  // Scroll to top when wizard step changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentWizardStep]);

  const initializeServices = async () => {
    try {
      highlevelService.current = new HighLevelService();
      databaseService.current = DatabaseService.getInstance();
      pollerRef.current = getAppointmentPoller();
      
      await highlevelService.current.getConfig();
      
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
  // Keep all existing availability and booking logic
  // ============================================

  const generateMonthCalendar = (month: Date, availableDates: Date[]) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    // Get day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create array of all days in month
    const daysInMonth = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysInMonth.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, monthIndex, day));
    }
    
    // Create a Set of available date strings for quick lookup
    const availableDateStrings = new Set(
      availableDates.map(date => date.toDateString())
    );
    
    return { daysInMonth, availableDateStrings };
  };

  const loadAvailableDates = async () => {
    const startTime = performance.now();
    
    try {
      setLoading(true);
      
      await highlevelService.current.getConfig();
      
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + minBookingHours);
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + maxBookingDays);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      console.log('[ModernAppointmentBooking] Loading availability:', {
        startDate: startDateStr,
        endDate: endDateStr,
        days: maxBookingDays,
        timezone
      });

      const availabilityData = await highlevelService.current.getAvailabilityRange({
        startDate: startDateStr,
        endDate: endDateStr,
        timezone
      });

      const allSlots: AvailableSlot[] = [];
      const dateSlotMap = new Map<string, AvailableSlot[]>();
      
      availabilityData.forEach(({ date, slots }) => {
        if (slots.length > 0) {
          dateSlotMap.set(date, slots);
          allSlots.push(...slots);
        }
      });

      const dates = Array.from(dateSlotMap.keys())
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => a.getTime() - b.getTime());

      setAvailableDates(dates);
      setSlotsCache(dateSlotMap); // Cache all slot data for instant access
      setCurrentStep('selecting-date');

      const duration = performance.now() - startTime;
      
      try {
        if (trackBookingEvent && typeof trackBookingEvent.availabilityLoaded === 'function') {
          trackBookingEvent.availabilityLoaded(duration, allSlots.length, false);
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }
      
      console.log(`[ModernAppointmentBooking] Cached ${dateSlotMap.size} days of slot data`)

    } catch (error) {
      console.error('[ModernAppointmentBooking] Error loading availability:', error);
      handleError(error as BookingError);
    } finally {
      setLoading(false);
    }
  };

  const loadSlotsForDate = async (date: Date) => {
    try {
      setLoading(true);
      
      const dateString = date.toISOString().split('T')[0];
      console.log(`[ModernAppointmentBooking] Loading slots for ${dateString}`);
      
      // Check cache first for instant loading
      const cachedSlots = slotsCache.get(dateString);
      
      if (cachedSlots) {
        console.log(`[ModernAppointmentBooking] Using cached slots for ${dateString}: ${cachedSlots.length} slots`);
        setAvailableSlots(cachedSlots);
        setLoading(false);
        return;
      }
      
      // Fallback to API call if not cached (shouldn't happen with proper caching)
      console.log(`[ModernAppointmentBooking] No cached slots for ${dateString}, fetching from API`);
      
      const response = await highlevelService.current.getAvailability({
        date: dateString,
        timezone
      });

      const dateSlots = response.filter((slot: AvailableSlot) => {
        if (!slot.time) return false;
        const slotDateStr = slot.time.split('T')[0];
        const selectedDateStr = date.toISOString().split('T')[0];
        return slotDateStr === selectedDateStr;
      });

      setAvailableSlots(dateSlots);
      
      // Update cache with new data
      const newCache = new Map(slotsCache);
      newCache.set(dateString, dateSlots);
      setSlotsCache(newCache);
      
      console.log(`[ModernAppointmentBooking] Fetched and cached ${dateSlots.length} slots for selected date`);
    } catch (error) {
      console.error('[ModernAppointmentBooking] Error loading slots:', error);
      handleError(error as BookingError);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Keep existing booking logic with minor updates
  // ============================================

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    try {
      if (trackBookingEvent && typeof trackBookingEvent.dateSelected === 'function') {
        trackBookingEvent.dateSelected(date, availableDates);
      }
    } catch (e) {
      console.error('Analytics error:', e);
    }
    
    loadSlotsForDate(date);
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    
    try {
      if (trackBookingEvent && typeof trackBookingEvent.timeSelected === 'function') {
        trackBookingEvent.timeSelected(slot, availableSlots);
      }
    } catch (e) {
      console.error('Analytics error:', e);  
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    const startTime = performance.now();

    try {
      setCurrentStep('creating-appointment');
      setLoading(true);

      const appointmentData: Appointment = {
        id: '',
        highlevelAppointmentId: '',
        highlevelContactId: '',
        status: 'pending_assignment',
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.time,
        timezone,
        durationMinutes: 30,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
        contactFirstName: contactInfo.firstName,
        contactLastName: contactInfo.lastName,
        taxSavingsAmount: leadData.taxSavingsAmount,
        propertySalePrice: leadData.propertySalePrice,
        sourceUrl: window.location.href,
        pollingAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      try {
        if (trackBookingEvent && typeof trackBookingEvent.bookingConfirmed === 'function') {
          trackBookingEvent.bookingConfirmed(appointmentData);
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }

      const appointmentRequest = {
        email: contactInfo.email,
        phone: contactInfo.phone,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        appointmentDate: selectedSlot.time,
        timezone,
        taxSavingsAmount: leadData.taxSavingsAmount,
        propertySalePrice: leadData.propertySalePrice,
        sourceUrl: window.location.href,
        formData: leadData.propertyDetails
      };

      const newAppointment = await highlevelService.current.bookAppointment(appointmentRequest);
      const savedAppointment = await databaseService.current.createAppointment(newAppointment);
      
      // Convert database appointment data to component format
      const formattedAppointment = {
        ...savedAppointment,
        appointmentDate: new Date(savedAppointment.appointment_date || savedAppointment.appointmentDate),
        appointmentTime: savedAppointment.appointment_time || savedAppointment.appointmentTime,
        assignedSpecialistName: savedAppointment.assigned_specialist_name || savedAppointment.assignedSpecialistName,
        meetingLocation: savedAppointment.meeting_location || savedAppointment.meetingLocation
      };
      
      setAppointment(formattedAppointment);
      setCurrentStep('pending-assignment');

      try {
        if (trackBookingEvent && typeof trackBookingEvent.appointmentCreated === 'function') {
          trackBookingEvent.appointmentCreated(savedAppointment);
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }

      subscribeToAppointmentUpdates(savedAppointment.id);

      pollerRef.current.startPolling(
        savedAppointment.id,
        (updatedAppointment: Appointment) => {
          console.log('Polling update received:', updatedAppointment);
          
          const formattedUpdated = {
            ...updatedAppointment,
            appointmentDate: new Date(updatedAppointment.appointment_date || updatedAppointment.appointmentDate),
            appointmentTime: updatedAppointment.appointment_time || updatedAppointment.appointmentTime,
            assignedSpecialistName: updatedAppointment.assigned_specialist_name || updatedAppointment.assignedSpecialistName,
            meetingLocation: updatedAppointment.meeting_location || updatedAppointment.meetingLocation,
            highlevelAppointmentId: updatedAppointment.highlevel_appointment_id || updatedAppointment.highlevelAppointmentId
          };
          
          setAppointment(formattedUpdated);
          
          if (updatedAppointment.status === 'confirmed') {
            try {
              if (trackBookingEvent && typeof trackBookingEvent.appointmentAssigned === 'function') {
                trackBookingEvent.appointmentAssigned(updatedAppointment);
              }
            } catch (e) {
              console.error('Analytics error:', e);
            }
            
            try {
              if (trackBookingEvent && typeof trackBookingEvent.bookingCompleted === 'function') {
                trackBookingEvent.bookingCompleted(updatedAppointment);
              }
            } catch (e) {
              console.error('Analytics error:', e);
            }
            
            setCurrentStep('confirmed');
            setCurrentWizardStep('confirmation');
            
            try {
              if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(formattedUpdated);
              }
            } catch (e) {
              console.error('Error in parent success handler:', e);
            }
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

  // Keep existing subscription and error handling logic
  const subscribeToAppointmentUpdates = (appointmentId: string) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = databaseService.current.subscribeToAppointment(
      appointmentId,
      (updatedAppointment: Appointment) => {
        const formattedUpdated = {
          ...updatedAppointment,
          appointmentDate: new Date(updatedAppointment.appointment_date || updatedAppointment.appointmentDate),
          appointmentTime: updatedAppointment.appointment_time || updatedAppointment.appointmentTime,
          assignedSpecialistName: updatedAppointment.assigned_specialist_name || updatedAppointment.assignedSpecialistName,
          meetingLocation: updatedAppointment.meeting_location || updatedAppointment.meetingLocation,
          highlevelAppointmentId: updatedAppointment.highlevel_appointment_id || updatedAppointment.highlevelAppointmentId
        };
        
        setAppointment(formattedUpdated);
        
        if (updatedAppointment.status === 'confirmed') {
          setCurrentStep('confirmed');
          setCurrentWizardStep('confirmation');
          
          if (typeof window !== 'undefined' && window.trackContentEngagement) {
            window.trackContentEngagement('appointment_confirmed', 'appointment_booking');
          }
          
          try {
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess(formattedUpdated);
            }
          } catch (e) {
            console.error('Error in parent success handler:', e);
          }
        }
      }
    );
  };

  const handleError = (bookingError: BookingError) => {
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
    
    try {
      if (onError && typeof onError === 'function') {
        onError(bookingError);
      }
    } catch (e) {
      console.error('Error in parent error handler:', e);
    }
  };

  // ============================================
  // New Modern Render Methods
  // ============================================

  const renderHeader = () => (
    <div className="bg-[#1B3BA7] text-white py-8 px-6 mb-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Select Your Preferred Time</h1>
        <p className="text-gray-300">Choose a time that works best for your schedule</p>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
      <p className="text-gray-600 mb-6">Please provide your contact details to book your appointment.</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={contactInfo.firstName}
              onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Matt"
              required
              suppressHydrationWarning
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={contactInfo.lastName}
              onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Nye"
              required
              suppressHydrationWarning
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            placeholder="matt.nye@nyecorp.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            placeholder="(321) 626-9791"
            required
          />
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="serviceConsent"
              checked={contactInfo.serviceConsent}
              onChange={(e) => setContactInfo({...contactInfo, serviceConsent: e.target.checked})}
              className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
              suppressHydrationWarning
            />
            <div>
              <label htmlFor="serviceConsent" className="text-sm font-medium text-gray-700">
                Service Message Consent
              </label>
              <p className="text-xs text-gray-500 mt-1">
                I agree to receive Automated Reminders and Service Based messages from Heather Wagenhals, at 
                the phone number provided above. This agreement isn't a condition of any purchase. Msg & data 
                rates may apply, message frequencies vary. Text HELP to (602) 541-8585 for assistance, reply 
                STOP or OUT to opt out or unsubscribe at any time.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketingConsent"
              checked={contactInfo.marketingConsent}
              onChange={(e) => setContactInfo({...contactInfo, marketingConsent: e.target.checked})}
              className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
              suppressHydrationWarning
            />
            <div>
              <label htmlFor="marketingConsent" className="text-sm font-medium text-gray-700">
                Marketing Message Consent
              </label>
              <p className="text-xs text-gray-500 mt-1">
                I agree to receive Marketing messages from Heather Wagenhals at the phone 
                number provided above. This agreement isn't a condition of any purchase. Msg & data rates may 
                apply, message frequencies vary. Text HELP to (602) 541-8585 for assistance, reply STOP or OUT 
                to opt out or to unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentWizardStep('datetime')}
          disabled={!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone}
          className="w-full py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          suppressHydrationWarning
        >
          Continue to Date Selection →
        </button>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
      <p className="text-gray-600 mb-6">Choose your preferred appointment date and time.</p>
      
      {/* Calendar Info */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-sm font-medium text-gray-700">Selected Calendar:</p>
        <p className="text-lg font-semibold text-gray-900">1031 Exchange Consultation</p>
      </div>

      {/* Timezone Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Timezone:</label>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">🌍</span>
          <span className="text-sm text-gray-600">Timezone</span>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>Pacific Time (PDT) UTC-8/-7</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">All times displayed in this timezone</p>
      </div>

      {loading && currentStep === 'loading-availability' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available dates...</p>
        </div>
      )}

      {availableDates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-red-500">📅</span>
              <h3 className="font-semibold text-gray-900">Select Date</h3>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900">
                  {availableDates.length > 0 
                    ? availableDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  }
                </h4>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                <div className="text-center p-2">Su</div>
                <div className="text-center p-2">Mo</div>
                <div className="text-center p-2">Tu</div>
                <div className="text-center p-2">We</div>
                <div className="text-center p-2">Th</div>
                <div className="text-center p-2">Fr</div>
                <div className="text-center p-2">Sa</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const currentMonth = availableDates.length > 0 ? availableDates[0] : new Date();
                  const { daysInMonth, availableDateStrings } = generateMonthCalendar(currentMonth, availableDates);
                  
                  return daysInMonth.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="p-2" />;
                    }
                    
                    const isAvailable = availableDateStrings.has(date.toDateString());
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => isAvailable && handleDateSelect(date)}
                        disabled={!isAvailable}
                        className={`p-2 text-sm rounded transition-colors ${
                          isSelected 
                            ? 'bg-yellow-400 text-blue-900 font-semibold' 
                            : isAvailable
                              ? 'text-gray-700 hover:bg-yellow-50 cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed bg-gray-50'
                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-red-500">🕐</span>
              <h3 className="font-semibold text-gray-900">Select Time</h3>
            </div>
            
            {selectedDate && (
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading time slots...</p>
                  </div>
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedSlot?.time === slot.time
                          ? 'bg-yellow-400 text-blue-900 border-yellow-400'
                          : 'bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      {new Date(slot.time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: timezone
                      })}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Select a date to see available times
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentWizardStep('contact')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentWizardStep('confirmation')}
          disabled={!selectedDate || !selectedSlot}
          className="px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Confirmation →
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Appointment</h2>
      <p className="text-gray-600 mb-8">Please review your appointment details before confirming.</p>
      
      <div className="bg-yellow-50 rounded-lg p-6 space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <span className="text-yellow-400">📅</span>
          <div>
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="ml-2 text-gray-900">
              {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-yellow-400">🕐</span>
          <div>
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="ml-2 text-gray-900">
              {selectedSlot && new Date(selectedSlot.time).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: timezone
              })} PDT
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-yellow-400">👤</span>
          <div>
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{contactInfo.firstName} {contactInfo.lastName}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-yellow-400">📧</span>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{contactInfo.email}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-yellow-400">📞</span>
          <div>
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-900">{contactInfo.phone}</span>
          </div>
        </div>
      </div>

      {currentStep === 'creating-appointment' || currentStep === 'pending-assignment' ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {currentStep === 'creating-appointment' ? 'Creating your appointment...' : 'Confirming appointment details...'}
          </p>
        </div>
      ) : appointment?.status === 'confirmed' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Appointment Confirmed!</h3>
          <p className="text-gray-600 mb-4">Your consultation has been scheduled successfully.</p>
          <p className="text-sm text-gray-500">
            You'll receive a confirmation email with calendar invite and meeting details.
          </p>
        </div>
      ) : (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentWizardStep('datetime')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back to Date Selection
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm Appointment ✓'}
          </button>
        </div>
      )}

      {/* Trust Message */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
        <h4 className="font-semibold text-gray-900 mb-2">No pitch, no pressure</h4>
        <p className="text-gray-600 text-sm">
          Just a strategic conversation about your potential 1031 exchange
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-600 text-2xl">⚠️</span>
      </div>
      <h3 className="text-2xl font-bold text-red-900 mb-2">Booking Error</h3>
      <p className="text-gray-600 mb-6">
        {error?.userMessage || 'An error occurred while booking your appointment.'}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {error?.retryable && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Try Again
          </button>
        )}
        
        <a
          href="tel:+18001031TAX"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
        >
          📞 Call 1-800-1031-TAX
        </a>
      </div>
    </div>
  );

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <StepIndicator currentStep={currentWizardStep} />
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 'error' && renderError()}
          {currentStep !== 'error' && currentWizardStep === 'contact' && renderContactInfo()}
          {currentStep !== 'error' && currentWizardStep === 'datetime' && renderDateTimeSelection()}
          {currentStep !== 'error' && currentWizardStep === 'confirmation' && renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default ModernAppointmentBooking;