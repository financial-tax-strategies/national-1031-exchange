import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { C as COMPANY, g as getPhoneLink, $ as $$Layout } from '../chunks/Layout_NoDNIcv-.mjs';
import { jsxDEV, Fragment } from 'react/jsx-dev-runtime';
import React, { createContext, useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
import { z } from 'zod';
import { D as DatabaseService } from '../chunks/database.service_C6kdc69n.mjs';
import { H as HighLevelService } from '../chunks/highlevel.service_BQje5Mta.mjs';
import CryptoJS from 'crypto-js';
import { s as stateNames } from '../chunks/taxCalculations_CCipOTQ8.mjs';
export { renderers } from '../renderers.mjs';

const phoneRegex = /^\+?1?\s?(\([0-9]{3}\)|[0-9]{3})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const emailSchema = z.string().email("Please enter a valid email address").refine((email) => {
  const commonTypos = ["gmial.com", "gmai.com", "yahooo.com", "hotmial.com"];
  const domain = email.split("@")[1];
  return !commonTypos.includes(domain);
}, "Please check your email address for typos");
const basicInfoSchema = z.object({
  "1031x_order_first_name": z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters").regex(/^[a-zA-Z\s'-]+$/, "Please enter a valid first name"),
  "1031x_order_last_name": z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters").regex(/^[a-zA-Z\s'-]+$/, "Please enter a valid last name"),
  "1031x_order_email": emailSchema,
  "1031x_order_phone": z.string().regex(phoneRegex, "Please enter a valid phone number").transform((val) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return val;
  }),
  "1031x_order_preferred_contact": z.enum(["phone", "email", "text", "no_preference"])
});
const propertyDetailsSchema = z.object({
  "1031x_order_property_address": z.string().min(5, "Please enter a valid street address").max(100, "Address is too long"),
  "1031x_order_property_city": z.string().min(2, "Please enter a valid city").max(50, "City name is too long").regex(/^[a-zA-Z\s'-]+$/, "Please enter a valid city name"),
  "1031x_order_property_state": z.string().length(2, "Please select a state"),
  "1031x_order_property_zip": z.string().regex(zipRegex, "Please enter a valid ZIP code"),
  "1031x_order_property_type": z.enum([
    "single_family_rental",
    "multi_family_2_4",
    "apartment_5_plus",
    "office",
    "retail",
    "industrial",
    "land",
    "mixed_use",
    "other"
  ]),
  "1031x_order_sale_price": z.number().min(1e4, "Sale price must be at least $10,000").max(1e8, "Sale price seems too high"),
  "1031x_order_mortgage_balance": z.number().min(0, "Mortgage balance cannot be negative").optional()
}).superRefine((data, ctx) => {
  if (data["1031x_order_mortgage_balance"] && data["1031x_order_sale_price"]) {
    if (data["1031x_order_mortgage_balance"] > data["1031x_order_sale_price"]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mortgage balance cannot exceed sale price",
        path: ["1031x_order_mortgage_balance"]
      });
    }
  }
});
const timelineSchema = z.object({
  "1031x_order_contract_status": z.enum([
    "not_listed",
    "listed_no_offers",
    "accepted_offer",
    "in_escrow",
    "closing_scheduled"
  ]),
  "1031x_order_closing_date": z.string().optional().refine((val) => {
    if (val) {
      const closingDate = new Date(val);
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return closingDate >= today;
    }
    return true;
  }, "Closing date must be in the future"),
  "1031x_order_expected_listing_date": z.string().optional().refine((val) => {
    if (val) {
      const listingDate = new Date(val);
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return listingDate >= today;
    }
    return true;
  }, "Expected listing date must be in the future"),
  "1031x_order_urgency_level": z.enum([
    "planning_3_plus",
    "getting_ready_1_3",
    "time_sensitive_1",
    "urgent_2_weeks"
  ])
}).superRefine((data, ctx) => {
  const status = data["1031x_order_contract_status"];
  if ((status === "in_escrow" || status === "closing_scheduled") && !data["1031x_order_closing_date"]) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Closing date is required when property is in escrow or closing is scheduled",
      path: ["1031x_order_closing_date"]
    });
  }
  if (status === "not_listed" && !data["1031x_order_expected_listing_date"]) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expected listing date is required when property is not yet listed",
      path: ["1031x_order_expected_listing_date"]
    });
  }
});
const exchangeGoalsSchema = z.object({
  "1031x_order_replacement_identified": z.enum([
    "yes_specific",
    "yes_multiple",
    "no_searching",
    "need_help"
  ]),
  "1031x_order_exchange_type": z.enum([
    "standard_delayed",
    "reverse",
    "improvement",
    "not_sure"
  ]),
  "1031x_order_cash_out_needed": z.enum([
    "no_cash",
    "minimal_50k",
    "moderate_50_200k",
    "significant_200k_plus",
    "not_sure"
  ]),
  "1031x_order_dst_interest": z.enum([
    "interested",
    "traditional_only",
    "learn_both",
    "not_familiar"
  ])
});
const professionalTeamSchema = z.object({
  "1031x_order_has_cpa": z.enum(["yes", "need_referral", "will_find"]),
  "1031x_order_cpa_name": z.string().optional(),
  "1031x_order_cpa_email": z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  "1031x_order_realtor_name": z.string().max(100, "Name is too long").optional(),
  "1031x_order_realtor_email": z.string().email("Please enter a valid email address").optional().or(z.literal(""))
});
const servicePreferencesSchema = z.object({
  "1031x_order_contract_preference": z.enum(["electronic", "mail", "in_person"]),
  "1031x_order_consultation_preference": z.enum(["phone", "video", "in_person", "email_only"]),
  "1031x_order_how_heard": z.enum([
    "google",
    "cpa_referral",
    "realtor_referral",
    "previous_client",
    "social_media",
    "other"
  ]),
  "1031x_order_additional_notes": z.string().max(500, "Please limit your notes to 500 characters").optional()
});
basicInfoSchema.merge(propertyDetailsSchema).merge(timelineSchema).merge(exchangeGoalsSchema).merge(professionalTeamSchema).merge(servicePreferencesSchema);
const stepSchemas = {
  1: basicInfoSchema,
  2: propertyDetailsSchema,
  3: timelineSchema,
  4: exchangeGoalsSchema,
  5: professionalTeamSchema,
  6: servicePreferencesSchema
};
function validateStep(step, data) {
  const schema = stepSchemas[step];
  if (!schema) {
    throw new Error(`Invalid step number: ${step}`);
  }
  return schema.safeParse(data);
}

