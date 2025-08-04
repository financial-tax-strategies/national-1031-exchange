import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { $ as $$Breadcrumbs } from '../chunks/Breadcrumbs_BLBGUB5A.mjs';
import { i as isSupabaseConfigured, s as supabase } from '../chunks/supabase_oEJHkwy9.mjs';
import { g as generateJsonLdScript, w as wrapInWebPageSchema, b as createPersonSchema } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Team = createComponent(async ($$result, $$props, $$slots) => {
  let teamMembers = [];
  let error = null;
  if (isSupabaseConfigured()) {
    try {
      const { data, error: fetchError } = await supabase.from("team_members_public").select("*").order("display_order", { ascending: true }).order("name", { ascending: true });
      if (fetchError) {
        error = fetchError.message;
      } else {
        teamMembers = data || [];
      }
    } catch (e) {
      error = "Failed to fetch team members";
      console.error(e);
    }
  } else {
    teamMembers = [
      {
        id: "ruth-benjamin",
        slug: "ruth-benjamin",
        name: "Ruth Benjamin",
        job_title: "Chief Client Success Officer",
        image: "/images/team/ruth-benjamin.jpg",
        description: "Ruth has an extensive background in real estate tax strategy with deep expertise in title, escrow, foreclosures, evictions, bankruptcy, mortgages, and legal matters. Over the past 35 years, she has served as president of two different 1031 Exchange Companies. Recognized throughout the industry as a subject matter expert in 1031 exchanges and tax-deferred cash-out strategies, Ruth's approach is distinctive\u2014she listens first, thinks creatively, and delivers elegant solutions to her clients.",
        years_experience: 35,
        knows_about: ["1031 exchanges", "Tax-deferred strategies", "Real estate tax strategy", "Client success", "Creative problem solving"],
        same_as: ["https://linkedin.com/in/ruthbenjamin1031"],
        email: "ruth.benjamin@the1031center.com"
      }
    ];
  }
  const transformedTeamMembers = teamMembers.map((member) => ({
    id: member.slug || member.id,
    name: member.name,
    title: member.job_title,
    image: member.primary_image_url || member.image,
    bio: member.description,
    experience: member.years_experience ? `${member.years_experience}+ years` : void 0,
    specialties: member.knows_about || member.specializations || [],
    linkedin: member.same_as?.[0],
    email: member.email,
    education: member.alumni_of,
    certifications: member.certifications,
    awards: member.awards,
    publications: member.publications,
    achievements: member.specializations
    // Using specializations for achievements if no specific field
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Our Team | Expert 1031 Exchange Specialists | The 1031 Center", "description": "Meet the experienced team of 1031 exchange specialists at The 1031 Center. Our certified experts bring decades of experience in tax-deferred exchanges." }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> ', ' <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">\nMeet Our Expert Team\n</h1> <p class="text-xl text-blue-100">\nIndustry-leading 1031 exchange specialists with over 150 years of combined experience, \n          dedicated to securing your investment future.\n</p> </div> </div> </section>  <section class="py-8 bg-gray-50 border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"> <div> <div class="text-3xl font-bold text-blue-900">150+</div> <div class="text-gray-600">Years Combined Experience</div> </div> <div> <div class="text-3xl font-bold text-blue-900">20,000+</div> <div class="text-gray-600">Exchanges Completed</div> </div> <div> <div class="text-3xl font-bold text-blue-900">$10B+</div> <div class="text-gray-600">Exchange Value</div> </div> <div> <div class="text-3xl font-bold text-blue-900">100%</div> <div class="text-gray-600">Security Record</div> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> ', ' <div class="space-y-16"> ', ` </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
Why Experience Matters in 1031 Exchanges
</h2> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-blue-900 mb-3">Regulatory Expertise</h3> <p class="text-gray-700">
Our team stays current with all IRS regulations, revenue rulings, and case law 
            affecting 1031 exchanges, ensuring your exchange is always compliant.
</p> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-blue-900 mb-3">Problem Solving</h3> <p class="text-gray-700">
With thousands of exchanges completed, we've seen every scenario and know how 
            to navigate challenges that could derail your exchange.
</p> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-blue-900 mb-3">Industry Relationships</h3> <p class="text-gray-700">
Our established relationships with title companies, attorneys, and real estate 
            professionals nationwide ensure smooth transactions.
</p> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-blue-900 mb-3">Continuous Education</h3> <p class="text-gray-700">
Every team member maintains ongoing education and certifications, staying at 
            the forefront of exchange strategies and best practices.
</p> </div> </div> </div> </section>  <section class="py-16 bg-blue-900 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-6">
Work with the Industry's Best Team
</h2> <p class="text-xl mb-8 text-blue-100">
When you choose The 1031 Center, you're partnering with the most experienced and 
        qualified team in the industry. Let our expertise secure your investment future.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/schedule" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
Schedule Expert Consultation
</a> <a href="/contact" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">
Contact Our Team
</a> </div> <p class="mt-8 text-blue-200">
Or call us directly:
<a`, ' class="text-yellow-400 hover:text-yellow-300 font-semibold">', '</a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "theme": "dark", "items": [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Our Team" }
  ] }), error ? renderTemplate`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"> <p class="text-yellow-800">Unable to load team members from database. Showing default team member.</p> </div>` : null, transformedTeamMembers.map((member, index) => renderTemplate`<div${addAttribute(`${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} flex flex-col lg:flex gap-12 items-center`, "class")}> <!-- Photo --> <div class="lg:w-1/3"> <div class="relative"> <img${addAttribute(member.image, "src")}${addAttribute(`${member.name}, ${member.title}`, "alt")} class="rounded-lg shadow-xl w-full" loading="lazy"> ${member.experience && renderTemplate`<div class="absolute -bottom-4 -right-4 bg-blue-900 text-white px-4 py-2 rounded-lg shadow-lg"> <span class="font-semibold">${member.experience}</span> </div>`} </div> </div> <!-- Bio --> <div class="lg:w-2/3"> <h2 class="text-3xl font-bold text-gray-900 mb-2">${member.name}</h2> <p class="text-xl text-blue-900 mb-4">${member.title}</p> <p class="text-gray-700 mb-6">${member.bio}</p> <!-- Credentials Grid --> ${(member.education || member.certifications) && renderTemplate`<div class="grid md:grid-cols-2 gap-6 mb-6"> <!-- Education --> ${member.education && renderTemplate`<div> <h3 class="font-semibold text-gray-900 mb-2">Education</h3> <ul class="space-y-1 text-sm text-gray-600"> ${member.education.map((edu) => renderTemplate`<li class="flex items-start"> <span class="text-blue-600 mr-2">•</span> ${edu} </li>`)} </ul> </div>`} <!-- Certifications --> ${member.certifications && renderTemplate`<div> <h3 class="font-semibold text-gray-900 mb-2">Certifications</h3> <ul class="space-y-1 text-sm text-gray-600"> ${member.certifications.map((cert) => renderTemplate`<li class="flex items-start"> <span class="text-green-600 mr-2">✓</span> ${cert} </li>`)} </ul> </div>`} </div>`} <!-- Specialties --> ${member.specialties && member.specialties.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="font-semibold text-gray-900 mb-2">Areas of Expertise</h3> <div class="flex flex-wrap gap-2"> ${member.specialties.map((specialty) => renderTemplate`<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"> ${specialty} </span>`)} </div> </div>`} <!-- Achievements/Publications --> ${member.publications && renderTemplate`<div class="mb-6"> <h3 class="font-semibold text-gray-900 mb-2">Publications</h3> <ul class="space-y-1 text-sm text-gray-600"> ${member.publications.map((pub) => renderTemplate`<li class="italic">${pub}</li>`)} </ul> </div>`} ${member.achievements && member.achievements.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="font-semibold text-gray-900 mb-2">Key Achievements</h3> <ul class="space-y-1 text-sm text-gray-600"> ${member.achievements.map((achievement) => renderTemplate`<li class="flex items-start"> <span class="text-yellow-500 mr-2">★</span> ${achievement} </li>`)} </ul> </div>`} ${member.awards && renderTemplate`<div class="mb-6"> <h3 class="font-semibold text-gray-900 mb-2">Awards & Recognition</h3> <ul class="space-y-1 text-sm text-gray-600"> ${member.awards.map((award) => renderTemplate`<li class="flex items-start"> <span class="text-yellow-500 mr-2">🏆</span> ${award} </li>`)} </ul> </div>`} <!-- Contact --> <div class="flex gap-4"> ${member.linkedin && renderTemplate`<a${addAttribute(member.linkedin, "href")} class="text-blue-600 hover:text-blue-700 font-medium" target="_blank" rel="noopener noreferrer">
LinkedIn Profile →
</a>`} ${member.email && renderTemplate`<a${addAttribute(`mailto:${member.email}`, "href")} class="text-blue-600 hover:text-blue-700 font-medium">
Email ${member.name.split(" ")[0]} →
</a>`} </div> </div> </div>`), addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      wrapInWebPageSchema(
        "https://the1031center.com/team",
        "Our Team | Expert 1031 Exchange Specialists",
        "Meet the experienced team of 1031 exchange specialists at The 1031 Center.",
        {
          "@type": "AboutPage",
          "@id": "https://the1031center.com/team#aboutpage",
          "mainEntity": {
            "@type": "Organization",
            "@id": "https://the1031center.com/#organization",
            "employee": transformedTeamMembers.map((member) => createPersonSchema({
              id: member.id,
              name: member.name,
              title: member.title,
              image: member.image,
              bio: member.bio,
              email: member.email,
              linkedin: member.linkedin,
              education: member.education,
              certifications: member.certifications,
              specialties: member.specialties,
              publications: member.publications
            }))
          }
        }
      )
    ]
  }))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/team.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/team.astro";
const $$url = "/team";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Team,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
