import type { Handler } from '@netlify/functions';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const handler: Handler = async (event, context) => {
  // Only handle PATCH requests
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'PATCH'
      },
    };
  }
  
  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: 'Database not configured' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { id, ...updateData } = body;
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team member ID is required' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    
    // Use Supabase REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Failed to update team member',
          details: error 
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ data: data[0] || null }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};