class EmailService {
  from;
  constructor() {
    this.from = process.env.EMAIL_FROM || "noreply@the1031center.com";
  }
  /**
   * Send email via configured provider
   */
  async sendEmail(params) {
    try {
      console.log("Email Service - Sending email:", {
        to: params.to,
        subject: params.subject,
        from: this.from,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode - Email content:", params.html);
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }
  /**
   * Convert HTML to plain text (basic implementation)
   */
  htmlToText(html) {
    return html.replace(/<style[^>]*>.*?<\/style>/gi, "").replace(/<script[^>]*>.*?<\/script>/gi, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
}

class OrderFormService {
  db;
  highlevel;
  email;
  constructor() {
    this.db = DatabaseService.getInstance();
    this.highlevel = new HighLevelService();
    this.email = new EmailService();
  }
  /**
   * Submit order form with complete processing flow
   */
  async submitOrderForm(data, metadata) {
    try {
      const mappedData = this.mapFieldNames(data);
      const { data: submission, error: dbError } = await this.db.getTable("order_form_submissions").insert({
        ...mappedData,
        ip_address: metadata?.ipAddress,
        user_agent: metadata?.userAgent,
        session_id: metadata?.sessionId,
        form_completion_time_seconds: metadata?.formCompletionTime,
        status: "new"
      }).select().single();
      if (dbError || !submission) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save form submission");
      }
      this.processSubmissionAsync(submission.id, mappedData, data).catch((err) => console.error("Async processing error:", err));
      return submission.id;
    } catch (error) {
      console.error("Order form submission error:", error);
      throw error;
    }
  }
  /**
   * Map field names - no need to change since they already have 1031x_order_ prefix
   */
  mapFieldNames(data) {
    return data;
  }
  /**
   * Process submission asynchronously
   */
  async processSubmissionAsync(submissionId, mappedData, originalData) {
    try {
      await this.db.getTable("order_form_submissions").update({ status: "processing" }).eq("id", submissionId);
      await this.sendAdminNotification(submissionId, mappedData);
      await this.sendUserConfirmation(submissionId, mappedData);
      const highlevelContactId = await this.syncToHighLevel(submissionId, mappedData, originalData);
      await this.triggerWebhooks(submissionId, mappedData);
      await this.db.getTable("order_form_submissions").update({
        status: "synced",
        highlevel_contact_id: highlevelContactId
      }).eq("id", submissionId);
    } catch (error) {
      console.error("Async processing error:", error);
      await this.db.getTable("order_form_submissions").update({
        status: "error",
        error_message: error.message
      }).eq("id", submissionId);
    }
  }
  /**
   * Send admin notification email
   */
  async sendAdminNotification(submissionId, data) {
    try {
      const leadScore = data.lead_score || 0;
      const urgencyEmoji = this.getUrgencyEmoji(data["1031x_order_urgency_level"]);
      const subject = `🏢 New 1031 Exchange Order ${urgencyEmoji} - ${data["1031x_order_first_name"]} ${data["1031x_order_last_name"]} (Score: ${leadScore})`;
      const body = `
        <h2>New 1031 Exchange Order Form Submission</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Lead Score: ${leadScore}/100 ${this.getScoreEmoji(leadScore)}</h3>
          <p><strong>Urgency:</strong> ${this.formatUrgencyLevel(data["1031x_order_urgency_level"])} ${urgencyEmoji}</p>
        </div>
        
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Name:</strong> ${data["1031x_order_first_name"]} ${data["1031x_order_last_name"]}</li>
          <li><strong>Email:</strong> <a href="mailto:${data["1031x_order_email"]}">${data["1031x_order_email"]}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${data["1031x_order_phone"]}">${data["1031x_order_phone"]}</a></li>
          <li><strong>Preferred Contact:</strong> ${data["1031x_order_preferred_contact"]}</li>
        </ul>
        
        <h3>Property Details</h3>
        <ul>
          <li><strong>Address:</strong> ${data["1031x_order_property_address"]}, ${data["1031x_order_property_city"]}, ${data["1031x_order_property_state"]} ${data["1031x_order_property_zip"]}</li>
          <li><strong>Type:</strong> ${this.formatPropertyType(data["1031x_order_property_type"])}</li>
          <li><strong>Sale Price:</strong> $${this.formatCurrency(data["1031x_order_sale_price"])}</li>
          <li><strong>Mortgage Balance:</strong> ${data["1031x_order_mortgage_balance"] ? "$" + this.formatCurrency(data["1031x_order_mortgage_balance"]) : "None"}</li>
        </ul>
        
        <h3>Timeline</h3>
        <ul>
          <li><strong>Contract Status:</strong> ${this.formatContractStatus(data["1031x_order_contract_status"])}</li>
          <li><strong>Closing Date:</strong> ${data["1031x_order_closing_date"] || "Not set"}</li>
          <li><strong>Expected Listing Date:</strong> ${data["1031x_order_expected_listing_date"] || "Not set"}</li>
        </ul>
        
        <h3>Exchange Goals</h3>
        <ul>
          <li><strong>Replacement Property:</strong> ${this.formatReplacementStatus(data["1031x_order_replacement_identified"])}</li>
          <li><strong>Exchange Type:</strong> ${this.formatExchangeType(data["1031x_order_exchange_type"])}</li>
          <li><strong>Cash Out Needs:</strong> ${this.formatCashOutNeeds(data["1031x_order_cash_out_needed"])}</li>
          <li><strong>DST Interest:</strong> ${this.formatDSTInterest(data["1031x_order_dst_interest"])}</li>
        </ul>
        
        <h3>Professional Team</h3>
        <ul>
          <li><strong>Has CPA:</strong> ${data["1031x_order_has_cpa"]}</li>
          ${data["1031x_order_cpa_name"] ? `<li><strong>CPA:</strong> ${data["1031x_order_cpa_name"]} (${data["1031x_order_cpa_email"]})</li>` : ""}
          ${data["1031x_order_realtor_name"] ? `<li><strong>Realtor:</strong> ${data["1031x_order_realtor_name"]} (${data["1031x_order_realtor_email"]})</li>` : ""}
        </ul>
        
        ${data["1031x_order_additional_notes"] ? `
        <h3>Additional Notes</h3>
        <p>${data["1031x_order_additional_notes"]}</p>
        ` : ""}
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Submission ID: ${submissionId}<br>
          Submitted: ${(/* @__PURE__ */ new Date()).toLocaleString()}
        </p>
      `;
      await this.email.sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@the1031center.com",
        subject,
        html: body
      });
      await this.db.getTable("order_form_submissions").update({
        admin_notification_sent: true,
        admin_notification_sent_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", submissionId);
      await this.db.getTable("order_form_emails").insert({
        order_form_id: submissionId,
        email_type: "admin_notification",
        recipient: process.env.ADMIN_EMAIL || "admin@the1031center.com",
        subject,
        body,
        sent: true,
        sent_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      throw error;
    }
  }
  /**
   * Send user confirmation email
   */
  async sendUserConfirmation(submissionId, data) {
    try {
      const subject = "Thank You - Your 1031 Exchange Application Has Been Received";
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Thank You for Choosing National 1031 Center</h2>
          
          <p>Dear ${data["1031x_order_first_name"]},</p>
          
          <p>We've successfully received your 1031 exchange application and are excited to help you defer capital gains taxes on your investment property.</p>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What Happens Next?</h3>
            <ol>
              <li>Our team will review your information within 24 hours</li>
              <li>A 1031 exchange specialist will contact you to discuss your specific situation</li>
              <li>We'll prepare all necessary documentation for your exchange</li>
              <li>You'll have 24/7 access to our client portal to track your exchange progress</li>
            </ol>
          </div>
          
          <h3>Your Property Details</h3>
          <p>
            <strong>Property:</strong> ${data["1031x_order_property_address"]}, ${data["1031x_order_property_city"]}, ${data["1031x_order_property_state"]}<br>
            <strong>Sale Price:</strong> $${this.formatCurrency(data["1031x_order_sale_price"])}<br>
            <strong>Timeline:</strong> ${this.formatUrgencyLevel(data["1031x_order_urgency_level"])}
          </p>
          
          <h3>Important Reminders</h3>
          <ul>
            <li>Never receive exchange funds directly - they must go through your QI</li>
            <li>You have 45 days to identify replacement properties</li>
            <li>You have 180 days to complete your purchase</li>
            <li>These deadlines are strict with no extensions</li>
          </ul>
          
          <p>If you have any immediate questions, please don't hesitate to call us at <strong>${process.env.COMPANY_PHONE || "800-595-1031"}</strong>.</p>
          
          <p>
            Best regards,<br>
            <strong>The National 1031 Center Team</strong>
          </p>
          
          <hr style="margin-top: 40px;">
          <p style="color: #666; font-size: 12px;">
            This email confirms your form submission. Please save it for your records.<br>
            Reference Number: ${submissionId.slice(-8).toUpperCase()}
          </p>
        </div>
      `;
      await this.email.sendEmail({
        to: data["1031x_order_email"],
        subject,
        html: body
      });
      await this.db.getTable("order_form_submissions").update({
        user_confirmation_sent: true,
        user_confirmation_sent_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", submissionId);
      await this.db.getTable("order_form_emails").insert({
        order_form_id: submissionId,
        email_type: "user_confirmation",
        recipient: data["1031x_order_email"],
        subject,
        body,
        sent: true,
        sent_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Failed to send user confirmation:", error);
    }
  }
  /**
   * Sync to HighLevel with all custom fields
   */
  async syncToHighLevel(submissionId, mappedData, originalData) {
    try {
      const customFields = {};
      for (const [key, value] of Object.entries(mappedData)) {
        if (key.startsWith("1031x_order_")) {
          customFields[key] = String(value || "");
        }
      }
      customFields["1031x_order_lead_score"] = String(mappedData.lead_score || 0);
      customFields["1031x_order_submission_id"] = submissionId;
      customFields["1031x_order_submission_date"] = (/* @__PURE__ */ new Date()).toISOString();
      const contactId = await this.highlevel.syncContact({
        leadId: submissionId,
        email: originalData["1031x_order_email"],
        phone: originalData["1031x_order_phone"],
        firstName: originalData["1031x_order_first_name"],
        lastName: originalData["1031x_order_last_name"],
        tags: [
          "1031-exchange-order-form",
          `urgency-${originalData["1031x_order_urgency_level"]}`,
          `score-${mappedData.lead_score}`,
          `property-${originalData["1031x_order_property_type"]}`
        ],
        customFields
      });
      return contactId;
    } catch (error) {
      console.error("Failed to sync to HighLevel:", error);
      throw error;
    }
  }
  /**
   * Trigger webhooks for external integrations
   */
  async triggerWebhooks(submissionId, data) {
    try {
      const webhookUrls = process.env.ORDER_FORM_WEBHOOK_URLS?.split(",") || [];
      if (webhookUrls.length === 0) {
        return;
      }
      const payload = {
        event: "order_form_submitted",
        submission_id: submissionId,
        lead_score: data.lead_score,
        data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      const webhookPromises = webhookUrls.map(async (url) => {
        try {
          const response = await fetch(url.trim(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Webhook-Secret": process.env.WEBHOOK_SECRET || ""
            },
            body: JSON.stringify(payload)
          });
          await this.db.getTable("order_form_webhooks").insert({
            order_form_id: submissionId,
            webhook_type: "order_form_submitted",
            url: url.trim(),
            payload,
            response_status: response.status,
            response_body: await response.text(),
            success: response.ok
          });
        } catch (error) {
          await this.db.getTable("order_form_webhooks").insert({
            order_form_id: submissionId,
            webhook_type: "order_form_submitted",
            url: url.trim(),
            payload,
            success: false,
            error_message: error.message
          });
        }
      });
      await Promise.all(webhookPromises);
      await this.db.getTable("order_form_submissions").update({
        webhook_sent: true,
        webhook_sent_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", submissionId);
    } catch (error) {
      console.error("Failed to trigger webhooks:", error);
    }
  }
  // Formatting helper methods
  formatCurrency(amount) {
    return amount.toLocaleString("en-US");
  }
  formatUrgencyLevel(level) {
    const map = {
      "urgent_2_weeks": "🚨 URGENT - Closing in 2 weeks",
      "time_sensitive_1": "⚡ Time Sensitive - 1 month",
      "getting_ready_1_3": "📅 Getting Ready - 1-3 months",
      "planning_3_plus": "📊 Planning - 3+ months"
    };
    return map[level] || level;
  }
  formatPropertyType(type) {
    const map = {
      "single_family_rental": "Single Family Rental",
      "multi_family_2_4": "Multi-Family (2-4 units)",
      "apartment_5_plus": "Apartment Building (5+ units)",
      "office": "Office Building",
      "retail": "Retail Property",
      "industrial": "Industrial Property",
      "land": "Land",
      "mixed_use": "Mixed Use",
      "other": "Other"
    };
    return map[type] || type;
  }
  formatContractStatus(status) {
    const map = {
      "not_listed": "Not Listed Yet",
      "listed_no_offers": "Listed - No Offers",
      "accepted_offer": "Accepted Offer",
      "in_escrow": "In Escrow",
      "closing_scheduled": "Closing Scheduled"
    };
    return map[status] || status;
  }
  formatReplacementStatus(status) {
    const map = {
      "yes_specific": "Yes - Specific Property Identified",
      "yes_multiple": "Yes - Multiple Options",
      "no_searching": "No - Still Searching",
      "need_help": "Need Help Finding Properties"
    };
    return map[status] || status;
  }
  formatExchangeType(type) {
    const map = {
      "standard_delayed": "Standard Delayed Exchange",
      "reverse": "Reverse Exchange",
      "improvement": "Improvement Exchange",
      "not_sure": "Not Sure - Need Guidance"
    };
    return map[type] || type;
  }
  formatCashOutNeeds(needs) {
    const map = {
      "no_cash": "No Cash Out",
      "minimal_50k": "Minimal (< $50k)",
      "moderate_50_200k": "Moderate ($50k - $200k)",
      "significant_200k_plus": "Significant ($200k+)",
      "not_sure": "Not Sure"
    };
    return map[needs] || needs;
  }
  formatDSTInterest(interest) {
    const map = {
      "interested": "Interested in DST",
      "traditional_only": "Traditional Properties Only",
      "learn_both": "Want to Learn About Both",
      "not_familiar": "Not Familiar with DST"
    };
    return map[interest] || interest;
  }
  getUrgencyEmoji(level) {
    const map = {
      "urgent_2_weeks": "🚨",
      "time_sensitive_1": "⚡",
      "getting_ready_1_3": "📅",
      "planning_3_plus": "📊"
    };
    return map[level] || "📋";
  }
  getScoreEmoji(score) {
    if (score >= 80) return "🔥";
    if (score >= 60) return "⭐";
    if (score >= 40) return "👍";
    return "📊";
  }
}

function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).substring(2, 9);
  const random2 = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random1}-${random2}`;
}

function getEncryptionKey() {
  const userAgent = navigator.userAgent || "";
  const language = navigator.language || "";
  const platform = navigator.platform || "";
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const compositeKey = `${userAgent}-${language}-${platform}-${screenResolution}-${timezone}`;
  return CryptoJS.SHA256(compositeKey).toString();
}
const SENSITIVE_FIELDS = [
  "1031x_email",
  "1031x_phone",
  "1031x_property_address",
  "1031x_cpa_email",
  "1031x_realtor_email",
  "1031x_additional_notes"
];
function isSensitiveField(fieldName) {
  return SENSITIVE_FIELDS.includes(fieldName);
}
function encryptFormData(data) {
  try {
    const key = getEncryptionKey();
    const processedData = { ...data };
    Object.keys(processedData).forEach((fieldName) => {
      if (isSensitiveField(fieldName) && processedData[fieldName]) {
        const encrypted2 = CryptoJS.AES.encrypt(
          JSON.stringify(processedData[fieldName]),
          key
        ).toString();
        processedData[fieldName] = {
          _encrypted: true,
          value: encrypted2
        };
      }
    });
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(processedData),
      key
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt form data");
  }
}
function decryptFormData(encryptedData) {
  try {
    const key = getEncryptionKey();
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error("Failed to decrypt data");
    }
    const processedData = JSON.parse(decryptedText);
    Object.keys(processedData).forEach((fieldName) => {
      if (processedData[fieldName] && typeof processedData[fieldName] === "object" && processedData[fieldName]._encrypted) {
        const fieldDecryptedBytes = CryptoJS.AES.decrypt(
          processedData[fieldName].value,
          key
        );
        const fieldDecryptedText = fieldDecryptedBytes.toString(CryptoJS.enc.Utf8);
        if (fieldDecryptedText) {
          processedData[fieldName] = JSON.parse(fieldDecryptedText);
        } else {
          delete processedData[fieldName];
        }
      }
    });
    return processedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt form data");
  }
}
function saveSecureData(key, data) {
  try {
    const encrypted = encryptFormData(data);
    const checksum = CryptoJS.SHA256(encrypted).toString();
    const storageData = {
      data: encrypted,
      timestamp: Date.now(),
      version: "1.0",
      checksum
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error("Error saving secure data:", error);
  }
}
function loadSecureData(key) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const storageData = JSON.parse(stored);
    const checksum = CryptoJS.SHA256(storageData.data).toString();
    if (checksum !== storageData.checksum) {
      console.error("Data integrity check failed");
      localStorage.removeItem(key);
      return null;
    }
    const maxAge = 24 * 60 * 60 * 1e3;
    if (Date.now() - storageData.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    return decryptFormData(storageData.data);
  } catch (error) {
    console.error("Error loading secure data:", error);
    localStorage.removeItem(key);
    return null;
  }
}
function clearSecureData(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing secure data:", error);
  }
}
function isEncryptionSupported() {
  try {
    const testData = "test";
    const encrypted = CryptoJS.AES.encrypt(testData, "test-key").toString();
    const decrypted = CryptoJS.AES.decrypt(encrypted, "test-key").toString(CryptoJS.enc.Utf8);
    return decrypted === testData && typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

const initialFormState = {
  currentStep: 1,
  data: {},
  completedSteps: [],
  errors: {}
};
const OrderFormContext = createContext(void 0);
const STORAGE_KEY = "1031_order_form_progress";
const SESSION_KEY = "1031_order_form_session";
const OrderFormProvider = ({
  children,
  onSuccess,
  onError
}) => {
  const [formState, setFormState] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    let savedSessionId = sessionStorage.getItem(SESSION_KEY);
    if (!savedSessionId) {
      savedSessionId = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, savedSessionId);
    }
    setSessionId(savedSessionId);
    try {
      if (isEncryptionSupported()) {
        const decryptedData = loadSecureData(STORAGE_KEY);
        if (decryptedData && decryptedData.formState) {
          setFormState(decryptedData.formState);
          console.log("Loaded encrypted form progress");
        }
      } else {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1e3) {
            setFormState(parsed.formState);
            console.log("Loaded unencrypted form progress (fallback mode)");
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (err) {
      console.error("Error loading saved progress:", err);
      clearSecureData(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  const saveProgress = useCallback((state) => {
    try {
      const dataToSave = {
        formState: state,
        timestamp: Date.now(),
        sessionId
      };
      if (isEncryptionSupported()) {
        saveSecureData(STORAGE_KEY, dataToSave);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  }, [sessionId]);
  const updateField = useCallback((field, value) => {
    setFormState((prev) => {
      const newState = {
        ...prev,
        data: {
          ...prev.data,
          [field]: value
        },
        errors: {
          ...prev.errors,
          [field]: void 0
          // Clear error when field is updated
        }
      };
      saveProgress(newState);
      if (typeof window !== "undefined" && window.trackOrderFormEvent) {
        window.trackOrderFormEvent("field_changed", {
          step: prev.currentStep,
          field,
          sessionId
        });
      }
      return newState;
    });
  }, [saveProgress, sessionId]);
  const validateCurrentStep = useCallback(() => {
    const result = validateStep(formState.currentStep, formState.data);
    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      setFormState((prev) => ({
        ...prev,
        errors
      }));
      return false;
    }
    setFormState((prev) => ({
      ...prev,
      errors: {}
    }));
    return true;
  }, [formState.currentStep, formState.data]);
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      setError("Please correct the errors before continuing");
      return;
    }
    setError(null);
    setFormState((prev) => {
      const nextStepNum = Math.min(prev.currentStep + 1, 6);
      const newCompletedSteps = prev.completedSteps.includes(prev.currentStep) ? prev.completedSteps : [...prev.completedSteps, prev.currentStep];
      const newState = {
        ...prev,
        currentStep: nextStepNum,
        completedSteps: newCompletedSteps
      };
      saveProgress(newState);
      if (typeof window !== "undefined" && window.trackOrderFormEvent) {
        window.trackOrderFormEvent("step_completed", {
          step: prev.currentStep,
          sessionId
        });
      }
      return newState;
    });
  }, [validateCurrentStep, saveProgress, sessionId]);
  const previousStep = useCallback(() => {
    setError(null);
    setFormState((prev) => {
      const prevStepNum = Math.max(prev.currentStep - 1, 1);
      const newState = {
        ...prev,
        currentStep: prevStepNum
      };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);
  const goToStep = useCallback((step) => {
    const canGoToStep = formState.completedSteps.includes(step) || step === formState.completedSteps.length + 1;
    if (!canGoToStep) {
      setError("Please complete the previous steps first");
      return;
    }
    setError(null);
    setFormState((prev) => ({
      ...prev,
      currentStep: step
    }));
  }, [formState.completedSteps]);
  const submitForm = useCallback(async () => {
    for (let step = 1; step <= 6; step++) {
      const result = validateStep(step, formState.data);
      if (!result.success) {
        setError(`Please complete step ${step} before submitting`);
        goToStep(step);
        return;
      }
    }
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined" && window.trackOrderFormEvent) {
        window.trackOrderFormEvent("form_submitted", {
          sessionId,
          urgencyLevel: formState.data["1031x_order_urgency_level"]
        });
      }
      const orderFormService = new OrderFormService();
      const submissionId = await orderFormService.submitOrderForm(
        formState.data,
        {
          sessionId,
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : void 0,
          ipAddress: void 0,
          // Would need to get from server
          formCompletionTime: void 0
          // Could track this if needed
        }
      );
      if (isEncryptionSupported()) {
        clearSecureData(STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      sessionStorage.removeItem(SESSION_KEY);
      if (onSuccess) {
        onSuccess(submissionId);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while submitting your information. Please try again.");
      if (onError) {
        onError(err);
      }
      if (typeof window !== "undefined" && window.trackOrderFormEvent) {
        window.trackOrderFormEvent("error_occurred", {
          step: formState.currentStep,
          error: err.message,
          sessionId
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formState.data, sessionId, goToStep, onSuccess, onError]);
  const canGoNext = useMemo(() => {
    if (formState.currentStep >= 6) return false;
    const data = formState.data;
    if (formState.currentStep === 2) {
      const hasAddress = data["1031x_order_property_address"] && data["1031x_order_property_address"].length >= 5;
      const hasCity = data["1031x_order_property_city"] && data["1031x_order_property_city"].length >= 2;
      const hasState = data["1031x_order_property_state"] && data["1031x_order_property_state"].length === 2;
      const hasZip = data["1031x_order_property_zip"] && /^\d{5}(-\d{4})?$/.test(data["1031x_order_property_zip"]);
      const hasType = data["1031x_order_property_type"] && data["1031x_order_property_type"] !== "";
      const hasPrice = data["1031x_order_sale_price"] && data["1031x_order_sale_price"] >= 1e4;
      return hasAddress && hasCity && hasState && hasZip && hasType && hasPrice;
    }
    try {
      const result = validateStep(formState.currentStep, formState.data);
      return result.success;
    } catch (error2) {
      console.error("Validation error:", error2);
      return false;
    }
  }, [formState.currentStep, formState.data]);
  const canGoPrevious = formState.currentStep > 1;
  const contextValue = {
    formState,
    updateField,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    isLoading,
    error,
    canGoNext,
    canGoPrevious
  };
  return /* @__PURE__ */ jsxDEV(OrderFormContext.Provider, { value: contextValue, children }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderFormContext.tsx",
    lineNumber: 393,
    columnNumber: 5
  }, undefined);
};
const useOrderForm = () => {
  const context = useContext(OrderFormContext);
  if (context === void 0) {
    throw new Error("useOrderForm must be used within an OrderFormProvider");
  }
  return context;
};

const stepLabels = {
  1: "Basic Info",
  2: "Property Details",
  3: "Timeline",
  4: "Exchange Goals",
  5: "Your Team",
  6: "Preferences"
};
const stepDescriptions = {
  1: "Contact information",
  2: "Property being sold",
  3: "Important dates",
  4: "Exchange strategy",
  5: "Professional team",
  6: "Service preferences"
};
const ProgressIndicator = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps = [1, 2, 3, 4, 5, 6];
  const getStepStatus = (step) => {
    if (step === currentStep) return "current";
    if (completedSteps.includes(step)) return "completed";
    return "upcoming";
  };
  const isClickable = (step) => {
    return completedSteps.includes(step) || step === completedSteps.length + 1;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV(
      "div",
      {
        style: { width: `${completedSteps.length / 6 * 100}%` },
        className: "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-900 transition-all duration-500 ease-out"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
        lineNumber: 67,
        columnNumber: 9
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-6", children: /* @__PURE__ */ jsxDEV("span", { className: "text-sm text-gray-600", children: [
      "Step ",
      currentStep,
      " of 6"
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 75,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 74,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-8", children: steps.map((step, index) => {
      const status = getStepStatus(step);
      const clickable = isClickable(step);
      return /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: "relative",
          children: [
            index < steps.length - 1 && /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: `
                      absolute top-5 left-full w-8 h-0.5
                      ${completedSteps.includes(step) ? "bg-blue-900" : "bg-gray-300"}
                    `
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                lineNumber: 95,
                columnNumber: 19
              },
              undefined
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => clickable && onStepClick?.(step),
                disabled: !clickable || !onStepClick,
                className: `
                    text-center
                    ${clickable && onStepClick ? "cursor-pointer" : "cursor-default"}
                  `,
                children: /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      className: `
                          relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                          transition-all duration-200
                          ${status === "completed" ? "bg-blue-900 text-white" : ""}
                          ${status === "current" ? "bg-yellow-400 text-blue-900 ring-4 ring-yellow-200" : ""}
                          ${status === "upcoming" ? "bg-gray-200 text-gray-500" : ""}
                          ${clickable && onStepClick ? "hover:ring-2 hover:ring-blue-500" : ""}
                        `,
                      children: status === "completed" ? /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
                        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                        lineNumber: 127,
                        columnNumber: 29
                      }, undefined) }, void 0, false, {
                        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                        lineNumber: 126,
                        columnNumber: 27
                      }, undefined) : /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-semibold", children: step }, void 0, false, {
                        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                        lineNumber: 130,
                        columnNumber: 27
                      }, undefined)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                      lineNumber: 115,
                      columnNumber: 23
                    },
                    undefined
                  ) }, void 0, false, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                    lineNumber: 114,
                    columnNumber: 21
                  }, undefined),
                  /* @__PURE__ */ jsxDEV("div", { className: "mt-2 text-center w-24", children: [
                    /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        className: `
                          text-xs font-medium
                          ${status === "current" ? "text-blue-900" : "text-gray-600"}
                        `,
                        children: stepLabels[step]
                      },
                      void 0,
                      false,
                      {
                        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                        lineNumber: 137,
                        columnNumber: 23
                      },
                      undefined
                    ),
                    /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-500 mt-0.5 h-8 flex items-start justify-center", children: /* @__PURE__ */ jsxDEV("span", { children: stepDescriptions[step] }, void 0, false, {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                      lineNumber: 146,
                      columnNumber: 25
                    }, undefined) }, void 0, false, {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                      lineNumber: 145,
                      columnNumber: 23
                    }, undefined)
                  ] }, void 0, true, {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                    lineNumber: 136,
                    columnNumber: 21
                  }, undefined)
                ] }, void 0, true, {
                  fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                  lineNumber: 111,
                  columnNumber: 19
                }, undefined)
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
                lineNumber: 103,
                columnNumber: 17
              },
              undefined
            )
          ]
        },
        step,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 89,
          columnNumber: 15
        },
        undefined
      );
    }) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 83,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 82,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "md:hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: currentStep > 1 && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-500", children: [
          "Previous: ",
          stepLabels[currentStep - 1]
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 164,
          columnNumber: 15
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 162,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-semibold text-blue-900", children: stepLabels[currentStep] }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
            lineNumber: 172,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-600", children: stepDescriptions[currentStep] }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
            lineNumber: 175,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: currentStep < 6 && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-500", children: [
          "Next: ",
          stepLabels[currentStep + 1]
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 183,
          columnNumber: 15
        }, undefined) }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
        lineNumber: 160,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center space-x-2", children: steps.map((step) => {
        const status = getStepStatus(step);
        return /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => isClickable(step) && onStepClick?.(step),
            disabled: !isClickable(step) || !onStepClick,
            className: `
                  w-2 h-2 rounded-full transition-all duration-200
                  ${status === "completed" ? "bg-blue-900 w-8" : ""}
                  ${status === "current" ? "bg-yellow-400 w-8" : ""}
                  ${status === "upcoming" ? "bg-gray-300" : ""}
                `,
            "aria-label": `Go to ${stepLabels[step]}`
          },
          step,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
            lineNumber: 196,
            columnNumber: 15
          },
          undefined
        );
      }) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
        lineNumber: 191,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
      lineNumber: 159,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/ProgressIndicator.tsx",
    lineNumber: 64,
    columnNumber: 5
  }, undefined);
};

