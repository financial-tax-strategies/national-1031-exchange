import { c as createAstro, d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../../chunks/astro/server_DPvkWNif.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_fWv45tcb.mjs';
import { a as isSupabaseAdminConfigured, b as supabaseAdmin, i as isSupabaseConfigured } from '../../chunks/supabase_oEJHkwy9.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://the1031center.com");
const $$TeamMembers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TeamMembers;
  let isAuthenticated = false;
  process.env.NODE_ENV === "development" || true;
  {
    console.log("[Admin] Development mode - bypassing authentication");
    isAuthenticated = true;
  }
  let teamMembers = [];
  let error = null;
  if (isSupabaseAdminConfigured() && isAuthenticated) {
    try {
      const { data, error: fetchError } = await supabaseAdmin.from("team_members").select("*").order("display_order", { ascending: true }).order("name", { ascending: true });
      if (fetchError) {
        error = fetchError.message;
        console.error("Database error:", fetchError);
      } else {
        teamMembers = data || [];
        console.log(`[Admin] Loaded ${teamMembers.length} team members (including inactive) via admin client`);
      }
    } catch (e) {
      error = "Failed to fetch team members";
      console.error("Fetch error:", e);
    }
  } else if (!isSupabaseAdminConfigured()) {
    error = "Admin database configuration missing (SUPABASE_SERVICE_ROLE_KEY required)";
  } else if (!isSupabaseConfigured()) {
    error = "Database not configured";
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Team Members Management" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="max-w-7xl mx-auto"> <div class="flex justify-between items-center mb-8"> <h1 class="text-3xl font-bold">Team Members</h1> <button id="addMemberBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
Add Team Member
</button> </div> ${!isSupabaseAdminConfigured() ? renderTemplate`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"> <p class="text-yellow-800">Admin database configuration is missing (SUPABASE_SERVICE_ROLE_KEY required). Team member management is disabled.</p> </div>` : error ? renderTemplate`<div class="bg-red-50 border border-red-200 rounded-lg p-4"> <p class="text-red-800">Error: ${error}</p> </div>` : renderTemplate`<div class="bg-white shadow-md rounded-lg overflow-hidden"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Order
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Name
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Title
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Email
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Status
</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Actions
</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${teamMembers.map((member) => renderTemplate`<tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ${member.display_order} </td> <td class="px-6 py-4 whitespace-nowrap"> <div class="flex items-center"> ${member.image && renderTemplate`<img${addAttribute(member.image, "src")}${addAttribute(member.name, "alt")} class="h-10 w-10 rounded-full mr-3">`} <div> <div class="text-sm font-medium text-gray-900"> ${member.name} </div> <div class="text-sm text-gray-500">
/${member.slug} </div> </div> </div> </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ${member.job_title || "-"} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ${member.email || "-"} </td> <td class="px-6 py-4 whitespace-nowrap"> <span${addAttribute(`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, "class")}> ${member.is_active ? "Active" : "Inactive"} </span> </td> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-btn"${addAttribute(JSON.stringify(member), "data-member")}>
Edit
</button> <button class="text-red-600 hover:text-red-900 toggle-btn"${addAttribute(member.id, "data-id")}${addAttribute(member.is_active, "data-active")}> ${member.is_active ? "Deactivate" : "Activate"} </button> </td> </tr>`)} </tbody> </table> ${teamMembers.length === 0 && renderTemplate`<div class="text-center py-8 text-gray-500">
No team members found. Click "Add Team Member" to create one.
</div>`} </div>`} </div> </main>  <div id="memberModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"> <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"> <h3 id="modalTitle" class="text-lg font-bold text-gray-900 mb-4">Add Team Member</h3> <form id="memberForm" class="space-y-4"> <input type="hidden" id="memberId" name="id"> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Name *</label> <input type="text" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div> <label class="block text-sm font-medium text-gray-700">URL Slug</label> <input type="text" name="slug" id="slugInput" placeholder="auto-generated from name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> <p class="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p> </div> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Job Title</label> <input type="text" name="job_title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div> <label class="block text-sm font-medium text-gray-700">Organization</label> <input type="text" name="works_for" value="The 1031 Center" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Email</label> <input type="email" name="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div> <label class="block text-sm font-medium text-gray-700">Phone</label> <input type="tel" name="telephone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700">Bio/Description</label> <textarea name="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea> </div> <div> <label class="block text-sm font-medium text-gray-700">Profile Image URL</label> <input type="url" name="image" placeholder="/images/team/name.jpg" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Years Experience</label> <input type="number" name="years_experience" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div> <label class="block text-sm font-medium text-gray-700">Display Order</label> <input type="number" name="display_order" value="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700">Areas of Expertise (comma-separated)</label> <input type="text" name="knows_about" placeholder="1031 exchanges, Tax strategy, Real estate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div> <label class="block text-sm font-medium text-gray-700">Social Media Links (comma-separated)</label> <input type="text" name="same_as" placeholder="https://linkedin.com/in/username" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"> </div> <div class="flex items-center"> <input type="checkbox" name="is_active" id="is_active" checked class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"> <label for="is_active" class="ml-2 block text-sm text-gray-900">
Active
</label> </div> <div class="flex justify-end space-x-4 pt-4"> <button type="button" id="cancelBtn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
Cancel
</button> <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
Save
</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/team-members.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/team-members.astro", void 0);
const $$file = "/Users/matthewdnye/odrive/Google Drive - NYEC50/NYEM50/Developer Projects/Elite Advisor Tools/national-1031-exchange/src/pages/admin/team-members.astro";
const $$url = "/admin/team-members";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TeamMembers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
