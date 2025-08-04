import { d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../chunks/Layout_NoDNIcv-.mjs';
import { $ as $$Breadcrumbs } from '../chunks/Breadcrumbs_BLBGUB5A.mjs';
import { g as generateJsonLdScript, w as wrapInWebPageSchema, j as createRatingSchema, k as createReviewSchema } from '../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Testimonials = createComponent(($$result, $$props, $$slots) => {
  const testimonials = [
    {
      id: "john-martinez-review",
      author: "John Martinez",
      location: "Los Angeles, CA",
      propertyType: "Multi-Family Properties",
      exchangeType: "Delayed Exchange",
      date: "2024-11-15",
      rating: 5,
      headline: "Saved $850,000 in taxes on my apartment complex exchange",
      review: "The 1031 Center made my $3.2M apartment building exchange seamless. Sarah Johnson personally walked me through every step, and their team's expertise saved me over $850,000 in capital gains taxes. The 48-hour response guarantee gave me peace of mind during a stressful time. I've done three exchanges with them now and wouldn't trust anyone else.",
      savings: "$850,000",
      propertyValue: "$3,200,000"
    },
    {
      id: "patricia-chen-review",
      author: "Patricia Chen",
      location: "San Francisco, CA",
      propertyType: "Commercial Office Building",
      exchangeType: "Reverse Exchange",
      date: "2024-10-28",
      rating: 5,
      headline: "Complex reverse exchange handled perfectly",
      review: "I needed to purchase my replacement property before selling in this competitive market. David Thompson's expertise with reverse exchanges was invaluable. The EAT structure they set up worked flawlessly, and I closed both properties within the timeline. Their fee was reasonable considering the complexity, and the tax savings were substantial.",
      savings: "$1,200,000",
      propertyValue: "$5,500,000"
    },
    {
      id: "robert-williams-review",
      author: "Robert Williams",
      location: "Dallas, TX",
      propertyType: "Retail Shopping Center",
      exchangeType: "Delayed Exchange",
      date: "2024-09-12",
      rating: 5,
      headline: "Outstanding service from start to finish",
      review: "After 20 years of owning strip malls, I decided to consolidate into a larger shopping center. The 1031 Center team handled everything professionally. Jennifer Martinez was always available to answer questions, and their secure fund handling gave me complete confidence. The process was smoother than I ever imagined.",
      savings: "$625,000",
      propertyValue: "$2,800,000"
    },
    {
      id: "maria-gonzalez-review",
      author: "Maria Gonzalez",
      location: "Miami, FL",
      propertyType: "Residential Rentals",
      exchangeType: "Multiple Property Exchange",
      date: "2024-08-20",
      rating: 5,
      headline: "Exchanged 5 rental houses for an apartment building",
      review: "I was overwhelmed thinking about exchanging my five rental houses for a single apartment building. Amanda Williams and her team made it simple. They coordinated all five closings perfectly, and I never felt rushed during the 45-day identification period. Their expertise in multi-property exchanges is unmatched.",
      savings: "$380,000",
      propertyValue: "$1,750,000"
    },
    {
      id: "david-anderson-review",
      author: "David Anderson",
      location: "Phoenix, AZ",
      propertyType: "Industrial Warehouse",
      exchangeType: "Improvement Exchange",
      date: "2024-07-30",
      rating: 5,
      headline: "Improvement exchange expertise saved the day",
      review: "We needed to use exchange funds to complete warehouse improvements. The 1031 Center's improvement exchange process was flawless. They managed the construction funds perfectly and ensured all improvements were completed within the 180-day window. Their attention to detail and regulatory compliance is exceptional.",
      savings: "$520,000",
      propertyValue: "$2,100,000"
    },
    {
      id: "susan-thompson-review",
      author: "Susan Thompson",
      location: "Seattle, WA",
      propertyType: "Mixed-Use Property",
      exchangeType: "Delayed Exchange",
      date: "2024-06-18",
      rating: 5,
      headline: "True professionals who care about their clients",
      review: "Selling our mixed-use building was emotional after 15 years. The 1031 Center team understood and guided us compassionately through the exchange. Their technology made document signing easy, and the online portal kept us informed every step. We're now enjoying better cash flow from our replacement property.",
      savings: "$440,000",
      propertyValue: "$1,950,000"
    },
    {
      id: "michael-lee-review",
      author: "Michael Lee",
      location: "Denver, CO",
      propertyType: "Self-Storage Facility",
      exchangeType: "Delayed Exchange",
      date: "2024-05-25",
      rating: 5,
      headline: "Expertise in self-storage exchanges",
      review: "The 1031 Center's knowledge of self-storage exchanges is impressive. They understood the unique aspects of our property type and helped us identify the perfect replacement facility. Their secure fund handling and daily reconciliation gave us peace of mind with our $4M transaction.",
      savings: "$980,000",
      propertyValue: "$4,000,000"
    },
    {
      id: "karen-davis-review",
      author: "Karen Davis",
      location: "Chicago, IL",
      propertyType: "Medical Office Building",
      exchangeType: "Partial Exchange",
      date: "2024-04-10",
      rating: 5,
      headline: "Perfect balance of cash out and tax deferral",
      review: "I needed some cash for another investment but wanted to defer most taxes. The partial exchange strategy they designed was perfect. I got $500K in cash and still deferred over $700K in taxes on the remaining exchange. Their expertise in partial exchanges sets them apart.",
      savings: "$700,000",
      propertyValue: "$3,500,000"
    },
    {
      id: "james-wilson-review",
      author: "James Wilson",
      location: "Houston, TX",
      propertyType: "Land Development",
      exchangeType: "Delayed Exchange",
      date: "2024-03-22",
      rating: 5,
      headline: "Land exchange expertise was crucial",
      review: "Exchanging raw land can be tricky, but The 1031 Center made it straightforward. They helped document our investment intent and guided us to income-producing replacement properties. The tax savings allowed us to acquire much more property than we could have otherwise.",
      savings: "$290,000",
      propertyValue: "$1,200,000"
    },
    {
      id: "jennifer-brown-review",
      author: "Jennifer Brown",
      location: "Atlanta, GA",
      propertyType: "Hotel Property",
      exchangeType: "Reverse Exchange",
      date: "2024-02-14",
      rating: 5,
      headline: "Complex hotel exchange handled brilliantly",
      review: "Exchanging a hotel property involves many moving parts. The 1031 Center team coordinated with our management company, handled the franchise issues, and structured a reverse exchange that let us secure our replacement property first. Their expertise in hospitality exchanges is remarkable.",
      savings: "$1,450,000",
      propertyValue: "$6,200,000"
    }
  ];
  const totalReviews = testimonials.length;
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Client Testimonials & Reviews | 1031 Exchange Success Stories", "description": "Read real client testimonials and success stories from investors who saved millions in taxes through 1031 exchanges with The 1031 Center." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> ', ' <div class="max-w-4xl"> <h1 class="text-4xl md:text-5xl font-bold mb-6">\nReal Success Stories from Our Clients\n</h1> <p class="text-xl text-blue-100">\nDiscover how investors across America have saved millions in taxes and grown \n          their wealth through successful 1031 exchanges with The 1031 Center.\n</p> <!-- Aggregate Rating Display --> <div class="mt-8 flex items-center"> <div class="flex"> ', ' </div> <span class="ml-3 text-2xl font-bold">', '</span> <span class="ml-2 text-blue-200">(', ' verified reviews)</span> </div> </div> </div> </section>  <section class="py-12 bg-gray-50 border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"> <div> <div class="text-3xl font-bold text-blue-900">$8.5M+</div> <div class="text-gray-600">Total Tax Savings</div> </div> <div> <div class="text-3xl font-bold text-blue-900">100%</div> <div class="text-gray-600">5-Star Reviews</div> </div> <div> <div class="text-3xl font-bold text-blue-900">$31M+</div> <div class="text-gray-600">Property Value Exchanged</div> </div> <div> <div class="text-3xl font-bold text-blue-900">15</div> <div class="text-gray-600">States Represented</div> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid gap-8 md:grid-cols-2"> ', ' </div> </div> </section>  <section class="py-16 bg-blue-50"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">\nSuccess by Property Type\n</h2> <div class="grid md:grid-cols-3 gap-8"> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">$12.5M</div> <div class="text-gray-600">Multi-Family Exchanges</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">$8.3M</div> <div class="text-gray-600">Commercial Property</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">$6.2M</div> <div class="text-gray-600">Specialty Properties</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">$3.8M</div> <div class="text-gray-600">Residential Rentals</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">45%</div> <div class="text-gray-600">Reverse Exchanges</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-blue-900 mb-2">100%</div> <div class="text-gray-600">Success Rate</div> </div> </div> </div> </section>  <section class="py-16 bg-blue-900 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-6">\nJoin Thousands of Successful Investors\n</h2> <p class="text-xl mb-8 text-blue-100">\nStart your tax-deferred exchange today and become our next success story. \n        Our expert team is ready to guide you through every step.\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/start-exchange" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">\nStart Your Exchange\n</a> <a href="/calculator" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">\nCalculate Your Savings\n</a> </div> <p class="mt-8 text-blue-200">\nQuestions? Call our experts:\n<a', ' class="text-yellow-400 hover:text-yellow-300 font-semibold">', '</a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "theme": "dark", "items": [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Testimonials" }
  ] }), [1, 2, 3, 4, 5].map((star) => renderTemplate`<svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`), averageRating.toFixed(1), totalReviews, testimonials.map((testimonial) => renderTemplate`<div class="bg-gray-50 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"> <!-- Rating and Date --> <div class="flex justify-between items-start mb-4"> <div class="flex"> ${[1, 2, 3, 4, 5].map((star) => renderTemplate`<svg${addAttribute(`w-5 h-5 ${star <= testimonial.rating ? "text-yellow-400" : "text-gray-300"} fill-current`, "class")} viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> <span class="text-sm text-gray-500">${new Date(testimonial.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span> </div> <!-- Headline --> <h3 class="text-xl font-bold text-gray-900 mb-3">${testimonial.headline}</h3> <!-- Review Text --> <p class="text-gray-700 mb-4 italic">"${testimonial.review}"</p> <!-- Transaction Details --> <div class="bg-white rounded p-4 mb-4"> <div class="grid grid-cols-2 gap-2 text-sm"> <div> <span class="text-gray-500">Property Type:</span> <span class="ml-2 font-medium text-gray-900">${testimonial.propertyType}</span> </div> <div> <span class="text-gray-500">Exchange Type:</span> <span class="ml-2 font-medium text-gray-900">${testimonial.exchangeType}</span> </div> <div> <span class="text-gray-500">Property Value:</span> <span class="ml-2 font-medium text-gray-900">${testimonial.propertyValue}</span> </div> <div> <span class="text-gray-500">Tax Savings:</span> <span class="ml-2 font-bold text-green-600">${testimonial.savings}</span> </div> </div> </div> <!-- Author Info --> <div class="flex items-center"> <div class="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-3"> ${testimonial.author.split(" ").map((n) => n[0]).join("")} </div> <div> <p class="font-semibold text-gray-900">${testimonial.author}</p> <p class="text-sm text-gray-500">${testimonial.location}</p> </div> </div> </div>`), addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      wrapInWebPageSchema(
        "https://the1031center.com/testimonials",
        "1031 Exchange Client Testimonials",
        "Real client testimonials and success stories from 1031 exchange investors",
        {
          "@type": "TestimonialPage",
          "@id": "https://the1031center.com/testimonials#main",
          "name": "1031 Exchange Client Testimonials",
          "description": "Real client testimonials and success stories from 1031 exchange investors",
          "aggregateRating": createRatingSchema(
            Number(averageRating.toFixed(1)),
            "AggregateRating",
            totalReviews
          ),
          "review": testimonials.map((testimonial) => createReviewSchema(testimonial))
        }
      )
    ]
  }))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/testimonials.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/testimonials.astro";
const $$url = "/testimonials";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Testimonials,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
