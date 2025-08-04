import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink, a as getEmailLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState } from 'react';
import { D as DatabaseService } from '../chunks/database.service_C6kdc69n.mjs';
import { H as HighLevelService } from '../chunks/highlevel.service_BQje5Mta.mjs';
import { d as createLocalBusinessSchema, g as generateJsonLdScript } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

class LeadCaptureService {
  db;
  highLevel;
  constructor() {
    this.db = DatabaseService.getInstance();
    this.highLevel = new HighLevelService();
  }
  async createLead(input) {
    try {
      const { data: leadId, error: dbError } = await this.db.executeFunction(
        "find_or_create_lead",
        {
          p_email: input.email,
          p_first_name: input.firstName || null,
          p_last_name: input.lastName || null,
          p_lead_source: input.leadSource,
          p_phone: input.phone || null
        }
      );
      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }
      try {
        await this.highLevel.syncContact({
          leadId,
          email: input.email,
          firstName: input.firstName || void 0,
          lastName: input.lastName || void 0,
          phone: input.phone || void 0,
          customFields: {
            lead_source: input.leadSource,
            ...input.metadata
          }
        });
      } catch (hlError) {
        console.error("HighLevel sync error:", hlError);
      }
      if (typeof window !== "undefined" && window.trackLeadCapture) {
        window.trackLeadCapture(input.leadSource, {
          email: input.email,
          lead_id: leadId
        });
      }
      return { id: leadId, success: true };
    } catch (error) {
      console.error("Lead capture error:", error);
      throw error;
    }
  }
}
const leadCaptureService = new LeadCaptureService();

function HighLevelContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    exchangeType: "",
    timeline: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (window.trackFormSubmit) {
        window.trackFormSubmit("contact_form");
      }
      await leadCaptureService.createLead({
        email: formData.email,
        phone: formData.phone || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        leadSource: "contact_form",
        metadata: {
          exchangeType: formData.exchangeType,
          timeline: formData.timeline,
          message: formData.message
        }
      });
      const netlifyFormData = new FormData();
      netlifyFormData.append("form-name", "contact");
      Object.entries(formData).forEach(([key, value]) => {
        netlifyFormData.append(key, value);
      });
      await fetch("/", {
        method: "POST",
        body: netlifyFormData
      });
      window.location.href = "/thank-you";
    } catch (err) {
      console.error("Form submission error:", err);
      setError("There was an error submitting your form. Please try again or call us directly.");
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    error && /* @__PURE__ */ jsxDEV("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", children: error }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 75,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-2", children: "First Name *" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            id: "firstName",
            name: "firstName",
            value: formData.firstName,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
            lineNumber: 85,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-2", children: "Last Name *" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 97,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            id: "lastName",
            name: "lastName",
            value: formData.lastName,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
            lineNumber: 100,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address *" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "email",
            id: "email",
            name: "email",
            value: formData.email,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
            lineNumber: 117,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-2", children: "Phone Number" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "tel",
            id: "phone",
            name: "phone",
            value: formData.phone,
            onChange: handleChange,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
            lineNumber: 132,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 112,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "exchangeType", className: "block text-sm font-medium text-gray-700 mb-2", children: "Exchange Type Interest" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "exchangeType",
          name: "exchangeType",
          value: formData.exchangeType,
          onChange: handleChange,
          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select an option" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 154,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "delayed", children: "Delayed Exchange" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 155,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "reverse", children: "Reverse Exchange" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 156,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "improvement", children: "Improvement Exchange" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 157,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "partial", children: "Partial Exchange" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 158,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "not-sure", children: "Not Sure Yet" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 159,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 147,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 143,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "timeline", className: "block text-sm font-medium text-gray-700 mb-2", children: "When are you planning to sell?" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: "timeline",
          name: "timeline",
          value: formData.timeline,
          onChange: handleChange,
          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: "Select timeline" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 174,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "immediate", children: "Already under contract" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 175,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "30-days", children: "Within 30 days" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 176,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "90-days", children: "Within 90 days" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 177,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "6-months", children: "Within 6 months" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 178,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "planning", children: "Just planning ahead" }, void 0, false, {
              fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
              lineNumber: 179,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 167,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "How can we help you? *" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 184,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          id: "message",
          name: "message",
          rows: 4,
          value: formData.message,
          onChange: handleChange,
          required: true,
          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
          lineNumber: 187,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 183,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "submit",
        disabled: submitting,
        className: `w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 ${submitting ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
        children: submitting ? "Sending..." : "Send Message"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
        lineNumber: 199,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 198,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 text-center", children: "By submitting this form, you agree to our privacy policy and consent to receive communications about 1031 exchanges." }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
      lineNumber: 212,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm.tsx",
    lineNumber: 73,
    columnNumber: 5
  }, this);
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const localBusinessSchema = createLocalBusinessSchema({
    id: "https://the1031center.com/#organization",
    name: COMPANY.name,
    alternateName: "The 1031 Exchange Center",
    description: "America's most trusted 1031 exchange qualified intermediary, facilitating tax-deferred property exchanges nationwide.",
    url: "https://the1031center.com",
    logo: "/images/logo.png",
    image: "/images/office.jpg",
    telephone: `+1${COMPANY.phone.mainFormatted}`,
    faxNumber: "+1-800-1031-FAX",
    email: COMPANY.email.main,
    address: {
      street: COMPANY.address.street,
      city: COMPANY.address.city,
      state: COMPANY.address.state,
      zip: COMPANY.address.zip,
      country: COMPANY.address.country
    },
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    hours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      }
    ],
    priceRange: "$$",
    areaServed: "United States",
    socialMedia: [
      "https://www.linkedin.com/company/the1031center",
      "https://www.facebook.com/the1031center",
      "https://twitter.com/the1031center"
    ],
    contactPoints: [
      {
        telephone: `+1${COMPANY.phone.mainFormatted}`,
        type: "customer service",
        areaServed: "US",
        languages: ["English", "Spanish"],
        options: ["TollFree", "Emergency"]
      }
    ]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Contact Us | ${COMPANY.name} | Get Expert 1031 Exchange Help`, "description": `Contact ${COMPANY.name} for expert 1031 exchange guidance. Available 24/7 for emergency support. Call ${COMPANY.phone.main} or use our contact form.` }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">\nContact ', ` </h1> <p class="text-xl text-blue-100">
