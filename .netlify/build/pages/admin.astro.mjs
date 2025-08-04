import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_fWv45tcb.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://the1031center.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const adminCards = [
    {
      title: "HighLevel Configuration",
      description: "Configure your HighLevel CRM integration settings",
      href: "/admin/highlevel-config",
      icon: "\u2699\uFE0F",
      status: "Ready"
    },
    {
      title: "SEO & Analytics",
      description: "Manage all SEO, AEO, and analytics configuration in one place",
      href: "/admin/seo-analytics",
      icon: "\u{1F4C8}",
      status: "Ready"
    },
    {
      title: "Test Integration",
      description: "Test the complete lead to appointment flow",
      href: "/admin/test-integration",
      icon: "\u{1F9EA}",
      status: "Ready"
    },
    {
      title: "Leads Management",
      description: "View and manage all captured leads with automated scoring",
      href: "/admin/leads",
      icon: "\u{1F465}",
      status: "Ready"
    },
    {
      title: "Appointments",
      description: "Manage appointment bookings and schedules",
      href: "/admin/appointments",
      icon: "\u{1F4C5}",
      status: "Coming Soon"
    },
    {
      title: "Analytics",
      description: "View conversion rates and performance metrics",
      href: "/admin/analytics",
      icon: "\u{1F4CA}",
      status: "Coming Soon"
    },
    {
      title: "Team Members",
      description: "Manage team member profiles for the website",
      href: "/admin/team-members",
      icon: "\u{1F465}",
      status: "Ready"
    },
    {
      title: "Reviews",
      description: "Moderate and manage customer reviews",
      href: "/admin/reviews",
      icon: "\u2B50",
      status: "Ready"
    },
    {
      title: "Settings",
      description: "System settings and user management",
      href: "/admin/settings",
      icon: "\u{1F527}",
      status: "Coming Soon"
    }
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Dashboard", "data-astro-cid-u2h3djql": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8" data-astro-cid-u2h3djql> <div class="max-w-6xl mx-auto" data-astro-cid-u2h3djql> <h1 class="text-3xl font-bold mb-8" data-astro-cid-u2h3djql>Admin Dashboard</h1> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-u2h3djql> ${adminCards.map((card) => renderTemplate`<a${addAttribute(card.status === "Ready" ? card.href : "#", "href")}${addAttribute(`block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${card.status !== "Ready" ? "opacity-60 cursor-not-allowed" : ""}`, "class")} data-astro-cid-u2h3djql> <div class="flex items-start justify-between mb-4" data-astro-cid-u2h3djql> <div class="text-4xl" data-astro-cid-u2h3djql>${card.icon}</div> <span${addAttribute(`text-xs px-2 py-1 rounded-full ${card.status === "Ready" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`, "class")} data-astro-cid-u2h3djql> ${card.status} </span> </div> <h2 class="text-xl font-semibold mb-2" data-astro-cid-u2h3djql>${card.title}</h2> <p class="text-gray-600" data-astro-cid-u2h3djql>${card.description}</p> </a>`)} </div> <div class="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg" data-astro-cid-u2h3djql> <h2 class="text-lg font-semibold text-blue-900 mb-2" data-astro-cid-u2h3djql>Getting Started</h2> <ol class="list-decimal list-inside space-y-2 text-blue-800" data-astro-cid-u2h3djql> <li data-astro-cid-u2h3djql>Configure your HighLevel integration settings</li> <li data-astro-cid-u2h3djql>Test the integration to ensure everything is working</li> <li data-astro-cid-u2h3djql>Update your forms to use the new lead capture system</li> <li data-astro-cid-u2h3djql>Monitor leads and appointments through the dashboard</li> </ol> </div> </div> </main> ` })} `;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/index.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
