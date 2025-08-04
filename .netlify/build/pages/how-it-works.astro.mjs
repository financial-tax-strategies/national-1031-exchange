import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { f as createHowToSchema, g as generateJsonLdScript } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$HowItWorks = createComponent(($$result, $$props, $$slots) => {
  const howToSchema = createHowToSchema({
    name: "How to Complete a 1031 Exchange",
    description: "Complete step-by-step guide to deferring capital gains taxes through 1031 exchanges",
    image: [
      "/images/guides/how-it-works.jpg",
      "/images/guides/1031-exchange-process.jpg",
      "/images/guides/exchange-timeline.jpg"
    ],
    totalTime: "PT180D",
    // 180 days
    estimatedCost: {
      currency: "USD",
      value: "1500"
    },
    supplies: [
      "Investment Property to Sell",
      "Qualified Intermediary",
      "Replacement Property"
    ],
    tools: [
      "Exchange Agreement",
      "Property Identification Form"
    ],
    steps: [
      {
        name: "Decide to Sell Your Property",
        text: `Contact ${COMPANY.name} before closing on your sale to establish the exchange framework. Early engagement ensures proper planning and documentation.`,
        url: "/how-it-works#step-1"
      },
      {
        name: "Sign Exchange Documents",
        text: "Complete exchange agreement before closing to establish Qualified Intermediary relationship. This creates the legal framework for your tax-deferred exchange.",
        url: "/how-it-works#step-2"
      },
      {
        name: "Close on Your Sale",
        text: "Sale proceeds go directly to Qualified Intermediary, starting your 45/180 day timeline. Funds are held in segregated, FDIC-insured accounts.",
        url: "/how-it-works#step-3"
      },
      {
        name: "Identify Replacement Properties",
        text: "Submit written identification within 45 days using 3-property rule (up to 3 properties), 200% rule (unlimited properties up to 200% of sale value), or 95% rule (any value but must purchase 95%).",
        url: "/how-it-works#step-4"
      },
      {
        name: "Shop and Negotiate",
        text: "Negotiate purchases, secure financing, and complete due diligence on identified properties within the 180-day exchange period.",
        url: "/how-it-works#step-5"
      },
      {
        name: "Purchase Replacement Property",
        text: "Complete acquisition within 180 days with Qualified Intermediary coordinating fund transfers and ensuring proper documentation.",
        url: "/how-it-works#step-6"
      },
      {
        name: "File Tax Return",
        text: "Report exchange on IRS Form 8824 using documentation provided by Qualified Intermediary, including exchange agreements, identification notices, and closing statements.",
        url: "/how-it-works#step-7"
      }
    ]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `How 1031 Exchanges Work | Step-by-Step Guide | ${COMPANY.name}`, "description": "Learn exactly how 1031 exchanges work with our step-by-step guide. Understand deadlines, requirements, and the complete exchange process from start to finish." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">
How 1031 Exchanges Work
</h1> <p class="text-xl text-blue-100">
A complete step-by-step guide to deferring capital gains taxes through 1031 exchanges. 
          Learn the process, deadlines, and requirements for successful tax-deferred property swaps.
</p> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-4xl mx-auto text-center mb-12"> <h2 class="text-3xl font-bold text-gray-900 mb-6">The 1031 Exchange Process</h2> <p class="text-xl text-gray-700">
A 1031 exchange allows you to sell investment property and reinvest the proceeds in new 
          property while deferring all capital gains taxes. Here's exactly how it works.
</p> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Complete Step-by-Step Process</h2> <div class="max-w-4xl mx-auto"> <div class="space-y-12"> <!-- Step 1 --> <div id="step-1" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">
1
</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Decide to Sell Your Property</h3> <p class="text-gray-700 mb-4">
When you're ready to sell your investment or business property, contact `, '\nas soon as you have a potential buyer or are listing the property. Early engagement \n                ensures proper planning and documentation.\n</p> <div class="bg-blue-50 border-l-4 border-blue-500 p-4"> <p class="text-blue-900 font-semibold">\u23F0 Timeline: Before listing or accepting an offer</p> <p class="text-blue-800">The earlier you involve us, the better we can structure your exchange for maximum benefit.</p> </div> </div> </div> <!-- Step 2 --> <div id="step-2" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">\n2\n</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Sign Exchange Documents</h3> <p class="text-gray-700 mb-4">\nBefore closing on your sale, you must sign our exchange agreement. This establishes\n', ` as your Qualified Intermediary and creates the legal framework for 
                your tax-deferred exchange. Learn more about <a href="/choosing-qualified-intermediary" class="text-blue-600 hover:text-blue-700 font-medium">choosing the right qualified intermediary</a> for your exchange.
</p> <div class="bg-red-50 border-l-4 border-red-500 p-4"> <p class="text-red-900 font-semibold">\u{1F6A8} Critical: Must be completed BEFORE closing</p> <p class="text-red-800">You cannot start a 1031 exchange after you've already closed on your sale.</p> </div> </div> </div> <!-- Step 3 --> <div id="step-3" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">
3
</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Close on Your Sale (Day 0)</h3> <p class="text-gray-700 mb-4">
At closing, your sale proceeds go directly to `, ' instead of to you. \n                We hold your funds in segregated, FDIC-insured accounts. We are bonded and \n                insured for your protection. Your exchange clock officially starts ticking.\n</p> <div class="bg-green-50 border-l-4 border-green-500 p-4"> <p class="text-green-900 font-semibold">\u2705 What happens at closing:</p> <ul class="text-green-800 mt-2 space-y-1"> <li>\u2022 Sale proceeds transferred directly to your QI</li> <li>\u2022 Funds deposited in secure, segregated account</li> <li>\u2022 Your 45-day identification period begins</li> <li>\u2022 Your 180-day exchange period begins</li> </ul> </div> </div> </div> <!-- Step 4 --> <div id="step-4" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">\n4\n</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Identify Replacement Properties (Day 1-45)</h3> <p class="text-gray-700 mb-4">\nYou have exactly 45 calendar days from your sale closing to identify potential \n                replacement properties in writing to ', `. Choose your identification 
                rule based on your investment strategy. Learn more about managing these <a href="/1031-exchange-timeline" class="text-blue-600 hover:text-blue-700 font-medium">critical deadlines and timeline requirements</a>.
</p> <div class="space-y-4"> <div class="bg-gray-50 p-4 rounded-lg"> <p class="font-semibold text-gray-900 mb-2">3-Property Rule (Most Popular)</p> <p class="text-gray-700">Identify up to 3 properties of any value. You can close on any or all of them.</p> </div> <div class="bg-gray-50 p-4 rounded-lg"> <p class="font-semibold text-gray-900 mb-2">200% Rule</p> <p class="text-gray-700">Identify unlimited properties as long as their total value doesn't exceed 200% of your sold property's value.</p> </div> <div class="bg-gray-50 p-4 rounded-lg"> <p class="font-semibold text-gray-900 mb-2">95% Rule</p> <p class="text-gray-700">Identify any number of properties, but you must purchase at least 95% of the total identified value.</p> </div> </div> <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4"> <p class="text-yellow-900 font-semibold">\u26A0\uFE0F Day 45 Deadline</p> <p class="text-yellow-800">Identification must be in writing and received by your QI by midnight on day 45. No extensions allowed.</p> </div> </div> </div> <!-- Step 5 --> <div id="step-5" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">
5
</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Shop and Negotiate (Day 1-180)</h3> <p class="text-gray-700 mb-4">
While your identification deadline is day 45, you can begin shopping for replacement 
                properties immediately after your sale closes. Negotiate purchases, secure financing, 
                and complete due diligence on your identified properties.
</p> <div class="bg-blue-50 border-l-4 border-blue-500 p-4"> <p class="text-blue-900 font-semibold">\u{1F4A1} Pro Tips:</p> <ul class="text-blue-800 mt-2 space-y-1"> <li>\u2022 Start shopping before your sale closes</li> <li>\u2022 Have backup properties identified</li> <li>\u2022 Secure financing pre-approval early</li> <li>\u2022 Coordinate with your real estate agent</li> </ul> </div> </div> </div> <!-- Step 6 --> <div id="step-6" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">
6
</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">Close on Replacement Property (By Day 180)</h3> <p class="text-gray-700 mb-4">
Complete your purchase within 180 days of your original sale (or by your tax return 
                due date, whichever is earlier). `, ` coordinates with your closing agent 
                to ensure proper fund transfers and documentation.
</p> <div class="bg-green-50 border-l-4 border-green-500 p-4"> <p class="text-green-900 font-semibold">\u2705 At replacement property closing:</p> <ul class="text-green-800 mt-2 space-y-1"> <li>\u2022 We transfer your exchange funds to closing</li> <li>\u2022 You receive title to your new property</li> <li>\u2022 Exchange documentation is completed</li> <li>\u2022 You've successfully deferred your taxes!</li> </ul> </div> </div> </div> <!-- Step 7 --> <div id="step-7" class="flex items-start"> <div class="flex-shrink-0 w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6">
7
</div> <div class="flex-grow"> <h3 class="text-2xl font-semibold text-gray-900 mb-3">File Your Tax Return</h3> <p class="text-gray-700 mb-4">
Report your exchange on IRS Form 8824 with your tax return. `, ' provides \n                all necessary documentation including exchange agreements, identification notices, \n                and closing statements.\n</p> <div class="bg-purple-50 border-l-4 border-purple-500 p-4"> <p class="text-purple-900 font-semibold">\u{1F4CB} We provide complete documentation:</p> <ul class="text-purple-800 mt-2 space-y-1"> <li>\u2022 Exchange agreement and amendments</li> <li>\u2022 Property identification forms</li> <li>\u2022 All closing statements</li> <li>\u2022 Form 8824 preparation assistance</li> </ul> </div> </div> </div> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Critical Timeline</h2> <div class="max-w-4xl mx-auto"> <div class="bg-gray-50 rounded-lg p-8"> <div class="relative"> <!-- Timeline Line --> <div class="absolute left-0 right-0 h-2 bg-gray-200 top-6 rounded-full"></div> <div class="absolute left-0 h-2 bg-blue-500 top-6 rounded-full" style="width: 25%"></div> <div class="absolute left-0 h-2 bg-green-500 top-6 rounded-full" style="width: 100%"></div> <!-- Timeline Points --> <div class="relative flex justify-between"> <!-- Day 0 --> <div class="text-center"> <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-4">\n0\n</div> <p class="text-sm font-semibold text-gray-900">Sale Closes</p> <p class="text-xs text-gray-600 mt-1">Exchange begins</p> </div> <!-- Day 45 --> <div class="text-center"> <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mb-4">\n45\n</div> <p class="text-sm font-semibold text-gray-900">ID Deadline</p> <p class="text-xs text-gray-600 mt-1">Must identify</p> </div> <!-- Day 180 --> <div class="text-center"> <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-4">\n180\n</div> <p class="text-sm font-semibold text-gray-900">Purchase Deadline</p> <p class="text-xs text-gray-600 mt-1">Must close</p> </div> </div> </div> <div class="mt-8 bg-red-50 rounded-lg p-6"> <h4 class="font-semibold text-red-900 mb-2 flex items-center"> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path> </svg>\nImportant: No Extensions Allowed\n</h4> <p class="text-red-800 text-sm">\nThese deadlines are set by federal law and cannot be extended for any reason, including \n              weekends, holidays, natural disasters, or personal emergencies. Learn more about the complete <a href="/1031-exchange-rules" class="text-red-600 hover:text-red-700 font-medium underline">IRS rules and regulations</a> governing 1031 exchanges.\n</p> </div> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Key Requirements</h2> <div class="max-w-4xl mx-auto"> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-white rounded-lg p-8 shadow-lg"> <h3 class="text-xl font-semibold text-gray-900 mb-6">To Defer ALL Taxes</h3> <ul class="space-y-4"> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Equal or Greater Value</p> <p class="text-gray-600">Purchase price \u2265 sale price</p> </div> </li> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Equal or Greater Debt</p> <p class="text-gray-600">New loan \u2265 paid-off loan (or add cash)</p> </div> </li> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Use All Proceeds</p> <p class="text-gray-600">Reinvest all sale proceeds</p> </div> </li> </ul> </div> <div class="bg-white rounded-lg p-8 shadow-lg"> <h3 class="text-xl font-semibold text-gray-900 mb-6">Property Requirements</h3> <ul class="space-y-4"> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Investment Use</p> <p class="text-gray-600">Both properties for business or investment</p> </div> </li> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Like-Kind</p> <p class="text-gray-600">Real property for real property</p> </div> </li> <li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <div> <p class="font-semibold text-gray-900">Same Taxpayer</p> <p class="text-gray-600">Same ownership structure</p> </div> </li> </ul> </div> </div> </div> </div> </section>  <section class="py-16 bg-blue-900"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold text-white mb-4">\nReady to Start Your 1031 Exchange?\n</h2> <p class="text-xl text-blue-100 mb-8">\nLet our experts guide you through every step of the process with confidence and security.\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/contact" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">\nGet Expert Guidance\n</a> <a href="/calculator" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">\nCalculate Your Savings\n</a> </div> <p class="mt-8 text-blue-200">\nQuestions? Call us at <a', ' class="text-yellow-400 hover:text-yellow-300 font-semibold">', '</a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), COMPANY.name, COMPANY.name, COMPANY.name, COMPANY.name, COMPANY.name, COMPANY.name, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript(howToSchema))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/how-it-works.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/how-it-works.astro";
const $$url = "/how-it-works";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HowItWorks,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