const StepNavigation = ({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onSubmit,
  isLoading = false,
  isLastStep = false,
  nextButtonText = "Continue",
  previousButtonText = "Back"
}) => {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      onNext();
    }
  };
  const getNextButtonText = () => {
    if (isLoading) return "Processing...";
    if (isLastStep) return "Submit Application";
    return nextButtonText;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "mt-8 pt-6 border-t border-gray-200", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: /* @__PURE__ */ jsxDEV("span", { className: "flex items-center justify-center", children: [
      /* @__PURE__ */ jsxDEV(
        "svg",
        {
          className: "w-4 h-4 mr-1 text-green-500",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxDEV(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M5 13l4 4L19 7"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
              lineNumber: 65,
              columnNumber: 15
            },
            undefined
          )
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
          lineNumber: 59,
          columnNumber: 13
        },
        undefined
      ),
      "Progress saved automatically"
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
      lineNumber: 58,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-center items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: onPrevious,
          disabled: !canGoPrevious || isLoading,
          className: `
            w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${canGoPrevious && !isLoading ? "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300" : "bg-gray-50 text-gray-400 cursor-not-allowed"}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          `,
          children: /* @__PURE__ */ jsxDEV("span", { className: "flex items-center justify-center", children: [
            /* @__PURE__ */ jsxDEV(
              "svg",
              {
                className: "w-5 h-5 mr-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxDEV(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M15 19l-7-7 7-7"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                    lineNumber: 100,
                    columnNumber: 15
                  },
                  undefined
                )
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                lineNumber: 94,
                columnNumber: 13
              },
              undefined
            ),
            previousButtonText
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
            lineNumber: 93,
            columnNumber: 11
          }, undefined)
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
          lineNumber: 80,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: handleNext,
          disabled: isLoading || !canGoNext && !isLastStep,
          className: `
            w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isLoading || !canGoNext && !isLastStep ? "bg-gray-300 text-gray-500 cursor-not-allowed" : isLastStep ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500" : "bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-700 focus:ring-blue-500"}
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `,
          children: /* @__PURE__ */ jsxDEV("span", { className: "flex items-center justify-center", children: isLoading ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV(
              "svg",
              {
                className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsxDEV(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                      lineNumber: 135,
                      columnNumber: 19
                    },
                    undefined
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                      lineNumber: 143,
                      columnNumber: 19
                    },
                    undefined
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                lineNumber: 130,
                columnNumber: 17
              },
              undefined
            ),
            getNextButtonText()
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
            lineNumber: 129,
            columnNumber: 15
          }, undefined) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
            getNextButtonText(),
            !isLastStep && /* @__PURE__ */ jsxDEV(
              "svg",
              {
                className: "w-5 h-5 ml-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxDEV(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M9 5l7 7-7 7"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                    lineNumber: 161,
                    columnNumber: 21
                  },
                  undefined
                )
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                lineNumber: 155,
                columnNumber: 19
              },
              undefined
            ),
            isLastStep && /* @__PURE__ */ jsxDEV(
              "svg",
              {
                className: "w-5 h-5 ml-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxDEV(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                    lineNumber: 176,
                    columnNumber: 21
                  },
                  undefined
                )
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
                lineNumber: 170,
                columnNumber: 19
              },
              undefined
            )
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
            lineNumber: 152,
            columnNumber: 15
          }, undefined) }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
            lineNumber: 127,
            columnNumber: 11
          }, undefined)
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
          lineNumber: 112,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
      lineNumber: 78,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/StepNavigation.tsx",
    lineNumber: 54,
    columnNumber: 5
  }, undefined);
};

