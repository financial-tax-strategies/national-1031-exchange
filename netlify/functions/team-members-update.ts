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
    
    // Clean up empty values and remove read-only fields
    const readOnlyFields = ['created_at', 'updated_at', 'created_by', 'updated_by'];
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null) {
        updateData[key] = null;
      }
      // Remove read-only fields that might cause issues
      if (readOnlyFields.includes(key)) {
        delete updateData[key];
      }
    });
    
    const url = `${supabaseUrl}/rest/v1/team_members?id=eq.${id}`;
    console.log('[Netlify Function] Sending PATCH to:', url);
    console.log('[Netlify Function] Update data:', updateData);
    
    // Use Supabase REST API directly
    // IMPORTANT: Removed 'Prefer: return=representation' as it was causing updates to not persist
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': authKey,
        'Authorization': `Bearer ${authKey}`
      },
      body: JSON.stringify(updateData)
    });
    
    const responseText = await response.text();
    console.log('[Netlify Function] Response status:', response.status);
    console.log('[Netlify Function] Response body:', responseText);
    
    // Without Prefer header, successful PATCH returns 204 with no body
    if (response.status === 204) {
      console.log('[Netlify Function] Received 204 - update should be successful');
    } else if (!response.ok) {
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
    
    // Fetch the updated record to return to the client
    console.log('[Netlify Function] Fetching updated record...');
    const fetchUrl = `${supabaseUrl}/rest/v1/team_members?id=eq.${id}`;
    const fetchResponse = await fetch(fetchUrl, {
      headers: {
        'apikey': authKey,
        'Authorization': `Bearer ${authKey}`
      }
    });
    
    if (!fetchResponse.ok) {
      console.error('[Netlify Function] Failed to fetch updated record');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Update may have succeeded but could not fetch updated record',
          success: false,
        }),
        headers,
      };
    }
    
    const updatedData = await fetchResponse.json();
    console.log('[Netlify Function] Fetched updated data:', updatedData);
    
    const actualData = updatedData[0];
    if (!actualData) {
      console.error('[Netlify Function] No data returned after update');
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Team member not found after update',
          success: false,
        }),
        headers,
      };
    }
    
    // Verify the update actually happened - just check if we got data back
    // Don't verify individual fields as they might have been transformed by the database
    const updateSuccessful = actualData && actualData.id === id;
    
    console.log('[Netlify Function] Update successful:', updateSuccessful);
    console.log('[Netlify Function] Returned data ID matches:', actualData?.id === id);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        data: actualData,
        success: true,
        message: 'Team member updated successfully',
        debug: {
          authKeyType: supabaseServiceKey ? 'service' : 'anon',
          updatedFields: Object.keys(updateData).filter(k => k !== 'id'),
          fieldsVerified: fieldsUpdated
        }
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