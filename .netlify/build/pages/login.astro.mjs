import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_NoDNIcv-.mjs';
import { A as AuthService, L as LoginForm } from '../chunks/LoginForm_zW9ionQT.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://the1031center.com");
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const authService = AuthService.getInstance();
  const userResponse = await authService.getCurrentUser();
  if (userResponse.success && userResponse.data) {
    return Astro2.redirect("/portal");
  }
  const pageTitle = "Customer Portal Login - National 1031 Exchange Center";
  const pageDescription = "Access your 1031 exchange portal to track your exchange progress, upload documents, and communicate with your team.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> <div class="sm:mx-auto sm:w-full sm:max-w-md"> <div class="text-center mb-8"> <h1 class="text-3xl font-extrabold text-gray-900">
Customer Portal
</h1> <p class="mt-2 text-sm text-gray-600">
Track your 1031 exchange progress
</p> </div> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "redirectUrl": "/portal", "client:component-hydration": "load", "client:component-path": "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/auth/LoginForm", "client:component-export": "LoginForm" })} <div class="mt-8 text-center"> <div class="relative"> <div class="absolute inset-0 flex items-center"> <div class="w-full border-t border-gray-300"></div> </div> <div class="relative flex justify-center text-sm"> <span class="px-4 bg-gray-50 text-gray-500">Need help?</span> </div> </div> <div class="mt-6 grid grid-cols-1 gap-3"> <a href="/contact" class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
Contact Support
</a> <a href="/faq" class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
View FAQ
</a> </div> </div> </div> <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"> <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3"> <h3 class="text-sm font-medium text-yellow-800">
First time logging in?
</h3> <div class="mt-2 text-sm text-yellow-700"> <p>
You should have received login credentials via email when you started your 1031 exchange. 
                If you haven't received them, please <a href="/contact" class="underline font-medium">contact us</a>.
</p> </div> </div> </div> </div> </div> </main> ` })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/login.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