const FieldError = ({ error, fieldId }) => {
  if (!error) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      role: "alert",
      "aria-live": "polite",
      id: fieldId ? `${fieldId}-error` : void 0,
      className: "mt-1 text-sm text-red-600 flex items-start",
      children: [
        /* @__PURE__ */ jsxDEV(
          "svg",
          {
            className: "w-4 h-4 mr-1 flex-shrink-0 mt-0.5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsxDEV(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              void 0,
              false,
              {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/FieldError.tsx",
                lineNumber: 37,
                columnNumber: 9
              },
              undefined
            )
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/FieldError.tsx",
            lineNumber: 31,
            columnNumber: 7
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("span", { children: error }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/FieldError.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, undefined)
      ]
    },
    void 0,
    true,
    {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/FieldError.tsx",
      lineNumber: 25,
      columnNumber: 5
    },
    undefined
  );
};

const PrivacyNotice = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  useEffect(() => {
    setEncryptionEnabled(isEncryptionSupported());
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-4 rounded-lg text-sm", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
    /* @__PURE__ */ jsxDEV(
      "svg",
      {
        className: "w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsxDEV(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 31,
            columnNumber: 11
          },
          undefined
        )
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 25,
        columnNumber: 9
      },
      undefined
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-blue-900 font-medium mb-1", children: "Your Information is Secure" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 39,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-blue-800", children: encryptionEnabled ? /* @__PURE__ */ jsxDEV(Fragment, { children: "Your data is encrypted and saved locally in your browser. We never store sensitive information on our servers." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 44,
        columnNumber: 15
      }, undefined) : /* @__PURE__ */ jsxDEV(Fragment, { children: "Your progress is saved locally in your browser. We never store sensitive information on our servers." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 46,
        columnNumber: 15
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 42,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setShowDetails(!showDetails),
          className: "text-blue-700 hover:text-blue-900 underline mt-2 text-sm",
          children: [
            showDetails ? "Hide" : "Learn more about",
            " our security measures"
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
          lineNumber: 50,
          columnNumber: 11
        },
        undefined
      ),
      showDetails && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 pt-3 border-t border-blue-200", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "font-medium text-blue-900 mb-2", children: "Security Features:" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
          lineNumber: 60,
          columnNumber: 15
        }, undefined),
        /* @__PURE__ */ jsxDEV("ul", { className: "space-y-1 text-blue-800", children: [
          /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600 mr-2", children: "✓" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 63,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { children: encryptionEnabled ? "AES-256 encryption for all sensitive data" : "Secure browser storage for form progress" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 64,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 62,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600 mr-2", children: "✓" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 72,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { children: "Data automatically expires after 24 hours" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 73,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 71,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600 mr-2", children: "✓" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 76,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { children: "No sensitive data transmitted until final submission" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 77,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 75,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600 mr-2", children: "✓" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 80,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { children: "HTTPS encryption for all data transmission" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 81,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 79,
            columnNumber: 17
          }, undefined),
          /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-green-600 mr-2", children: "✓" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 84,
              columnNumber: 19
            }, undefined),
            /* @__PURE__ */ jsxDEV("span", { children: "Compliant with data protection regulations" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
              lineNumber: 85,
              columnNumber: 19
            }, undefined)
          ] }, void 0, true, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
            lineNumber: 83,
            columnNumber: 17
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
          lineNumber: 61,
          columnNumber: 15
        }, undefined),
        !encryptionEnabled && /* @__PURE__ */ jsxDEV("p", { className: "mt-3 text-xs text-blue-700 italic", children: "Note: Your browser doesn't support advanced encryption features. Your data is still protected by browser security measures." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
          lineNumber: 90,
          columnNumber: 17
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
        lineNumber: 59,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
    lineNumber: 24,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/components/PrivacyNotice.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, undefined);
};

