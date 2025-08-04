import { d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { C as COMPANY, g as getPhoneLink, $ as $$Layout } from '../chunks/Layout_NoDNIcv-.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState, useRef, useEffect } from 'react';
import { c as calculateTaxSavings, s as stateNames, f as formatCurrency } from '../chunks/taxCalculations_CCipOTQ8.mjs';
import { g as getAppointmentPoller, t as trackBookingEvent, B as BookingErrorCode } from '../chunks/bookingAnalytics_BTiv0fT2.mjs';
import { H as HighLevelService } from '../chunks/highlevel.service_BQje5Mta.mjs';
import { D as DatabaseService } from '../chunks/database.service_C6kdc69n.mjs';
export { renderers } from '../renderers.mjs';

const AppointmentBooking = ({
  leadData,
  onSuccess,
  onError,
  onCancel,
  options = {}
}) => {
  const [currentStep, setCurrentStep] = useState("idle");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    firstName: leadData.firstName || "",
    lastName: leadData.lastName || "",
    email: leadData.email || "",
    phone: leadData.phone || ""
  });
  const highlevelService = useRef(null);
  const databaseService = useRef(null);
  const subscriptionRef = useRef(null);
  const pollerRef = useRef(null);
  const {
    timezone = "America/New_York",
    prefetchDays = 14,
    minBookingHours = 2,
    maxBookingDays = 30,
    // HighLevel API limit is 31 days
    debugMode = false
  } = options;
  useEffect(() => {
    initializeServices();
    return () => {
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
      console.log("[AppointmentBooking] Loading availability:", {
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
      console.log("[AppointmentBooking] Availability data received:", {
        datesWithSlots: availabilityData.length,
        totalSlots: availabilityData.reduce((sum, d) => sum + d.slots.length, 0)
      });
      const allSlots = [];
      const dateSlotMap = /* @__PURE__ */ new Map();
      availabilityData.forEach(({ date, slots }) => {
        if (slots.length > 0) {
          dateSlotMap.set(date, slots);
          allSlots.push(...slots);
        }
      });
      console.log("[AppointmentBooking] Availability summary:", {
        totalSlots: allSlots.length,
        uniqueDates: dateSlotMap.size,
        dateKeys: Array.from(dateSlotMap.keys())
      });
      const dates = Array.from(dateSlotMap.keys()).map((dateStr) => new Date(dateStr)).sort((a, b) => a.getTime() - b.getTime());
      setAvailableDates(dates);
      setCurrentStep("selecting-date");
      const duration = performance.now() - startTime;
      try {
        if (trackBookingEvent && typeof trackBookingEvent.availabilityLoaded === "function") {
          trackBookingEvent.availabilityLoaded(duration, allSlots.length, false);
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      console.log("[AppointmentBooking] Final available dates:", dates);
    } catch (error2) {
      console.error("[AppointmentBooking] Error loading availability:", error2);
      handleError(error2);
    } finally {
      setLoading(false);
    }
  };
  const loadSlotsForDate = async (date) => {
    try {
      setLoading(true);
      const dateString = date.toISOString().split("T")[0];
      console.log(`[AppointmentBooking] Loading slots for ${dateString}`);
      const response = await highlevelService.current.getAvailability({
        date: dateString,
        timezone
      });
      console.log(`[AppointmentBooking] Received ${response.length} slots for ${dateString}`);
      const dateSlots = response.filter((slot) => {
        if (!slot.time) return false;
        const slotDateStr = slot.time.split("T")[0];
        const selectedDateStr = date.toISOString().split("T")[0];
        console.log(`[AppointmentBooking] Comparing dates: slot=${slotDateStr}, selected=${selectedDateStr}`);
        return slotDateStr === selectedDateStr;
      });
      setAvailableSlots(dateSlots);
      setCurrentStep("selecting-time");
      console.log(`[AppointmentBooking] Filtered to ${dateSlots.length} slots for selected date`);
    } catch (error2) {
      console.error("[AppointmentBooking] Error loading slots:", error2);
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
    if (isContactInfoComplete()) {
      setCurrentStep("confirming-details");
    } else {
      setCurrentStep("collecting-contact");
    }
  };
  const isContactInfoComplete = () => {
    return contactInfo.firstName.trim() !== "" && contactInfo.lastName.trim() !== "" && contactInfo.email.trim() !== "" && contactInfo.phone.trim() !== "";
  };
  const handleContactSubmit = () => {
    if (isContactInfoComplete()) {
      setCurrentStep("confirming-details");
    }
  };
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;
    const startTime = performance.now();
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
      setAppointment(savedAppointment);
      setCurrentStep("pending-assignment");
      try {
        if (trackBookingEvent && typeof trackBookingEvent.appointmentCreated === "function") {
          trackBookingEvent.appointmentCreated(savedAppointment);
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      try {
        const duration = performance.now() - startTime;
        if (trackBookingEvent && typeof trackBookingEvent.submissionPerformance === "function") {
          trackBookingEvent.submissionPerformance(duration, true);
        }
      } catch (e) {
        console.error("Analytics error:", e);
      }
      subscribeToAppointmentUpdates(savedAppointment.id);
      pollerRef.current.startPolling(
        savedAppointment.id,
        (updatedAppointment) => {
          console.log("Polling update received:", updatedAppointment);
          setAppointment(updatedAppointment);
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
            try {
              if (onSuccess && typeof onSuccess === "function") {
                onSuccess(updatedAppointment);
              }
            } catch (e) {
              console.error("Error in parent success handler:", e);
            }
          } else if (updatedAppointment.status === "failed") {
            const error2 = {
              code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
              message: "Appointment assignment failed after polling",
              details: updatedAppointment,
              userMessage: "Unable to assign your appointment. Please try again or call us directly.",
              retryable: true
            };
            try {
              if (trackBookingEvent && typeof trackBookingEvent.bookingError === "function") {
                trackBookingEvent.bookingError(error2, { source: "polling_fallback" });
              }
            } catch (e) {
              console.error("Analytics error:", e);
            }
            handleError(error2);
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
        setAppointment(updatedAppointment);
        if (updatedAppointment.status === "confirmed" && updatedAppointment.assignedSpecialistId) {
          setCurrentStep("confirmed");
          if (typeof window !== "undefined" && window.trackContentEngagement) {
            window.trackContentEngagement("appointment_confirmed", "appointment_booking");
          }
          try {
            if (onSuccess && typeof onSuccess === "function") {
              onSuccess(updatedAppointment);
            }
          } catch (e) {
            console.error("Error in parent success handler:", e);
          }
        } else if (updatedAppointment.status === "failed") {
          handleError({
            code: BookingErrorCode.ASSIGNMENT_TIMEOUT,
            message: "Appointment assignment failed",
            details: updatedAppointment,
            userMessage: "Unable to assign appointment. Please try again or call us directly.",
            retryable: true
          });
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
  const handleRetry = () => {
    if (pollerRef.current && appointment?.id) {
      pollerRef.current.stopPolling(appointment.id);
    }
    setError(null);
    setCurrentStep("idle");
    initializeServices();
  };
  const handleBackToDateSelection = () => {
    setSelectedSlot(null);
    setCurrentStep("selecting-time");
  };
  const handleBackToTimeSelection = () => {
    setCurrentStep("selecting-date");
  };
  const renderDateSelection = () => /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Schedule Your 1031 Exchange Consultation" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 563,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Select a date for your free consultation with one of our 1031 exchange specialists." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 566,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 562,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: availableDates.length > 0 ? availableDates.map((date) => /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => handleDateSelect(date),
        className: "p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center",
        children: /* @__PURE__ */ jsxDEV("div", { className: "font-semibold text-gray-900", children: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric"
        }) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 579,
          columnNumber: 15
        }, undefined)
      },
      date.toISOString(),
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 574,
        columnNumber: 13
      },
      undefined
    )) : /* @__PURE__ */ jsxDEV("div", { className: "col-span-full text-center py-8", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-2", children: "No available dates found." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 590,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: "Please check the browser console for debugging information." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 591,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: [
        "Debug: ",
        availableDates.length,
        " dates loaded"
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 594,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 589,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 571,
      columnNumber: 7
    }, undefined),
    onCancel && /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: onCancel,
        className: "text-gray-500 hover:text-gray-700 transition-colors",
        children: "Cancel Booking"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 603,
        columnNumber: 11
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 602,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 561,
    columnNumber: 5
  }, undefined);
  const renderContactCollection = () => /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Contact Information" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 617,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Please provide your contact information to complete your appointment booking." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 620,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 616,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-lg border border-gray-200 space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name *" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 628,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: contactInfo.firstName,
              onChange: (e) => setContactInfo({ ...contactInfo, firstName: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "Enter your first name",
              required: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 631,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 627,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name *" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 641,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: contactInfo.lastName,
              onChange: (e) => setContactInfo({ ...contactInfo, lastName: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "Enter your last name",
              required: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 644,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 640,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 626,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address *" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 656,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "email",
            value: contactInfo.email,
            onChange: (e) => setContactInfo({ ...contactInfo, email: e.target.value }),
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            placeholder: "your.email@example.com",
            required: true
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 659,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 655,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number *" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 670,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "tel",
            value: contactInfo.phone,
            onChange: (e) => setContactInfo({ ...contactInfo, phone: e.target.value }),
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            placeholder: "(555) 123-4567",
            required: true
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 673,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 669,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 625,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setCurrentStep("selecting-time"),
          className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
          children: "Back to Times"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 685,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleContactSubmit,
          disabled: !isContactInfoComplete(),
          className: "px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Continue to Confirmation"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 691,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 684,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 615,
    columnNumber: 5
  }, undefined);
  const renderTimeSelection = () => /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Select a Time" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 705,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: [
        "Available times for ",
        selectedDate?.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 708,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 704,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3", children: availableSlots.map((slot, index) => /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => handleSlotSelect(slot),
        className: "p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center font-medium",
        children: slot.displayTime || new Date(slot.time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: timezone
        })
      },
      index,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 719,
        columnNumber: 11
      },
      undefined
    )) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 717,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center space-x-4", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: handleBackToTimeSelection,
        className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
        children: "Back to Dates"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 735,
        columnNumber: 9
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 734,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 703,
    columnNumber: 5
  }, undefined);
  const renderBookingConfirmation = () => /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Confirm Your Appointment" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 748,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Please review your appointment details below." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 751,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 747,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Contact Information" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 758,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: [
          contactInfo.firstName,
          " ",
          contactInfo.lastName,
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 760,
            columnNumber: 59
          }, undefined),
          contactInfo.email,
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 761,
            columnNumber: 32
          }, undefined),
          contactInfo.phone
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 759,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 757,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Appointment Details" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 767,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: [
          selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }),
          /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 774,
            columnNumber: 16
          }, undefined),
          selectedSlot?.displayTime || new Date(selectedSlot.time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone
          }),
          " (",
          timezone,
          ")"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 768,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 766,
        columnNumber: 9
      }, undefined),
      leadData.taxSavingsAmount && /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: "Tax Savings Opportunity" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 786,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-green-600 font-semibold", children: [
          "$",
          leadData.taxSavingsAmount.toLocaleString(),
          " in potential tax savings"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 787,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 785,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 756,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center space-x-4", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleBackToDateSelection,
          className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
          children: "Back to Times"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 795,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleConfirmBooking,
          disabled: loading,
          className: "px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50",
          children: loading ? "Scheduling..." : "Confirm Appointment"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 801,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 794,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 746,
    columnNumber: 5
  }, undefined);
  const renderPendingAssignment = () => /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 814,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Confirming Your Appointment" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 816,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "We're assigning you to one of our 1031 exchange specialists. This usually takes just a few seconds." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 819,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 815,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxDEV("p", { className: "text-blue-800 text-sm", children: [
      /* @__PURE__ */ jsxDEV("strong", { children: "Your appointment is being processed." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 827,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 827,
        columnNumber: 64
      }, undefined),
      "You'll receive a confirmation email shortly with meeting details."
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 826,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 825,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 813,
    columnNumber: 5
  }, undefined);
  const renderConfirmed = () => /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxDEV("svg", { className: "w-8 h-8 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 838,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 837,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 836,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-green-900 mb-2", children: "Appointment Confirmed!" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 843,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Your consultation has been scheduled successfully." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 846,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 842,
      columnNumber: 7
    }, undefined),
    appointment && /* @__PURE__ */ jsxDEV("div", { className: "bg-green-50 p-6 rounded-lg text-left space-y-3", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-green-900", children: "Appointment Details" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 853,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "text-green-800", children: [
        /* @__PURE__ */ jsxDEV("p", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Date:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 855,
            columnNumber: 16
          }, undefined),
          " ",
          appointment.appointment_date || appointment.appointmentDate ? new Date(appointment.appointment_date || appointment.appointmentDate).toLocaleDateString() : "Date TBD"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 855,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Time:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 860,
            columnNumber: 16
          }, undefined),
          " ",
          appointment.appointment_time || appointment.appointmentTime || "Time TBD"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 860,
          columnNumber: 13
        }, undefined),
        (appointment.assigned_specialist_name || appointment.assignedSpecialistName) && /* @__PURE__ */ jsxDEV("p", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Specialist:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 862,
            columnNumber: 18
          }, undefined),
          " ",
          appointment.assigned_specialist_name || appointment.assignedSpecialistName
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 862,
          columnNumber: 15
        }, undefined),
        (appointment.meeting_location || appointment.meetingLocation) && /* @__PURE__ */ jsxDEV("p", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Meeting Link:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
            lineNumber: 865,
            columnNumber: 18
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: appointment.meeting_location || appointment.meetingLocation,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 hover:underline ml-1",
              children: "Click to join"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 866,
              columnNumber: 17
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 865,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 854,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 852,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: "You'll receive a confirmation email with calendar invite and meeting details." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 876,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 835,
    columnNumber: 5
  }, undefined);
  const renderError = () => /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxDEV("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 886,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 885,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 884,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-red-900 mb-2", children: "Booking Error" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 891,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: error?.userMessage || "An error occurred while booking your appointment." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 894,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 890,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
      error?.retryable && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleRetry,
          className: "px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors",
          children: "Try Again"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 901,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: "/schedule-widget",
          className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center",
          children: [
            /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 914,
              columnNumber: 13
            }, undefined) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 913,
              columnNumber: 11
            }, undefined),
            "Use Alternative Booking"
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 909,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: getPhoneLink(),
          className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center",
          onClick: () => {
            if (typeof window !== "undefined" && window.trackPhoneCall) {
              window.trackPhoneCall("booking_error_fallback");
            }
          },
          children: [
            /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 929,
              columnNumber: 13
            }, undefined) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
              lineNumber: 928,
              columnNumber: 11
            }, undefined),
            "Call ",
            COMPANY.phone.main
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 919,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 899,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500 bg-gray-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "font-semibold mb-1", children: "Alternative Options:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 936,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("ul", { className: "text-left space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { children: "• Try our widget-based booking system" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 938,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { children: "• Call us directly for immediate assistance" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 939,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { children: "• Email us at info@the1031center.com" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
          lineNumber: 940,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 937,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 935,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 883,
    columnNumber: 5
  }, undefined);
  const renderLoadingState = () => /* @__PURE__ */ jsxDEV("div", { className: "text-center space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 948,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Loading Available Times" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 950,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Please wait while we find the best appointment times for you." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
        lineNumber: 953,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
      lineNumber: 949,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 947,
    columnNumber: 5
  }, undefined);
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg", children: [
    currentStep === "idle" && renderLoadingState(),
    currentStep === "loading-availability" && renderLoadingState(),
    currentStep === "selecting-date" && renderDateSelection(),
    currentStep === "selecting-time" && renderTimeSelection(),
    currentStep === "collecting-contact" && renderContactCollection(),
    currentStep === "confirming-details" && renderBookingConfirmation(),
    currentStep === "creating-appointment" && renderLoadingState(),
    currentStep === "pending-assignment" && renderPendingAssignment(),
    currentStep === "confirmed" && renderConfirmed(),
    currentStep === "error" && renderError()
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/AppointmentBooking.tsx",
    lineNumber: 965,
    columnNumber: 5
  }, undefined);
};

