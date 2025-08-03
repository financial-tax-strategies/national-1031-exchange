import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured',
      data: [] 
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
    const includeInactive = url.searchParams.get('include_inactive') === 'true';
    
    // Build query
    let query = supabase
      .from('team_members_public')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    // Apply filters
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    if (!includeInactive) {
      // The view already filters for active members
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching team members:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch team members',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ data: data || [] }), {
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

// POST endpoint for creating team members (admin only)
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
    // TODO: Add authentication check here
    // const session = await getSession(request);
    // if (!session || !session.user.isAdmin) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return new Response(JSON.stringify({ 
        error: 'Name is required' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Insert team member
    const { data, error } = await supabase
      .from('team_members')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating team member:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to create team member',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ data }), {
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