function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(userAgent) && width < 768) {
    return "mobile";
  }
  if (/ipad|tablet/.test(userAgent) || width >= 768 && width < 1024) {
    return "tablet";
  }
  return "desktop";
}
function getUTMParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utmParams = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  return utmParams;
}
class OrderFormAnalytics {
  startTime;
  stepStartTimes = /* @__PURE__ */ new Map();
  fieldInteractions = /* @__PURE__ */ new Map();
  constructor() {
    this.startTime = Date.now();
  }
  // ============================================
  // Step Tracking
  // ============================================
  trackStepStart(step, sessionId) {
    this.stepStartTimes.set(step, Date.now());
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      referrer: document.referrer,
      source: getUTMParams().utm_source
    };
    this.sendEvent("order_form_step_started", event);
  }
  trackStepComplete(step, sessionId) {
    const startTime = this.stepStartTimes.get(step);
    const timeOnStep = startTime ? Date.now() - startTime : void 0;
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      timeOnStep
    };
    this.sendEvent("order_form_step_completed", event);
  }
  // ============================================
  // Field Tracking
  // ============================================
  trackFieldInteraction(field, interactionType, step, sessionId) {
    const key = `${field}_${interactionType}`;
    this.fieldInteractions.set(key, (this.fieldInteractions.get(key) || 0) + 1);
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      field,
      fieldType: this.getFieldType(field),
      interactionType
    };
    this.sendEvent("order_form_field_interaction", event);
  }
  // ============================================
  // Form Submission
  // ============================================
  trackFormSubmission(sessionId, formData, completedSteps) {
    const completionTime = Date.now() - this.startTime;
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      completionTime,
      stepsVisited: completedSteps,
      urgencyLevel: formData["1031x_urgency_level"],
      exchangeType: formData["1031x_exchange_type"],
      ...getUTMParams()
    };
    this.sendEvent("order_form_submitted", event);
    if (typeof window !== "undefined" && window.trackConversion) {
      window.trackConversion("order_form", {
        urgencyLevel: formData["1031x_urgency_level"],
        exchangeType: formData["1031x_exchange_type"]
      });
    }
  }
  // ============================================
  // Error Tracking
  // ============================================
  trackError(errorType, errorMessage, sessionId, step, field) {
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      field,
      errorType,
      errorMessage
    };
    this.sendEvent("order_form_error", event);
  }
  // ============================================
  // Abandonment Tracking
  // ============================================
  trackAbandonment(lastStep, completedSteps, sessionId, lastField) {
    const timeSpent = Date.now() - this.startTime;
    const event = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      lastStep,
      completedSteps,
      timeSpent,
      lastField
    };
    this.sendEvent("order_form_abandoned", event);
  }
  // ============================================
  // Utility Methods
  // ============================================
  getFieldType(field) {
    const fieldTypeMap = {
      "1031x_email": "email",
      "1031x_phone": "phone",
      "1031x_sale_price": "number",
      "1031x_mortgage_balance": "number",
      "1031x_closing_date": "date",
      "1031x_expected_listing_date": "date",
      "1031x_additional_notes": "textarea"
    };
    return fieldTypeMap[field] || "text";
  }
  sendEvent(eventName, eventData) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, eventData);
    }
    if (typeof window !== "undefined" && window.trackHighLevelEvent) {
      window.trackHighLevelEvent(eventName, eventData);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(`[OrderForm Analytics] ${eventName}:`, eventData);
    }
  }
  // ============================================
  // Performance Metrics
  // ============================================
  getFormMetrics() {
    const totalTime = Date.now() - this.startTime;
    const stepTimes = {};
    this.stepStartTimes.forEach((startTime, step) => {
      stepTimes[step] = Date.now() - startTime;
    });
    const fieldInteractionCounts = {};
    this.fieldInteractions.forEach((count, field) => {
      fieldInteractionCounts[field] = count;
    });
    return {
      totalTime,
      stepTimes,
      fieldInteractionCounts
    };
  }
}
let analyticsInstance = null;
function getOrderFormAnalytics() {
  if (!analyticsInstance) {
    analyticsInstance = new OrderFormAnalytics();
  }
  return analyticsInstance;
}
function useOrderFormAnalytics() {
  return getOrderFormAnalytics();
}
if (typeof window !== "undefined") {
  window.trackOrderFormEvent = (eventType, data) => {
    const analytics = getOrderFormAnalytics();
    switch (eventType) {
      case "step_started":
        analytics.trackStepStart(data.step, data.sessionId);
        break;
      case "step_completed":
        analytics.trackStepComplete(data.step, data.sessionId);
        break;
      case "field_changed":
        analytics.trackFieldInteraction(data.field, "change", data.step, data.sessionId);
        break;
      case "form_submitted":
        analytics.trackFormSubmission(data.sessionId, data.formData || {}, data.completedSteps || []);
        break;
      case "error_occurred":
        analytics.trackError(data.errorType || "unknown", data.error, data.sessionId, data.step, data.field);
        break;
      case "form_abandoned":
        analytics.trackAbandonment(data.lastStep, data.completedSteps || [], data.sessionId, data.lastField);
        break;
    }
  };
}

const BasicInfoStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(1, sessionId);
  }, [analytics]);
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    updateField("1031x_order_phone", formatted);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Let's Get Started" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Tell us about yourself" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
        lineNumber: 50,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "first-name",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "First Name ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
                lineNumber: 62,
                columnNumber: 24
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 58,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "first-name",
            type: "text",
            value: formState.data["1031x_order_first_name"] || "",
            onChange: (e) => handleInputChange("1031x_order_first_name", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_first_name", "focus", 1, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_first_name"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "John",
            "aria-describedby": formState.errors["1031x_order_first_name"] ? "first-name-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_first_name"],
            suppressHydrationWarning: true
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 64,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_first_name"],
            fieldId: "first-name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 84,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
        lineNumber: 57,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "last-name",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "Last Name ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
                lineNumber: 96,
                columnNumber: 23
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 92,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "last-name",
            type: "text",
            value: formState.data["1031x_order_last_name"] || "",
            onChange: (e) => handleInputChange("1031x_order_last_name", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_last_name", "focus", 1, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_last_name"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "Smith",
            "aria-describedby": formState.errors["1031x_order_last_name"] ? "last-name-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_last_name"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 98,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_last_name"],
            fieldId: "last-name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
            lineNumber: 117,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Email Address ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 130,
              columnNumber: 25
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 126,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          id: "email",
          type: "email",
          value: formState.data["1031x_order_email"] || "",
          onChange: (e) => handleInputChange("1031x_order_email", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_email", "focus", 1, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_email"] ? "border-red-500" : "border-gray-300"}
          `,
          placeholder: "john@example.com",
          "aria-describedby": formState.errors["1031x_order_email"] ? "email-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_email"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 132,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_email"],
          fieldId: "email"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 151,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "phone",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Phone Number ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 163,
              columnNumber: 24
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 159,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          id: "phone",
          type: "tel",
          value: formState.data["1031x_order_phone"] || "",
          onChange: (e) => handlePhoneChange(e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_phone", "focus", 1, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_phone"] ? "border-red-500" : "border-gray-300"}
          `,
          placeholder: "(555) 123-4567",
          maxLength: 14,
          "aria-describedby": formState.errors["1031x_order_phone"] ? "phone-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_phone"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 165,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_phone"],
          fieldId: "phone"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 185,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "contact-preference",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Preferred Contact Method ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 197,
              columnNumber: 36
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 193,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "contact-preference",
          value: formState.data["1031x_order_preferred_contact"] || "",
          onChange: (e) => handleInputChange("1031x_order_preferred_contact", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_preferred_contact", "focus", 1, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_preferred_contact"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_preferred_contact"] ? "contact-preference-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_preferred_contact"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select preference..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 216,
              columnNumber: 11
            }, undefined),
            /* @__PURE__ */ jsxDEV("option", { value: "phone", children: "Phone" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 217,
              columnNumber: 11
            }, undefined),
            /* @__PURE__ */ jsxDEV("option", { value: "email", children: "Email" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 218,
              columnNumber: 11
            }, undefined),
            /* @__PURE__ */ jsxDEV("option", { value: "text", children: "Text Message" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 219,
              columnNumber: 11
            }, undefined),
            /* @__PURE__ */ jsxDEV("option", { value: "no_preference", children: "No Preference" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
              lineNumber: 220,
              columnNumber: 11
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 199,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_preferred_contact"],
          fieldId: "contact-preference"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
          lineNumber: 222,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 192,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV(PrivacyNotice, {}, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
      lineNumber: 229,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/BasicInfoStep.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, undefined);
};

const propertyTypes = [
  { value: "single_family_rental", label: "Single Family Rental" },
  { value: "multi_family_2_4", label: "Multi-Family (2-4 units)" },
  { value: "apartment_5_plus", label: "Apartment Building (5+ units)" },
  { value: "office", label: "Office Building" },
  { value: "retail", label: "Retail Property" },
  { value: "industrial", label: "Industrial/Warehouse" },
  { value: "land", label: "Land/Vacant Lot" },
  { value: "mixed_use", label: "Mixed Use" },
  { value: "other", label: "Other Investment Property" }
];
const PropertyDetailsStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(2, sessionId);
  }, [analytics]);
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  const handleNumberChange = (field, value) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const numValue = cleaned === "" ? void 0 : parseFloat(cleaned);
    updateField(field, numValue);
  };
  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toLocaleString("en-US");
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Property You're Selling" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Details about your relinquished property" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "property-address",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Property Street Address ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 78,
              columnNumber: 35
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 74,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          id: "property-address",
          type: "text",
          value: formState.data["1031x_order_property_address"] || "",
          onChange: (e) => handleInputChange("1031x_order_property_address", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_property_address", "focus", 2, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_property_address"] ? "border-red-500" : "border-gray-300"}
          `,
          placeholder: "123 Main Street",
          "aria-describedby": formState.errors["1031x_order_property_address"] ? "property-address-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_property_address"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 80,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_property_address"],
          fieldId: "property-address"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 99,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "property-city",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "City ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 113,
                columnNumber: 18
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 109,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "property-city",
            type: "text",
            value: formState.data["1031x_order_property_city"] || "",
            onChange: (e) => handleInputChange("1031x_order_property_city", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_property_city", "focus", 2, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_property_city"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "San Francisco",
            "aria-describedby": formState.errors["1031x_order_property_city"] ? "property-city-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_property_city"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 115,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_property_city"],
            fieldId: "property-city"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 134,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 108,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "property-state",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "State ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 146,
                columnNumber: 19
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 142,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            id: "property-state",
            value: formState.data["1031x_order_property_state"] || "",
            onChange: (e) => handleInputChange("1031x_order_property_state", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_property_state", "focus", 2, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_property_state"] ? "border-red-500" : "border-gray-300"}
            `,
            "aria-describedby": formState.errors["1031x_order_property_state"] ? "property-state-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_property_state"],
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select state..." }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 165,
                columnNumber: 13
              }, undefined),
              Object.entries(stateNames).map(([abbr, name]) => /* @__PURE__ */ jsxDEV("option", { value: abbr, children: name }, abbr, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 167,
                columnNumber: 15
              }, undefined))
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 148,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_property_state"],
            fieldId: "property-state"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 170,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "property-zip",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "ZIP Code ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 182,
                columnNumber: 22
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 178,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "property-zip",
            type: "text",
            value: formState.data["1031x_order_property_zip"] || "",
            onChange: (e) => handleInputChange("1031x_order_property_zip", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_property_zip", "focus", 2, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_property_zip"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "94105",
            maxLength: 10,
            "aria-describedby": formState.errors["1031x_order_property_zip"] ? "property-zip-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_property_zip"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 184,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_property_zip"],
            fieldId: "property-zip"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 204,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 177,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "property-type",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Property Type ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 217,
              columnNumber: 25
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 213,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "property-type",
          value: formState.data["1031x_order_property_type"] || "",
          onChange: (e) => handleInputChange("1031x_order_property_type", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_property_type", "focus", 2, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_property_type"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_property_type"] ? "property-type-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_property_type"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select property type..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 236,
              columnNumber: 11
            }, undefined),
            propertyTypes.map((type) => /* @__PURE__ */ jsxDEV("option", { value: type.value, children: type.label }, type.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 238,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 219,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_property_type"],
          fieldId: "property-type"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 241,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 212,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "sale-price",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: [
              "Expected Sale Price ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
                fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
                lineNumber: 255,
                columnNumber: 33
              }, undefined)
            ]
          },
          void 0,
          true,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 251,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 258,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "sale-price",
              type: "text",
              value: formatCurrency(formState.data["1031x_order_sale_price"]),
              onChange: (e) => handleNumberChange("1031x_order_sale_price", e.target.value),
              onFocus: () => {
                const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
                analytics.trackFieldInteraction("1031x_order_sale_price", "focus", 2, sessionId);
              },
              className: `
                w-full pl-8 pr-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors["1031x_order_sale_price"] ? "border-red-500" : "border-gray-300"}
              `,
              placeholder: "1,000,000",
              "aria-describedby": formState.errors["1031x_order_sale_price"] ? "sale-price-error" : void 0,
              "aria-invalid": !!formState.errors["1031x_order_sale_price"]
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 259,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 257,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_sale_price"],
            fieldId: "sale-price"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 279,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 250,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "mortgage-balance",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Current Mortgage Balance (optional)"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 287,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "$" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 294,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "mortgage-balance",
              type: "text",
              value: formatCurrency(formState.data["1031x_order_mortgage_balance"]),
              onChange: (e) => handleNumberChange("1031x_order_mortgage_balance", e.target.value),
              onFocus: () => {
                const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
                analytics.trackFieldInteraction("1031x_order_mortgage_balance", "focus", 2, sessionId);
              },
              className: `
                w-full pl-8 pr-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors["1031x_order_mortgage_balance"] ? "border-red-500" : "border-gray-300"}
              `,
              placeholder: "400,000",
              "aria-describedby": formState.errors["1031x_order_mortgage_balance"] ? "mortgage-balance-error" : void 0,
              "aria-invalid": !!formState.errors["1031x_order_mortgage_balance"]
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
              lineNumber: 295,
              columnNumber: 13
            },
            undefined
          )
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
          lineNumber: 293,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_mortgage_balance"],
            fieldId: "mortgage-balance"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
            lineNumber: 315,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 286,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 248,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-blue-900", children: [
      /* @__PURE__ */ jsxDEV("strong", { children: "Note:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
        lineNumber: 325,
        columnNumber: 11
      }, undefined),
      " The sale price and mortgage information help us calculate your potential tax savings and determine the best exchange strategy for your situation."
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 324,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
      lineNumber: 323,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/PropertyDetailsStep.tsx",
    lineNumber: 62,
    columnNumber: 5
  }, undefined);
};

