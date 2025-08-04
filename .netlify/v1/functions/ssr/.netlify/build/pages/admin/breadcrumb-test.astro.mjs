import { d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_NoDNIcv-.mjs';
import { $ as $$Breadcrumbs } from '../../chunks/Breadcrumbs_BLBGUB5A.mjs';
export { renderers } from '../../renderers.mjs';

const $$BreadcrumbTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Breadcrumb Test | The 1031 Center" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold mb-4">Dark Theme Breadcrumbs (Good Contrast)</h2> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "theme": "dark", "items": [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Our Team" }
  ] })} </div> </section>  <section class="bg-white py-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold mb-4 text-gray-900">Light Theme Breadcrumbs (Default)</h2> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Delayed Exchange" }
  ] })} </div> </section>  <section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold mb-4">Custom Tailwind Classes Approach</h2> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": [
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "FAQ" }
  ], "class": "[&_a]:text-blue-200 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60" })} </div> </section>  <section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold mb-4">Before/After Comparison</h2> <div class="space-y-4"> <div> <p class="text-sm text-blue-200 mb-2">❌ Before (Poor Contrast - Hard to Read):</p> <nav class="text-sm"> <ol class="flex items-center space-x-2"> <li><a href="/" class="text-gray-600">Home</a></li> <li class="text-gray-400">›</li> <li><a href="/about" class="text-gray-600">About</a></li> <li class="text-gray-400">›</li> <li><span class="text-gray-900">Our Team</span></li> </ol> </nav> </div> <div> <p class="text-sm text-blue-200 mb-2">✅ After (Good Contrast - Easy to Read):</p> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "theme": "dark", "items": [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Our Team" }
  ] })} </div> </div> </div> </section> ` })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/breadcrumb-test.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/breadcrumb-test.astro";
const $$url = "/admin/breadcrumb-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BreadcrumbTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
