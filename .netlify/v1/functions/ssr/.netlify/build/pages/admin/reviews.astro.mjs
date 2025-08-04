import { c as createAstro, d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, f as addAttribute, k as Fragment } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
import { i as isSupabaseConfigured, s as supabase } from '../../chunks/supabase_oEJHkwy9.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://the1031center.com");
const $$Reviews = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reviews;
  let reviews = [];
  let summary = null;
  let error = null;
  const url = new URL(Astro2.request.url);
  const statusFilter = url.searchParams.get("status") || "all";
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      const { data, error: fetchError } = await query;
      if (fetchError) {
        error = fetchError.message;
      } else {
        reviews = data || [];
      }
      const { data: summaryData } = await supabase.from("reviews_summary").select("*").single();
      summary = summaryData;
    } catch (e) {
      error = "Failed to fetch reviews";
      console.error(e);
    }
  }
  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    flagged: reviews.filter((r) => r.status === "flagged").length
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Reviews Management" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-7xl mx-auto"> <div class="mb-8"> <h1 class="text-3xl font-bold mb-4">Customer Reviews</h1> ${summary && renderTemplate`<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"> <div class="bg-white p-4 rounded-lg shadow"> <div class="text-2xl font-bold text-blue-600">${summary.total_reviews}</div> <div class="text-sm text-gray-600">Total Reviews</div> </div> <div class="bg-white p-4 rounded-lg shadow"> <div class="text-2xl font-bold text-yellow-600"> ${summary.average_rating ? summary.average_rating.toFixed(1) : "0.0"} </div> <div class="text-sm text-gray-600">Average Rating</div> </div> <div class="bg-white p-4 rounded-lg shadow"> <div class="text-2xl font-bold text-green-600">${summary.five_star_count}</div> <div class="text-sm text-gray-600">5-Star Reviews</div> </div> <div class="bg-white p-4 rounded-lg shadow"> <div class="text-2xl font-bold text-orange-600">${statusCounts.pending}</div> <div class="text-sm text-gray-600">Pending Moderation</div> </div> <div class="bg-white p-4 rounded-lg shadow"> <div class="text-2xl font-bold text-red-600">${statusCounts.flagged}</div> <div class="text-sm text-gray-600">Flagged</div> </div> </div>`} <!-- Status Filter Tabs --> <div class="border-b border-gray-200"> <nav class="-mb-px flex space-x-8"> ${Object.entries(statusCounts).map(([status, count]) => renderTemplate`<a${addAttribute(`?status=${status}`, "href")}${addAttribute(`py-2 px-1 border-b-2 font-medium text-sm ${statusFilter === status ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`, "class")}> ${status.charAt(0).toUpperCase() + status.slice(1)} (${count})
</a>`)} </nav> </div> </div> ${!isSupabaseConfigured() ? renderTemplate`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"> <p class="text-yellow-800">Database configuration is missing. Review management is disabled.</p> </div>` : error ? renderTemplate`<div class="bg-red-50 border border-red-200 rounded-lg p-4"> <p class="text-red-800">Error: ${error}</p> </div>` : renderTemplate`<div class="space-y-4"> ${reviews.map((review) => renderTemplate`<div class="bg-white shadow rounded-lg p-6"> <div class="flex justify-between items-start mb-4"> <div> <div class="flex items-center mb-2"> <div class="flex text-yellow-400"> ${[...Array(5)].map((_, i) => renderTemplate`<svg${addAttribute(`h-5 w-5 ${i < review.review_rating_value ? "fill-current" : "fill-gray-300"}`, "class")} viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> <span class="ml-2 text-sm text-gray-600"> ${review.review_rating_value}/5
</span> ${review.is_featured && renderTemplate`<span class="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
Featured
</span>`} </div> ${review.headline && renderTemplate`<h3 class="text-lg font-semibold text-gray-900">${review.headline}</h3>`} </div> <div class="flex items-center space-x-2"> <span${addAttribute(`px-3 py-1 text-xs font-semibold rounded-full ${review.status === "approved" ? "bg-green-100 text-green-800" : review.status === "pending" ? "bg-yellow-100 text-yellow-800" : review.status === "rejected" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`, "class")}> ${review.status.charAt(0).toUpperCase() + review.status.slice(1)} </span> </div> </div> <div class="text-gray-700 mb-4"> ${review.review_body || renderTemplate`<em class="text-gray-500">No review text provided</em>`} </div> <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4"> <div> <strong>Author:</strong> ${review.author_name} ${review.author_location && ` from ${review.author_location}`} </div> ${review.service_type && renderTemplate`<div> <strong>Service:</strong> ${review.service_type.replace(/_/g, " ")} </div>`} ${review.transaction_value_range && renderTemplate`<div> <strong>Value:</strong> ${review.transaction_value_range.replace(/_/g, "-")} </div>`} <div> <strong>Date:</strong> ${new Date(review.date_published).toLocaleDateString()} </div> <div> <strong>Source:</strong> ${review.source} </div> </div> ${review.response_text && renderTemplate`<div class="bg-gray-50 p-4 rounded mb-4"> <div class="text-sm font-semibold text-gray-700 mb-1">Business Response:</div> <div class="text-sm text-gray-600">${review.response_text}</div> ${review.response_date && renderTemplate`<div class="text-xs text-gray-500 mt-1">
Responded on ${new Date(review.response_date).toLocaleDateString()} </div>`} </div>`} <div class="flex justify-between items-center pt-4 border-t"> <div class="flex space-x-2"> ${review.status === "pending" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <button class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 approve-btn"${addAttribute(review.id, "data-id")}>
Approve
</button> <button class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 reject-btn"${addAttribute(review.id, "data-id")}>
Reject
</button> ` })}`} ${review.status === "approved" && renderTemplate`<button class="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 feature-btn"${addAttribute(review.id, "data-id")}${addAttribute(review.is_featured, "data-featured")}> ${review.is_featured ? "Unfeature" : "Feature"} </button>`} ${!review.response_text && renderTemplate`<button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 respond-btn"${addAttribute(review.id, "data-id")}>
Respond
</button>`} ${review.status !== "flagged" && renderTemplate`<button class="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 flag-btn"${addAttribute(review.id, "data-id")}>
Flag
</button>`} </div> <div class="text-xs text-gray-500">
Submitted ${new Date(review.created_at).toLocaleString()} </div> </div> </div>`)} ${reviews.length === 0 && renderTemplate`<div class="text-center py-8 text-gray-500">
No reviews found for the selected filter.
</div>`} </div>`} </div> </main>  <div id="responseModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"> <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white"> <h3 class="text-lg font-bold text-gray-900 mb-4">Add Business Response</h3> <form id="responseForm"> <input type="hidden" id="reviewId"> <textarea id="responseText" rows="4" required placeholder="Thank you for your review..." class="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea> <div class="flex justify-end space-x-4 mt-4"> <button type="button" id="cancelResponseBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
Cancel
</button> <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
Post Response
</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/reviews.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/reviews.astro", void 0);

const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/reviews.astro";
const $$url = "/admin/reviews";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reviews,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
