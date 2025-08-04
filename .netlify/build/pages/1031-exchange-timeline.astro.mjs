import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { T as TimelineCalculator } from '../chunks/TimelineCalculator_BZ-KU1zo.mjs';
import { c as createArticleSchema, a as createFAQPageSchema, g as generateJsonLdScript } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$1031ExchangeTimeline = createComponent(($$result, $$props, $$slots) => {
  const articleSchema = createArticleSchema({
    type: "Article",
    headline: "1031 Exchange Timeline Guide & Calculator: Critical Deadlines Explained",
    description: "Master the 1031 exchange timeline with our interactive calculator. Understand the 45-day identification period, 180-day completion deadline, and avoid costly mistakes.",
    image: [
      "/images/guides/1031-exchange-timeline.jpg",
      "/images/guides/exchange-deadlines.jpg",
      "/images/guides/timeline-calculator.jpg"
    ],
    author: "National 1031 Center Compliance Team",
    datePublished: "2024-01-01",
    dateModified: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    url: "/1031-exchange-timeline",
    wordCount: 2834,
    // Approximately 2834 words based on content
    articleSection: "Tax Guide",
    keywords: "1031 exchange timeline, 45-day identification period, 180-day exchange period, 1031 deadlines, exchange timeline calculator, IRS deadlines"
  });
  const faqSchema = createFAQPageSchema([
    {
      question: "What happens if the 45th day falls on a weekend or holiday?",
      answer: "The deadline doesn't extend. If day 45 falls on a Saturday, Sunday, or holiday, you must still identify by that date. We recommend identifying several days early to avoid any issues."
    },
    {
      question: "Can I change my identified properties after the 45-day deadline?",
      answer: "No. Once the 45-day deadline passes, your identification is locked. You cannot add, remove, or change properties. You can only purchase from the properties you identified."
    },
    {
      question: "What if my replacement property purchase falls through?",
      answer: "You can purchase any other property from your identification list. If you identified multiple properties (using the 3-property or 200% rule), you have backup options. If all identified properties become unavailable, your exchange will fail."
    },
    {
      question: "Do I have to use all my exchange funds?",
      answer: `To defer all taxes, you must: (1) purchase replacement property of equal or greater value, and (2) reinvest all equity. If you take cash out or buy down in value, you'll pay taxes on the difference (called "boot").`
    },
    {
      question: "Can I extend the 180-day deadline?",
      answer: "No. The 180-day deadline is absolute with no extensions. The only exception is if your tax return is due earlier (including extensions), in which case that becomes your deadline. Most investors file for a tax extension to ensure the full 180 days."
    }
  ]);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "1031 Exchange Timeline Guide & Calculator | Critical Deadlines Explained", "description": "Master the 1031 exchange timeline with our interactive calculator. Understand the 45-day identification and 180-day completion deadlines. Never miss a critical date." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-b from-blue-50 to-white py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">\n1031 Exchange Timeline: Your Complete Guide to Critical Deadlines\n</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">\nNavigate the strict IRS deadlines with confidence. Use our interactive timeline calculator to track your \n          45-day identification and 180-day completion deadlines\u2014never miss a critical date that could cost you thousands in taxes.\n</p> <!-- CTA Buttons --> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="#calculator" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg">\nCalculate Your Deadlines\n</a> <a href="/contact" class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">\nGet Expert Help\n</a> </div> </div> <!-- Key Timeline Stats --> <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"> <div class="bg-white rounded-lg shadow-md p-6 text-center"> <div class="text-3xl font-bold text-red-600 mb-2">45 Days</div> <div class="text-gray-600">To identify replacement properties</div> </div> <div class="bg-white rounded-lg shadow-md p-6 text-center"> <div class="text-3xl font-bold text-orange-600 mb-2">180 Days</div> <div class="text-gray-600">To complete the exchange</div> </div> <div class="bg-white rounded-lg shadow-md p-6 text-center"> <div class="text-3xl font-bold text-green-600 mb-2">Zero</div> <div class="text-gray-600">Extensions allowed by IRS</div> </div> </div> </div> </section>  <section id="calculator" class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">\nCalculate Your 1031 Exchange Deadlines\n</h2> <div class="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8"> ', ` </div> <div class="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"> <p class="text-blue-800"> <strong>Important:</strong> These deadlines are strict and cannot be extended, even if they fall on weekends or holidays. 
          Missing these deadlines will disqualify your exchange and trigger immediate tax liability.
</p> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
The Complete 1031 Exchange Timeline: Step-by-Step
</h2> <div class="max-w-4xl mx-auto space-y-8"> <!-- Day 0: Sale Closing --> <div class="bg-white rounded-lg shadow-md p-6"> <div class="flex items-start"> <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold">
0
</div> <div class="ml-4"> <h3 class="text-xl font-semibold text-gray-900 mb-2">Day 0: Sale of Relinquished Property Closes</h3> <p class="text-gray-600 mb-4">
Your 1031 exchange timeline officially begins when you close on the sale of your original property. 
                This is the starting point for all deadline calculations.
</p> <ul class="space-y-2 text-gray-600"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Proceeds go directly to Qualified Intermediary (QI)
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Exchange agreement must be signed before closing
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Cannot receive any proceeds directly
</li> </ul> </div> </div> </div> <!-- Days 1-45: Identification Period --> <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"> <div class="flex items-start"> <div class="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold">
45
</div> <div class="ml-4"> <h3 class="text-xl font-semibold text-gray-900 mb-2">Days 1-45: Property Identification Period</h3> <p class="text-gray-600 mb-4">
You have exactly 45 calendar days to identify potential replacement properties. This deadline is 
                absolute\u2014no extensions are granted for any reason.
</p> <h4 class="font-semibold text-gray-800 mb-2">Identification Rules (Choose One):</h4> <div class="space-y-3 mb-4"> <div class="bg-gray-50 p-4 rounded"> <h5 class="font-semibold text-gray-800">3-Property Rule</h5> <p class="text-gray-600">Identify up to 3 properties regardless of their value</p> </div> <div class="bg-gray-50 p-4 rounded"> <h5 class="font-semibold text-gray-800">200% Rule</h5> <p class="text-gray-600">Identify any number of properties as long as their total value doesn't exceed 200% of your sold property's value</p> </div> <div class="bg-gray-50 p-4 rounded"> <h5 class="font-semibold text-gray-800">95% Rule</h5> <p class="text-gray-600">Identify any number of properties of any value, but you must purchase 95% of the identified value</p> </div> </div> <div class="bg-yellow-50 p-4 rounded"> <p class="text-yellow-800"> <strong>Critical:</strong> Identification must be in writing, signed, and delivered to your QI by midnight on day 45.
</p> </div> </div> </div> </div> <!-- Days 46-180: Acquisition Period --> <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"> <div class="flex items-start"> <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold">
180
</div> <div class="ml-4"> <h3 class="text-xl font-semibold text-gray-900 mb-2">Days 46-180: Property Acquisition Period</h3> <p class="text-gray-600 mb-4">
You must close on your replacement property within 180 days of selling your original property, 
                or by your tax return due date (including extensions), whichever comes first.
</p> <h4 class="font-semibold text-gray-800 mb-2">Key Requirements:</h4> <ul class="space-y-2 text-gray-600 mb-4"> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Must purchase property previously identified
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Purchase price must be equal or greater for full tax deferral
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
All exchange equity must be reinvested
</li> <li class="flex items-start"> <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Title must be taken in same taxpayer name
</li> </ul> <div class="bg-green-50 p-4 rounded"> <p class="text-green-800"> <strong>Success!</strong> Once you close on your replacement property within 180 days, your exchange is complete 
                  and your capital gains taxes are successfully deferred.
</p> </div> </div> </div> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
Avoid These Critical Timeline Mistakes
</h2> <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"> <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg"> <h3 class="text-xl font-semibold text-red-900 mb-3">
\u274C Missing the 45-Day Deadline
</h3> <p class="text-red-800 mb-3">
The #1 reason exchanges fail. Even being one day late disqualifies your entire exchange.
</p> <p class="text-gray-700"> <strong>Solution:</strong> Set multiple reminders and submit identification early. We recommend identifying by day 40 to allow for any issues.
</p> </div> <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg"> <h3 class="text-xl font-semibold text-red-900 mb-3">
\u274C Improper Identification Format
</h3> <p class="text-red-800 mb-3">
Verbal identification or incomplete property descriptions can invalidate your exchange.
</p> <p class="text-gray-700"> <strong>Solution:</strong> Always provide written identification with complete property addresses and legal descriptions.
</p> </div> <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg"> <h3 class="text-xl font-semibold text-red-900 mb-3">
\u274C Calculating Days Incorrectly
</h3> <p class="text-red-800 mb-3">
Using business days instead of calendar days, or starting from the wrong date.
</p> <p class="text-gray-700"> <strong>Solution:</strong> Count calendar days starting from the day after closing. Use our calculator to be certain.
</p> </div> <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg"> <h3 class="text-xl font-semibold text-red-900 mb-3">
\u274C Assuming Extensions Are Possible
</h3> <p class="text-red-800 mb-3">
There are NO extensions, even for natural disasters, holidays, or emergencies.
</p> <p class="text-gray-700"> <strong>Solution:</strong> Plan ahead and act early. Build buffer time into your exchange timeline.
</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
1031 Exchange Timeline: Frequently Asked Questions
</h2> <div class="space-y-6"> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">
What happens if the 45th day falls on a weekend or holiday?
</h3> <p class="text-gray-600">
The deadline doesn't extend. If day 45 falls on a Saturday, Sunday, or holiday, you must still 
            identify by that date. We recommend identifying several days early to avoid any issues.
</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">
Can I change my identified properties after the 45-day deadline?
</h3> <p class="text-gray-600">
No. Once the 45-day deadline passes, your identification is locked. You cannot add, remove, or 
            change properties. You can only purchase from the properties you identified.
</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">
What if my replacement property purchase falls through?
</h3> <p class="text-gray-600">
You can purchase any other property from your identification list. If you identified multiple 
            properties (using the 3-property or 200% rule), you have backup options. If all identified 
            properties become unavailable, your exchange will fail.
</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">
Do I have to use all my exchange funds?
</h3> <p class="text-gray-600">
To defer all taxes, you must: (1) purchase replacement property of equal or greater value, and 
            (2) reinvest all equity. If you take cash out or buy down in value, you'll pay taxes on the difference (called "boot").
</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">
Can I extend the 180-day deadline?
</h3> <p class="text-gray-600">
No. The 180-day deadline is absolute with no extensions. The only exception is if your tax 
            return is due earlier (including extensions), in which case that becomes your deadline. 
            Most investors file for a tax extension to ensure the full 180 days.
</p> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
Visual 1031 Exchange Timeline
</h2> <div class="max-w-6xl mx-auto"> <div class="relative"> <!-- Timeline Line --> <div class="absolute left-0 right-0 h-1 bg-gray-300 top-1/2 transform -translate-y-1/2"></div> <!-- Timeline Points --> <div class="relative flex justify-between"> <!-- Day 0 --> <div class="text-center"> <div class="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mb-4 relative z-10">
0
</div> <h4 class="font-semibold text-gray-900">Sale Closes</h4> <p class="text-sm text-gray-600 mt-1">Exchange Begins</p> </div> <!-- Day 45 --> <div class="text-center"> <div class="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mb-4 relative z-10">
45
</div> <h4 class="font-semibold text-gray-900">ID Deadline</h4> <p class="text-sm text-gray-600 mt-1">Identify Properties</p> </div> <!-- Day 180 --> <div class="text-center"> <div class="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mb-4 relative z-10">
180
</div> <h4 class="font-semibold text-gray-900">Purchase Deadline</h4> <p class="text-sm text-gray-600 mt-1">Close on Replacement</p> </div> </div> <!-- Period Labels --> <div class="flex mt-8"> <div class="flex-1 text-center pr-4"> <div class="bg-yellow-100 p-3 rounded"> <span class="font-semibold text-yellow-800">Identification Period</span> <span class="block text-sm text-yellow-700 mt-1">45 Calendar Days</span> </div> </div> <div class="flex-1 text-center pl-4"> <div class="bg-green-100 p-3 rounded"> <span class="font-semibold text-green-800">Acquisition Period</span> <span class="block text-sm text-green-700 mt-1">135 Additional Days</span> </div> </div> </div> </div> </div> </div> </section>  <section class="py-16 bg-blue-900 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-6">
Don't Risk Missing Your 1031 Exchange Deadlines
</h2> <p class="text-xl mb-8 text-blue-100">
With zero room for error and no extensions, you need an experienced team to guide you through every deadline. 
        Let our experts ensure your exchange stays on track.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8"> <a href="/contact" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
Start Your Exchange Today
</a> <a`, ' class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">\nCall ', ' </a> </div> <p class="text-blue-200"> <strong>48-Hour Response Guarantee</strong> \u2022 Bonded & Insured \u2022 Serving All 50 States\n</p> </div> </section>  <script type="application/ld+json">', '<\/script>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), renderComponent($$result2, "TimelineCalculator", TimelineCalculator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/calculators/TimelineCalculator", "client:component-export": "TimelineCalculator" }), addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript(articleSchema)), unescapeHTML(generateJsonLdScript(faqSchema))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/1031-exchange-timeline.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/1031-exchange-timeline.astro";
const $$url = "/1031-exchange-timeline";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$1031ExchangeTimeline,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
