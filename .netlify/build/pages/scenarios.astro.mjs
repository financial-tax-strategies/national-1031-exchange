import { d as createComponent, i as renderComponent, r as renderTemplate, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_NoDNIcv-.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const scenarioCategories = [
    {
      name: "Portfolio Strategy",
      description: "Consolidate, diversify, or optimize your real estate portfolio",
      icon: "\u{1F4CA}",
      scenarios: [
        { slug: "exchange-multiple-properties", title: "Exchange Multiple Properties", difficulty: "Advanced" },
        { slug: "consolidate-properties", title: "Consolidate Properties", difficulty: "Intermediate" },
        { slug: "diversify-portfolio", title: "Diversify Your Portfolio", difficulty: "Intermediate" },
        { slug: "exchange-into-delaware-statutory-trust", title: "Exchange into DST", difficulty: "Intermediate" }
      ]
    },
    {
      name: "Geographic Strategy",
      description: "Relocate your investments or expand into new markets",
      icon: "\u{1F5FA}\uFE0F",
      scenarios: [
        { slug: "exchange-into-different-state", title: "Exchange to Different State", difficulty: "Intermediate" },
        { slug: "exchange-out-of-high-tax-state", title: "Exit High-Tax States", difficulty: "Advanced" },
        { slug: "exchange-into-opportunity-zone", title: "Exchange to Opportunity Zone", difficulty: "Advanced" }
      ]
    },
    {
      name: "Financial Planning",
      description: "Optimize cash flow, financing, and tax strategies",
      icon: "\u{1F4B0}",
      scenarios: [
        { slug: "exchange-with-boot", title: "Exchange with Boot", difficulty: "Intermediate" },
        { slug: "refinance-during-exchange", title: "Refinance During Exchange", difficulty: "Advanced" },
        { slug: "exchange-to-reduce-management", title: "Reduce Management Burden", difficulty: "Beginner" },
        { slug: "exchange-to-increase-cash-flow", title: "Increase Cash Flow", difficulty: "Intermediate" }
      ]
    },
    {
      name: "Special Situations",
      description: "Navigate unique circumstances and complex scenarios",
      icon: "\u26A1",
      scenarios: [
        { slug: "exchange-inherited-property", title: "Exchange Inherited Property", difficulty: "Advanced" },
        { slug: "exchange-with-partners", title: "Exchange with Partners", difficulty: "Advanced" },
        { slug: "exchange-from-personal-residence", title: "Exchange from Personal Residence", difficulty: "Expert" },
        { slug: "exchange-vacation-rental", title: "Exchange Vacation Rental", difficulty: "Intermediate" },
        { slug: "exchange-foreign-property", title: "Exchange Foreign Property", difficulty: "Expert" }
      ]
    },
    {
      name: "Estate & Retirement Planning",
      description: "Align your exchanges with long-term wealth strategies",
      icon: "\u{1F3DB}\uFE0F",
      scenarios: [
        { slug: "exchange-for-estate-planning", title: "Estate Planning Exchange", difficulty: "Advanced" },
        { slug: "exchange-before-retirement", title: "Pre-Retirement Exchange", difficulty: "Intermediate" },
        { slug: "exchange-with-ira-llc", title: "Exchange with IRA/LLC", difficulty: "Expert" }
      ]
    },
    {
      name: "Entity & Ownership",
      description: "Handle complex ownership structures and entity changes",
      icon: "\u{1F3E2}",
      scenarios: [
        { slug: "exchange-llc-property", title: "Exchange LLC Property", difficulty: "Intermediate" },
        { slug: "exchange-partnership-property", title: "Exchange Partnership Property", difficulty: "Advanced" },
        { slug: "exchange-with-tenancy-in-common", title: "Exchange with TIC", difficulty: "Advanced" },
        { slug: "drop-and-swap-exchange", title: "Drop and Swap Exchange", difficulty: "Expert" }
      ]
    },
    {
      name: "Property Type Transitions",
      description: "Change property types or investment strategies",
      icon: "\u{1F504}",
      scenarios: [
        { slug: "exchange-into-commercial-property", title: "Move to Commercial", difficulty: "Intermediate" },
        { slug: "exchange-raw-land", title: "Exchange Raw Land", difficulty: "Advanced" },
        { slug: "exchange-into-net-lease-property", title: "Exchange to NNN Property", difficulty: "Beginner" }
      ]
    },
    {
      name: "Risk Management",
      description: "Protect your investment and ensure exchange success",
      icon: "\u{1F6E1}\uFE0F",
      scenarios: [
        { slug: "failed-exchange-recovery", title: "Failed Exchange Recovery", difficulty: "Expert" },
        { slug: "simultaneous-exchange", title: "Simultaneous Exchange", difficulty: "Intermediate" },
        { slug: "reverse-exchange-strategy", title: "Reverse Exchange Strategy", difficulty: "Advanced" }
      ]
    }
  ];
  const totalScenarios = scenarioCategories.reduce((sum, cat) => sum + cat.scenarios.length, 0);
  const difficultyColors = {
    "Beginner": "bg-green-100 text-green-800",
    "Intermediate": "bg-yellow-100 text-yellow-800",
    "Advanced": "bg-orange-100 text-orange-800",
    "Expert": "bg-red-100 text-red-800"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "1031 Exchange Scenarios - Real-World Situations & Solutions", "description": `Explore ${totalScenarios} specific 1031 exchange scenarios with step-by-step guidance. From portfolio consolidation to estate planning, find solutions for your unique situation.` }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-4xl md:text-5xl font-bold mb-6">\n1031 Exchange Scenarios\n</h1> <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">\nReal-world situations and proven solutions for every type of exchange\n</p> <div class="flex flex-wrap justify-center gap-4 text-sm"> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"> ', ' Scenarios\n</div> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"> ', ` Categories
</div> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
All Difficulty Levels
</div> </div> </div> </div> </section>  <section class="py-12 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-3xl mx-auto text-center"> <p class="text-lg text-gray-700 mb-8">
Every 1031 exchange is unique. Whether you're consolidating multiple properties, 
          navigating partnership structures, or planning for retirement, understanding how to 
          handle your specific situation is crucial for exchange success.
</p> <div class="bg-blue-50 border-l-4 border-blue-500 p-6 text-left"> <p class="text-gray-700"> <strong>Expert Guidance:</strong> Each scenario includes step-by-step strategies, 
            potential challenges, real-world examples, and specific IRS considerations to help 
            you navigate your exchange with confidence.
</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="space-y-12"> `, ' </div> </div> </section>  <section class="py-12 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold text-center mb-8">Find Your Scenario</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Investor Type</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-multiple-properties" class="text-blue-600 hover:underline">Portfolio Investors</a></li> <li><a href="/scenarios/exchange-before-retirement" class="text-blue-600 hover:underline">Retiring Investors</a></li> <li><a href="/scenarios/exchange-to-reduce-management" class="text-blue-600 hover:underline">Passive Investors</a></li> <li><a href="/scenarios/exchange-with-partners" class="text-blue-600 hover:underline">Partnership Investors</a></li> </ul> </div> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Goal</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-to-increase-cash-flow" class="text-blue-600 hover:underline">Increase Income</a></li> <li><a href="/scenarios/consolidate-properties" class="text-blue-600 hover:underline">Simplify Portfolio</a></li> <li><a href="/scenarios/exchange-out-of-high-tax-state" class="text-blue-600 hover:underline">Reduce Taxes</a></li> <li><a href="/scenarios/diversify-portfolio" class="text-blue-600 hover:underline">Diversify Risk</a></li> </ul> </div> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Complexity</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-into-net-lease-property" class="text-blue-600 hover:underline">Simple Exchanges</a></li> <li><a href="/scenarios/exchange-llc-property" class="text-blue-600 hover:underline">Entity Structures</a></li> <li><a href="/scenarios/drop-and-swap-exchange" class="text-blue-600 hover:underline">Complex Strategies</a></li> <li><a href="/scenarios/failed-exchange-recovery" class="text-blue-600 hover:underline">Problem Resolution</a></li> </ul> </div> </div> </div> </section>  <section class="py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-4">\nNeed Help with Your Specific Scenario?\n</h2> <p class="text-xl text-blue-100 mb-8">\nOur exchange experts can guide you through even the most complex situations\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/schedule" class="bg-yellow-400 text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors text-lg">\nSchedule Free Consultation\n</a> <a href="/calculator" class="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-lg">\nCalculate Your Savings\n</a> </div> </div> </section>  <script type="application/ld+json">\n    {JSON.stringify({\n      "@context": "https://schema.org",\n      "@type": "CollectionPage",\n      "name": "1031 Exchange Scenarios",\n      "description": `${totalScenarios} real-world 1031 exchange scenarios with step-by-step guidance`,\n      "url": `https://the1031center.com/scenarios`,\n      "provider": {\n        "@type": "Organization",\n        "name": COMPANY.name,\n        "url": "https://the1031center.com"\n      },\n      "mainEntity": {\n        "@type": "ItemList",\n        "itemListElement": scenarioCategories.flatMap((category, catIndex) => \n          category.scenarios.map((scenario, scenIndex) => ({\n            "@type": "ListItem",\n            "position": catIndex * 10 + scenIndex + 1,\n            "name": scenario.title,\n            "url": `https://the1031center.com/scenarios/${scenario.slug}`\n          }))\n        )\n      }\n    })}\n  <\/script> '], ["  ", '<section class="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-4xl md:text-5xl font-bold mb-6">\n1031 Exchange Scenarios\n</h1> <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">\nReal-world situations and proven solutions for every type of exchange\n</p> <div class="flex flex-wrap justify-center gap-4 text-sm"> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"> ', ' Scenarios\n</div> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"> ', ` Categories
</div> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
All Difficulty Levels
</div> </div> </div> </div> </section>  <section class="py-12 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-3xl mx-auto text-center"> <p class="text-lg text-gray-700 mb-8">
Every 1031 exchange is unique. Whether you're consolidating multiple properties, 
          navigating partnership structures, or planning for retirement, understanding how to 
          handle your specific situation is crucial for exchange success.
</p> <div class="bg-blue-50 border-l-4 border-blue-500 p-6 text-left"> <p class="text-gray-700"> <strong>Expert Guidance:</strong> Each scenario includes step-by-step strategies, 
            potential challenges, real-world examples, and specific IRS considerations to help 
            you navigate your exchange with confidence.
</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="space-y-12"> `, ' </div> </div> </section>  <section class="py-12 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold text-center mb-8">Find Your Scenario</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Investor Type</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-multiple-properties" class="text-blue-600 hover:underline">Portfolio Investors</a></li> <li><a href="/scenarios/exchange-before-retirement" class="text-blue-600 hover:underline">Retiring Investors</a></li> <li><a href="/scenarios/exchange-to-reduce-management" class="text-blue-600 hover:underline">Passive Investors</a></li> <li><a href="/scenarios/exchange-with-partners" class="text-blue-600 hover:underline">Partnership Investors</a></li> </ul> </div> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Goal</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-to-increase-cash-flow" class="text-blue-600 hover:underline">Increase Income</a></li> <li><a href="/scenarios/consolidate-properties" class="text-blue-600 hover:underline">Simplify Portfolio</a></li> <li><a href="/scenarios/exchange-out-of-high-tax-state" class="text-blue-600 hover:underline">Reduce Taxes</a></li> <li><a href="/scenarios/diversify-portfolio" class="text-blue-600 hover:underline">Diversify Risk</a></li> </ul> </div> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="font-semibold text-lg mb-3">By Complexity</h3> <ul class="space-y-2 text-sm"> <li><a href="/scenarios/exchange-into-net-lease-property" class="text-blue-600 hover:underline">Simple Exchanges</a></li> <li><a href="/scenarios/exchange-llc-property" class="text-blue-600 hover:underline">Entity Structures</a></li> <li><a href="/scenarios/drop-and-swap-exchange" class="text-blue-600 hover:underline">Complex Strategies</a></li> <li><a href="/scenarios/failed-exchange-recovery" class="text-blue-600 hover:underline">Problem Resolution</a></li> </ul> </div> </div> </div> </section>  <section class="py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-4">\nNeed Help with Your Specific Scenario?\n</h2> <p class="text-xl text-blue-100 mb-8">\nOur exchange experts can guide you through even the most complex situations\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/schedule" class="bg-yellow-400 text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors text-lg">\nSchedule Free Consultation\n</a> <a href="/calculator" class="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-lg">\nCalculate Your Savings\n</a> </div> </div> </section>  <script type="application/ld+json">\n    {JSON.stringify({\n      "@context": "https://schema.org",\n      "@type": "CollectionPage",\n      "name": "1031 Exchange Scenarios",\n      "description": \\`\\${totalScenarios} real-world 1031 exchange scenarios with step-by-step guidance\\`,\n      "url": \\`https://the1031center.com/scenarios\\`,\n      "provider": {\n        "@type": "Organization",\n        "name": COMPANY.name,\n        "url": "https://the1031center.com"\n      },\n      "mainEntity": {\n        "@type": "ItemList",\n        "itemListElement": scenarioCategories.flatMap((category, catIndex) => \n          category.scenarios.map((scenario, scenIndex) => ({\n            "@type": "ListItem",\n            "position": catIndex * 10 + scenIndex + 1,\n            "name": scenario.title,\n            "url": \\`https://the1031center.com/scenarios/\\${scenario.slug}\\`\n          }))\n        )\n      }\n    })}\n  <\/script> '])), maybeRenderHead(), totalScenarios, scenarioCategories.length, scenarioCategories.map((category) => renderTemplate`<div class="bg-white rounded-lg shadow-lg overflow-hidden"> <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4"> <div class="flex items-center justify-between"> <div class="flex items-center"> <span class="text-3xl mr-3">${category.icon}</span> <div> <h2 class="text-xl font-bold text-white">${category.name}</h2> <p class="text-blue-100 text-sm">${category.description}</p> </div> </div> <span class="bg-white/20 text-white px-3 py-1 rounded-full text-sm"> ${category.scenarios.length} scenarios
</span> </div> </div> <div class="p-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${category.scenarios.map((scenario) => renderTemplate`<a${addAttribute(`/scenarios/${scenario.slug}`, "href")} class="group border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200"> <div class="flex items-start justify-between"> <div class="flex-1"> <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"> ${scenario.title} </h3> <p class="text-sm text-gray-600 mt-1">
Learn the strategies and requirements
</p> </div> <span${addAttribute(`ml-3 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${difficultyColors[scenario.difficulty]}`, "class")}> ${scenario.difficulty} </span> </div> </a>`)} </div> </div> </div>`)) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/scenarios/index.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/scenarios/index.astro";
const $$url = "/scenarios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
