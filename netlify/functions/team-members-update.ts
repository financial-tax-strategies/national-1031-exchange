import type { Handler } from '@netlify/functions';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only handle PATCH requests
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
      headers: {
        ...headers,
        'Allow': 'PATCH'
      },
    };
  }
  
  // Check if Supabase is configured
  if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: 'Database not configured' }),
      headers,
    };
  }
  
  // Use service key if available, otherwise fall back to anon key
  const authKey = supabaseServiceKey || supabaseAnonKey;
  console.log('[Netlify Function] Using auth key type:', supabaseServiceKey ? 'service' : 'anon');
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { id, ...updateData } = body;
    
    console.log('[Netlify Function] Received update request:', { id, updateData });
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Team member ID is required' }),
        headers,
      };
    }
    
    // Clean up empty values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null) {
        updateData[key] = null;
      }
    });
    
    const url = `${supabaseUrl}/rest/v1/team_members?id=eq.${id}`;
    console.log('[Netlify Function] Sending PATCH to:', url);
    console.log('[Netlify Function] Update data:', updateData);
    
    // Use Supabase REST API directly
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': authKey,
        'Authorization': `Bearer ${authKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    });
    
    const responseText = await response.text();
    console.log('[Netlify Function] Response status:', response.status);
    console.log('[Netlify Function] Response body:', responseText);
    
    if (!response.ok) {
      console.error('[Netlify Function] Supabase error:', responseText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Failed to update team member',
          details: responseText,
          url: url.replace(supabaseUrl, 'SUPABASE_URL') // Hide sensitive URL in response
        }),
        headers,
      };
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[Netlify Function] Failed to parse response:', e);
      data = [];
    }
    
    console.log('[Netlify Function] Update successful:', data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        data: data[0] || null,
        success: true,
        message: 'Team member updated successfully'
      }),
      headers,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      headers,
    };
  }
};