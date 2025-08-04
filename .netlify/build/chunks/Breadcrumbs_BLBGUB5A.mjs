import { c as createAstro, d as createComponent, r as renderTemplate, u as unescapeHTML, i as renderComponent, k as Fragment, f as addAttribute, m as maybeRenderHead } from './astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { e as createBreadcrumbSchema, g as generateJsonLdScript } from './schema-utils_OWOV97hQ.mjs';
/* empty css                                   */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://the1031center.com");
const $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  const { items = [], class: className = "", theme = "light" } = Astro2.props;
  const breadcrumbSchema = createBreadcrumbSchema(items);
  return renderTemplate(_a || (_a = __template(["<!-- Breadcrumb Navigation -->", '<nav aria-label="Breadcrumb"', ' data-astro-cid-ilhxcym7> <ol class="flex items-center space-x-2" data-astro-cid-ilhxcym7> ', ' </ol> </nav> <!-- Breadcrumb Schema Markup --> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), addAttribute(`text-sm ${className}`, "class"), items.map((item, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-ilhxcym7": true }, { "default": ($$result2) => renderTemplate`${index > 0 && renderTemplate`<li${addAttribute(theme === "dark" ? "text-white/60" : "text-gray-400", "class")} data-astro-cid-ilhxcym7> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-ilhxcym7> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" data-astro-cid-ilhxcym7></path> </svg> </li>`}<li data-astro-cid-ilhxcym7> ${item.url ? renderTemplate`<a${addAttribute(item.url, "href")}${addAttribute(theme === "dark" ? "text-white/80 hover:text-white transition-colors" : "text-gray-600 hover:text-blue-900 transition-colors", "class")}${addAttribute(index === items.length - 1 ? "page" : void 0, "aria-current")} data-astro-cid-ilhxcym7> ${item.name} </a>` : renderTemplate`<span${addAttribute(theme === "dark" ? "text-white font-medium" : "text-gray-900 font-medium", "class")} aria-current="page" data-astro-cid-ilhxcym7> ${item.name} </span>`} </li> ` })}`), unescapeHTML(generateJsonLdScript(breadcrumbSchema)));
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/components/Breadcrumbs.astro", void 0);

export { $$Breadcrumbs as $ };
