import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured',
      data: [],
      summary: null
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Get query parameters
    const tenantId = url.searchParams.get('tenant_id');
    const featured = url.searchParams.get('featured') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const includeStats = url.searchParams.get('include_stats') === 'true';
    
    // Build query for reviews
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('date_published', { ascending: false });
    
    // Apply filters
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data: reviews, error: reviewsError } = await query;
    
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch reviews',
        details: reviewsError.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Fetch summary statistics if requested
    let summary = null;
    if (includeStats) {
      const { data: summaryData, error: summaryError } = await supabase
        .from('reviews_summary')
        .select('*')
        .single();
      
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

// POST endpoint for submitting reviews (public)
export const POST: APIRoute = async ({ request }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured' 
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['author_name', 'review_rating_value'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        fields: missingFields 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Validate rating value
    if (body.review_rating_value < 1 || body.review_rating_value > 5) {
      return new Response(JSON.stringify({ 
        error: 'Rating must be between 1 and 5' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Set default status to pending for moderation
    const reviewData = {
      ...body,
      status: 'pending',
      source: 'website',
      date_published: new Date().toISOString().split('T')[0]
    };
    
    // Insert review
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit review',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ 
      data,
      message: 'Thank you for your review! It will be published after moderation.'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
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

// PATCH endpoint for updating reviews (admin only)
export const PATCH: APIRoute = async ({ request, params }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured' 
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // TODO: Add authentication check here
    // const session = await getSession(request);
    // if (!session || !session.user.isAdmin) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'Review ID is required' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Update review
    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating review:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to update review',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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