import { D as DatabaseService } from './database.service_C6kdc69n.mjs';

class HighLevelService {
  db;
  config = null;
  baseUrl = "https://services.leadconnectorhq.com";
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  /**
   * Get active HighLevel configuration
   */
  async getConfig() {
    if (!this.config) {
      const { data, error } = await this.db.getTable("highlevel_config").select("*").eq("is_active", true).single();
      if (error || !data) {
        throw new Error("HighLevel configuration not found");
      }
      this.config = data;
    }
    return this.config;
  }
  /**
   * Make API request to HighLevel with retry logic
   */
  async makeRequest(endpoint, options, retries = 3) {
    const config = await this.getConfig();
    const headers = {
      "Authorization": `Bearer ${config.api_key}`,
      "Content-Type": "application/json",
      "Version": "2021-07-28",
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
        await new Promise((resolve) => setTimeout(resolve, 1e3 * Math.pow(2, attempt)));
      }
    }
  }
  /**
   * Log integration attempt
   */
  async logIntegration(params) {
    const { data, error } = await this.db.getTable("highlevel_integrations").insert({
      lead_id: params.leadId,
      integration_type: params.integrationType,
      payload_sent: params.payloadSent,
      response_received: params.responseReceived,
      success: params.success,
      error_message: params.errorMessage,
      highlevel_entity_id: params.highlevelEntityId,
      retry_count: 0
    }).select().single();
    if (error) throw error;
    return data;
  }
  /**
   * Create or update contact in HighLevel
   */
  async syncContact(params) {
    const config = await this.getConfig();
    const payload = {
      email: params.email,
      phone: params.phone,
      firstName: params.firstName,
      lastName: params.lastName,
      locationId: config.location_id,
      tags: params.tags || ["1031-exchange-lead"],
      customFields: params.customFields ? Object.entries(params.customFields).map(([key, value]) => ({ key, value: String(value) })) : []
    };
    let contactId;
    try {
      const response = await this.makeRequest("/contacts/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      contactId = response.contact.id;
      await this.logIntegration({
        leadId: params.leadId,
        integrationType: "contact_create",
        payloadSent: payload,
        responseReceived: response,
        success: true,
        highlevelEntityId: contactId
      });
    } catch (error) {
      if (error.message?.includes("already exists")) {
        try {
          const searchResponse = await this.makeRequest(
            `/contacts/lookup?email=${encodeURIComponent(params.email)}`,
            { method: "GET" }
          );
          contactId = searchResponse.contacts[0]?.id;
          if (contactId) {
            const updateResponse = await this.makeRequest(
              `/contacts/${contactId}`,
              {
                method: "PUT",
                body: JSON.stringify(payload)
              }
            );
            await this.logIntegration({
              leadId: params.leadId,
              integrationType: "contact_update",
              payloadSent: payload,
              responseReceived: updateResponse,
              success: true,
              highlevelEntityId: contactId
            });
          }
        } catch (updateError) {
          await this.logIntegration({
            leadId: params.leadId,
            integrationType: "contact_update",
            payloadSent: payload,
            success: false,
            errorMessage: updateError.message
          });
          throw updateError;
        }
      } else {
        await this.logIntegration({
          leadId: params.leadId,
          integrationType: "contact_create",
          payloadSent: payload,
          success: false,
          errorMessage: error.message
        });
        throw error;
      }
    }
    await this.db.getTable("leads").update({ highlevel_contact_id: contactId }).eq("id", params.leadId);
    return contactId;
  }
  /**
   * Create appointment in HighLevel
   */
  async createAppointment(params) {
    const config = await this.getConfig();
    const startDate = new Date(params.startTime);
    const endDate = new Date(params.endTime);
    const startTimestamp = Math.floor(startDate.getTime() / 1e3);
    const endTimestamp = Math.floor(endDate.getTime() / 1e3);
    const payload = {
      calendarId: config.calendar_id,
      contactId: params.contactId,
      startTime: startTimestamp,
      endTime: endTimestamp,
      title: params.title || "1031 Exchange Consultation",
      appointmentStatus: params.appointmentStatus || "new"
    };
    try {
      const response = await this.makeRequest("/appointments/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const highlevelAppointmentId = response.id;
      await this.logIntegration({
        integrationType: "appointment_create",
        payloadSent: payload,
        responseReceived: response,
        success: true,
        highlevelEntityId: highlevelAppointmentId
      });
      await this.db.getTable("appointments").update({
        highlevel_appointment_id: highlevelAppointmentId,
        highlevel_contact_id: params.contactId
      }).eq("id", params.appointmentId);
      return highlevelAppointmentId;
    } catch (error) {
      await this.logIntegration({
        integrationType: "appointment_create",
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
  async processWebhook(params) {
    const { data: webhook, error } = await this.db.getTable("webhooks").insert({
      webhook_type: params.type,
      payload: params.payload,
      headers: params.headers,
      processed: false
    }).select().single();
    if (error) throw error;
    try {
      switch (params.type) {
        case "ContactCreate":
        case "ContactUpdate":
          await this.processContactWebhook(webhook.id, params.payload);
          break;
        case "AppointmentCreate":
        case "AppointmentUpdate":
          await this.processAppointmentWebhook(webhook.id, params.payload);
          break;
        default:
          console.log(`Unhandled webhook type: ${params.type}`);
      }
      await this.db.getTable("webhooks").update({
        processed: true,
        processed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", webhook.id);
    } catch (error2) {
      await this.db.getTable("webhooks").update({
        processing_error: error2.message
      }).eq("id", webhook.id);
      throw error2;
    }
  }
  /**
   * Process contact webhook
   */
  async processContactWebhook(webhookId, payload) {
    const contactId = payload.id;
    const email = payload.email;
    if (!email) return;
    const { data: lead } = await this.db.getTable("leads").select("*").eq("email", email).single();
    if (lead) {
      await this.db.getTable("leads").update({
        highlevel_contact_id: contactId,
        phone: payload.phone || lead.phone,
        first_name: payload.firstName || lead.first_name,
        last_name: payload.lastName || lead.last_name
      }).eq("id", lead.id);
      await this.db.getTable("webhooks").update({ lead_id: lead.id }).eq("id", webhookId);
    }
  }
  /**
   * Process appointment webhook
   */
  async processAppointmentWebhook(webhookId, payload) {
    const appointmentId = payload.id;
    payload.contactId;
    const { data: appointment } = await this.db.getTable("appointments").select("*").eq("highlevel_appointment_id", appointmentId).single();
    if (appointment) {
      const updates = {
        webhook_payload: payload,
        webhook_received_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (payload.appointmentStatus) {
        const statusMap = {
          "showed": "completed",
          "noshow": "no_show",
          "cancelled": "cancelled",
          "confirmed": "confirmed"
        };
        updates.status = statusMap[payload.appointmentStatus] || payload.appointmentStatus;
      }
      if (payload.assignedUserId) {
        updates.assigned_specialist_id = payload.assignedUserId;
      }
      await this.db.getTable("appointments").update(updates).eq("id", appointment.id);
      await this.db.getTable("webhooks").update({ lead_id: appointment.lead_id }).eq("id", webhookId);
    }
  }
  /**
   * Get calendar ID from configuration
   */
  getCalendarId() {
    if (!this.config) {
      throw new Error("HighLevel configuration not loaded. Call getConfig() first.");
    }
    return this.config.calendar_id;
  }
  /**
   * Get calendar availability
   */
  async getAvailability(params) {
    const config = await this.getConfig();
    console.log("[HighLevelService] getAvailability called with:", {
      date: params.date,
      timezone: params.timezone,
      calendarId: config.calendar_id
    });
    try {
      const dateObj = new Date(params.date);
      const startTimestamp = dateObj.getTime();
      const endTimestamp = startTimestamp + 864e5;
      let endpoint = `/calendars/${config.calendar_id}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`;
      if (params.timezone) {
        endpoint += `&timezone=${encodeURIComponent(params.timezone)}`;
      }
      console.log("[HighLevelService] Making calendar API request:", {
        endpoint,
        startTimestamp,
        endTimestamp,
        startDate: new Date(startTimestamp).toISOString(),
        endDate: new Date(endTimestamp).toISOString()
      });
      const response = await this.makeRequest(endpoint, { method: "GET" });
      console.log("[HighLevelService] Calendar API raw response:", response);
      const dateKey = params.date;
      const dateData = response[dateKey];
      if (dateData && dateData.slots && Array.isArray(dateData.slots)) {
        console.log(`[HighLevelService] Found ${dateData.slots.length} slots for ${dateKey}`);
        const slots = dateData.slots.map((slotTime) => ({
          time: slotTime,
          available: true
        }));
        return slots;
      }
      console.log(`[HighLevelService] No slots found for ${dateKey}`);
      return [];
    } catch (error) {
      console.error("[HighLevelService] Calendar API Error:", {
        message: error.message,
        calendarId: config.calendar_id,
        date: params.date,
        endpoint: "calendars/free-slots",
        error
      });
      return [];
    }
  }
  /**
   * Book appointment with contact creation - matches AppointmentBooking component parameters
   */
  async bookAppointment(params) {
    const config = await this.getConfig();
    console.log("[HighLevelService] bookAppointment called with:", {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      appointmentDate: params.appointmentDate,
      timezone: params.timezone
    });
    let contactId;
    try {
      console.log("[HighLevelService] Searching for existing contact with email:", params.email);
      try {
        const searchResponse = await this.makeRequest(
          `/contacts/search/duplicate?email=${encodeURIComponent(params.email)}&locationId=${config.location_id}`,
          { method: "GET" }
        );
        if (searchResponse.contact && searchResponse.contact.id) {
          console.log("[HighLevelService] Found existing contact:", searchResponse.contact.id);
          contactId = searchResponse.contact.id;
        } else {
          contactId = await this.createNewContact(params, config);
        }
      } catch (searchError) {
        console.log("[HighLevelService] Contact search failed, creating new contact");
        contactId = await this.createNewContact(params, config);
      }
      const startTime = params.appointmentDate;
      const startDate = new Date(startTime);
      const endTime = new Date(startDate.getTime() + 30 * 6e4).toISOString();
      const appointmentData = {
        calendarId: config.calendar_id,
        locationId: config.location_id,
        contactId,
        startTime,
        endTime,
        title: "1031 Exchange Consultation",
        appointmentStatus: "confirmed"
      };
      console.log("[HighLevelService] Booking appointment with round-robin:", appointmentData);
      const appointmentResponse = await this.makeRequest("/calendars/events/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentData)
      });
      console.log("[HighLevelService] Appointment booked successfully:", appointmentResponse);
      await this.logIntegration({
        integrationType: "appointment_create",
        payloadSent: appointmentData,
        responseReceived: appointmentResponse,
        success: true,
        highlevelEntityId: appointmentResponse.id
      });
      return {
        id: appointmentResponse.id,
        highlevelAppointmentId: appointmentResponse.id,
        highlevelContactId: contactId,
        status: "confirmed",
        appointmentDate: startDate,
        appointmentTime: startTime,
        timezone: params.timezone,
        durationMinutes: 30,
        contactEmail: params.email,
        contactPhone: params.phone,
        contactFirstName: params.firstName,
        contactLastName: params.lastName,
        taxSavingsAmount: params.taxSavingsAmount,
        propertySalePrice: params.propertySalePrice,
        sourceUrl: params.sourceUrl,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("[HighLevelService] Error booking appointment:", error);
      await this.logIntegration({
        integrationType: "appointment_create",
        payloadSent: {
          email: params.email,
          appointmentDate: params.appointmentDate,
          timezone: params.timezone
        },
        success: false,
        errorMessage: error.message
      });
      throw error;
    }
  }
  /**
   * Create new contact helper method
   */
  async createNewContact(params, config) {
    console.log("[HighLevelService] Creating new contact");
    const contactData = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone || "",
      locationId: config.location_id,
      tags: ["1031-exchange-lead"],
      customFields: [
        params.taxSavingsAmount ? { key: "tax_savings_amount", field_value: params.taxSavingsAmount.toString() } : null,
        params.propertySalePrice ? { key: "property_sale_price", field_value: params.propertySalePrice.toString() } : null
      ].filter(Boolean)
    };
    try {
      const contactResponse = await this.makeRequest("/contacts/", {
        method: "POST",
        body: JSON.stringify(contactData)
      });
      console.log("[HighLevelService] Contact created successfully:", contactResponse);
      await this.logIntegration({
        integrationType: "contact_create",
        payloadSent: contactData,
        responseReceived: contactResponse,
        success: true,
        highlevelEntityId: contactResponse.contact.id
      });
      return contactResponse.contact.id;
    } catch (error) {
      if (error.message?.includes("already exists") || error.message?.includes("Duplicate")) {
        try {
          const errorMessage = error.message;
          const contactIdMatch = errorMessage.match(/contactId['":\s]+([a-zA-Z0-9-]+)/);
          if (contactIdMatch) {
            console.log("[HighLevelService] Using existing contact ID from error:", contactIdMatch[1]);
            return contactIdMatch[1];
          }
        } catch (parseError) {
          console.error("[HighLevelService] Failed to parse contact ID from error");
        }
      }
      await this.logIntegration({
        integrationType: "contact_create",
        payloadSent: contactData,
        success: false,
        errorMessage: error.message
      });
      throw error;
    }
  }
  /**
   * Get calendar availability for a date range
   */
  async getAvailabilityRange(params) {
    const config = await this.getConfig();
    console.log("[HighLevelService] getAvailabilityRange called with:", {
      startDate: params.startDate,
      endDate: params.endDate,
      timezone: params.timezone,
      calendarId: config.calendar_id
    });
    try {
      const startTimestamp = new Date(params.startDate).getTime();
      const endTimestamp = new Date(params.endDate).getTime();
      let endpoint = `/calendars/${config.calendar_id}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`;
      if (params.timezone) {
        endpoint += `&timezone=${encodeURIComponent(params.timezone)}`;
      }
      console.log("[HighLevelService] Making calendar range API request:", {
        endpoint,
        startTimestamp,
        endTimestamp
      });
      const response = await this.makeRequest(endpoint, { method: "GET" });
      console.log("[HighLevelService] Calendar range API response keys:", Object.keys(response));
      const result = [];
      for (const dateKey in response) {
        if (dateKey === "traceId") continue;
        const dateData = response[dateKey];
        if (dateData && dateData.slots && Array.isArray(dateData.slots)) {
          const slots = dateData.slots.map((slotTime) => ({
            time: slotTime,
            available: true
          }));
          result.push({
            date: dateKey,
            slots
          });
        }
      }
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      console.log(`[HighLevelService] Found availability for ${result.length} dates`);
      return result;
    } catch (error) {
      console.error("[HighLevelService] Calendar range API Error:", {
        message: error.message,
        calendarId: config.calendar_id,
        startDate: params.startDate,
        endDate: params.endDate,
        error
      });
      return [];
    }
  }
}

export { HighLevelService as H };