const contractStatuses = [
  { value: "not_listed", label: "Not listed yet" },
  { value: "listed_no_offers", label: "Listed, no offers" },
  { value: "accepted_offer", label: "Have accepted offer" },
  { value: "in_escrow", label: "In escrow" },
  { value: "closing_scheduled", label: "Closing scheduled" }
];
const urgencyLevels = [
  { value: "planning_3_plus", label: "Planning ahead (3+ months)" },
  { value: "getting_ready_1_3", label: "Getting ready (1-3 months)" },
  { value: "time_sensitive_1", label: "Time sensitive (< 1 month)" },
  { value: "urgent_2_weeks", label: "Urgent (< 2 weeks)" }
];
const TimelineStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(3, sessionId);
  }, [analytics]);
  const showClosingDate = formState.data["1031x_order_contract_status"] === "in_escrow" || formState.data["1031x_order_contract_status"] === "closing_scheduled";
  const showListingDate = formState.data["1031x_order_contract_status"] === "not_listed";
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const getUrgencyMessage = () => {
    const urgencyLevel = formState.data["1031x_order_urgency_level"];
    switch (urgencyLevel) {
      case "urgent_2_weeks":
        return {
          type: "urgent",
          message: "Time is critical! We'll prioritize your exchange and contact you within 24 hours."
        };
      case "time_sensitive_1":
        return {
          type: "warning",
          message: "You're approaching important deadlines. Let's start your exchange process soon."
        };
      case "getting_ready_1_3":
        return {
          type: "info",
          message: "Good timing! You have time to plan your exchange strategy properly."
        };
      case "planning_3_plus":
        return {
          type: "success",
          message: "Excellent planning! Starting early gives you the most flexibility."
        };
      default:
        return null;
    }
  };
  const urgencyMessage = getUrgencyMessage();
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Important Dates" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 90,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Critical deadlines for your exchange" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "contract-status",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "What's the current status of your property? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 104,
              columnNumber: 55
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 100,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "contract-status",
          value: formState.data["1031x_order_contract_status"] || "",
          onChange: (e) => handleInputChange("1031x_order_contract_status", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_contract_status", "focus", 3, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_contract_status"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_contract_status"] ? "contract-status-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_contract_status"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select status..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 123,
              columnNumber: 11
            }, undefined),
            contractStatuses.map((status) => /* @__PURE__ */ jsxDEV("option", { value: status.value, children: status.label }, status.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 125,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 106,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_contract_status"],
          fieldId: "contract-status"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 128,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, undefined),
    showClosingDate && /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "closing-date",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Closing Date ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 141,
              columnNumber: 26
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 137,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          id: "closing-date",
          type: "date",
          value: formState.data["1031x_order_closing_date"] || "",
          onChange: (e) => handleInputChange("1031x_order_closing_date", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_closing_date", "focus", 3, sessionId);
          },
          min: today,
          className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_closing_date"] ? "border-red-500" : "border-gray-300"}
            `,
          "aria-describedby": formState.errors["1031x_order_closing_date"] ? "closing-date-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_closing_date"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 143,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_closing_date"],
          fieldId: "closing-date"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 162,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-gray-500", children: "Your 45-day identification period will start on this date" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 166,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 136,
      columnNumber: 9
    }, undefined),
    showListingDate && /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "listing-date",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Expected Listing Date ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 178,
              columnNumber: 35
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 174,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          id: "listing-date",
          type: "date",
          value: formState.data["1031x_order_expected_listing_date"] || "",
          onChange: (e) => handleInputChange("1031x_order_expected_listing_date", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_expected_listing_date", "focus", 3, sessionId);
          },
          min: today,
          className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_expected_listing_date"] ? "border-red-500" : "border-gray-300"}
            `,
          "aria-describedby": formState.errors["1031x_order_expected_listing_date"] ? "listing-date-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_expected_listing_date"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 180,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_expected_listing_date"],
          fieldId: "listing-date"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 199,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 173,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "urgency-level",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "How soon do you need to complete your exchange? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 212,
              columnNumber: 59
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 208,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "urgency-level",
          value: formState.data["1031x_order_urgency_level"] || "",
          onChange: (e) => handleInputChange("1031x_order_urgency_level", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_urgency_level", "focus", 3, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_urgency_level"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_urgency_level"] ? "urgency-level-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_urgency_level"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select timeframe..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 231,
              columnNumber: 11
            }, undefined),
            urgencyLevels.map((level) => /* @__PURE__ */ jsxDEV("option", { value: level.value, children: level.label }, level.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
              lineNumber: 233,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 214,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_urgency_level"],
          fieldId: "urgency-level"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 236,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 207,
      columnNumber: 7
    }, undefined),
    urgencyMessage && /* @__PURE__ */ jsxDEV("div", { className: `
          p-4 rounded-lg border
          ${urgencyMessage.type === "urgent" ? "bg-red-50 border-red-200" : ""}
          ${urgencyMessage.type === "warning" ? "bg-yellow-50 border-yellow-200" : ""}
          ${urgencyMessage.type === "info" ? "bg-blue-50 border-blue-200" : ""}
          ${urgencyMessage.type === "success" ? "bg-green-50 border-green-200" : ""}
        `, children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
      urgencyMessage.type === "urgent" && /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 254,
        columnNumber: 17
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 253,
        columnNumber: 15
      }, undefined),
      urgencyMessage.type === "warning" && /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 259,
        columnNumber: 17
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 258,
        columnNumber: 15
      }, undefined),
      urgencyMessage.type === "info" && /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 264,
        columnNumber: 17
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 263,
        columnNumber: 15
      }, undefined),
      urgencyMessage.type === "success" && /* @__PURE__ */ jsxDEV("svg", { className: "w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 269,
        columnNumber: 17
      }, undefined) }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 268,
        columnNumber: 15
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: `
              text-sm
              ${urgencyMessage.type === "urgent" ? "text-red-800" : ""}
              ${urgencyMessage.type === "warning" ? "text-yellow-800" : ""}
              ${urgencyMessage.type === "info" ? "text-blue-800" : ""}
              ${urgencyMessage.type === "success" ? "text-green-800" : ""}
            `, children: urgencyMessage.message }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 272,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 251,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 244,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-6 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "1031 Exchange Timeline" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 287,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 text-sm text-gray-700", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "Day 0:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 292,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Close on your relinquished property" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 293,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 291,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "Day 45:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 296,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Deadline to identify replacement properties" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 297,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 295,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "Day 180:" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 300,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Deadline to close on replacement property" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
            lineNumber: 301,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
          lineNumber: 299,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
        lineNumber: 290,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
      lineNumber: 286,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/TimelineStep.tsx",
    lineNumber: 88,
    columnNumber: 5
  }, undefined);
};

const replacementOptions = [
  { value: "yes_specific", label: "Yes, specific property identified" },
  { value: "yes_multiple", label: "Yes, multiple properties identified" },
  { value: "no_searching", label: "No, still searching" },
  { value: "need_help", label: "Need help finding properties" }
];
const exchangeTypes = [
  { value: "standard_delayed", label: "Standard Delayed Exchange" },
  { value: "reverse", label: "Reverse Exchange (buy first)" },
  { value: "improvement", label: "Improvement/Construction Exchange" },
  { value: "not_sure", label: "Not sure - need guidance" }
];
const cashOutOptions = [
  { value: "no_cash", label: "No cash out - full reinvestment" },
  { value: "minimal_50k", label: "Minimal cash out (< $50k)" },
  { value: "moderate_50_200k", label: "Moderate cash out ($50k-$200k)" },
  { value: "significant_200k_plus", label: "Significant cash out (> $200k)" },
  { value: "not_sure", label: "Not sure yet" }
];
const dstOptions = [
  { value: "interested", label: "Yes, interested in DST properties" },
  { value: "traditional_only", label: "No, traditional properties only" },
  { value: "learn_both", label: "Want to learn about both options" },
  { value: "not_familiar", label: "Not familiar with DST properties" }
];
const ExchangeGoalsStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(4, sessionId);
  }, [analytics]);
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Your Exchange Strategy" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "What are you looking to accomplish?" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 69,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "replacement-identified",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Have you identified replacement property? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 80,
              columnNumber: 53
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 76,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "replacement-identified",
          value: formState.data["1031x_order_replacement_identified"] || "",
          onChange: (e) => handleInputChange("1031x_order_replacement_identified", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_replacement_identified", "focus", 4, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_replacement_identified"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_replacement_identified"] ? "replacement-identified-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_replacement_identified"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select status..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 99,
              columnNumber: 11
            }, undefined),
            replacementOptions.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 101,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 82,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_replacement_identified"],
          fieldId: "replacement-identified"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 104,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 75,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "exchange-type",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "What type of exchange are you considering? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 116,
              columnNumber: 54
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 112,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "exchange-type",
          value: formState.data["1031x_order_exchange_type"] || "",
          onChange: (e) => handleInputChange("1031x_order_exchange_type", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_exchange_type", "focus", 4, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_exchange_type"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_exchange_type"] ? "exchange-type-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_exchange_type"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select exchange type..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 135,
              columnNumber: 11
            }, undefined),
            exchangeTypes.map((type) => /* @__PURE__ */ jsxDEV("option", { value: type.value, children: type.label }, type.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 137,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 118,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_exchange_type"],
          fieldId: "exchange-type"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 140,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-gray-500", children: "Not sure? Most exchanges are standard delayed exchanges." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 111,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "cash-out",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Do you need to take any cash out? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 155,
              columnNumber: 45
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 151,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "cash-out",
          value: formState.data["1031x_order_cash_out_needed"] || "",
          onChange: (e) => handleInputChange("1031x_order_cash_out_needed", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_cash_out_needed", "focus", 4, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_cash_out_needed"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_cash_out_needed"] ? "cash-out-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_cash_out_needed"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select option..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 174,
              columnNumber: 11
            }, undefined),
            cashOutOptions.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 176,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 157,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_cash_out_needed"],
          fieldId: "cash-out"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 179,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-gray-500", children: "Taking cash out will trigger taxes on that portion." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 183,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 150,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "dst-interest",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Are you interested in Delaware Statutory Trust (DST) properties? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 194,
              columnNumber: 76
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 190,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "dst-interest",
          value: formState.data["1031x_order_dst_interest"] || "",
          onChange: (e) => handleInputChange("1031x_order_dst_interest", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_dst_interest", "focus", 4, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_dst_interest"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_dst_interest"] ? "dst-interest-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_dst_interest"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select option..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 213,
              columnNumber: 11
            }, undefined),
            dstOptions.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
              lineNumber: 215,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 196,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_dst_interest"],
          fieldId: "dst-interest"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 218,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-gray-500", children: "DST properties offer passive investment with no management responsibilities." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 222,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 189,
      columnNumber: 7
    }, undefined),
    formState.data["1031x_order_exchange_type"] && formState.data["1031x_order_exchange_type"] !== "not_sure" && /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-2", children: exchangeTypes.find((t) => t.value === formState.data["1031x_order_exchange_type"])?.label }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 230,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-700", children: [
        formState.data["1031x_order_exchange_type"] === "standard_delayed" && /* @__PURE__ */ jsxDEV("p", { children: "The most common type. You sell first, then have 45 days to identify and 180 days to purchase replacement property." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 235,
          columnNumber: 15
        }, undefined),
        formState.data["1031x_order_exchange_type"] === "reverse" && /* @__PURE__ */ jsxDEV("p", { children: "Purchase your replacement property before selling. Requires special financing and parking arrangements." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 238,
          columnNumber: 15
        }, undefined),
        formState.data["1031x_order_exchange_type"] === "improvement" && /* @__PURE__ */ jsxDEV("p", { children: "Use exchange funds to improve replacement property. Complex but allows property upgrades within the exchange." }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
          lineNumber: 241,
          columnNumber: 15
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
        lineNumber: 233,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
      lineNumber: 229,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ExchangeGoalsStep.tsx",
    lineNumber: 64,
    columnNumber: 5
  }, undefined);
};

