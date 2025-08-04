import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState, useEffect } from 'react';
import { D as DatabaseService } from '../../chunks/database.service_C6kdc69n.mjs';
import { H as HighLevelService } from '../../chunks/highlevel.service_BQje5Mta.mjs';
/* empty css                                               */
export { renderers } from '../../renderers.mjs';

function HighLevelConfigComponent() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [locationId, setLocationId] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [isActive, setIsActive] = useState(true);
  const db = DatabaseService.getInstance();
  const highLevel = new HighLevelService();
  useEffect(() => {
    loadConfig();
  }, [db]);
  async function loadConfig() {
    try {
      const { data } = await db.getTable("highlevel_config").select("*").eq("is_active", true).single();
      if (data) {
        setConfig(data);
        setApiKey(data.api_key);
        setLocationId(data.location_id);
        setCalendarId(data.calendar_id);
        setWebhookSecret(data.webhook_secret || "");
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setLoading(false);
    }
  }
  async function saveConfig(e) {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);
    try {
      const configData = {
        api_key: apiKey,
        location_id: locationId,
        calendar_id: calendarId,
        webhook_secret: webhookSecret,
        webhook_url: `${window.location.origin}/.netlify/functions/highlevel-webhook`,
        timezone: "America/New_York",
        is_active: isActive
      };
      if (config) {
        const { error } = await db.getTable("highlevel_config").update(configData).eq("id", config.id);
        if (error) throw error;
      } else {
        const { data, error } = await db.getTable("highlevel_config").insert(configData).select().single();
        if (error) throw error;
        setConfig(data);
      }
      setTestResult({ success: true, message: "Configuration saved successfully!" });
    } catch (error) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  }
  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      await saveConfig(new Event("submit"));
      if (!testResult?.success) return;
      const testDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const slots = await highLevel.getAvailability({ date: testDate });
      setTestResult({
        success: true,
        message: `Connection successful! Found ${slots.length} available slots for today.`
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    } finally {
      setTesting(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 122,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("form", { onSubmit: saveConfig, className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-6 rounded-lg shadow-md space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-xl font-semibold mb-4", children: "API Configuration" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 130,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "apiKey", className: "block text-sm font-medium text-gray-700 mb-1", children: [
          "API Key ",
          /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 134,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "password",
            id: "apiKey",
            value: apiKey,
            onChange: (e) => setApiKey(e.target.value),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Your HighLevel API Key"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 136,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: "Get this from HighLevel Settings → Business Profile → API Key" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 132,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "locationId", className: "block text-sm font-medium text-gray-700 mb-1", children: [
          "Location ID ",
          /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 152,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 151,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            id: "locationId",
            value: locationId,
            onChange: (e) => setLocationId(e.target.value),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Your HighLevel Location ID"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 154,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: "Found in HighLevel Settings → Business Profile" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 150,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "calendarId", className: "block text-sm font-medium text-gray-700 mb-1", children: [
          "Calendar ID ",
          /* @__PURE__ */ jsxDEV("span", { className: "text-red-500", children: "*" }, void 0, false, {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 170,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 169,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            id: "calendarId",
            value: calendarId,
            onChange: (e) => setCalendarId(e.target.value),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Your HighLevel Calendar ID"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 172,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: "Found in HighLevel Calendars → Select Calendar → Settings" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 168,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "webhookSecret", className: "block text-sm font-medium text-gray-700 mb-1", children: "Webhook Secret (Optional)" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 187,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "password",
            id: "webhookSecret",
            value: webhookSecret,
            onChange: (e) => setWebhookSecret(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder: "Webhook verification secret"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 190,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: "Used to verify webhook requests are from HighLevel" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 198,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            id: "isActive",
            checked: isActive,
            onChange: (e) => setIsActive(e.target.checked),
            className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          },
          void 0,
          false,
          {
            fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
            lineNumber: 204,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "isActive", className: "ml-2 block text-sm text-gray-700", children: "Configuration is active" }, void 0, false, {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 203,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-yellow-50 border border-yellow-200 rounded-md p-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-medium text-yellow-800 mb-2", children: "Webhook URL" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 218,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-yellow-700 mb-2", children: "Add this URL to your HighLevel webhooks:" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 219,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("code", { className: "block bg-white px-3 py-2 rounded border border-yellow-300 text-xs break-all", children: [
        window.location.origin,
        "/.netlify/functions/highlevel-webhook"
      ] }, void 0, true, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
        lineNumber: 222,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 217,
      columnNumber: 7
    }, this),
    testResult && /* @__PURE__ */ jsxDEV("div", { className: `p-4 rounded-md ${testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`, children: /* @__PURE__ */ jsxDEV("p", { className: `text-sm ${testResult.success ? "text-green-800" : "text-red-800"}`, children: testResult.message }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 229,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 228,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "submit",
          disabled: saving || testing,
          className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
          children: saving ? "Saving..." : "Save Configuration"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 236,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: testConnection,
          disabled: saving || testing || !apiKey || !locationId || !calendarId,
          className: "px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50",
          children: testing ? "Testing..." : "Test Connection"
        },
        void 0,
        false,
        {
          fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
          lineNumber: 244,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
      lineNumber: 235,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig.tsx",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}

const $$Astro = createAstro("https://the1031center.com");
const $$HighlevelConfig = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HighlevelConfig;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "HighLevel Configuration - Admin", "data-astro-cid-7bwsdtox": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8" data-astro-cid-7bwsdtox> <div class="max-w-4xl mx-auto" data-astro-cid-7bwsdtox> <h1 class="text-3xl font-bold mb-8" data-astro-cid-7bwsdtox>HighLevel Integration Settings</h1> <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-astro-cid-7bwsdtox> <p class="text-sm text-blue-700" data-astro-cid-7bwsdtox>
Configure your HighLevel CRM integration settings. These credentials will be used to sync leads and appointments.
</p> </div> ${renderComponent($$result2, "HighLevelConfigComponent", HighLevelConfigComponent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/HighLevelConfig", "client:component-export": "default", "data-astro-cid-7bwsdtox": true })} </div> </main> ` })} `;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/highlevel-config.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/highlevel-config.astro";
const $$url = "/admin/highlevel-config";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HighlevelConfig,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
