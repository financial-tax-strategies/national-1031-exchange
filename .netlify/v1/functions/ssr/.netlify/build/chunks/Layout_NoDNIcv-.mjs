import { d as createComponent, m as maybeRenderHead, j as renderScript, r as renderTemplate, f as addAttribute, c as createAstro, i as renderComponent, n as renderSlot, l as renderHead } from './astro/server_DPvkWNif.mjs';
import 'kleur/colors';
/* empty css                         */
import 'clsx';

const COMPANY = {
  name: "National 1031 Center",
  // Contact Information
  phone: {
    main: "(877) 483-0427",
    mainFormatted: "877-483-0427",
    emergency: "(877) 483-0427"},
  email: {
    main: "info@the1031center.com",
    support: "support@the1031center.com"
  },
  // Address
  address: {
    street: "1313 N. Milpitas Blvd, Suite 155",
    city: "Milpitas",
    state: "CA",
    zip: "95035",
    country: "United States",
    countryCode: "US"
  },
  url: "https://the1031center.com"};
const getPhoneLink = (type = "main") => {
  const phone = type === "emergency" ? COMPANY.phone.emergency : COMPANY.phone.main;
  return `tel:+1${phone.replace(/[^0-9]/g, "")}`;
};
const getEmailLink = (type = "main") => {
  const email = type === "support" ? COMPANY.email.support : COMPANY.email.main;
  return `mailto:${email}`;
};

