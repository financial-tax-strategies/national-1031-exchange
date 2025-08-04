import { d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

const HighLevelWidget = ({
  // Default to your calendar widget URL
  widgetUrl = "https://links.toptaxstrategies.com/widget/bookings/deferthegainstax/1031-exchange-consultation",
  height = "800px",
  onLoad,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://links.toptaxstrategies.com") return;
      console.log("Message from HighLevel widget:", event.data);
      if (event.data.type === "booking-completed") {
        console.log("Booking completed:", event.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };
  return /* @__PURE__ */ jsxDEV("div", { className: `highlevel-widget-container ${className}`, children: [
    isLoading && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center py-12", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDEV("span", { className: "ml-3 text-gray-600", children: "Loading calendar..." }, void 0, false, {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDEV(
      "iframe",
      {
        src: widgetUrl,
        width: "100%",
        height,
        frameBorder: "0",
        scrolling: "no",
        onLoad: handleIframeLoad,
        className: `highlevel-booking-widget ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`,
        title: "Book Your 1031 Exchange Consultation",
        allow: "payment"
      },
      void 0,
      false,
      {
        fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
        lineNumber: 60,
        columnNumber: 7
      },
      undefined
    ),
    /* @__PURE__ */ jsxDEV("style", { jsx: true, children: `
        .highlevel-widget-container {
          position: relative;
          width: 100%;
          min-height: ${height};
        }
        
        .highlevel-booking-widget {
          border: none;
          width: 100%;
          display: block;
        }
      ` }, void 0, false, {
      fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, undefined)
  ] }, void 0, true, {
    fileName: "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, undefined);
};

const $$ScheduleWidget = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Schedule Consultation (Widget) | ${COMPANY.name}`, "description": "Schedule a free 1031 exchange consultation using our booking widget." }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">
Schedule Your Free 1031 Exchange Consultation
</h1> <p class="text-xl text-blue-100">
Book a time that works for you with our certified exchange specialists.
</p> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- HighLevel Widget (Iframe Approach) --> ${renderComponent($$result2, "HighLevelWidget", HighLevelWidget, { "client:load": true, "height": "900px", "className": "shadow-xl rounded-lg overflow-hidden", "onLoad": () => {
    console.log("HighLevel widget loaded");
    if (typeof window !== "undefined" && window.trackContentEngagement) {
      window.trackContentEngagement("widget_loaded", "schedule_widget");
    }
  }, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/booking/HighLevelWidget", "client:component-export": "default" })} <!-- Alternative: Use custom widget URL if needed --> <!-- 
      <HighLevelWidget 
        client:load
        widgetUrl="YOUR_CUSTOM_WIDGET_URL_HERE"
        height="900px"
      />
      --> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-2xl font-bold text-gray-900 mb-4">
Having Trouble Booking?
</h2> <p class="text-lg text-gray-600 mb-6">
Our team is here to help you schedule your consultation.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a${addAttribute(getPhoneLink(), "href")} class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path> </svg>
Call ${COMPANY.phone.main} </a> <a href="/contact" class="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>
Send Message
</a> </div> </div> </section> ` })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/schedule-widget.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/schedule-widget.astro";
const $$url = "/schedule-widget";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ScheduleWidget,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
