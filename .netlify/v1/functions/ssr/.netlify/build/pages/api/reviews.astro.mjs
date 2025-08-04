import { i as isSupabaseConfigured, s as supabase } from '../../chunks/supabase_oEJHkwy9.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({
      error: "Database not configured",
      data: [],
      summary: null
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const tenantId = url.searchParams.get("tenant_id");
    const featured = url.searchParams.get("featured") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const includeStats = url.searchParams.get("include_stats") === "true";
    let query = supabase.from("reviews").select("*").eq("status", "approved").eq("is_active", true).order("date_published", { ascending: false });
    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
    if (featured) {
      query = query.eq("is_featured", true);
    }
    query = query.range(offset, offset + limit - 1);
    const { data: reviews, error: reviewsError } = await query;
    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
      return new Response(JSON.stringify({
        error: "Failed to fetch reviews",
        details: reviewsError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    let summary = null;
    if (includeStats) {
      const { data: summaryData, error: summaryError } = await supabase.from("reviews_summary").select("*").single();
      if (!summaryError && summaryData) {
        summary = summaryData;
      }
    }
    return new Response(JSON.stringify({
      data: reviews || [],
      summary,
      pagination: {
        limit,
        offset,
        total: summary?.total_reviews || null
      }
    }), {
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
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({
      error: "Database not configured"
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const body = await request.json();
    const requiredFields = ["author_name", "review_rating_value"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        error: "Missing required fields",
        fields: missingFields
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (body.review_rating_value < 1 || body.review_rating_value > 5) {
      return new Response(JSON.stringify({
        error: "Rating must be between 1 and 5"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const reviewData = {
      ...body,
      status: "pending",
      source: "website",
      date_published: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    const { data, error } = await supabase.from("reviews").insert([reviewData]).select().single();
    if (error) {
      console.error("Error creating review:", error);
      return new Response(JSON.stringify({
        error: "Failed to submit review",
        details: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      data,
      message: "Thank you for your review! It will be published after moderation."
    }), {
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
const PATCH = async ({ request, params }) => {
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({
      error: "Database not configured"
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
        error: "Review ID is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const { data, error } = await supabase.from("reviews").update(updateData).eq("id", id).select().single();
    if (error) {
      console.error("Error updating review:", error);
      return new Response(JSON.stringify({
        error: "Failed to update review",
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
  GET,
  PATCH,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
