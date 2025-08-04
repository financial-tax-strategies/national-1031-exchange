import { d as createComponent, l as renderHead, r as renderTemplate } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$TestEnv = createComponent(($$result, $$props, $$slots) => {
  const supabaseUrl = "https://fweohnekiahcvnfcpfic.supabase.co";
  return renderTemplate`<html> <head><title>Environment Test</title>${renderHead()}</head> <body> <h1>Environment Variables Check</h1> <ul> <li>Supabase URL: ${supabaseUrl}</li> <li>Supabase Anon Key: ${"SET" }</li> <li>Environment Mode: ${"production"}</li> </ul> <p>If these are not set, please check your .env.local file</p> <a href="/admin">Back to Admin</a> </body></html>`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-env.astro", void 0);
const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/test-env.astro";
const $$url = "/admin/test-env";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestEnv,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
