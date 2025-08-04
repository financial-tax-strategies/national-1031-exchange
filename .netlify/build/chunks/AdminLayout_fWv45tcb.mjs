import { c as createAstro, d as createComponent, m as maybeRenderHead, f as addAttribute, r as renderTemplate, i as renderComponent, n as renderSlot } from './astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_NoDNIcv-.mjs';
import 'clsx';

const $$Astro$1 = createAstro("https://the1031center.com");
const $$AdminNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminNav;
  const currentPath = Astro2.url.pathname;
  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/highlevel-config", label: "HighLevel Config" },
    { href: "/admin/seo-analytics", label: "SEO & Analytics" },
    { href: "/admin/test-integration", label: "Test Integration" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/appointments", label: "Appointments" }
  ];
  function isActive(href) {
    return currentPath === href || href !== "/admin" && currentPath.startsWith(href);
  }
  return renderTemplate`${maybeRenderHead()}<nav class="bg-gray-800 text-white"> <div class="container mx-auto px-4"> <div class="flex items-center justify-between h-16"> <div class="flex items-center space-x-8"> <div class="font-bold text-xl">Admin Panel</div> <div class="hidden md:flex space-x-4"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, "class")}> ${item.label} </a>`)} </div> </div> <div class="flex items-center space-x-4"> <a href="/" class="text-sm text-gray-300 hover:text-white">
← Back to Site
</a> </div> </div> </div> </nav> <!-- Mobile menu --> <div class="md:hidden bg-gray-800 border-t border-gray-700"> <div class="container mx-auto px-4 py-2 space-y-1"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`block px-3 py-2 rounded-md text-sm font-medium ${isActive(item.href) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, "class")}> ${item.label} </a>`)} </div> </div>`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/admin/AdminNav.astro", void 0);

const $$Astro = createAstro("https://the1031center.com");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminNav", $$AdminNav, {})} ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
