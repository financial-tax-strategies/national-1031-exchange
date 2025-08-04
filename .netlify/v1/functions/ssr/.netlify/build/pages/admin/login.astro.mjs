import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_NoDNIcv-.mjs';
import { A as AuthService, L as LoginForm } from '../../chunks/LoginForm_zW9ionQT.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://the1031center.com");
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const authService = AuthService.getInstance();
  const userResponse = await authService.getCurrentUser();
  if (userResponse.success && userResponse.data && userResponse.data.adminProfile) {
    return Astro2.redirect("/admin");
  }
  const pageTitle = "Admin Login - National 1031 Exchange Center";
  const pageDescription = "Admin login for National 1031 Exchange Center staff.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "noindex": true, "data-astro-cid-rf56lckb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8" data-astro-cid-rf56lckb> <div class="sm:mx-auto sm:w-full sm:max-w-md" data-astro-cid-rf56lckb> <div class="text-center mb-8" data-astro-cid-rf56lckb> <img src="/logo.png" alt="National 1031 Exchange Center" class="mx-auto h-12 w-auto" fetchpriority="high" data-astro-cid-rf56lckb> <h1 class="mt-6 text-3xl font-extrabold text-gray-900" data-astro-cid-rf56lckb>
Admin Dashboard
</h1> <p class="mt-2 text-sm text-gray-600" data-astro-cid-rf56lckb>
Staff access only
</p> </div> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "redirectUrl": "/admin", "isAdminLogin": true, "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm", "client:component-export": "LoginForm", "data-astro-cid-rf56lckb": true })} <div class="mt-8 text-center" data-astro-cid-rf56lckb> <div class="bg-blue-50 border border-blue-200 rounded-md p-4" data-astro-cid-rf56lckb> <div class="flex" data-astro-cid-rf56lckb> <div class="flex-shrink-0" data-astro-cid-rf56lckb> <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-rf56lckb> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" data-astro-cid-rf56lckb></path> </svg> </div> <div class="ml-3" data-astro-cid-rf56lckb> <h3 class="text-sm font-medium text-blue-800" data-astro-cid-rf56lckb>
Security Notice
</h3> <div class="mt-2 text-sm text-blue-700" data-astro-cid-rf56lckb> <p data-astro-cid-rf56lckb>
This is a secure area for authorized staff only. 
                  All login attempts are monitored and logged.
</p> </div> </div> </div> </div> <div class="mt-6 text-sm text-gray-600" data-astro-cid-rf56lckb> <p data-astro-cid-rf56lckb>
Having trouble logging in? Contact your system administrator.
</p> </div> </div> </div> <footer class="mt-8 text-center text-xs text-gray-500" data-astro-cid-rf56lckb> <p data-astro-cid-rf56lckb>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} National 1031 Exchange Center. All rights reserved.</p> <p class="mt-1" data-astro-cid-rf56lckb> <a href="/" class="hover:text-gray-700" data-astro-cid-rf56lckb>Back to main site</a> </p> </footer> </main> ` })} `;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/login.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
