import { i as isSupabaseConfigured, s as supabase } from '../../chunks/supabase_oEJHkwy9.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({
      error: "Database not configured",
      data: null
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const tenantId = url.searchParams.get("tenant_id");
    const { data, error } = await supabase.from("reviews_summary").select("*").single();
    if (error) {
      console.error("Error fetching reviews summary:", error);
      return new Response(JSON.stringify({
        error: "Failed to fetch reviews summary",
        details: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const summary = data || {
      total_reviews: 0,
      average_rating: 0,
      five_star_count: 0,
      four_star_count: 0,
      three_star_count: 0,
      two_star_count: 0,
      one_star_count: 0
    };
    return new Response(JSON.stringify({ data: summary }), {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
