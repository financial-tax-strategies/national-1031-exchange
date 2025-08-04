import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
export { renderers } from '../../renderers.mjs';

const $$TestTeamUpdate = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Team Update Test" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <h1 class="text-3xl font-bold mb-8">Team Member Update Test</h1> <div class="bg-white shadow-md rounded-lg p-6 mb-6"> <h2 class="text-xl font-semibold mb-4">Test Ruth Benjamin Update</h2> <div class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700">Job Title</label> <input type="text" id="jobTitle" value="Chief Client Success Officer" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> </div> <button id="testUpdate" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
Test Update
</button> </div> </div> <div class="bg-gray-50 rounded-lg p-6"> <h3 class="text-lg font-semibold mb-2">Test Results</h3> <pre id="results" class="whitespace-pre-wrap text-sm">Ready to test...</pre> </div> <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"> <p class="text-sm text-yellow-800">
This test page directly calls the Netlify Function and shows detailed results.
          Check the browser console for additional logging.
</p> </div> </div> </main> ` })} ${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-team-update.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-team-update.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-team-update.astro";
const $$url = "/admin/test-team-update";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestTeamUpdate,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
