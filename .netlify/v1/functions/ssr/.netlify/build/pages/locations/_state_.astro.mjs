import { c as createAstro, d as createComponent, i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$Layout, C as COMPANY, g as getPhoneLink } from '../../chunks/Layout_NoDNIcv-.mjs';
import { g as generateJsonLdScript, w as wrapInWebPageSchema } from '../../chunks/schema-utils_OWOV97hQ.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://the1031center.com");
async function getStaticPaths() {
  const states = [
    { slug: "alabama", name: "Alabama", abbr: "AL", capital: "Montgomery", topCities: ["Birmingham", "Huntsville", "Mobile", "Montgomery"] },
    { slug: "alaska", name: "Alaska", abbr: "AK", capital: "Juneau", topCities: ["Anchorage", "Fairbanks", "Juneau", "Sitka"] },
    { slug: "arizona", name: "Arizona", abbr: "AZ", capital: "Phoenix", topCities: ["Phoenix", "Tucson", "Mesa", "Scottsdale"] },
    { slug: "arkansas", name: "Arkansas", abbr: "AR", capital: "Little Rock", topCities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"] },
    { slug: "california", name: "California", abbr: "CA", capital: "Sacramento", topCities: ["Los Angeles", "San Francisco", "San Diego", "San Jose"] },
    { slug: "colorado", name: "Colorado", abbr: "CO", capital: "Denver", topCities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"] },
    { slug: "connecticut", name: "Connecticut", abbr: "CT", capital: "Hartford", topCities: ["Bridgeport", "New Haven", "Hartford", "Stamford"] },
    { slug: "delaware", name: "Delaware", abbr: "DE", capital: "Dover", topCities: ["Wilmington", "Dover", "Newark", "Middletown"] },
    { slug: "florida", name: "Florida", abbr: "FL", capital: "Tallahassee", topCities: ["Miami", "Tampa", "Orlando", "Jacksonville"] },
    { slug: "georgia", name: "Georgia", abbr: "GA", capital: "Atlanta", topCities: ["Atlanta", "Augusta", "Columbus", "Savannah"] },
    { slug: "hawaii", name: "Hawaii", abbr: "HI", capital: "Honolulu", topCities: ["Honolulu", "Pearl City", "Hilo", "Kailua"] },
    { slug: "idaho", name: "Idaho", abbr: "ID", capital: "Boise", topCities: ["Boise", "Meridian", "Nampa", "Idaho Falls"] },
    { slug: "illinois", name: "Illinois", abbr: "IL", capital: "Springfield", topCities: ["Chicago", "Aurora", "Rockford", "Joliet"] },
    { slug: "indiana", name: "Indiana", abbr: "IN", capital: "Indianapolis", topCities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"] },
    { slug: "iowa", name: "Iowa", abbr: "IA", capital: "Des Moines", topCities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"] },
    { slug: "kansas", name: "Kansas", abbr: "KS", capital: "Topeka", topCities: ["Wichita", "Overland Park", "Kansas City", "Topeka"] },
    { slug: "kentucky", name: "Kentucky", abbr: "KY", capital: "Frankfort", topCities: ["Louisville", "Lexington", "Bowling Green", "Owensboro"] },
    { slug: "louisiana", name: "Louisiana", abbr: "LA", capital: "Baton Rouge", topCities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"] },
    { slug: "maine", name: "Maine", abbr: "ME", capital: "Augusta", topCities: ["Portland", "Lewiston", "Bangor", "South Portland"] },
    { slug: "maryland", name: "Maryland", abbr: "MD", capital: "Annapolis", topCities: ["Baltimore", "Columbia", "Germantown", "Silver Spring"] },
    { slug: "massachusetts", name: "Massachusetts", abbr: "MA", capital: "Boston", topCities: ["Boston", "Worcester", "Springfield", "Cambridge"] },
    { slug: "michigan", name: "Michigan", abbr: "MI", capital: "Lansing", topCities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"] },
    { slug: "minnesota", name: "Minnesota", abbr: "MN", capital: "St. Paul", topCities: ["Minneapolis", "St. Paul", "Rochester", "Duluth"] },
    { slug: "mississippi", name: "Mississippi", abbr: "MS", capital: "Jackson", topCities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg"] },
    { slug: "missouri", name: "Missouri", abbr: "MO", capital: "Jefferson City", topCities: ["Kansas City", "St. Louis", "Springfield", "Columbia"] },
    { slug: "montana", name: "Montana", abbr: "MT", capital: "Helena", topCities: ["Billings", "Missoula", "Great Falls", "Bozeman"] },
    { slug: "nebraska", name: "Nebraska", abbr: "NE", capital: "Lincoln", topCities: ["Omaha", "Lincoln", "Bellevue", "Grand Island"] },
    { slug: "nevada", name: "Nevada", abbr: "NV", capital: "Carson City", topCities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"] },
    { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", capital: "Concord", topCities: ["Manchester", "Nashua", "Concord", "Derry"] },
    { slug: "new-jersey", name: "New Jersey", abbr: "NJ", capital: "Trenton", topCities: ["Newark", "Jersey City", "Paterson", "Elizabeth"] },
    { slug: "new-mexico", name: "New Mexico", abbr: "NM", capital: "Santa Fe", topCities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"] },
    { slug: "new-york", name: "New York", abbr: "NY", capital: "Albany", topCities: ["New York City", "Buffalo", "Rochester", "Yonkers"] },
    { slug: "north-carolina", name: "North Carolina", abbr: "NC", capital: "Raleigh", topCities: ["Charlotte", "Raleigh", "Greensboro", "Durham"] },
    { slug: "north-dakota", name: "North Dakota", abbr: "ND", capital: "Bismarck", topCities: ["Fargo", "Bismarck", "Grand Forks", "Minot"] },
    { slug: "ohio", name: "Ohio", abbr: "OH", capital: "Columbus", topCities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"] },
    { slug: "oklahoma", name: "Oklahoma", abbr: "OK", capital: "Oklahoma City", topCities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"] },
    { slug: "oregon", name: "Oregon", abbr: "OR", capital: "Salem", topCities: ["Portland", "Eugene", "Salem", "Gresham"] },
    { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", capital: "Harrisburg", topCities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"] },
    { slug: "rhode-island", name: "Rhode Island", abbr: "RI", capital: "Providence", topCities: ["Providence", "Warwick", "Cranston", "Pawtucket"] },
    { slug: "south-carolina", name: "South Carolina", abbr: "SC", capital: "Columbia", topCities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant"] },
    { slug: "south-dakota", name: "South Dakota", abbr: "SD", capital: "Pierre", topCities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"] },
    { slug: "tennessee", name: "Tennessee", abbr: "TN", capital: "Nashville", topCities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"] },
    { slug: "texas", name: "Texas", abbr: "TX", capital: "Austin", topCities: ["Houston", "Dallas", "Austin", "San Antonio"] },
    { slug: "utah", name: "Utah", abbr: "UT", capital: "Salt Lake City", topCities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan"] },
    { slug: "vermont", name: "Vermont", abbr: "VT", capital: "Montpelier", topCities: ["Burlington", "Essex", "South Burlington", "Colchester"] },
    { slug: "virginia", name: "Virginia", abbr: "VA", capital: "Richmond", topCities: ["Virginia Beach", "Norfolk", "Richmond", "Arlington"] },
    { slug: "washington", name: "Washington", abbr: "WA", capital: "Olympia", topCities: ["Seattle", "Spokane", "Tacoma", "Vancouver"] },
    { slug: "west-virginia", name: "West Virginia", abbr: "WV", capital: "Charleston", topCities: ["Charleston", "Huntington", "Morgantown", "Parkersburg"] },
    { slug: "wisconsin", name: "Wisconsin", abbr: "WI", capital: "Madison", topCities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"] },
    { slug: "wyoming", name: "Wyoming", abbr: "WY", capital: "Cheyenne", topCities: ["Cheyenne", "Casper", "Laramie", "Gillette"] }
  ];
  return states.map((state) => ({
    params: { state: state.slug },
    props: { state }
  }));
}
const $$state = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$state;
  const { state } = Astro2.props;
  const stateTaxRates = {
    "california": 13.3,
    "oregon": 9.9,
    "minnesota": 9.85,
    "iowa": 8.53,
    "new-jersey": 10.75,
    "vermont": 8.75,
    "new-york": 10.9,
    "maine": 7.15,
    "wisconsin": 7.65,
    "hawaii": 11,
    "idaho": 6.5,
    "south-carolina": 7,
    "montana": 6.75,
    "massachusetts": 5,
    "rhode-island": 5.99,
    "california": 13.3,
    "maryland": 5.75,
    "nebraska": 6.64,
    "connecticut": 6.99,
    "kansas": 5.7,
    "missouri": 5.4,
    "west-virginia": 6.5,
    "delaware": 6.6,
    "illinois": 4.95,
    "virginia": 5.75,
    "georgia": 5.75,
    "kentucky": 5,
    "north-carolina": 4.99,
    "oklahoma": 4.75,
    "alabama": 5,
    "mississippi": 5,
    "arizona": 4.5,
    "new-mexico": 5.9,
    "ohio": 3.99,
    "colorado": 4.4,
    "indiana": 3.23,
    "pennsylvania": 3.07,
    "michigan": 4.25,
    "utah": 4.85,
    "north-dakota": 2.9,
    "louisiana": 4.25,
    "arkansas": 5.5,
    "alaska": 0,
    "florida": 0,
    "nevada": 0,
    "south-dakota": 0,
    "tennessee": 0,
    "texas": 0,
    "washington": 0,
    "wyoming": 0,
    "new-hampshire": 0
  };
  const stateTaxRate = stateTaxRates[state.slug] || 5;
  const potentialSavings = Math.round(1e6 * (stateTaxRate / 100));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${state.name} 1031 Exchange Services | Expert Qualified Intermediary`, "description": `Complete 1031 exchange services in ${state.name}. Save on capital gains taxes with our expert qualified intermediary services. Serving ${state.topCities.join(", ")} and all of ${state.abbr}.` }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="bg-gradient-to-b from-blue-50 to-white py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6"> ', ' 1031 Exchange Services\n</h1> <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">\nProfessional 1031 exchange services throughout ', ". From ", " to ", ', \n          we help real estate investors defer capital gains taxes and build wealth through strategic property exchanges.\n</p> <!-- CTA Buttons --> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/start-exchange" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg">\nStart Your ', ' Exchange\n</a> <a href="/calculator" class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">\nCalculate Your Savings\n</a> </div> </div> <!-- State Tax Savings Highlight --> <div class="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto"> <div class="grid md:grid-cols-2 gap-6"> <div class="text-center"> <div class="text-3xl font-bold text-blue-600">', '%</div> <div class="text-gray-600">', ' Capital Gains Tax Rate</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-green-600">$', '</div> <div class="text-gray-600">Potential Tax Savings on $1M Exchange</div> </div> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">\nLocal ', ' Expertise, National Resources\n</h2> <div class="grid lg:grid-cols-3 gap-8"> <div class="bg-gray-50 p-6 rounded-lg"> <h3 class="text-xl font-semibold text-gray-900 mb-4">Statewide Coverage</h3> <p class="text-gray-600 mb-4">\nWe serve all of ', ', including:\n</p> <ul class="space-y-2 text-gray-600"> ', ' </ul> </div> <div class="bg-gray-50 p-6 rounded-lg"> <h3 class="text-xl font-semibold text-gray-900 mb-4">', ' Tax Benefits</h3> <p class="text-gray-600 mb-4"> ', ' </p> <p class="text-gray-600">\nOur experts understand ', `'s specific tax laws and real estate regulations to maximize your benefits.
</p> </div> <div class="bg-gray-50 p-6 rounded-lg"> <h3 class="text-xl font-semibold text-gray-900 mb-4">Local Market Knowledge</h3> <p class="text-gray-600 mb-4">
Our team has deep knowledge of `, "'s real estate markets, from residential properties in ", '\nto commercial investments throughout the state.\n</p> <p class="text-gray-600">\nWe help you identify the best replacement properties to meet your investment goals.\n</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">\n1031 Exchange Services Available in ', ' </h2> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-gray-900 mb-3">Delayed Exchange</h3> <p class="text-gray-600 mb-4">\nThe most common exchange type. Sell your ', ' property first, then identify and purchase replacement property within the required timelines.\n</p> <a href="/services/delayed-exchange" class="text-blue-600 font-semibold hover:text-blue-700">\nLearn More \u2192\n</a> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-gray-900 mb-3">Reverse Exchange</h3> <p class="text-gray-600 mb-4">\nPerfect for ', `'s competitive markets. Buy your replacement property before selling, ensuring you don't miss opportunities.
</p> <a href="/services/reverse-exchange" class="text-blue-600 font-semibold hover:text-blue-700">
Learn More \u2192
</a> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-gray-900 mb-3">Improvement Exchange</h3> <p class="text-gray-600 mb-4">
Use exchange funds to improve your replacement property. Ideal for value-add investors in `, `'s growing markets.
</p> <a href="/services/improvement-exchange" class="text-blue-600 font-semibold hover:text-blue-700">
Learn More \u2192
</a> </div> <div class="bg-white p-6 rounded-lg shadow-md"> <h3 class="text-xl font-semibold text-gray-900 mb-3">Partial Exchange</h3> <p class="text-gray-600 mb-4">
Take some cash out while still deferring taxes on the majority of your gain. Flexible solution for `, ' investors.\n</p> <a href="/services/partial-exchange" class="text-blue-600 font-semibold hover:text-blue-700">\nLearn More \u2192\n</a> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">\nWhy ', ' Investors Choose National 1031 Center\n</h2> <div class="grid lg:grid-cols-3 gap-8"> <div class="text-center"> <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Security & Protection</h3> <p class="text-gray-600">\nBonded, insured, and with segregated accounts. Your ', ' exchange funds are protected at every step.\n</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">48-Hour Response</h3> <p class="text-gray-600">\nFast response times for ', ' investors. We understand that timing is critical in real estate transactions.\n</p> </div> <div class="text-center"> <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"> <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-3">Expert Team</h3> <p class="text-gray-600">\nCertified Exchange Specialists familiar with ', ' real estate laws and tax regulations.\n</p> </div> </div> </div> </section>  <section class="py-16 bg-gray-50"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">\nCommon Questions from ', ' Investors\n</h2> <div class="space-y-6"> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">\nCan I exchange property from ', ' to another state?\n</h3> <p class="text-gray-600">\nYes! 1031 exchanges allow you to exchange property across state lines. Many ', ' investors use exchanges to \n            diversify geographically or move investments to states with different tax advantages.\n</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">\nHow much can I save on taxes in ', '?\n</h3> <p class="text-gray-600"> ', ' </p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">\nWhat types of ', ' properties qualify?\n</h3> <p class="text-gray-600">\nMost investment and business properties in ', ' qualify, including rental homes, apartment buildings, \n            office buildings, retail centers, industrial properties, and vacant land held for investment.\n</p> </div> <div class="bg-white rounded-lg shadow-md p-6"> <h3 class="text-lg font-semibold text-gray-900 mb-3">\nHow quickly can I start my ', ` exchange?
</h3> <p class="text-gray-600">
We can set up your exchange immediately. Contact us before closing on your sale, and we'll have everything 
            ready to ensure a smooth exchange process that complies with all IRS requirements.
</p> </div> </div> </div> </section>  <section class="py-16 bg-blue-900 text-white"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold mb-6">
Ready to Save on `, ' Capital Gains Taxes?\n</h2> <p class="text-xl mb-8 text-blue-100">\nJoin thousands of ', ' investors who have successfully deferred taxes through 1031 exchanges. \n        Our experts are ready to guide you through every step.\n</p> <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8"> <a href="/start-exchange" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">\nStart Your ', ' Exchange\n</a> <a href="/calculator" class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">\nCalculate Your Savings\n</a> </div> <p class="text-blue-200">\nQuestions? Call our ', " exchange specialists:\n<a", ' class="text-yellow-400 hover:text-yellow-300 font-semibold">', '</a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), state.name, state.name, state.capital, state.topCities[0], state.abbr, stateTaxRate, state.name, potentialSavings.toLocaleString(), state.name, state.name, state.topCities.map((city) => renderTemplate`<li class="flex items-center"> <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> ${city} </li>`), state.name, stateTaxRate === 0 ? `While ${state.name} has no state income tax, federal capital gains taxes still apply. A 1031 exchange defers federal taxes of 15-20% plus depreciation recapture.` : `With ${state.name}'s ${stateTaxRate}% capital gains tax plus federal taxes, investors can defer 20-30% or more in combined taxes through a 1031 exchange.`, state.name, state.name, state.topCities[0], state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, state.name, stateTaxRate === 0 ? `While ${state.name} has no state income tax, you can still defer federal capital gains taxes (15-20%) and depreciation recapture (25%). On a $1 million gain, this could mean deferring $200,000+ in federal taxes.` : `With ${state.name}'s ${stateTaxRate}% state tax plus federal taxes, you could defer ${stateTaxRate + 20}% or more. On a $1 million gain, that's potentially $${((stateTaxRate + 20) * 1e4).toLocaleString()} in deferred taxes.`, state.name, state.name, state.name, state.name, state.name, state.name, state.name, addAttribute(getPhoneLink(), "href"), COMPANY.phone.main, unescapeHTML(generateJsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      wrapInWebPageSchema(
        `https://the1031center.com/locations/${state.slug}`,
        `${state.name} 1031 Exchange Services | The 1031 Center`,
        `Professional 1031 exchange services throughout ${state.name}. Expert qualified intermediary helping investors defer capital gains taxes.`,
        {
          "@type": "Service",
          "@id": `https://the1031center.com/locations/${state.slug}#service`,
          "name": `${state.name} 1031 Exchange Services`,
          "description": `Professional 1031 exchange services throughout ${state.name}. Expert qualified intermediary helping investors defer capital gains taxes.`,
          "provider": {
            "@type": "Organization",
            "name": "National 1031 Center",
            "@id": "https://the1031center.com/#organization",
            "telephone": COMPANY.phone.main,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US",
              "addressRegion": state.abbr
            }
          },
          "areaServed": {
            "@type": "State",
            "name": state.name,
            "containsPlace": state.topCities.map((city) => ({
              "@type": "City",
              "name": city
            }))
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "1031 Exchange Types",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Delayed Exchange",
                  "description": "Standard 1031 exchange - sell first, then buy"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Reverse Exchange",
                  "description": "Buy replacement property before selling"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Improvement Exchange",
                  "description": "Use exchange funds for property improvements"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Partial Exchange",
                  "description": "Defer taxes while taking some cash out"
                }
              }
            ]
          }
        }
      )
    ]
  }))) })}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/locations/[state].astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/locations/[state].astro";
const $$url = "/locations/[state]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$state,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