const cpaOptions = [
  { value: "yes", label: "Yes, have a CPA" },
  { value: "need_referral", label: "No, need CPA referral" },
  { value: "will_find", label: "Will find one" }
];
const ProfessionalTeamStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(5, sessionId);
  }, [analytics]);
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  const showCPAFields = formState.data["1031x_order_has_cpa"] === "yes";
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Your Professional Team" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Who's helping with your exchange?" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "has-cpa",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "Do you have a CPA or tax advisor? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
              lineNumber: 59,
              columnNumber: 45
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 55,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "has-cpa",
          value: formState.data["1031x_order_has_cpa"] || "",
          onChange: (e) => handleInputChange("1031x_order_has_cpa", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_has_cpa", "focus", 5, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_has_cpa"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_has_cpa"] ? "has-cpa-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_has_cpa"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select option..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
              lineNumber: 78,
              columnNumber: 11
            }, undefined),
            cpaOptions.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
              lineNumber: 80,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 61,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_has_cpa"],
          fieldId: "has-cpa"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 83,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 54,
      columnNumber: 7
    }, undefined),
    showCPAFields && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "cpa-name",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "CPA Name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 93,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "cpa-name",
            type: "text",
            value: formState.data["1031x_order_cpa_name"] || "",
            onChange: (e) => handleInputChange("1031x_order_cpa_name", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_cpa_name", "focus", 5, sessionId);
            },
            className: `
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors["1031x_order_cpa_name"] ? "border-red-500" : "border-gray-300"}
              `,
            placeholder: "John Smith, CPA",
            "aria-describedby": formState.errors["1031x_order_cpa_name"] ? "cpa-name-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_cpa_name"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 99,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_cpa_name"],
            fieldId: "cpa-name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 118,
            columnNumber: 13
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 92,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "cpa-email",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "CPA Email (optional)"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 125,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "cpa-email",
            type: "email",
            value: formState.data["1031x_order_cpa_email"] || "",
            onChange: (e) => handleInputChange("1031x_order_cpa_email", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_cpa_email", "focus", 5, sessionId);
            },
            className: `
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors["1031x_order_cpa_email"] ? "border-red-500" : "border-gray-300"}
              `,
            placeholder: "john@smithcpa.com",
            "aria-describedby": formState.errors["1031x_order_cpa_email"] ? "cpa-email-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_cpa_email"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 131,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_cpa_email"],
            fieldId: "cpa-email"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 150,
            columnNumber: 13
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-gray-500", children: "We can coordinate with your CPA to ensure proper tax planning" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 154,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 91,
      columnNumber: 9
    }, undefined),
    formState.data["1031x_order_has_cpa"] === "need_referral" && /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-blue-900 mb-2", children: "CPA Referral Available" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 164,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-blue-800", children: "We work with experienced CPAs who specialize in 1031 exchanges. We'll connect you with qualified tax professionals in your area." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 163,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "border-t pt-6", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Real Estate Professional (optional)" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 174,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "realtor-name",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Realtor/Broker Name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 179,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "realtor-name",
            type: "text",
            value: formState.data["1031x_order_realtor_name"] || "",
            onChange: (e) => handleInputChange("1031x_order_realtor_name", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_realtor_name", "focus", 5, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_realtor_name"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "Jane Doe, Realtor",
            "aria-describedby": formState.errors["1031x_order_realtor_name"] ? "realtor-name-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_realtor_name"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 185,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_realtor_name"],
            fieldId: "realtor-name"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 204,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 178,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxDEV(
          "label",
          {
            htmlFor: "realtor-email",
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Realtor/Broker Email"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 211,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "realtor-email",
            type: "email",
            value: formState.data["1031x_order_realtor_email"] || "",
            onChange: (e) => handleInputChange("1031x_order_realtor_email", e.target.value),
            onFocus: () => {
              const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
              analytics.trackFieldInteraction("1031x_order_realtor_email", "focus", 5, sessionId);
            },
            className: `
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors["1031x_order_realtor_email"] ? "border-red-500" : "border-gray-300"}
            `,
            placeholder: "jane@realty.com",
            "aria-describedby": formState.errors["1031x_order_realtor_email"] ? "realtor-email-error" : void 0,
            "aria-invalid": !!formState.errors["1031x_order_realtor_email"]
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 217,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_realtor_email"],
            fieldId: "realtor-email"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 236,
            columnNumber: 11
          },
          undefined
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 210,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 173,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900 mb-2", children: "Why a Professional Team Matters" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 245,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("ul", { className: "text-sm text-gray-700 space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-blue-900 mr-2", children: "•" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 248,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "CPAs ensure proper tax planning and compliance" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 249,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-blue-900 mr-2", children: "•" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 252,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Realtors help find suitable replacement properties" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 253,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 251,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-blue-900 mr-2", children: "•" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 256,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "We coordinate with your team for seamless exchanges" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
            lineNumber: 257,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
          lineNumber: 255,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
        lineNumber: 246,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
      lineNumber: 244,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ProfessionalTeamStep.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, undefined);
};

