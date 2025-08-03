import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured',
      data: null 
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Get tenant ID if provided
    const tenantId = url.searchParams.get('tenant_id');
    
    // For now, use the view which aggregates all approved reviews
    // In the future, we might need to create tenant-specific views
    const { data, error } = await supabase
      .from('reviews_summary')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching reviews summary:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch reviews summary',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // If no data, return empty summary
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
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};