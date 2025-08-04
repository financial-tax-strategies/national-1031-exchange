import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState } from 'react';
import { D as DatabaseService } from '../../chunks/database.service_C6kdc69n.mjs';
import { H as HighLevelService } from '../../chunks/highlevel.service_BQje5Mta.mjs';
/* empty css                                               */
export { renderers } from '../../renderers.mjs';

class LeadService {
  db;
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  /**
   * Find or create a lead by email (deduplication)
   */
  async findOrCreateLead(params) {
    try {
      const leadId = await this.db.executeFunction("find_or_create_lead", {
        p_email: params.email,
        p_phone: params.phone || null,
        p_first_name: params.firstName || null,
        p_last_name: params.lastName || null,
        p_lead_source: params.leadSource || "unknown"
      });
      const { data, error } = await this.db.getTable("leads").select("*").eq("id", leadId).single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Lead creation/lookup failed");
    }
  }
  /**
   * Update lead information
   */
  async updateLead(leadId, updates) {
    try {
      const { data, error } = await this.db.getTable("leads").update(updates).eq("id", leadId).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Lead update failed");
    }
  }
  /**
   * Track lead activity
   */
  async trackActivity(params) {
    try {
      const { data, error } = await this.db.getTable("lead_activities").insert({
        lead_id: params.leadId,
        activity_type: params.activityType,
        activity_data: params.activityData || {},
        session_id: params.sessionId,
        source_url: params.sourceUrl,
        referrer_url: params.referrerUrl,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
        device_type: params.deviceType
      }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Activity tracking failed");
    }
  }
  /**
   * Save calculator submission
   */
  async saveCalculatorSubmission(params) {
    try {
      const { data, error } = await this.db.getTable("calculator_submissions").insert({
        lead_id: params.leadId,
        property_sale_price: params.propertySalePrice,
        current_basis: params.currentBasis,
        depreciation_taken: params.depreciationTaken,
        calculated_capital_gains: params.calculatedCapitalGains,
        calculated_tax_savings: params.calculatedTaxSavings,
        property_type: params.propertyType,
        property_state: params.propertyState,
        submission_data: params.submissionData || {}
      }).select().single();
      if (error) throw error;
      await this.trackActivity({
        leadId: params.leadId,
        activityType: "calculator_complete",
        activityData: {
          tax_savings: params.calculatedTaxSavings,
          property_type: params.propertyType
        }
      });
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Calculator submission failed");
    }
  }
  /**
   * Create or update order form submission
   */
  async upsertOrderFormSubmission(params) {
    try {
      const { data: existing } = await this.db.getTable("order_form_submissions").select("id").eq("lead_id", params.leadId).single();
      if (existing) {
        const { data, error } = await this.db.getTable("order_form_submissions").update({
          step_completed: params.stepCompleted,
          completion_status: params.completionStatus || "in_progress",
          urgency_level: params.urgencyLevel,
          exchange_type: params.exchangeType,
          property_sale_price: params.propertySalePrice,
          form_data: params.formData,
          completed_at: params.completionStatus === "completed" ? (/* @__PURE__ */ new Date()).toISOString() : null
        }).eq("id", existing.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await this.db.getTable("order_form_submissions").insert({
          lead_id: params.leadId,
          step_completed: params.stepCompleted,
          completion_status: params.completionStatus || "in_progress",
          urgency_level: params.urgencyLevel,
          exchange_type: params.exchangeType,
          property_sale_price: params.propertySalePrice,
          form_data: params.formData
        }).select().single();
        if (error) throw error;
        return data;
      }
    } catch (error) {
      throw this.db.handleError(error, "Order form submission failed");
    }
  }
  /**
   * Get lead by email
   */
  async getLeadByEmail(email) {
    try {
      const { data, error } = await this.db.getTable("leads").select("*").eq("email", email).single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (error) {
      throw this.db.handleError(error, "Lead lookup failed");
    }
  }
  /**
   * Get lead with all related data
   */
  async getLeadWithDetails(leadId) {
    try {
      const [lead, calculator, orderForm, appointments, activities] = await Promise.all([
        // Get lead
        this.db.getTable("leads").select("*").eq("id", leadId).single(),
        // Get calculator submissions
        this.db.getTable("calculator_submissions").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
        // Get order form submission
        this.db.getTable("order_form_submissions").select("*").eq("lead_id", leadId).single(),
        // Get appointments
        this.db.getTable("appointments").select("*").eq("lead_id", leadId).order("appointment_date", { ascending: false }),
        // Get recent activities
        this.db.getTable("lead_activities").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(50)
      ]);
      if (lead.error && lead.error.code !== "PGRST116") throw lead.error;
      return {
        lead: lead.data,
        calculator_submissions: calculator.data || [],
        order_form: orderForm.data,
        appointments: appointments.data || [],
        activities: activities.data || []
      };
    } catch (error) {
      throw this.db.handleError(error, "Lead details fetch failed");
    }
  }
  /**
   * Update lead status
   */
  async updateLeadStatus(leadId, status) {
    return this.updateLead(leadId, { lead_status: status });
  }
  /**
   * Get leads by status
   */
  async getLeadsByStatus(status, limit = 100) {
    try {
      const { data, error } = await this.db.getTable("leads").select("*").eq("lead_status", status).order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, "Lead fetch by status failed");
    }
  }
}

class AppointmentService {
  db;
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  /**
   * Create a new appointment
   */
  async createAppointment(params) {
    try {
      const { data, error } = await this.db.getTable("appointments").insert({
        lead_id: params.leadId,
        appointment_date: params.appointmentDate,
        appointment_time: params.appointmentTime,
        timezone: params.timezone || "America/New_York",
        duration_minutes: params.durationMinutes || 30,
        booking_source: params.bookingSource,
        tax_savings_amount: params.taxSavingsAmount,
        property_sale_price: params.propertySalePrice,
        property_type: params.propertyType,
        exchange_timeline: params.exchangeTimeline,
        source_url: params.sourceUrl,
        form_data: params.formData || {},
        status: "scheduled"
      }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Appointment creation failed");
    }
  }
  /**
   * Update appointment with HighLevel correlation
   */
  async updateAppointmentWithHighLevel(appointmentId, highLevelData) {
    try {
      const { data, error } = await this.db.getTable("appointments").update({
        highlevel_appointment_id: highLevelData.highlevelAppointmentId,
        highlevel_contact_id: highLevelData.highlevelContactId,
        assigned_specialist_id: highLevelData.assignedSpecialistId,
        assigned_specialist_name: highLevelData.assignedSpecialistName,
        meeting_location: highLevelData.meetingLocation
      }).eq("id", appointmentId).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Appointment update failed");
    }
  }
  /**
   * Update appointment status
   */
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const { data, error } = await this.db.getTable("appointments").update({ status }).eq("id", appointmentId).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, "Appointment status update failed");
    }
  }
  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId) {
    try {
      const { data, error } = await this.db.getTable("appointments").select("*").eq("id", appointmentId).single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (error) {
      throw this.db.handleError(error, "Appointment fetch failed");
    }
  }
  /**
   * Get appointments by lead ID
   */
  async getAppointmentsByLead(leadId) {
    try {
      const { data, error } = await this.db.getTable("appointments").select("*").eq("lead_id", leadId).order("appointment_date", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, "Lead appointments fetch failed");
    }
  }
  /**
   * Get appointments by date range
   */
  async getAppointmentsByDateRange(startDate, endDate, status) {
    try {
      let query = this.db.getTable("appointments").select("*").gte("appointment_date", startDate).lte("appointment_date", endDate);
      if (status) {
        query = query.eq("status", status);
      }
      const { data, error } = await query.order("appointment_date", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, "Date range appointments fetch failed");
    }
  }
  /**
   * Get appointments needing specialist assignment
   */
  async getUnassignedAppointments() {
    try {
      const { data, error } = await this.db.getTable("appointments").select("*").is("assigned_specialist_id", null).eq("status", "scheduled").order("appointment_date", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, "Unassigned appointments fetch failed");
    }
  }
  /**
   * Process webhook data from HighLevel
   */
  async processHighLevelWebhook(webhookData) {
    try {
      if (!webhookData.appointmentId) return;
      const { data: appointment } = await this.db.getTable("appointments").select("*").eq("highlevel_appointment_id", webhookData.appointmentId).single();
      if (appointment) {
        const updates = {
          webhook_received_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (webhookData.status) updates.status = webhookData.status;
        if (webhookData.assignedUserId) updates.assigned_specialist_id = webhookData.assignedUserId;
        if (webhookData.assignedUserName) updates.assigned_specialist_name = webhookData.assignedUserName;
        if (webhookData.meetingLocation) updates.meeting_location = webhookData.meetingLocation;
        await this.db.getTable("appointments").update(updates).eq("id", appointment.id);
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }
  /**
   * Get availability cache
   */
  async getAvailabilityCache(calendarId, date, timezone) {
    try {
      const cacheKey = `${calendarId}:${date}:${timezone}`;
      const { data, error } = await this.db.getTable("availability_cache").select("*").eq("cache_key", cacheKey).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.slots || null;
    } catch (error) {
      throw this.db.handleError(error, "Availability cache fetch failed");
    }
  }
  /**
   * Save availability cache
   */
  async saveAvailabilityCache(calendarId, date, timezone, slots, expiresInMinutes = 30) {
    try {
      const cacheKey = `${calendarId}:${date}:${timezone}`;
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1e3).toISOString();
      await this.db.getTable("availability_cache").upsert({
        cache_key: cacheKey,
        calendar_id: calendarId,
        date,
        timezone,
        slots,
        expires_at: expiresAt
      }, {
        onConflict: "cache_key"
      });
    } catch (error) {
      console.error("Availability cache save error:", error);
    }
  }
}

function TestIntegrationComponent() {
  const leadService = new LeadService();
  const appointmentService = new AppointmentService();
  const highLevelService = new HighLevelService();
  const [testLead, setTestLead] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [phone, setPhone] = useState("555-123-4567");
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");
  async function runIntegrationTest() {
    setTesting(true);
    setTestResults([]);
    setTestLead(null);
    try {
      addTestResult("Creating/finding lead...", true, "In progress");
      const lead = await leadService.findOrCreateLead({
        email,
        phone,
        firstName,
        lastName,
        leadSource: "test"
      });
      setTestLead(lead);
      updateTestResult(0, true, `Lead created/found: ${lead.id}`);
      addTestResult("Tracking lead activity...", true, "In progress");
      await leadService.trackActivity({
        leadId: lead.id,
        activityType: "test_integration",
        activityData: { test: true }
      });
      updateTestResult(1, true, "Activity tracked successfully");
      addTestResult("Syncing contact with HighLevel...", true, "In progress");
      try {
        const contactId = await highLevelService.syncContact({
          leadId: lead.id,
          email: lead.email,
          phone: lead.phone || void 0,
          firstName: lead.first_name || void 0,
          lastName: lead.last_name || void 0,
          tags: ["test-integration"]
        });
        updateTestResult(2, true, `HighLevel contact synced: ${contactId}`);
      } catch (error) {
        updateTestResult(2, false, `HighLevel sync failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      addTestResult("Creating test appointment...", true, "In progress");
      const tomorrow = /* @__PURE__ */ new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const appointment = await appointmentService.createAppointment({
        leadId: lead.id,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: "10:00 AM",
        bookingSource: "test",
        formData: { test: true }
      });
      updateTestResult(3, true, `Appointment created: ${appointment.id}`);
      if (lead.highlevel_contact_id) {
        addTestResult("Syncing appointment with HighLevel...", true, "In progress");
        try {
          const endTime = new Date(tomorrow);
          endTime.setMinutes(endTime.getMinutes() + 30);
          const hlAppointmentId = await highLevelService.createAppointment({
            appointmentId: appointment.id,
            contactId: lead.highlevel_contact_id,
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
            title: "Test Integration Appointment"
          });
          updateTestResult(4, true, `HighLevel appointment created: ${hlAppointmentId}`);
        } catch (error) {
          updateTestResult(4, false, `HighLevel appointment sync failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      addTestResult("Testing calendar availability...", true, "In progress");
      try {
        const testDate = tomorrow.toISOString().split("T")[0];
        console.warn("[TestIntegration] Testing calendar availability for:", testDate);
        const startTime = performance.now();
        const slots = await highLevelService.getAvailability({
          date: testDate
        });
        const duration = performance.now() - startTime;
        console.log("[TestIntegration] Calendar availability response:", {
          date: testDate,
          slotsReceived: slots.length,
          duration: `${duration.toFixed(2)}ms`,
          firstSlot: slots[0],
          allSlots: slots
        });
        if (slots.length === 0) {
          updateTestResult(5, true, `No available slots found for ${testDate} (API returned empty array)`);
        } else {
          updateTestResult(5, true, `Found ${slots.length} available slots for ${testDate} (took ${duration.toFixed(0)}ms)`);
        }
      } catch (error) {
        console.error("[TestIntegration] Calendar availability error:", error);
        updateTestResult(5, false, `Availability check failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Integration test error:", error);
      addTestResult("Unexpected error", false, error.message);
    } finally {
      setTesting(false);
    }
  }
  function addTestResult(step, success, message) {
    setTestResults((prev) => [...prev, { step, success, message }]);
  }
  function updateTestResult(index, success, message) {
    setTestResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], success, message };
      return updated;
    });
  }
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-semibold mb-4", children: "Test Data" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 168,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "email",
              id: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              disabled: testing,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
              lineNumber: 171,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 167,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 182,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "tel",
              id: "phone",
              value: phone,
              onChange: (e) => setPhone(e.target.value),
              disabled: testing,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
              lineNumber: 185,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              id: "firstName",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value),
              disabled: testing,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
              lineNumber: 199,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 195,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 210,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              id: "lastName",
              value: lastName,
              onChange: (e) => setLastName(e.target.value),
              disabled: testing,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
              lineNumber: 213,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 209,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 166,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: runIntegrationTest,
          disabled: testing,
          className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
          children: testing ? "Running Test..." : "Run Integration Test"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 224,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    testResults.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-semibold mb-4", children: "Test Results" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 235,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: testResults.map((result, index) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex-shrink-0 mt-0.5", children: result.message === "In progress" ? /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 242,
          columnNumber: 21
        }, this) : result.success ? /* @__PURE__ */ jsxDEV("svg", { className: "h-5 w-5 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 245,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 244,
          columnNumber: 21
        }, this) : /* @__PURE__ */ jsxDEV("svg", { className: "h-5 w-5 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 249,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 248,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 240,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-gray-900", children: result.step }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 255,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: result.message }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
            lineNumber: 256,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
          lineNumber: 254,
          columnNumber: 17
        }, this)
      ] }, index, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 239,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 237,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
      lineNumber: 234,
      columnNumber: 9
    }, this),
    testLead && /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg mt-6", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold mb-3", children: "Test Lead Details" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 266,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("pre", { className: "text-xs bg-white p-4 rounded border border-gray-200 overflow-x-auto", children: JSON.stringify(testLead, null, 2) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
        lineNumber: 267,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
      lineNumber: 265,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration.tsx",
    lineNumber: 162,
    columnNumber: 5
  }, this);
}

const $$Astro = createAstro("https://the1031center.com");
const $$TestIntegration = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TestIntegration;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Test Integration - Admin", "data-astro-cid-oh23xnab": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8" data-astro-cid-oh23xnab> <div class="max-w-4xl mx-auto" data-astro-cid-oh23xnab> <h1 class="text-3xl font-bold mb-8" data-astro-cid-oh23xnab>Integration Testing</h1> <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-astro-cid-oh23xnab> <p class="text-sm text-blue-700" data-astro-cid-oh23xnab>
Test the complete integration flow: Lead creation → HighLevel sync → Appointment booking
</p> </div> ${renderComponent($$result2, "TestIntegrationComponent", TestIntegrationComponent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/TestIntegration", "client:component-export": "default", "data-astro-cid-oh23xnab": true })} </div> </main> ` })} `;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-integration.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-integration.astro";
const $$url = "/admin/test-integration";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestIntegration,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