const contractPreferences = [
  { value: "electronic", label: "Yes, use electronic contracts (recommended)" },
  { value: "mail", label: "Prefer traditional mail" },
  { value: "in_person", label: "Sign in person" }
];
const consultationPreferences = [
  { value: "phone", label: "Phone consultation" },
  { value: "video", label: "Video call (Zoom)" },
  { value: "in_person", label: "In-person meeting" },
  { value: "email_only", label: "Email only" }
];
const referralSources = [
  { value: "google", label: "Google Search" },
  { value: "cpa_referral", label: "CPA Referral" },
  { value: "realtor_referral", label: "Realtor Referral" },
  { value: "previous_client", label: "Previous Client" },
  { value: "social_media", label: "Social Media" },
  { value: "other", label: "Other" }
];
const ServicePreferencesStep = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  useEffect(() => {
    const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
    analytics.trackStepStart(6, sessionId);
  }, [analytics]);
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };
  const handleTextAreaChange = (field, value) => {
    if (value.length <= 500) {
      updateField(field, value);
    }
  };
  const remainingChars = 500 - (formState.data["1031x_order_additional_notes"]?.length || 0);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "How We'll Work Together" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: "Your preferences for the exchange process" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 70,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "contract-preference",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "How would you prefer to sign your exchange agreements? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 81,
              columnNumber: 66
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 77,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "contract-preference",
          value: formState.data["1031x_order_contract_preference"] || "",
          onChange: (e) => handleInputChange("1031x_order_contract_preference", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_contract_preference", "focus", 6, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_contract_preference"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_contract_preference"] ? "contract-preference-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_contract_preference"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select preference..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 100,
              columnNumber: 11
            }, undefined),
            contractPreferences.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 102,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 83,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_contract_preference"],
          fieldId: "contract-preference"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 105,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, undefined),
    formState.data["1031x_order_contract_preference"] === "electronic" && /* @__PURE__ */ jsxDEV("div", { className: "bg-green-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-green-900 mb-2", children: "Benefits of Electronic Contracts" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 114,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("ul", { className: "text-sm text-green-800 space-y-1", children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "mr-2", children: "✓" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 117,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Faster processing - sign from anywhere" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 118,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 116,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "mr-2", children: "✓" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 121,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Secure and legally binding" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 122,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 120,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "mr-2", children: "✓" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 125,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Automatic backups and audit trail" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 126,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 124,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 115,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "consultation-preference",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "How would you like to conduct your initial consultation? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 138,
              columnNumber: 68
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 134,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "consultation-preference",
          value: formState.data["1031x_order_consultation_preference"] || "",
          onChange: (e) => handleInputChange("1031x_order_consultation_preference", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_consultation_preference", "focus", 6, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_consultation_preference"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_consultation_preference"] ? "consultation-preference-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_consultation_preference"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select preference..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 157,
              columnNumber: 11
            }, undefined),
            consultationPreferences.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 159,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 140,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_consultation_preference"],
          fieldId: "consultation-preference"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 162,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "how-heard",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: [
            "How did you hear about us? ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 174,
              columnNumber: 38
            }, undefined)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 170,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "how-heard",
          value: formState.data["1031x_order_how_heard"] || "",
          onChange: (e) => handleInputChange("1031x_order_how_heard", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_how_heard", "focus", 6, sessionId);
          },
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_how_heard"] ? "border-red-500" : "border-gray-300"}
          `,
          "aria-describedby": formState.errors["1031x_order_how_heard"] ? "how-heard-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_how_heard"],
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select source..." }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 193,
              columnNumber: 11
            }, undefined),
            referralSources.map((source) => /* @__PURE__ */ jsxDEV("option", { value: source.value, children: source.label }, source.value, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
              lineNumber: 195,
              columnNumber: 13
            }, undefined))
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 176,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        FieldError,
        {
          error: formState.errors["1031x_order_how_heard"],
          fieldId: "how-heard"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 198,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 169,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV(
        "label",
        {
          htmlFor: "additional-notes",
          className: "block text-sm font-medium text-gray-700 mb-2",
          children: "Any special circumstances or questions? (optional)"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 206,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          id: "additional-notes",
          value: formState.data["1031x_order_additional_notes"] || "",
          onChange: (e) => handleTextAreaChange("1031x_order_additional_notes", e.target.value),
          onFocus: () => {
            const sessionId = sessionStorage.getItem("1031_order_form_session") || "";
            analytics.trackFieldInteraction("1031x_order_additional_notes", "focus", 6, sessionId);
          },
          rows: 4,
          className: `
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors["1031x_order_additional_notes"] ? "border-red-500" : "border-gray-300"}
          `,
          placeholder: "Tell us about any unique aspects of your exchange or questions you have...",
          "aria-describedby": formState.errors["1031x_order_additional_notes"] ? "additional-notes-error" : void 0,
          "aria-invalid": !!formState.errors["1031x_order_additional_notes"]
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 212,
          columnNumber: 9
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mt-1", children: [
        /* @__PURE__ */ jsxDEV(
          FieldError,
          {
            error: formState.errors["1031x_order_additional_notes"],
            fieldId: "additional-notes"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 232,
            columnNumber: 11
          },
          undefined
        ),
        /* @__PURE__ */ jsxDEV("span", { className: `text-sm ${remainingChars < 50 ? "text-red-600" : "text-gray-500"}`, children: [
          remainingChars,
          " characters remaining"
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 231,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 205,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-6 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-blue-900 mb-3", children: "Ready to Submit Your Application" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-blue-800 mb-4", children: "By submitting this form, you're taking the first step toward a successful 1031 exchange. Here's what happens next:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 247,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV("ol", { className: "text-sm text-blue-800 space-y-2", children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "1." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 253,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "We'll review your information and prepare your exchange documents" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 254,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 252,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "2." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 257,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "A specialist will contact you within 24 hours (or immediately if urgent)" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 258,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 256,
          columnNumber: 11
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "3." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 261,
            columnNumber: 13
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "We'll guide you through every step of your 1031 exchange" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
            lineNumber: 262,
            columnNumber: 13
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
          lineNumber: 260,
          columnNumber: 11
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 251,
        columnNumber: 9
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 243,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600 text-center", children: [
      'By clicking "Submit Application" you agree to our',
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "/terms", className: "text-blue-900 hover:underline", target: "_blank", children: "Terms of Service" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 270,
        columnNumber: 9
      }, undefined),
      " ",
      "and",
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "/privacy", className: "text-blue-900 hover:underline", target: "_blank", children: "Privacy Policy" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
        lineNumber: 272,
        columnNumber: 9
      }, undefined),
      "."
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
      lineNumber: 268,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/steps/ServicePreferencesStep.tsx",
    lineNumber: 65,
    columnNumber: 5
  }, undefined);
};

const stepComponents = {
  1: BasicInfoStep,
  2: PropertyDetailsStep,
  3: TimelineStep,
  4: ExchangeGoalsStep,
  5: ProfessionalTeamStep,
  6: ServicePreferencesStep
};
const OrderFormContent = () => {
  const {
    formState,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    isLoading,
    error,
    canGoNext,
    canGoPrevious
  } = useOrderForm();
  const formContainerRef = useRef(null);
  const CurrentStepComponent = stepComponents[formState.currentStep];
  const isLastStep = formState.currentStep === 6;
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: "Order Form - Step " + formState.currentStep,
        page_location: window.location.href
      });
    }
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formState.currentStep]);
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", ref: formContainerRef, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: /* @__PURE__ */ jsxDEV(
      ProgressIndicator,
      {
        currentStep: formState.currentStep,
        completedSteps: formState.completedSteps,
        onStepClick: (step) => goToStep(step)
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 72,
        columnNumber: 9
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 71,
      columnNumber: 7
    }, undefined),
    error && /* @__PURE__ */ jsxDEV("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start", children: [
      /* @__PURE__ */ jsxDEV(
        "svg",
        {
          className: "w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxDEV(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            void 0,
            false,
            {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
              lineNumber: 89,
              columnNumber: 15
            },
            undefined
          )
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 83,
          columnNumber: 13
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-red-800", children: error }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 96,
        columnNumber: 13
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 82,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 81,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [
      /* @__PURE__ */ jsxDEV(CurrentStepComponent, {}, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 104,
        columnNumber: 9
      }, undefined),
      /* @__PURE__ */ jsxDEV(
        StepNavigation,
        {
          canGoPrevious,
          canGoNext,
          onPrevious: previousStep,
          onNext: nextStep,
          onSubmit: submitForm,
          isLoading,
          isLastStep
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 107,
          columnNumber: 9
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 102,
      columnNumber: 7
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: [
      "Need help? Call us at",
      " ",
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: getPhoneLink(),
          className: "text-blue-900 font-medium hover:underline",
          onClick: () => {
            if (typeof window !== "undefined" && window.trackPhoneCall) {
              window.trackPhoneCall("order_form_help");
            }
          },
          children: COMPANY.phone.main
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 122,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 120,
      columnNumber: 9
    }, undefined) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
    lineNumber: 69,
    columnNumber: 5
  }, undefined);
};
const SuccessScreen = ({ contactId }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto text-center", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-xl shadow-lg p-8", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxDEV(
      "svg",
      {
        className: "w-10 h-10 text-green-600",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsxDEV(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M5 13l4 4L19 7"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 159,
            columnNumber: 13
          },
          undefined
        )
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 153,
        columnNumber: 11
      },
      undefined
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 152,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Application Submitted Successfully!" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 168,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("p", { className: "text-lg text-gray-600 mb-8", children: "Thank you for choosing National 1031 Center. We've received your information and one of our specialists will contact you within 24 hours." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 172,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-blue-50 p-6 rounded-lg text-left mb-8", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-semibold text-blue-900 mb-3", children: "What Happens Next:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 179,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("ol", { className: "space-y-2 text-blue-800", children: [
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "1." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 184,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "Our team will review your information and prepare your exchange documents" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 185,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 183,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "2." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 188,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "A 1031 specialist will contact you within 24 hours to discuss your exchange" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 189,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 187,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDEV("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "font-semibold mr-2", children: "3." }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 192,
            columnNumber: 15
          }, undefined),
          /* @__PURE__ */ jsxDEV("span", { children: "We'll guide you through every step of your 1031 exchange process" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
            lineNumber: 193,
            columnNumber: 15
          }, undefined)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, undefined)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 182,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 178,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-100 p-4 rounded-lg mb-8", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: "Your reference number:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 200,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xl font-mono font-semibold text-gray-900", children: contactId.slice(-8).toUpperCase() }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
        lineNumber: 203,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 199,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: "/calculator",
          className: "px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200",
          children: "Calculate Tax Savings"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 210,
          columnNumber: 11
        },
        undefined
      ),
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: "/complete-guide-1031-exchanges",
          className: "px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200",
          children: "Learn About 1031 Exchanges"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
          lineNumber: 216,
          columnNumber: 11
        },
        undefined
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 209,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
    lineNumber: 150,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
    lineNumber: 149,
    columnNumber: 5
  }, undefined);
};
const OrderForm = ({
  onSuccess,
  onError
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [contactId, setContactId] = React.useState("");
  const handleSuccess = (id) => {
    setContactId(id);
    setIsSubmitted(true);
    if (typeof window !== "undefined") {
      if (window.trackConversion) {
        window.trackConversion("order_form_complete", {
          value: 0,
          // No monetary value yet
          currency: "USD"
        });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (onSuccess) {
      onSuccess(id);
    }
  };
  if (isSubmitted) {
    return /* @__PURE__ */ jsxDEV(SuccessScreen, { contactId }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
      lineNumber: 267,
      columnNumber: 12
    }, undefined);
  }
  return /* @__PURE__ */ jsxDEV(OrderFormProvider, { onSuccess: handleSuccess, onError, children: /* @__PURE__ */ jsxDEV(OrderFormContent, {}, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
    lineNumber: 272,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm.tsx",
    lineNumber: 271,
    columnNumber: 5
  }, undefined);
};

const $$StartExchange = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Start Your 1031 Exchange | National 1031 Center", "description": "Begin your 1031 exchange with our comprehensive order form. Get expert guidance and save thousands in capital gains taxes." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gray-50 min-h-screen py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Hero Section --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
Start Your 1031 Exchange
</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto">
Complete our secure order form to begin your tax-deferred exchange. 
          Our specialists will guide you through every step of the process.
</p> </div> <!-- Trust Indicators --> <div class="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"> <div class="text-center"> <div class="text-3xl font-bold text-blue-900 mb-1">35+</div> <div class="text-sm text-gray-600">Years Experience</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-blue-900 mb-1">$2B+</div> <div class="text-sm text-gray-600">Exchanges Completed</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-blue-900 mb-1">50</div> <div class="text-sm text-gray-600">States Served</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-blue-900 mb-1">98%</div> <div class="text-sm text-gray-600">Success Rate</div> </div> </div> <!-- Order Form Component --> ${renderComponent($$result2, "OrderForm", OrderForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/order-form/OrderForm", "client:component-export": "OrderForm" })} <!-- Additional Information --> <div class="mt-16 max-w-4xl mx-auto"> <div class="bg-white rounded-xl shadow-lg p-8"> <h2 class="text-2xl font-bold text-gray-900 mb-6">
Why Choose ${COMPANY.name}?
</h2> <div class="grid md:grid-cols-2 gap-8"> <div> <h3 class="text-lg font-semibold text-gray-900 mb-3">Expert Guidance</h3> <ul class="space-y-2 text-gray-600"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Dedicated exchange specialist assigned to your account</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Step-by-step guidance through the entire process</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Proactive deadline tracking and reminders</span> </li> </ul> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-3">Complete Security</h3> <ul class="space-y-2 text-gray-600"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Bank-level encryption for all data</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Fully bonded and insured qualified intermediary</span> </li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>Segregated FDIC-insured accounts</span> </li> </ul> </div> </div> <div class="mt-8 p-4 bg-blue-50 rounded-lg"> <p class="text-sm text-blue-900"> <strong>Privacy Notice:</strong> Your information is secure and confidential. 
              We never share your data with third parties without your explicit consent.
</p> </div> </div> <!-- FAQ Section --> <div class="mt-12 bg-white rounded-xl shadow-lg p-8"> <h2 class="text-2xl font-bold text-gray-900 mb-6">
Frequently Asked Questions
</h2> <div class="space-y-6"> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">
How long does it take to complete the order form?
</h3> <p class="text-gray-600">
Most clients complete the form in 5-10 minutes. Your progress is automatically 
                saved, so you can return anytime to finish.
</p> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">
What information do I need to have ready?
</h3> <p class="text-gray-600">
You'll need basic property information (address, expected sale price), 
                your timeline, and contact information. Having your CPA or realtor's 
                contact info is helpful but not required.
</p> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">
Is there a fee to start the process?
</h3> <p class="text-gray-600">
There's no fee to submit the order form or speak with our specialists. 
                Exchange fees are only due when you proceed with the exchange and are 
                clearly disclosed upfront.
</p> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">
What happens after I submit the form?
</h3> <p class="text-gray-600">
A 1031 exchange specialist will contact you within 24 hours (or immediately 
                for urgent exchanges) to review your situation and guide you through the next steps.
</p> </div> </div> </div> </div> </div> </div>  <div class="bg-white py-12 border-t"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex flex-wrap justify-center items-center gap-8"> <!-- Trust Indicators without images --> <div class="flex items-center gap-2 text-gray-600"> <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> <span class="font-semibold">Bonded & Insured</span> </div> <div class="flex items-center gap-2 text-gray-600"> <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path> </svg> <span class="font-semibold">FEA Member</span> </div> <div class="flex items-center gap-2 text-gray-600"> <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> <span class="font-semibold">Bank-Level Security</span> </div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/start-exchange.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/start-exchange.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/start-exchange.astro";
const $$url = "/start-exchange";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$StartExchange,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