Get expert guidance from America's most trusted 1031 exchange qualified intermediary. 
          We're here to help you maximize your tax savings and navigate your exchange with confidence.
</p> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid md:grid-cols-3 gap-8 mb-12"> <!-- Phone --> <div class="bg-white rounded-lg shadow-lg p-8 text-center"> <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Call Us</h3> <p class="text-gray-600 mb-4">Speak with an exchange expert</p> <a`, ` class="text-2xl font-bold text-blue-600 hover:text-blue-800" onclick="if(window.trackPhoneCall) window.trackPhoneCall('contact_page');"> `, ' </a> <p class="text-sm text-gray-500 mt-2">Monday-Friday 8am-6pm EST</p> <p class="text-sm text-yellow-600 font-semibold">24/7 Emergency Support</p> </div> <!-- Email --> <div class="bg-white rounded-lg shadow-lg p-8 text-center"> <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Email Us</h3> <p class="text-gray-600 mb-4">Get a response within 24 hours</p> <a', ' class="text-lg text-blue-600 hover:text-blue-800"> ', ' </a> <p class="text-sm text-gray-500 mt-2">48-hour response guarantee</p> </div> <!-- Schedule --> <div class="bg-white rounded-lg shadow-lg p-8 text-center"> <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">Schedule Consultation</h3> <p class="text-gray-600 mb-4">Book a free strategy session</p> <a href="/schedule" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">\nBook Appointment\n</a> <p class="text-sm text-gray-500 mt-2">30-minute consultation</p> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid lg:grid-cols-2 gap-12"> <!-- Contact Form --> <div> <h2 class="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2> <p class="text-gray-600 mb-8">\nHave questions about your 1031 exchange? Fill out the form below and one of our \n            experts will get back to you within 24 hours.\n</p> ', ' </div> <!-- Company Info --> <div> <h2 class="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2> <div class="space-y-6 mb-8"> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Headquarters</h3> <p class="text-gray-600"> ', "<br> ", ", ", " ", "<br> ", ' </p> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3> <p class="text-gray-600">\nMonday - Friday: 8:00 AM - 6:00 PM EST<br>\nSaturday - Sunday: Closed<br> <span class="text-yellow-600 font-semibold">24/7 Emergency Support Available</span> </p> </div> <div> <h3 class="text-lg font-semibold text-gray-900 mb-2">Direct Lines</h3> <div class="space-y-2"> <p class="text-gray-600"> <span class="font-medium">Main:</span> <a', ' class="text-blue-600 hover:text-blue-800">', '</a> </p> <p class="text-gray-600"> <span class="font-medium">Fax:</span> 1-800-1031-FAX\n</p> <p class="text-gray-600"> <span class="font-medium">Emergency:</span> <span class="text-yellow-600 font-semibold">Available 24/7</span> </p> </div> </div> </div> <!-- Map Placeholder --> <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-8"> <p class="text-gray-500">Interactive map coming soon</p> </div> <!-- Trust Badges --> <div class="border-t pt-8"> <h3 class="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h3> <div class="grid grid-cols-2 gap-4"> <div class="flex items-center"> <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Bonded & Insured</span> </div> <div class="flex items-center"> <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">Service in All 50 States</span> </div> <div class="flex items-center"> <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-700">10,000+ Exchanges</span> </div> </div> </div> </div> </div> </div> </section>  <section class="py-8 bg-yellow-50 border-t border-b border-yellow-200"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <p class="text-lg text-yellow-900"> <span class="font-semibold">Need Emergency Exchange Support?</span>\nOur team is available 24/7 for time-sensitive matters.\n<a', ' class="text-yellow-700 underline font-semibold hover:text-yellow-800">\nCall immediately: ', ' </a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), COMPANY.name, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, addAttribute(getEmailLink(), "href"), COMPANY.email.main, renderComponent($$result2, "HighLevelContactForm", HighLevelContactForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/HighLevelContactForm", "client:component-export": "default" }), COMPANY.address.street, COMPANY.address.city, COMPANY.address.state, COMPANY.address.zip, COMPANY.address.country, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript(localBusinessSchema))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/contact.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
