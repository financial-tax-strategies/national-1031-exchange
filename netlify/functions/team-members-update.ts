import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

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
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Update team member
    const { data, error } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating team member:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to update team member',
          details: error.message 
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
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