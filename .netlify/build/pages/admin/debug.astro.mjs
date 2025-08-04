import { d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
export { renderers } from '../../renderers.mjs';

const $$Debug = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Debug - Admin" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <h1 class="text-3xl font-bold mb-8">Debug Information</h1> <div class="bg-white p-6 rounded-lg shadow-md mb-6"> <h2 class="text-xl font-semibold mb-4">Quick Navigation</h2> <div class="space-y-2"> <p><a href="/admin" class="text-blue-600 hover:underline">Admin Dashboard</a></p> <p><a href="/admin/highlevel-config" class="text-blue-600 hover:underline">HighLevel Config</a></p> <p><a href="/admin/test-integration" class="text-blue-600 hover:underline">Test Integration</a></p> </div> </div> <div class="bg-yellow-50 p-6 rounded-lg shadow-md"> <h2 class="text-xl font-semibold mb-4">Troubleshooting</h2> <p class="mb-2">If you're getting "page not found" errors:</p> <ol class="list-decimal list-inside space-y-1"> <li>Try refreshing the page</li> <li>Make sure the URL is exactly: /admin/highlevel-config</li> <li>Check the browser console for any JavaScript errors</li> <li>Try navigating from the admin dashboard</li> </ol> </div> </div> </main> ` })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/debug.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/debug.astro";
const $$url = "/admin/debug";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Debug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