const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="bg-white shadow-lg sticky top-0 z-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center h-16"> <!-- Logo --> <div class="flex-shrink-0 flex items-center"> <a href="/" class="text-2xl font-bold text-blue-900"> ${COMPANY.name} </a> </div> <!-- Desktop Navigation --> <div class="hidden md:block"> <div class="ml-10 flex items-baseline space-x-4"> <!-- 1031 Services Mega Menu (Combines Services + How It Works) --> <div class="relative group"> <button class="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
1031 Services
<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <!-- Enhanced Mega Menu --> <div class="absolute left-0 mt-2 w-[600px] bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> <div class="py-6 px-6 grid grid-cols-2 gap-6"> <div> <h3 class="text-sm font-semibold text-gray-900 mb-3">Exchange Types</h3> <div class="space-y-2"> <a href="/services/delayed-exchange" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">Delayed Exchange</span> <span class="text-xs text-gray-500 block">Most common - 45/180 day timeline</span> </a> <a href="/services/reverse-exchange" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">Reverse Exchange</span> <span class="text-xs text-gray-500 block">Buy first, then sell</span> </a> <a href="/services/improvement-exchange" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">Improvement Exchange</span> <span class="text-xs text-gray-500 block">Add value during exchange</span> </a> <a href="/services/partial-exchange" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">Partial Exchange</span> <span class="text-xs text-gray-500 block">Exchange with cash out</span> </a> </div> </div> <div> <h3 class="text-sm font-semibold text-gray-900 mb-3">Getting Started</h3> <div class="space-y-2"> <a href="/how-it-works" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">How It Works</span> <span class="text-xs text-gray-500 block">Step-by-step process guide</span> </a> <a href="/1031-exchange-timeline" class="block text-sm text-gray-600 hover:text-blue-900 transition-colors"> <span class="font-medium">Timeline & Deadlines</span> <span class="text-xs text-gray-500 block">Critical dates calculator</span> </a> <div class="mt-4 pt-4 border-t border-gray-200"> <a href="/start-exchange" class="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700">
Start Your Exchange
<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> </div> </div> </div> </div> <!-- Resources & Tools Mega Menu (Combines Resources + Property Types + Scenarios) --> <div class="relative group"> <button class="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
Resources & Tools
<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <!-- Enhanced Mega Menu --> <div class="absolute left-0 mt-2 w-[800px] bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> <div class="py-6 px-6 grid grid-cols-4 gap-6"> <!-- Learning Center Column --> <div> <h3 class="text-sm font-semibold text-gray-900 mb-3">Learning Center</h3> <div class="space-y-2"> <a href="/complete-guide-1031-exchanges" class="block text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
Complete Guide
</a> <a href="/1031-exchange-rules" class="block text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
Exchange Rules
</a> <a href="/types-of-1031-exchanges" class="block text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
Types of Exchanges
</a> <a href="/choosing-qualified-intermediary" class="block text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
Choosing a QI
</a> <a href="/faq" class="block text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
FAQ
</a> </div> </div> <!-- Interactive Tools Column --> <div> <h3 class="text-sm font-semibold text-gray-900 mb-3">Interactive Tools</h3> <div class="space-y-2"> <a href="/calculator" class="block bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors"> <p class="text-sm font-medium text-gray-900">Tax Savings Calculator</p> <p class="text-xs text-gray-600 mt-1">Estimate your savings</p> </a> <a href="/timeline-calculator" class="block bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors"> <p class="text-sm font-medium text-gray-900">Timeline Calculator</p> <p class="text-xs text-gray-600 mt-1">Track your deadlines</p> </a> </div> </div> <!-- Browse By Column --> <div> <h3 class="text-sm font-semibold text-gray-900 mb-3">Browse By</h3> <div class="space-y-3"> <a href="/property-types" class="block"> <div class="flex items-center justify-between"> <span class="text-sm text-gray-600 hover:text-blue-900">Property Types</span> <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">20 types</span> </div> </a> <a href="/scenarios" class="block"> <div class="flex items-center justify-between"> <span class="text-sm text-gray-600 hover:text-blue-900">Common Scenarios</span> <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">30 scenarios</span> </div> </a> </div> <div class="mt-4 pt-4 border-t border-gray-200"> <p class="text-xs font-semibold text-gray-500 mb-2">Popular Topics</p> <div class="space-y-1"> <a href="/property-types/residential-rental" class="text-xs text-blue-600 hover:text-blue-700 block">→ Residential Rentals</a> <a href="/scenarios/exchange-multiple-properties" class="text-xs text-blue-600 hover:text-blue-700 block">→ Multiple Properties</a> </div> </div> </div> <!-- Quick Actions Column --> <div class="bg-gray-50 -m-6 ml-0 p-6 rounded-r-md"> <h3 class="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3> <div class="space-y-2"> <a href="/schedule" class="block w-full bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors text-center">
Schedule Consultation
</a> <a href="/start-exchange" class="block w-full bg-yellow-400 text-blue-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-300 transition-colors text-center">
Start Exchange
</a> </div> </div> </div> </div> </div> <!-- Locations --> <div class="relative group"> <button class="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
Locations
<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div class="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> <div class="py-4 px-6"> <h3 class="text-sm font-semibold text-gray-900 mb-2">Popular States</h3> <div class="grid grid-cols-2 gap-2"> <a href="/locations/california" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">California</a> <a href="/locations/texas" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">Texas</a> <a href="/locations/florida" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">Florida</a> <a href="/locations/new-york" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">New York</a> <a href="/locations/illinois" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">Illinois</a> <a href="/locations/arizona" class="text-sm text-gray-600 hover:text-blue-900 transition-colors">Arizona</a> </div> <div class="mt-3 pt-3 border-t border-gray-200"> <a href="/locations" class="text-sm text-blue-900 hover:text-blue-700 font-medium">
View All 50 States →
</a> </div> </div> </div> </div> <!-- About Dropdown --> <div class="relative group"> <button class="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
About
<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> <div class="py-2"> <a href="/about" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
About Us
</a> <a href="/team" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
Our Team
</a> <a href="/testimonials" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
Testimonials
</a> <a href="/comparisons" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
QI Comparisons
</a> <a href="/trust-security" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
Trust & Security
</a> <a href="/contact" class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors">
Contact
</a> </div> </div> </div> </div> </div> <!-- CTA Buttons --> <div class="hidden md:flex space-x-3"> <a href="/start-exchange" class="bg-yellow-400 text-blue-900 px-6 py-2 rounded-md text-sm font-medium hover:bg-yellow-300 transition-colors duration-200 shadow-sm hover:shadow-md">
Start Your Exchange
</a> <a href="/schedule" class="bg-blue-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors duration-200 shadow-sm hover:shadow-md">
Free Consultation
</a> </div> <!-- Mobile menu button --> <div class="md:hidden"> <button type="button" class="mobile-menu-button text-gray-700 hover:text-blue-900 focus:outline-none focus:text-blue-900 transition-colors duration-200"> <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> <!-- Mobile Navigation Menu --> <div class="mobile-menu hidden md:hidden"> <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50"> <!-- 1031 Services Section --> <div class="mobile-section"> <button class="mobile-section-button w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 rounded-md flex items-center justify-between"> <span>1031 Services</span> <svg class="h-5 w-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div class="mobile-section-content hidden pl-6 space-y-1"> <a href="/services/delayed-exchange" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Delayed Exchange
</a> <a href="/services/reverse-exchange" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Reverse Exchange
</a> <a href="/services/improvement-exchange" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Improvement Exchange
</a> <a href="/services/partial-exchange" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Partial Exchange
</a> <a href="/how-it-works" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
How It Works
</a> </div> </div> <!-- Resources & Tools Section --> <div class="mobile-section"> <button class="mobile-section-button w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 rounded-md flex items-center justify-between"> <span>Resources & Tools</span> <svg class="h-5 w-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div class="mobile-section-content hidden pl-6 space-y-1"> <a href="/complete-guide-1031-exchanges" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Complete Guide
</a> <a href="/calculator" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Tax Calculator
</a> <a href="/timeline-calculator" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Timeline Calculator
</a> <a href="/property-types" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Property Types
</a> <a href="/scenarios" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Scenarios
</a> <a href="/faq" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-md">
FAQ
</a> </div> </div> <!-- Direct Links --> <a href="/locations" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Locations
</a> <a href="/about" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
About Us
</a> <a href="/team" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Our Team
</a> <a href="/testimonials" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Testimonials
</a> <a href="/comparisons" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
QI Comparisons
</a> <a href="/trust-security" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Trust & Security
</a> <a href="/contact" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-md">
Contact
</a> <!-- Mobile CTAs --> <div class="pt-4 space-y-2"> <a href="/start-exchange" class="block px-3 py-2 text-base font-medium bg-yellow-400 text-blue-900 hover:bg-yellow-300 rounded-md text-center">
Start Your Exchange
</a> <a href="/schedule" class="block px-3 py-2 text-base font-medium bg-blue-900 text-white hover:bg-blue-800 rounded-md text-center">
Free Consultation
</a> </div> </div> </div> </div> </nav> ${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-900 text-white py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid md:grid-cols-4 gap-8 mb-8"> <!-- Company Info --> <div class="md:col-span-2"> <h3 class="text-xl font-bold mb-4">${COMPANY.name}</h3> <p class="text-gray-400 mb-4">
America's most trusted 1031 exchange qualified intermediary. 
          Helping investors defer capital gains taxes since 2024.
</p> <div class="flex space-x-4"> <a href="https://www.linkedin.com/company/national1031center" class="text-gray-400 hover:text-white transition-colors"> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path> </svg> </a> <a href="https://www.facebook.com/national1031center" class="text-gray-400 hover:text-white transition-colors"> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a> <a href="https://twitter.com/national1031" class="text-gray-400 hover:text-white transition-colors"> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path> </svg> </a> </div> </div> <!-- Quick Links --> <div> <h4 class="text-lg font-semibold mb-4">Quick Links</h4> <ul class="space-y-2"> <li><a href="/calculator" class="text-gray-400 hover:text-white transition-colors">Tax Savings Calculator</a></li> <li><a href="/complete-guide-1031-exchanges" class="text-gray-400 hover:text-white transition-colors">Complete Guide</a></li> <li><a href="/how-it-works" class="text-gray-400 hover:text-white transition-colors">How It Works</a></li> <li><a href="/faq" class="text-gray-400 hover:text-white transition-colors">FAQ</a></li> <li><a href="/about" class="text-gray-400 hover:text-white transition-colors">About Us</a></li> <li><a href="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li> </ul> </div> <!-- Contact Info --> <div> <h4 class="text-lg font-semibold mb-4">Contact Us</h4> <div class="space-y-3"> <p class="text-gray-400"> <a${addAttribute(getPhoneLink(), "href")} class="hover:text-white transition-colors" onclick="if(window.trackPhoneCall) window.trackPhoneCall('footer');"> ${COMPANY.phone.main} </a> </p> <p class="text-gray-400"> <a${addAttribute(getEmailLink(), "href")} class="hover:text-white transition-colors"> ${COMPANY.email.main} </a> </p> <p class="text-gray-400"> ${COMPANY.address.street}<br> ${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip} </p> <p class="text-yellow-400 font-semibold">
24/7 Emergency Support
</p> </div> </div> </div> <!-- Bottom Bar --> <div class="pt-8 border-t border-gray-800 text-center"> <p class="text-gray-400 text-sm">
© 2024 ${COMPANY.name}. All rights reserved. |
<a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a> |
<a href="/terms" class="hover:text-white transition-colors">Terms of Service</a> |
<a href="/disclaimer" class="hover:text-white transition-colors">Disclaimer</a> </p> </div> </div> </footer>`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/Footer.astro", void 0);

const $$GoogleAnalytics = createComponent(($$result, $$props, $$slots) => {
  const isProduction = false;
  return renderTemplate`${isProduction}${renderTemplate`${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/analytics/GoogleAnalytics.astro?astro&type=script&index=1&lang.ts")}`}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/analytics/GoogleAnalytics.astro", void 0);

const $$GoogleTagManager = createComponent(($$result, $$props, $$slots) => {
  const isProduction = false;
  return renderTemplate`${isProduction}${renderTemplate`${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/analytics/GoogleTagManager.astro?astro&type=script&index=1&lang.ts")}`}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/analytics/GoogleTagManager.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://the1031center.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "America's most trusted 1031 exchange qualified intermediary. Defer capital gains taxes with our expert guidance and industry-leading security.",
    image = "/images/og-image.jpg",
    canonical,
    noindex = false
  } = Astro2.props;
  const site = COMPANY.url;
  const fullTitle = title.includes(COMPANY.name) ? title : `${title} | ${COMPANY.name}`;
  const canonicalURL = canonical || new URL(Astro2.url.pathname, site);
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg" fetchpriority="high"><meta name="generator"', "><!-- SEO Meta Tags --><title>", '</title><meta name="description"', '><link rel="canonical"', ">", '<!-- PWA and Mobile --><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#1e3a8a"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title"', '><!-- Additional SEO --><meta name="author"', '><meta name="publisher"', '><meta name="copyright"', '><meta name="language" content="English"><meta name="geo.region" content="US"><meta name="geo.placename" content="United States"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name"', '><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', `><!-- Preconnect to external domains --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://www.google-analytics.com"><!-- DNS Prefetch for additional domains --><link rel="dns-prefetch" href="https://www.googletagmanager.com"><link rel="dns-prefetch" href="https://fonts.googleapis.com"><!-- Schema.org JSON-LD --><script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Organization", "LocalBusiness", "FinancialService"],
          "@id": "https://the1031center.com/#organization",
          "name": "National 1031 Center",
          "alternateName": ["The 1031 Center", "National 1031 Exchange Center"],
          "legalName": "National 1031 Center, LLC",
          "url": "https://the1031center.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://the1031center.com/images/logo.png",
            "width": 300,
            "height": 100
          },
          "image": "https://the1031center.com/images/og-image.jpg",
          "description": "America's most trusted 1031 exchange qualified intermediary, facilitating tax-deferred property exchanges nationwide with industry-leading security and expertise.",
          "slogan": "America's Most Trusted 1031 Exchange Partner",
          "foundingDate": "2024",
          "telephone": "(877) 483-0427",
          "email": "info@the1031center.com",
          "priceRange": "$$",
          "currenciesAccepted": "USD",
          "paymentAccepted": ["Wire Transfer", "ACH", "Check"],
          "openingHours": "Mo-Fr 08:00-18:00",
          "sameAs": [
            "https://www.linkedin.com/company/national1031center",
            "https://www.facebook.com/national1031center",
            "https://twitter.com/national1031",
            "https://www.youtube.com/@national1031center"
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+1-877-483-0427",
              "contactType": "customer service",
              "areaServed": "US",
              "availableLanguage": ["English", "Spanish"],
              "contactOption": ["TollFree", "HearingImpairedSupported"]
            },
            {
              "@type": "ContactPoint",
              "telephone": "+1-877-483-0427",
              "contactType": "sales",
              "areaServed": "US",
              "availableLanguage": "English"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Exchange Plaza",
            "addressLocality": "Los Angeles",
            "addressRegion": "CA",
            "postalCode": "90210",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 34.0522,
            "longitude": -118.2437
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "memberOf": [
            {
              "@type": "Organization",
              "name": "Federation of Exchange Accommodators"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "1031 Exchange Services",
            "itemListElement": [
              {
                "@type": "Service",
                "name": "Delayed 1031 Exchange",
                "description": "Standard forward exchange with 45-day identification period"
              },
              {
                "@type": "Service",
                "name": "Reverse 1031 Exchange",
                "description": "Purchase replacement property before selling relinquished property"
              },
              {
                "@type": "Service",
                "name": "Improvement Exchange",
                "description": "Use exchange funds for property improvements"
              },
              {
                "@type": "Service",
                "name": "Partial Exchange",
                "description": "Strategic cash-out while deferring most taxes"
              }
            ]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "247",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://the1031center.com/#website",
          "url": "https://the1031center.com",
          "name": "National 1031 Center",
          "description": "Complete resource for 1031 exchange services and information",
          "publisher": {
            "@id": "https://the1031center.com/#organization"
          },
          "inLanguage": "en-US",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://the1031center.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Service",
          "@id": "https://the1031center.com/#service",
          "name": "1031 Exchange Services",
          "serviceType": "Qualified Intermediary Services",
          "provider": {
            "@id": "https://the1031center.com/#organization"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "1031 Exchange Types",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Delayed Exchange",
                  "description": "Sell first, then buy replacement property within 180 days"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Reverse Exchange",
                  "description": "Buy replacement property before selling current property"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Improvement Exchange",
                  "description": "Use exchange funds for construction or improvements"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Partial Exchange",
                  "description": "Defer taxes on portion of proceeds while taking some cash"
                }
              }
            ]
          }
        }
      ]
    }
    <\/script><!-- Analytics -->`, "", "", '</head> <body class="min-h-screen bg-white flex flex-col"> <!-- Google Tag Manager (noscript) --> <noscript> <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe> </noscript> ', ' <main class="flex-grow"> ', " </main> ", " </body></html>"])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), fullTitle, addAttribute(description, "content"), addAttribute(canonicalURL, "href"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, addAttribute(COMPANY.name, "content"), addAttribute(COMPANY.name, "content"), addAttribute(COMPANY.name, "content"), addAttribute(`\xA9 2024 ${COMPANY.name}`, "content"), addAttribute(canonicalURL, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(new URL(image, site), "content"), addAttribute(COMPANY.name, "content"), addAttribute(canonicalURL, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(new URL(image, site), "content"), renderComponent($$result, "GoogleTagManager", $$GoogleTagManager, {}), renderComponent($$result, "GoogleAnalytics", $$GoogleAnalytics, {}), renderHead(), renderComponent($$result, "Navigation", $$Navigation, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/layouts/Layout.astro", void 0);

export { $$Layout as $, COMPANY as C, getEmailLink as a, getPhoneLink as g };