const TaxSavingsCalculator = ({ onLeadCapture }) => {
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    salePrice: 0,
    purchasePrice: 0,
    improvements: 0,
    closingCosts: 0,
    state: "CA",
    filingStatus: "married_joint",
    income: 25e4
  });
  const [leadData, setLeadData] = useState({
    email: "",
    phone: "",
    name: ""
  });
  useEffect(() => {
    if (formData.salePrice > 0 && formData.purchasePrice > 0) {
      const calculationResult = calculateTaxSavings(formData);
      setResult(calculationResult);
    }
  }, [formData]);
  const handleInputChange = (field, value) => {
    if (formData.salePrice === 0 && formData.purchasePrice === 0) {
      if (typeof window !== "undefined" && window.trackCalculatorStart) {
        window.trackCalculatorStart();
      }
    }
    setFormData((prev) => ({
      ...prev,
      [field]: field === "state" || field === "filingStatus" ? value : Number(value)
    }));
  };
  const handleCalculate = (e) => {
    e.preventDefault();
    if (result && result.taxSavings > 0) {
      setShowEmailCapture(true);
    }
  };
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (result && typeof window !== "undefined") {
        if (window.trackCalculatorComplete) {
          window.trackCalculatorComplete(result.taxSavings);
        }
        if (window.trackLeadCapture) {
          window.trackLeadCapture("1031 Tax Calculator", result.taxSavings);
        }
        if (window.trackHighLevelEvent) {
          window.trackHighLevelEvent("lead_captured", {
            source: "1031 Tax Calculator",
            value: result.taxSavings,
            type: "calculator",
            formName: "Tax Savings Calculator",
            calculatorSavings: result.taxSavings
          });
        }
      }
      if (result) {
        try {
          const response = await fetch("/.netlify/functions/capture-lead", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...leadData,
              calculationResult: result,
              propertyDetails: formData
            })
          });
          if (!response.ok) {
            throw new Error("Failed to capture lead");
          }
          const apiResult = await response.json();
          console.log("Lead captured successfully:", apiResult);
        } catch (apiError) {
          console.error("Error calling capture-lead API:", apiError);
        }
      }
      if (onLeadCapture && result) {
        await onLeadCapture({
          ...leadData,
          calculationResult: result,
          propertyDetails: formData
        });
      }
      setShowEmailCapture(false);
      setShowResults(true);
    } catch (error) {
      console.error("Error capturing lead:", error);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setShowResults(false);
    setShowEmailCapture(false);
    setShowBooking(false);
    setFormData({
      salePrice: 0,
      purchasePrice: 0,
      improvements: 0,
      closingCosts: 0,
      state: "CA",
      filingStatus: "married_joint",
      income: 25e4
    });
    setLeadData({
      email: "",
      phone: "",
      name: ""
    });
    setResult(null);
  };
  const handleStartBooking = () => {
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement("booking_flow_started", "tax_calculator_booking");
    }
    setShowBooking(true);
  };
  const handleBookingSuccess = (appointment) => {
    if (typeof window !== "undefined") {
      if (window.trackContentEngagement) {
        window.trackContentEngagement("appointment_booked", "tax_calculator_success");
      }
      if (window.trackHighLevelEvent) {
        window.trackHighLevelEvent("appointment_booked", {
          source: "1031 Tax Calculator",
          appointmentId: appointment.highlevelAppointmentId,
          value: appointment.taxSavingsAmount || 0,
          type: "appointment_from_calculator"
        });
      }
    }
    console.log("Appointment booked successfully:", appointment);
  };
  const handleBookingError = (error) => {
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement("booking_error", "tax_calculator_booking");
    }
    console.error("Booking error:", error);
  };
  const handleBookingCancel = () => {
    trackBookingEvent.bookingAbandoned("user_cancelled", "user_clicked_cancel");
    setShowBooking(false);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "1031 Tax Savings Calculator" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
      lineNumber: 218,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-8", children: "See how much you can save in capital gains taxes with a 1031 exchange" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
      lineNumber: 221,
      columnNumber: 7
    }, undefined),
    !showResults && !showEmailCapture && /* @__PURE__ */ jsxDEV("form", { onSubmit: handleCalculate, className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Property Details" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 229,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sale Price" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 232,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 236,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: formData.salePrice || "",
                  onChange: (e) => handleInputChange("salePrice", e.target.value),
                  className: "pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "1,000,000",
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 237,
                  columnNumber: 19
                },
                undefined
              )
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 235,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 231,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Original Purchase Price" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 249,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 253,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: formData.purchasePrice || "",
                  onChange: (e) => handleInputChange("purchasePrice", e.target.value),
                  className: "pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "600,000",
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 254,
                  columnNumber: 19
                },
                undefined
              )
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 252,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 248,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Improvements Made" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 266,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 270,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: formData.improvements || "",
                  onChange: (e) => handleInputChange("improvements", e.target.value),
                  className: "pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "50,000"
                },
                void 0,
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 271,
                  columnNumber: 19
                },
                undefined
              )
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 269,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 265,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Closing Costs" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 282,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 286,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: formData.closingCosts || "",
                  onChange: (e) => handleInputChange("closingCosts", e.target.value),
                  className: "pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "10,000"
                },
                void 0,
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 287,
                  columnNumber: 19
                },
                undefined
              )
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 285,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 281,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 230,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 228,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Tax Information" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 301,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "State" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 304,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: formData.state,
                onChange: (e) => handleInputChange("state", e.target.value),
                className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                children: Object.entries(stateNames).map(([abbr, name]) => /* @__PURE__ */ jsxDEV("option", { value: abbr, children: name }, abbr, false, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 313,
                  columnNumber: 21
                }, undefined))
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 307,
                columnNumber: 17
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 303,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Filing Status" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 319,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: formData.filingStatus,
                onChange: (e) => handleInputChange("filingStatus", e.target.value),
                className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "single", children: "Single" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                    lineNumber: 327,
                    columnNumber: 19
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "married_joint", children: "Married Filing Jointly" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                    lineNumber: 328,
                    columnNumber: 19
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "married_separate", children: "Married Filing Separately" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                    lineNumber: 329,
                    columnNumber: 19
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("option", { value: "head_of_household", children: "Head of Household" }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                    lineNumber: 330,
                    columnNumber: 19
                  }, undefined)
                ]
              },
              void 0,
              true,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 322,
                columnNumber: 17
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 318,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Annual Income" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 335,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                lineNumber: 339,
                columnNumber: 19
              }, undefined),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: formData.income || "",
                  onChange: (e) => handleInputChange("income", e.target.value),
                  className: "pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "250,000",
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
                  lineNumber: 340,
                  columnNumber: 19
                },
                undefined
              )
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 338,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 334,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 302,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 300,
        columnNumber: 11
      }, undefined),
      result && result.capitalGain > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-blue-900", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: "Estimated Tax Savings:" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 357,
          columnNumber: 17
        }, undefined),
        " ",
        formatCurrency(result.taxSavings)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 356,
        columnNumber: 15
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 355,
        columnNumber: 13
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "submit",
          className: "w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200",
          children: "Calculate My Savings"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 363,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
      lineNumber: 226,
      columnNumber: 9
    }, undefined),
    showEmailCapture && /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-8 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: [
        "Your Potential Tax Savings: ",
        result && formatCurrency(result.taxSavings)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 375,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-6", children: "Get your detailed tax savings report and learn how to start your 1031 exchange." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 378,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleEmailSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address *" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 384,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "email",
              value: leadData.email,
              onChange: (e) => setLeadData((prev) => ({ ...prev, email: e.target.value })),
              className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "john@example.com",
              required: true
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 387,
              columnNumber: 15
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 383,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 398,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: leadData.name,
              onChange: (e) => setLeadData((prev) => ({ ...prev, name: e.target.value })),
              className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "John Smith"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 401,
              columnNumber: 15
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 397,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Phone Number" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 411,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "tel",
              value: leadData.phone,
              onChange: (e) => setLeadData((prev) => ({ ...prev, phone: e.target.value })),
              className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "(555) 123-4567"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 414,
              columnNumber: 15
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 410,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50",
            children: loading ? "Sending..." : "Get My Full Report"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 423,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 text-center", children: "We respect your privacy. Your information will never be shared." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 431,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 382,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
      lineNumber: 374,
      columnNumber: 9
    }, undefined),
    showBooking && result && leadData.email && /* @__PURE__ */ jsxDEV(
      AppointmentBooking,
      {
        leadData: {
          email: leadData.email,
          phone: leadData.phone,
          firstName: leadData.name.split(" ")[0] || "Valued",
          lastName: leadData.name.split(" ").slice(1).join(" ") || "Customer",
          taxSavingsAmount: result.taxSavings,
          propertySalePrice: formData.salePrice,
          propertyDetails: formData
        },
        onSuccess: handleBookingSuccess,
        onError: handleBookingError,
        onCancel: handleBookingCancel,
        options: {
          timezone: "America/New_York",
          prefetchDays: 14,
          minBookingHours: 2,
          maxBookingDays: 30
        }
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 440,
        columnNumber: 9
      },
      undefined
    ),
    showResults && result && !showBooking && /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-green-50 p-6 rounded-lg border-2 border-green-200", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-green-900 mb-2", children: "Your 1031 Exchange Tax Savings" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 466,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-4xl font-bold text-green-600", children: formatCurrency(result.taxSavings) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 469,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-green-700 mt-2", children: [
          "That's ",
          result.percentageSaved.toFixed(1),
          "% of your tax liability deferred!"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 472,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 465,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Tax Breakdown" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 479,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 border-b", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: "Capital Gain" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 482,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: formatCurrency(result.capitalGain) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 483,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 481,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 border-b", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: "Federal Capital Gains Tax" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 486,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: formatCurrency(result.federalTax) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 487,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 485,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 border-b", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: [
              "State Tax (",
              stateNames[formData.state],
              ")"
            ] }, void 0, true, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 490,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: formatCurrency(result.stateTax) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 491,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 489,
            columnNumber: 15
          }, undefined),
          result.netInvestmentIncomeTax > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 border-b", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: "Net Investment Income Tax (3.8%)" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 495,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: formatCurrency(result.netInvestmentIncomeTax) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 496,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 494,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 font-semibold text-lg", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Total Tax Without 1031" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 500,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-600", children: formatCurrency(result.totalTaxWithout1031) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 501,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 499,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between py-2 font-semibold text-lg", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Total Tax With 1031" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 504,
              columnNumber: 17
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600", children: formatCurrency(result.totalTaxWith1031) }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
              lineNumber: 505,
              columnNumber: 17
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 503,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 480,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 478,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "text-lg font-semibold text-blue-900 mb-3", children: "Next Steps" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 512,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("ol", { className: "list-decimal list-inside space-y-2 text-blue-800", children: [
          /* @__PURE__ */ jsxDEV("li", { children: "Schedule a free consultation with our 1031 experts" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 514,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { children: "Identify your replacement property within 45 days" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 515,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { children: "Complete your exchange within 180 days" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 516,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { children: [
            "Defer ",
            formatCurrency(result.taxSavings),
            " in taxes!"
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 517,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 513,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 511,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleStartBooking,
            className: "flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200",
            children: "Schedule Free Consultation"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 523,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleReset,
            className: "flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200",
            children: "Calculate Again"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 529,
            columnNumber: 13
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 522,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm mb-2", children: "Prefer to speak with us directly?" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
          lineNumber: 539,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: "/contact",
            className: "text-blue-600 hover:text-blue-800 font-medium",
            onClick: () => {
              if (typeof window !== "undefined" && window.trackContentEngagement) {
                window.trackContentEngagement("cta_click", "calculator_contact_page");
              }
            },
            children: "Visit our contact page →"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
            lineNumber: 542,
            columnNumber: 13
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
        lineNumber: 538,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
      lineNumber: 464,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator.tsx",
    lineNumber: 217,
    columnNumber: 5
  }, undefined);
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Calculator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "1031 Tax Savings Calculator | The 1031 Center", "description": "Calculate your potential capital gains tax savings with a 1031 exchange. Free calculator shows federal and state tax deferral amounts instantly." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="bg-gray-50 min-h-screen py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Hero Section --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">\n1031 Exchange Tax Savings Calculator\n</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto">\nDiscover how much you can save in capital gains taxes by completing a 1031 exchange. \n          Our calculator provides instant estimates based on your specific situation.\n</p> </div> <!-- Benefits Grid --> <div class="grid md:grid-cols-3 gap-6 mb-12"> <div class="bg-white p-6 rounded-lg shadow-md"> <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Accurate Calculations</h3> <p class="text-gray-600">Based on 2024 federal and state tax rates with automatic updates</p> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3> <p class="text-gray-600">See your potential tax savings immediately with detailed breakdown</p> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> </svg> </div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Detailed Report</h3> <p class="text-gray-600">Get a comprehensive PDF report with your personalized results</p> </div> </div> <!-- Calculator Component --> ', ' <!-- Educational Content --> <div class="mt-16 prose prose-lg max-w-none"> <h2 class="text-3xl font-bold text-gray-900 mb-6">Understanding 1031 Exchange Tax Savings</h2> <div class="grid md:grid-cols-2 gap-8"> <div> <h3 class="text-xl font-semibold text-gray-900 mb-3">What Taxes Can Be Deferred?</h3> <ul class="space-y-2 text-gray-600"> <li><strong>Federal Capital Gains Tax:</strong> 0%, 15%, or 20% based on income</li> <li><strong>State Capital Gains Tax:</strong> Varies by state (0% - 13.3%)</li> <li><strong>Net Investment Income Tax:</strong> 3.8% for high earners</li> <li><strong>Depreciation Recapture:</strong> Up to 25% on depreciated amount</li> </ul> </div> <div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Calculator Assumptions</h3> <ul class="space-y-2 text-gray-600"> <li>Uses 2024 tax rates and brackets</li> <li>Assumes long-term capital gains (property held >1 year)</li> <li>Simplified depreciation recapture calculation</li> <li>Does not include local taxes or transaction costs</li> </ul> </div> </div> <div class="mt-8 bg-yellow-50 p-6 rounded-lg"> <p class="text-gray-800"> <strong>Important Note:</strong> This calculator provides estimates for educational purposes only. \n            Actual tax savings depend on your specific situation. Consult with a qualified tax professional \n            and 1031 exchange expert before making any investment decisions.\n</p> </div> </div> <!-- CTA Section --> <div class="mt-16 bg-blue-900 text-white rounded-xl p-8 text-center"> <h2 class="text-3xl font-bold mb-4">Ready to Save on Taxes?</h2> <p class="text-xl mb-8 text-blue-200">\nLet our experts guide you through your 1031 exchange and maximize your tax savings.\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/contact" class="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200">\nGet Expert Guidance\n</a> <a href="/complete-guide-1031-exchanges" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors duration-200">\nLearn More About 1031s\n</a> </div> </div> </div> </div>  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "WebApplication",\n    "name": "1031 Exchange Tax Savings Calculator",\n    "url": "https://the1031center.com/calculator",\n    "applicationCategory": "FinanceApplication",\n    "operatingSystem": "Any",\n    "offers": {\n      "@type": "Offer",\n      "price": "0",\n      "priceCurrency": "USD"\n    },\n    "description": "Calculate your potential capital gains tax savings with a 1031 exchange. Free calculator shows federal and state tax deferral amounts instantly.",\n    "screenshot": "https://the1031center.com/images/calculator-screenshot.jpg",\n    "creator": {\n      "@type": "Organization",\n      "name": "The 1031 Center",\n      "url": "https://the1031center.com"\n    },\n    "featureList": [\n      "Federal capital gains tax calculation",\n      "State tax calculation for all 50 states",\n      "Net investment income tax calculation",\n      "Instant results with detailed breakdown",\n      "PDF report generation",\n      "2024 tax rates"\n    ]\n  }\n  <\/script> '])), maybeRenderHead(), renderComponent($$result2, "TaxSavingsCalculator", TaxSavingsCalculator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TaxSavingsCalculator", "client:component-export": "TaxSavingsCalculator" })) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/calculator.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/calculator.astro";
const $$url = "/calculator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Calculator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
