import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { C as COMPANY, g as getPhoneLink, $ as $$Layout, a as getEmailLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState, useRef, useEffect } from 'react';
import { g as getAppointmentPoller, t as trackBookingEvent, B as BookingErrorCode } from '../chunks/bookingAnalytics_BTiv0fT2.mjs';
import { H as HighLevelService } from '../chunks/highlevel.service_BQje5Mta.mjs';
import { D as DatabaseService } from '../chunks/database.service_C6kdc69n.mjs';
import { h as createEventSchema, i as createServiceSchema, g as generateJsonLdScript } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: "contact", label: "Contact Info", icon: "👤" },
    { id: "datetime", label: "Date & Time", icon: "📅" },
    { id: "confirmation", label: "Confirmation", icon: "✅" }
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 mb-8 px-4", children: steps.map((step, index) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: `flex items-center space-x-1 sm:space-x-3 ${currentStep === step.id ? "text-yellow-400" : steps.findIndex((s) => s.id === currentStep) > index ? "text-green-500" : "text-gray-400"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: `w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base ${currentStep === step.id ? "bg-yellow-400" : steps.findIndex((s) => s.id === currentStep) > index ? "bg-green-600" : "bg-gray-300"}`, children: steps.findIndex((s) => s.id === currentStep) > index ? "✓" : step.icon }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 44,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-xs sm:text-sm md:text-base hidden sm:block", children: step.label }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 50,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 40,
      columnNumber: 11
    }, undefined),
    index < steps.length - 1 && /* @__PURE__ */ jsxDEV("div", { className: `w-8 sm:w-12 lg:w-16 h-0.5 mx-1 sm:mx-2 lg:mx-4 ${steps.findIndex((s) => s.id === currentStep) > index ? "bg-yellow-400" : "bg-gray-300"}` }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 53,
      columnNumber: 13
    }, undefined)
  ] }, step.id, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 39,
    columnNumber: 9
  }, undefined)) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 37,
    columnNumber: 5
  }, undefined);
};
const ModernAppointmentBooking = ({
  leadData,
  onSuccess,
  onError,
  onCancel,
  options = {}
}) => {
  const [currentWizardStep, setCurrentWizardStep] = useState("contact");
  const [currentStep, setCurrentStep] = useState("idle");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotsCache, setSlotsCache] = useState(/* @__PURE__ */ new Map());
  const [contactInfo, setContactInfo] = useState({
    firstName: leadData.firstName || "",
    lastName: leadData.lastName || "",
    email: leadData.email || "",
    phone: leadData.phone || "",
    serviceConsent: false,
    marketingConsent: false
  });
  const highlevelService = useRef(null);
  const databaseService = useRef(null);
  const subscriptionRef = useRef(null);
  const pollerRef = useRef(null);
  const headerRef = useRef(null);
  const {
    timezone = "America/New_York",
    prefetchDays = 14,
    minBookingHours = 2,
    maxBookingDays = 30,
    debugMode = false
  } = options;
  useEffect(() => {
    if (currentWizardStep === "datetime" && availableDates.length === 0) {
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
  useEffect(() => {
    if (typeof window !== "undefined" && headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentWizardStep]);
  const initializeServices = async () => {
    try {
      highlevelService.current = new HighLevelService();
      databaseService.current = DatabaseService.getInstance();
      pollerRef.current = getAppointmentPoller();
      await highlevelService.current.getConfig();
      try {
        if (trackBookingEvent && typeof trackBookingEvent.flowStart === "function") {
          trackBookingEvent.flowStart({
            taxSavingsAmount: leadData.taxSavingsAmount,
            propertySalePrice: leadData.propertySalePrice,
            source: "1031_tax_calculator"
          });
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      setCurrentStep("loading-availability");
      await loadAvailableDates();
    } catch (error2) {
      console.error("Error initializing services:", error2);
      handleError({
        code: BookingErrorCode.INVALID_CONFIG,
        message: "Failed to initialize booking system",
        details: error2,
        userMessage: "Unable to load booking system. Please try refreshing the page.",
        retryable: true
      });
    }
  };
  const generateMonthCalendar = (month, availableDates2) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysInMonth.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, monthIndex, day));
    }
    const availableDateStrings = new Set(
      availableDates2.map((date) => date.toDateString())
    );
    return { daysInMonth, availableDateStrings };
  };
  const loadAvailableDates = async () => {
    const startTime = performance.now();
    try {
      setLoading(true);
      await highlevelService.current.getConfig();
      const startDate = /* @__PURE__ */ new Date();
      startDate.setHours(startDate.getHours() + minBookingHours);
      const endDate = /* @__PURE__ */ new Date();
      endDate.setDate(endDate.getDate() + maxBookingDays);
      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];
      console.log("[ModernAppointmentBooking] Loading availability:", {
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
      const allSlots = [];
      const dateSlotMap = /* @__PURE__ */ new Map();
      availabilityData.forEach(({ date, slots }) => {
        if (slots.length > 0) {
          dateSlotMap.set(date, slots);
          allSlots.push(...slots);
        }
      });
      const dates = Array.from(dateSlotMap.keys()).map((dateStr) => new Date(dateStr)).sort((a, b) => a.getTime() - b.getTime());
      setAvailableDates(dates);
      setSlotsCache(dateSlotMap);
      setCurrentStep("selecting-date");
      const duration = performance.now() - startTime;
      try {
        if (trackBookingEvent && typeof trackBookingEvent.availabilityLoaded === "function") {
          trackBookingEvent.availabilityLoaded(duration, allSlots.length, false);
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      console.log(`[ModernAppointmentBooking] Cached ${dateSlotMap.size} days of slot data`);
    } catch (error2) {
      console.error("[ModernAppointmentBooking] Error loading availability:", error2);
      handleError(error2);
    } finally {
      setLoading(false);
    }
  };
  const loadSlotsForDate = async (date) => {
    try {
      setLoading(true);
      const dateString = date.toISOString().split("T")[0];
      console.log(`[ModernAppointmentBooking] Loading slots for ${dateString}`);
      const cachedSlots = slotsCache.get(dateString);
      if (cachedSlots) {
        console.log(`[ModernAppointmentBooking] Using cached slots for ${dateString}: ${cachedSlots.length} slots`);
        setAvailableSlots(cachedSlots);
        setLoading(false);
        return;
      }
      console.log(`[ModernAppointmentBooking] No cached slots for ${dateString}, fetching from API`);
      const response = await highlevelService.current.getAvailability({
        date: dateString,
        timezone
      });
      const dateSlots = response.filter((slot) => {
        if (!slot.time) return false;
        const slotDateStr = slot.time.split("T")[0];
        const selectedDateStr = date.toISOString().split("T")[0];
        return slotDateStr === selectedDateStr;
      });
      setAvailableSlots(dateSlots);
      const newCache = new Map(slotsCache);
      newCache.set(dateString, dateSlots);
      setSlotsCache(newCache);
      console.log(`[ModernAppointmentBooking] Fetched and cached ${dateSlots.length} slots for selected date`);
    } catch (error2) {
      console.error("[ModernAppointmentBooking] Error loading slots:", error2);
      handleError(error2);
    } finally {
      setLoading(false);
    }
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    try {
      if (trackBookingEvent && typeof trackBookingEvent.dateSelected === "function") {
        trackBookingEvent.dateSelected(date, availableDates);
      }
    } catch (e) {
      console.error("Analytics error:", e);
    }
    loadSlotsForDate(date);
  };
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    try {
      if (trackBookingEvent && typeof trackBookingEvent.timeSelected === "function") {
        trackBookingEvent.timeSelected(slot, availableSlots);
      }
    } catch (e) {
      console.error("Analytics error:", e);
    }
  };
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;
    performance.now();
    try {
      setCurrentStep("creating-appointment");
      setLoading(true);
      const appointmentData = {
        id: "",
        highlevelAppointmentId: "",
        highlevelContactId: "",
        status: "pending_assignment",
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
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      try {
        if (trackBookingEvent && typeof trackBookingEvent.bookingConfirmed === "function") {
          trackBookingEvent.bookingConfirmed(appointmentData);
        }
      } catch (e) {
        console.error("Analytics error:", e);
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
      const formattedAppointment = {
        ...savedAppointment,
        appointmentDate: new Date(savedAppointment.appointment_date || savedAppointment.appointmentDate),
        appointmentTime: savedAppointment.appointment_time || savedAppointment.appointmentTime,
        assignedSpecialistName: savedAppointment.assigned_specialist_name || savedAppointment.assignedSpecialistName,
        meetingLocation: savedAppointment.meeting_location || savedAppointment.meetingLocation
      };
      setAppointment(formattedAppointment);
      setCurrentStep("pending-assignment");
      try {
        if (trackBookingEvent && typeof trackBookingEvent.appointmentCreated === "function") {
          trackBookingEvent.appointmentCreated(savedAppointment);
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      subscribeToAppointmentUpdates(savedAppointment.id);
      pollerRef.current.startPolling(
        savedAppointment.id,
        (updatedAppointment) => {
          console.log("Polling update received:", updatedAppointment);
          const formattedUpdated = {
            ...updatedAppointment,
            appointmentDate: new Date(updatedAppointment.appointment_date || updatedAppointment.appointmentDate),
            appointmentTime: updatedAppointment.appointment_time || updatedAppointment.appointmentTime,
            assignedSpecialistName: updatedAppointment.assigned_specialist_name || updatedAppointment.assignedSpecialistName,
            meetingLocation: updatedAppointment.meeting_location || updatedAppointment.meetingLocation,
            highlevelAppointmentId: updatedAppointment.highlevel_appointment_id || updatedAppointment.highlevelAppointmentId
          };
          setAppointment(formattedUpdated);
          if (updatedAppointment.status === "confirmed") {
            try {
              if (trackBookingEvent && typeof trackBookingEvent.appointmentAssigned === "function") {
                trackBookingEvent.appointmentAssigned(updatedAppointment);
              }
            } catch (e) {
              console.error("Analytics error:", e);
            }
            try {
              if (trackBookingEvent && typeof trackBookingEvent.bookingCompleted === "function") {
                trackBookingEvent.bookingCompleted(updatedAppointment);
              }
            } catch (e) {
              console.error("Analytics error:", e);
            }
            setCurrentStep("confirmed");
            setCurrentWizardStep("confirmation");
            try {
              if (onSuccess && typeof onSuccess === "function") {
                onSuccess(formattedUpdated);
              }
            } catch (e) {
              console.error("Error in parent success handler:", e);
            }
          }
        },
        (error2) => {
          console.error("Polling error:", error2);
          handleError({
            code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
            message: "Polling failed",
            details: error2,
            userMessage: "Unable to confirm appointment assignment. Please try again or call us directly.",
            retryable: true
          });
        }
      );
    } catch (error2) {
      console.error("Error creating appointment:", error2);
      handleError(error2);
    } finally {
      setLoading(false);
    }
  };
  const subscribeToAppointmentUpdates = (appointmentId) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    subscriptionRef.current = databaseService.current.subscribeToAppointment(
      appointmentId,
      (updatedAppointment) => {
        const formattedUpdated = {
          ...updatedAppointment,
          appointmentDate: new Date(updatedAppointment.appointment_date || updatedAppointment.appointmentDate),
          appointmentTime: updatedAppointment.appointment_time || updatedAppointment.appointmentTime,
          assignedSpecialistName: updatedAppointment.assigned_specialist_name || updatedAppointment.assignedSpecialistName,
          meetingLocation: updatedAppointment.meeting_location || updatedAppointment.meetingLocation,
          highlevelAppointmentId: updatedAppointment.highlevel_appointment_id || updatedAppointment.highlevelAppointmentId
        };
        setAppointment(formattedUpdated);
        if (updatedAppointment.status === "confirmed") {
          setCurrentStep("confirmed");
          setCurrentWizardStep("confirmation");
          if (typeof window !== "undefined" && window.trackContentEngagement) {
            window.trackContentEngagement("appointment_confirmed", "appointment_booking");
          }
          try {
            if (onSuccess && typeof onSuccess === "function") {
              onSuccess(formattedUpdated);
            }
          } catch (e) {
            console.error("Error in parent success handler:", e);
          }
        }
      }
    );
  };
  const handleError = (bookingError) => {
    try {
      if (trackBookingEvent && typeof trackBookingEvent.bookingError === "function") {
        trackBookingEvent.bookingError(bookingError, {
          step: currentStep,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    } catch (analyticsError) {
      console.error("Analytics tracking error:", analyticsError);
    }
    setError(bookingError);
    setCurrentStep("error");
    setLoading(false);
    try {
      if (onError && typeof onError === "function") {
        onError(bookingError);
      }
    } catch (e) {
      console.error("Error in parent error handler:", e);
    }
  };
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");
    const truncated = phoneNumber.slice(0, 10);
    if (truncated.length === 0) {
      return "";
    } else if (truncated.length <= 3) {
      return truncated;
    } else if (truncated.length <= 6) {
      return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
    } else {
      return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
    }
  };
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContactInfo({ ...contactInfo, phone: formatted });
  };
  const getTimeSlotGridCols = (slotCount) => {
    if (slotCount <= 8) {
      return "grid-cols-1";
    } else if (slotCount <= 16) {
      return "grid-cols-1 lg:grid-cols-2";
    } else if (slotCount <= 24) {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };
  const renderHeader = () => /* @__PURE__ */ jsxDEV("div", { ref: headerRef, className: "bg-[#1B3BA7] text-white py-8 px-6 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto text-center", children: [
    /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-bold mb-2", children: "Select Your Preferred Time" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 610,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300", children: "Choose a time that works best for your schedule" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 611,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 609,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 608,
    columnNumber: 5
  }, undefined);
  const renderContactInfo = () => /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Contact Information" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 618,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-6", children: "Please provide your contact details to book your appointment." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 619,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "First Name" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 624,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: contactInfo.firstName,
              onChange: (e) => setContactInfo({ ...contactInfo, firstName: e.target.value }),
              className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              placeholder: "Matt",
              required: true,
              suppressHydrationWarning: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 625,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 623,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Last Name" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 636,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: contactInfo.lastName,
              onChange: (e) => setContactInfo({ ...contactInfo, lastName: e.target.value }),
              className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              placeholder: "Nye",
              required: true,
              suppressHydrationWarning: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 637,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 635,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 622,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 650,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "email",
            value: contactInfo.email,
            onChange: (e) => setContactInfo({ ...contactInfo, email: e.target.value }),
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
            placeholder: "matt.nye@nyecorp.com",
            required: true
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 651,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 649,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Phone Number" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 662,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "tel",
            value: contactInfo.phone,
            onChange: handlePhoneChange,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
            placeholder: "(321) 626-9791",
            maxLength: 14,
            required: true,
            suppressHydrationWarning: true
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 663,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 661,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start space-x-3", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "checkbox",
              id: "serviceConsent",
              checked: contactInfo.serviceConsent,
              onChange: (e) => setContactInfo({ ...contactInfo, serviceConsent: e.target.checked }),
              className: "w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400",
              suppressHydrationWarning: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 678,
              columnNumber: 13
            },
            undefined
          ),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { htmlFor: "serviceConsent", className: "text-sm font-medium text-gray-700", children: "Service Message Consent" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 687,
              columnNumber: 15
            }, undefined),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: [
              "I agree to receive Automated Reminders and Service Based messages from ",
              COMPANY.name,
              ", at the phone number provided above. This agreement isn't a condition of any purchase. Msg & data rates may apply, message frequencies vary. Text HELP to ",
              COMPANY.phone.main,
              " for assistance, reply STOP or OUT to opt out or unsubscribe at any time."
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 690,
              columnNumber: 15
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 686,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 677,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start space-x-3", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "checkbox",
              id: "marketingConsent",
              checked: contactInfo.marketingConsent,
              onChange: (e) => setContactInfo({ ...contactInfo, marketingConsent: e.target.checked }),
              className: "w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400",
              suppressHydrationWarning: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 700,
              columnNumber: 13
            },
            undefined
          ),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { htmlFor: "marketingConsent", className: "text-sm font-medium text-gray-700", children: "Marketing Message Consent" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 709,
              columnNumber: 15
            }, undefined),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: [
              "I agree to receive Marketing messages from ",
              COMPANY.name,
              " at the phone number provided above. This agreement isn't a condition of any purchase. Msg & data rates may apply, message frequencies vary. Text HELP to ",
              COMPANY.phone.main,
              " for assistance, reply STOP or OUT to opt out or to unsubscribe at any time."
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 712,
              columnNumber: 15
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 708,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 699,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 676,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setCurrentWizardStep("datetime"),
          disabled: !contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone,
          className: "w-full py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          suppressHydrationWarning: true,
          children: "Continue to Date Selection →"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 722,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 621,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 617,
    columnNumber: 5
  }, undefined);
  const renderDateTimeSelection = () => /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Select Date & Time" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 736,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-6", children: "Choose your preferred appointment date and time." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 737,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-yellow-50 p-4 rounded-lg mb-6", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-gray-700", children: "Selected Calendar:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 741,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-lg font-semibold text-gray-900", children: "1031 Exchange Consultation" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 742,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 740,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Timezone:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 747,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-blue-500", children: "🌍" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 749,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-gray-600", children: "Timezone" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 750,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("select", { className: "border border-gray-300 rounded px-3 py-1 text-sm", children: /* @__PURE__ */ jsxDEV("option", { children: "Pacific Time (PDT) UTC-8/-7" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 752,
          columnNumber: 13
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 751,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 748,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: "All times displayed in this timezone" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 755,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 746,
      columnNumber: 7
    }, undefined),
    loading && currentStep === "loading-availability" && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 760,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Loading available dates..." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 761,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 759,
      columnNumber: 9
    }, undefined),
    availableDates.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "📅" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 770,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("h3", { className: "font-semibold text-gray-900", children: "Select Date" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 771,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 769,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: availableDates.length > 0 ? availableDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" }) : (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 776,
            columnNumber: 17
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 775,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Su" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 785,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Mo" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 786,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Tu" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 787,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "We" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 788,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Th" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 789,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Fr" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 790,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center p-2", children: "Sa" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
              lineNumber: 791,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 784,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-7 gap-1", children: (() => {
            const currentMonth = availableDates.length > 0 ? availableDates[0] : /* @__PURE__ */ new Date();
            const { daysInMonth, availableDateStrings } = generateMonthCalendar(currentMonth, availableDates);
            return daysInMonth.map((date, index) => {
              if (!date) {
                return /* @__PURE__ */ jsxDEV("div", { className: "p-2" }, `empty-${index}`, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
                  lineNumber: 801,
                  columnNumber: 30
                }, undefined);
              }
              const isAvailable = availableDateStrings.has(date.toDateString());
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => isAvailable && handleDateSelect(date),
                  disabled: !isAvailable,
                  className: `p-2 text-sm rounded transition-colors ${isSelected ? "bg-yellow-400 text-blue-900 font-semibold" : isAvailable ? "text-gray-700 hover:bg-yellow-50 cursor-pointer" : "text-gray-400 cursor-not-allowed bg-gray-50"} ${isToday ? "ring-2 ring-blue-400" : ""}`,
                  children: date.getDate()
                },
                date.toISOString(),
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
                  lineNumber: 809,
                  columnNumber: 23
                },
                undefined
              );
            });
          })() }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 794,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 774,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 768,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "🕐" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 833,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("h3", { className: "font-semibold text-gray-900", children: "Select Time" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 834,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 832,
          columnNumber: 13
        }, undefined),
        selectedDate && /* @__PURE__ */ jsxDEV("div", { className: "relative", children: loading ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 841,
            columnNumber: 21
          }, undefined),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: "Loading time slots..." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 842,
            columnNumber: 21
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 840,
          columnNumber: 19
        }, undefined) : availableSlots.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: `grid gap-2 ${getTimeSlotGridCols(availableSlots.length)} max-h-[400px] overflow-y-auto pr-2`, children: availableSlots.map((slot, index) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSlotSelect(slot),
            className: `p-3 text-center rounded-lg border transition-colors ${selectedSlot?.time === slot.time ? "bg-yellow-400 text-blue-900 border-yellow-400 font-semibold" : "bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"}`,
            children: new Date(slot.time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: timezone
            })
          },
          index,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 847,
            columnNumber: 23
          },
          undefined
        )) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 845,
          columnNumber: 19
        }, undefined) : /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 text-center py-4", children: "Select a date to see available times" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 866,
          columnNumber: 19
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 838,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 831,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 766,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between mt-8", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setCurrentWizardStep("contact"),
          className: "px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
          children: "← Back"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 877,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setCurrentWizardStep("confirmation"),
          disabled: !selectedDate || !selectedSlot,
          className: "px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Continue to Confirmation →"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 883,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 876,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 735,
    columnNumber: 5
  }, undefined);
  const renderConfirmation = () => /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Confirm Your Appointment" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 896,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-8", children: "Please review your appointment details before confirming." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 897,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-yellow-50 rounded-lg p-6 space-y-4 mb-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-400", children: "📅" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 901,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-gray-700", children: "Date:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 903,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-gray-900", children: selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 904,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 902,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 900,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-400", children: "🕐" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 916,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-gray-700", children: "Time:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 918,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-gray-900", children: [
            selectedSlot && new Date(selectedSlot.time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: timezone
            }),
            " PDT"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 919,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 917,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 915,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-400", children: "👤" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 931,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-gray-700", children: "Name:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 933,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-gray-900", children: [
            contactInfo.firstName,
            " ",
            contactInfo.lastName
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 934,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 932,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 930,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-400", children: "📧" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 939,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-gray-700", children: "Email:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 941,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-gray-900", children: contactInfo.email }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 942,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 940,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 938,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-yellow-400", children: "📞" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 947,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-gray-700", children: "Phone:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 949,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { className: "ml-2 text-gray-900", children: contactInfo.phone }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
            lineNumber: 950,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 948,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 946,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 899,
      columnNumber: 7
    }, undefined),
    currentStep === "creating-appointment" || currentStep === "pending-assignment" ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 957,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: currentStep === "creating-appointment" ? "Creating your appointment..." : "Confirming appointment details..." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 958,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 956,
      columnNumber: 9
    }, undefined) : appointment?.status === "confirmed" ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV("span", { className: "text-green-500 text-2xl", children: "✓" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 965,
        columnNumber: 13
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 964,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-green-900 mb-2", children: "Appointment Confirmed!" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 967,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-4", children: "Your consultation has been scheduled successfully." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 968,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: "You'll receive a confirmation email with calendar invite and meeting details." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 969,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 963,
      columnNumber: 9
    }, undefined) : /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setCurrentWizardStep("datetime"),
          className: "px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
          children: "← Back to Date Selection"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 975,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleConfirmBooking,
          disabled: loading,
          className: "px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50",
          children: loading ? "Confirming..." : "Confirm Appointment ✓"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 981,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 974,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-8 bg-blue-50 rounded-lg p-6 text-center", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-2", children: "No pitch, no pressure" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 993,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm", children: "Just a strategic conversation about your potential 1031 exchange" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 994,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 992,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 895,
    columnNumber: 5
  }, undefined);
  const renderError = () => /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto text-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV("span", { className: "text-red-600 text-2xl", children: "⚠️" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1004,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1003,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-red-900 mb-2", children: "Booking Error" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1006,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-6", children: error?.userMessage || "An error occurred while booking your appointment." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1007,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
      error?.retryable && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "px-6 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-colors",
          children: "Try Again"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 1013,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: getPhoneLink(),
          className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center",
          children: [
            "📞 Call ",
            COMPANY.phone.main
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
          lineNumber: 1021,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1011,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 1002,
    columnNumber: 5
  }, undefined);
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50", children: [
    renderHeader(),
    /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto px-6 pb-12", children: [
      /* @__PURE__ */ jsxDEV(StepIndicator, { currentStep: currentWizardStep }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 1040,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [
        currentStep === "error" && renderError(),
        currentStep !== "error" && currentWizardStep === "contact" && renderContactInfo(),
        currentStep !== "error" && currentWizardStep === "datetime" && renderDateTimeSelection(),
        currentStep !== "error" && currentWizardStep === "confirmation" && renderConfirmation()
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
        lineNumber: 1042,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
      lineNumber: 1039,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking.tsx",
    lineNumber: 1036,
    columnNumber: 5
  }, undefined);
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Schedule = createComponent(($$result, $$props, $$slots) => {
  const eventSchema = createEventSchema({
    name: "Free 1031 Exchange Consultation",
    description: "Schedule a free consultation with certified 1031 exchange specialists to review your investment strategy and calculate potential tax savings.",
    duration: "PT30M",
    // 30 minutes in ISO 8601 format
    attendanceMode: "MixedEventAttendanceMode",
    // Can be phone, video, or in-person
    status: "EventScheduled",
    location: {
      type: "virtual",
      url: "https://the1031center.com/schedule"
    },
    price: 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    validFrom: "2025-01-01",
    bookingUrl: "https://the1031center.com/schedule",
    maxCapacity: 1,
    // One-on-one consultations
    remainingCapacity: 1
  });
  const serviceSchema = createServiceSchema({
    name: "1031 Exchange Consultation Service",
    description: "Expert consultation service for tax-deferred property exchanges. Our certified specialists provide personalized analysis, tax savings calculations, and strategic guidance for all types of 1031 exchanges.",
    serviceType: "Consultation",
    category: "Financial Services",
    price: 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    validFrom: "2025-01-01",
    serviceUrl: "https://the1031center.com/schedule",
    areaServed: "United States",
    audienceType: "Real Estate Investors",
    hoursAvailable: [
      {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      }
    ]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Schedule Consultation | Book Your 1031 Exchange Expert | ${COMPANY.name}`, "description": `Schedule a free consultation with ${COMPANY.name}'s exchange experts. Get personalized guidance for your tax-deferred property exchange. Book your appointment today.` }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">
Schedule Your Free 1031 Exchange Consultation
</h1> <p class="text-xl text-blue-100">
Get expert guidance from America's most trusted qualified intermediary. Our certified 
          exchange specialists will help you navigate your tax-deferred exchange with confidence.
</p> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
What You'll Get in Your Consultation
</h2> <div class="grid md:grid-cols-3 gap-8"> <div class="bg-white rounded-lg p-8 shadow-lg text-center"> <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Custom Strategy Review</h3> <p class="text-gray-600">
Personalized analysis of your property and investment goals to determine the best 
            exchange strategy for maximum tax savings.
</p> </div> <div class="bg-white rounded-lg p-8 shadow-lg text-center"> <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0 2.08-.402 2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Tax Savings Estimate</h3> <p class="text-gray-600">
Detailed calculation of your potential tax savings including federal, state, and 
            depreciation recapture taxes you can defer.
</p> </div> <div class="bg-white rounded-lg p-8 shadow-lg text-center"> <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Next Steps Roadmap</h3> <p class="text-gray-600">
Clear action plan with timelines, deadlines, and requirements to ensure your 
            exchange is completed successfully and on time.
</p> </div> </div> </div> </section>  `, '  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">\nWhy Schedule with ', '?\n</h2> <div class="grid md:grid-cols-2 gap-8"> <div> <h3 class="text-xl font-semibold text-gray-900 mb-4">Unmatched Security</h3> <ul class="space-y-3"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Bonded & insured protection</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Segregated, FDIC-insured accounts</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Daily account reconciliation</span> </li> </ul> </div> <div> <h3 class="text-xl font-semibold text-gray-900 mb-4">Expert Team</h3> <ul class="space-y-3"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Certified Exchange Specialists on staff</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">In-house attorneys and CPAs</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">30+ years combined experience</span> </li> </ul> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">\nPrefer to Connect Another Way?\n</h2> <div class="grid md:grid-cols-3 gap-8"> <!-- Phone --> <div class="text-center"> <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Call Us Direct</h3> <a', ` class="text-2xl font-bold text-blue-600 hover:text-blue-800 block" onclick="if(window.trackPhoneCall) window.trackPhoneCall('schedule_page');"> `, ' </a> <p class="text-sm text-gray-500 mt-2">Mon-Fri 8am-6pm EST</p> <p class="text-sm text-yellow-600 font-semibold">24/7 Emergency Support</p> </div> <!-- Email --> <div class="text-center"> <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Email Us</h3> <a', ' class="text-lg text-blue-600 hover:text-blue-800"> ', ' </a> <p class="text-sm text-gray-500 mt-2">48-hour response guarantee</p> </div> <!-- Contact Form --> <div class="text-center"> <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Contact Form</h3> <a href="/contact" class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">\nSend Message\n</a> <p class="text-sm text-gray-500 mt-2">Detailed inquiry form</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">\nWhat Our Clients Say\n</h2> <div class="grid md:grid-cols-3 gap-8"> <div class="bg-white rounded-lg p-6 shadow-lg"> <div class="flex items-center mb-4"> <div class="flex text-yellow-400"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> </div> </div> <p class="text-gray-700 mb-4">\n"The consultation was incredibly valuable. They walked me through every step and \n            helped me save over $200,000 in taxes on my apartment building sale."\n</p> <p class="font-semibold text-gray-900">- Sarah M., Commercial Investor</p> </div> <div class="bg-white rounded-lg p-6 shadow-lg"> <div class="flex items-center mb-4"> <div class="flex text-yellow-400"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> </div> </div> <p class="text-gray-700 mb-4">\n"Professional, knowledgeable, and responsive. They made my first 1031 exchange \n            stress-free and saved me a fortune in taxes."\n</p> <p class="font-semibold text-gray-900">- Michael R., Real Estate Investor</p> </div> <div class="bg-white rounded-lg p-6 shadow-lg"> <div class="flex items-center mb-4"> <div class="flex text-yellow-400"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> </div> </div> <p class="text-gray-700 mb-4">\n"I was impressed by how thorough they were during our consultation. They answered \n            all my questions and gave me confidence to move forward."\n</p> <p class="font-semibold text-gray-900">- Jennifer L., Property Manager</p> </div> </div> </div> </section>  <script type="application/ld+json">', '<\/script>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), renderComponent($$result2, "ModernAppointmentBooking", ModernAppointmentBooking, { "client:load": true, "leadData": {
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    taxSavingsAmount: 0,
    propertySalePrice: 0,
    propertyDetails: null
  }, "onSuccess": (appointment) => {
    console.log("Appointment booked successfully:", appointment);
    if (typeof window !== "undefined") {
      if (window.trackContentEngagement) {
        window.trackContentEngagement("appointment_booked", "schedule_page_direct");
      }
      if (window.trackHighLevelEvent) {
        window.trackHighLevelEvent("appointment_booked", {
          source: "Schedule Page Direct",
          appointmentId: appointment.highlevelAppointmentId,
          type: "consultation_booking"
        });
      }
    }
  }, "onError": (error) => {
    console.error("Booking error:", error);
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement("booking_error", "schedule_page_direct");
    }
  }, "onCancel": () => {
    console.log("Booking cancelled by user");
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement("booking_cancelled", "schedule_page_direct");
    }
  }, "options": {
    timezone: "America/New_York",
    prefetchDays: 21,
    minBookingHours: 2,
    maxBookingDays: 30,
    showConsultationType: true,
    debugMode: true
  }, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/ModernAppointmentBooking", "client:component-export": "default" }), COMPANY.name, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, addAttribute(getEmailLink(), "href"), COMPANY.email.main, unescapeHTML(generateJsonLdScript(eventSchema)), unescapeHTML(generateJsonLdScript(serviceSchema))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/schedule.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/schedule.astro";
const $$url = "/schedule";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Schedule,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
