import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_B4R-lrOo.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/1031-exchange-rules.astro.mjs');
const _page2 = () => import('./pages/1031-exchange-timeline.astro.mjs');
const _page3 = () => import('./pages/about.astro.mjs');
const _page4 = () => import('./pages/admin/breadcrumb-test.astro.mjs');
const _page5 = () => import('./pages/admin/debug.astro.mjs');
const _page6 = () => import('./pages/admin/highlevel-config.astro.mjs');
const _page7 = () => import('./pages/admin/leads.astro.mjs');
const _page8 = () => import('./pages/admin/login.astro.mjs');
const _page9 = () => import('./pages/admin/reviews.astro.mjs');
const _page10 = () => import('./pages/admin/seo-analytics.astro.mjs');
const _page11 = () => import('./pages/admin/team-members.astro.mjs');
const _page12 = () => import('./pages/admin/team-members-debug.astro.mjs');
const _page13 = () => import('./pages/admin/test-env.astro.mjs');
const _page14 = () => import('./pages/admin/test-integration.astro.mjs');
const _page15 = () => import('./pages/admin/test-team-update.astro.mjs');
const _page16 = () => import('./pages/admin.astro.mjs');
const _page17 = () => import('./pages/api/reviews.astro.mjs');
const _page18 = () => import('./pages/api/reviews-summary.astro.mjs');
const _page19 = () => import('./pages/api/team-members.astro.mjs');
const _page20 = () => import('./pages/calculator.astro.mjs');
const _page21 = () => import('./pages/choosing-qualified-intermediary.astro.mjs');
const _page22 = () => import('./pages/comparisons/_competitor_.astro.mjs');
const _page23 = () => import('./pages/comparisons.astro.mjs');
const _page24 = () => import('./pages/complete-guide-1031-exchanges.astro.mjs');
const _page25 = () => import('./pages/contact.astro.mjs');
const _page26 = () => import('./pages/disclaimer.astro.mjs');
const _page27 = () => import('./pages/faq.astro.mjs');
const _page28 = () => import('./pages/how-it-works.astro.mjs');
const _page29 = () => import('./pages/locations/_state_.astro.mjs');
const _page30 = () => import('./pages/locations.astro.mjs');
const _page31 = () => import('./pages/login.astro.mjs');
const _page32 = () => import('./pages/privacy.astro.mjs');
const _page33 = () => import('./pages/property-types/_type_.astro.mjs');
const _page34 = () => import('./pages/property-types.astro.mjs');
const _page35 = () => import('./pages/scenarios/_scenario_.astro.mjs');
const _page36 = () => import('./pages/scenarios.astro.mjs');
const _page37 = () => import('./pages/schedule.astro.mjs');
const _page38 = () => import('./pages/schedule-widget.astro.mjs');
const _page39 = () => import('./pages/services/delayed-exchange.astro.mjs');
const _page40 = () => import('./pages/services/improvement-exchange.astro.mjs');
const _page41 = () => import('./pages/services/partial-exchange.astro.mjs');
const _page42 = () => import('./pages/services/reverse-exchange.astro.mjs');
const _page43 = () => import('./pages/sitemap.xml.astro.mjs');
const _page44 = () => import('./pages/start-exchange.astro.mjs');
const _page45 = () => import('./pages/team.astro.mjs');
const _page46 = () => import('./pages/terms.astro.mjs');
const _page47 = () => import('./pages/testimonials.astro.mjs');
const _page48 = () => import('./pages/thank-you.astro.mjs');
const _page49 = () => import('./pages/timeline-calculator.astro.mjs');
const _page50 = () => import('./pages/trust-security.astro.mjs');
const _page51 = () => import('./pages/types-of-1031-exchanges.astro.mjs');
const _page52 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/1031-exchange-rules.astro", _page1],
    ["src/pages/1031-exchange-timeline.astro", _page2],
    ["src/pages/about.astro", _page3],
    ["src/pages/admin/breadcrumb-test.astro", _page4],
    ["src/pages/admin/debug.astro", _page5],
    ["src/pages/admin/highlevel-config.astro", _page6],
    ["src/pages/admin/leads.astro", _page7],
    ["src/pages/admin/login.astro", _page8],
    ["src/pages/admin/reviews.astro", _page9],
    ["src/pages/admin/seo-analytics.astro", _page10],
    ["src/pages/admin/team-members.astro", _page11],
    ["src/pages/admin/team-members-debug.astro", _page12],
    ["src/pages/admin/test-env.astro", _page13],
    ["src/pages/admin/test-integration.astro", _page14],
    ["src/pages/admin/test-team-update.astro", _page15],
    ["src/pages/admin/index.astro", _page16],
    ["src/pages/api/reviews.ts", _page17],
    ["src/pages/api/reviews-summary.ts", _page18],
    ["src/pages/api/team-members.ts", _page19],
    ["src/pages/calculator.astro", _page20],
    ["src/pages/choosing-qualified-intermediary.astro", _page21],
    ["src/pages/comparisons/[competitor].astro", _page22],
    ["src/pages/comparisons/index.astro", _page23],
    ["src/pages/complete-guide-1031-exchanges.astro", _page24],
    ["src/pages/contact.astro", _page25],
    ["src/pages/disclaimer.astro", _page26],
    ["src/pages/faq.astro", _page27],
    ["src/pages/how-it-works.astro", _page28],
    ["src/pages/locations/[state].astro", _page29],
    ["src/pages/locations/index.astro", _page30],
    ["src/pages/login.astro", _page31],
    ["src/pages/privacy.astro", _page32],
    ["src/pages/property-types/[type].astro", _page33],
    ["src/pages/property-types/index.astro", _page34],
    ["src/pages/scenarios/[scenario].astro", _page35],
    ["src/pages/scenarios/index.astro", _page36],
    ["src/pages/schedule.astro", _page37],
    ["src/pages/schedule-widget.astro", _page38],
    ["src/pages/services/delayed-exchange.astro", _page39],
    ["src/pages/services/improvement-exchange.astro", _page40],
    ["src/pages/services/partial-exchange.astro", _page41],
    ["src/pages/services/reverse-exchange.astro", _page42],
    ["src/pages/sitemap.xml.ts", _page43],
    ["src/pages/start-exchange.astro", _page44],
    ["src/pages/team.astro", _page45],
    ["src/pages/terms.astro", _page46],
    ["src/pages/testimonials.astro", _page47],
    ["src/pages/thank-you.astro", _page48],
    ["src/pages/timeline-calculator.astro", _page49],
    ["src/pages/trust-security.astro", _page50],
    ["src/pages/types-of-1031-exchanges.astro", _page51],
    ["src/pages/index.astro", _page52]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "5adb33d6-447d-4fbb-af96-bcc6dfe24fb4"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
