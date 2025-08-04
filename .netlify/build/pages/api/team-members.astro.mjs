import { i as isSupabaseConfigured, a as isSupabaseAdminConfigured, b as supabaseAdmin, s as supabase } from '../../chunks/supabase_oEJHkwy9.mjs';
export { renderers } from '../../renderers.mjs';

const ALL = async ({ request }) => {
  const method = request.method;
  console.log(`[API Debug] team-members received ${method} request`);
  if (!["GET", "POST", "PATCH"].includes(method)) {
    return new Response(JSON.stringify({
      error: `Method ${method} not supported`,
      supportedMethods: ["GET", "POST", "PATCH"],
      debug: true
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Allow": "GET, POST, PATCH"
      }
    });
  }
  if (method === "GET") return GET({ url: new URL(request.url)});
  if (method === "POST") return POST({ request });
  if (method === "PATCH") return PATCH({ request });
};
const GET = async ({ url }) => {
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({
      error: "Database not configured",
      data: []
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const tenantId = url.searchParams.get("tenant_id");
    const includeInactive = url.searchParams.get("include_inactive") === "true";
    const client = includeInactive && isSupabaseAdminConfigured() ? supabaseAdmin : supabase;
    const tableName = includeInactive && isSupabaseAdminConfigured() ? "team_members" : "team_members_public";
    let query = client.from(tableName).select("*").order("display_order", { ascending: true }).order("name", { ascending: true });
    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
    if (!includeInactive) {
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching team members:", error);
      return new Response(JSON.stringify({
        error: "Failed to fetch team members",
        details: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({ data: data || [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request }) => {
  if (!isSupabaseAdminConfigured()) {
    return new Response(JSON.stringify({
      error: "Admin database configuration missing (SUPABASE_SERVICE_ROLE_KEY required)"
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({
        error: "Name is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (!body.slug || !body.slug.trim()) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (!body.slug) {
        body.slug = "team-member-" + Date.now();
      }
    }
    if (typeof body.display_order !== "number") {
      body.display_order = 0;
    }
    if (typeof body.is_active !== "boolean") {
      body.is_active = true;
    }
    console.log("[API] Creating team member with data:", body);
    const { data, error } = await supabaseAdmin.from("team_members").insert([body]).select().single();
    if (error) {
      console.error("Error creating team member:", error);
      return new Response(JSON.stringify({
        error: "Failed to create team member",
        details: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({ data }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const PATCH = async ({ request }) => {
  if (!isSupabaseAdminConfigured()) {
    return new Response(JSON.stringify({
      error: "Admin database configuration missing (SUPABASE_SERVICE_ROLE_KEY required)"
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return new Response(JSON.stringify({
        error: "Team member ID is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (updateData.name && !updateData.name.trim()) {
      return new Response(JSON.stringify({
        error: "Name cannot be empty"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (updateData.name && (!updateData.slug || !updateData.slug.trim())) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (!updateData.slug) {
        updateData.slug = "team-member-" + Date.now();
      }
    }
    if (updateData.display_order !== void 0 && typeof updateData.display_order !== "number") {
      const parsed = parseInt(updateData.display_order);
      updateData.display_order = isNaN(parsed) ? 0 : parsed;
    }
    console.log("[API] Updating team member with data:", { id, updateData });
    const { data, error } = await supabaseAdmin.from("team_members").update(updateData).eq("id", id).select().single();
    if (error) {
      console.error("Error updating team member:", error);
      return new Response(JSON.stringify({
        error: "Failed to update team member",
        details: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  GET,
  PATCH,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
