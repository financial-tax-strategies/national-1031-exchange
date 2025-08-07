import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '../../lib/supabase';

interface SEOConfig {
  id?: string;
  tenant_id?: string;
  analytics?: {
    ga4_id?: string;
    gtm_id?: string;
    fb_pixel_id?: string;
    linkedin_id?: string;
    twitter_pixel_id?: string;
    clarity_id?: string;
    hotjar_id?: string;
  };
  meta?: {
    default_description?: string;
    default_author?: string;
    default_keywords?: string;
    default_og_image?: string;
  };
  schema?: {
    org_name?: string;
    org_legal_name?: string;
    social_facebook?: string;
    social_linkedin?: string;
    social_twitter?: string;
    social_youtube?: string;
    price_range?: string;
  };
  ai_bots?: {
    gpt_bot?: boolean;
    claude_web?: boolean;
    perplexity_bot?: boolean;
    you_bot?: boolean;
    cohere_ai?: boolean;
  };
  updated_at?: string;
  created_at?: string;
}

// GET endpoint to retrieve SEO configuration
export const GET: APIRoute = async ({ url }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    // Return default configuration if database is not available
    return new Response(JSON.stringify({ 
      data: {
        analytics: {},
        meta: {},
        schema: {},
        ai_bots: {
          gpt_bot: true,
          claude_web: true,
          perplexity_bot: true,
          you_bot: true,
          cohere_ai: true
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const tenantId = url.searchParams.get('tenant_id') || 'default';
    
    // First check if the table exists
    const { error: tableCheckError } = await supabase
      .from('seo_config')
      .select('id')
      .limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      // Table doesn't exist, return default configuration
      console.log('SEO config table does not exist yet');
      return new Response(JSON.stringify({ 
        data: {
          analytics: {},
          meta: {},
          schema: {},
          ai_bots: {
            gpt_bot: true,
            claude_web: true,
            perplexity_bot: true,
            you_bot: true,
            cohere_ai: true
          }
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Try to fetch existing configuration
    const { data, error } = await supabase
      .from('seo_config')
      .select('*')
      .eq('tenant_id', tenantId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching SEO config:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch SEO configuration',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Return existing config or default
    const responseData = data || {
      analytics: {},
      meta: {},
      schema: {},
      ai_bots: {
        gpt_bot: true,
        claude_web: true,
        perplexity_bot: true,
        you_bot: true,
        cohere_ai: true
      }
    };
    
    return new Response(JSON.stringify({ data: responseData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
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

// POST endpoint to save SEO configuration
export const POST: APIRoute = async ({ request }) => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return new Response(JSON.stringify({ 
      error: 'Database not configured. SEO configuration cannot be saved.',
      message: 'Please configure Supabase environment variables to enable saving.'
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
    const tenantId = body.tenant_id || 'default';
    
    // Prepare the configuration object
    const config: SEOConfig = {
      tenant_id: tenantId,
      analytics: body.analytics || {},
      meta: body.meta || {},
      schema: body.schema || {},
      ai_bots: body.aiBots || body.ai_bots || {},
      updated_at: new Date().toISOString()
    };
    
    console.log('[API] Saving SEO configuration:', config);
    
    // First, check if the table exists
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;
    const { error: tableCheckError } = await client
      .from('seo_config')
      .select('id')
      .limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      // Table doesn't exist, try to create it
      console.log('SEO config table does not exist, attempting to create it...');
      
      if (!isSupabaseAdminConfigured()) {
        return new Response(JSON.stringify({ 
          error: 'Cannot create SEO config table',
          message: 'Admin privileges required. Please create the seo_config table in Supabase.',
          sql: `
-- Create SEO configuration table
CREATE TABLE IF NOT EXISTS seo_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default',
  analytics JSONB DEFAULT '{}',
  meta JSONB DEFAULT '{}',
  schema JSONB DEFAULT '{}',
  ai_bots JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Create RLS policies
ALTER TABLE seo_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON seo_config
  FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON seo_config
  FOR UPDATE USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON seo_config
  FOR INSERT WITH CHECK (true);
          `
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Create the table using admin client
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS seo_config (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tenant_id TEXT DEFAULT 'default',
          analytics JSONB DEFAULT '{}',
          meta JSONB DEFAULT '{}',
          schema JSONB DEFAULT '{}',
          ai_bots JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(tenant_id)
        );
      `;
      
      const { error: createError } = await supabaseAdmin.rpc('exec_sql', { 
        sql: createTableSQL 
      }).single();
      
      if (createError) {
        console.error('Failed to create table:', createError);
        // Continue anyway, maybe the table exists but we can't query it
      }
    }
    
    // Check if configuration already exists
    const { data: existingConfig } = await client
      .from('seo_config')
      .select('id')
      .eq('tenant_id', tenantId)
      .single();
    
    let result;
    if (existingConfig) {
      // Update existing configuration
      const { data, error } = await client
        .from('seo_config')
        .update({
          analytics: config.analytics,
          meta: config.meta,
          schema: config.schema,
          ai_bots: config.ai_bots,
          updated_at: config.updated_at
        })
        .eq('tenant_id', tenantId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating SEO config:', error);
        return new Response(JSON.stringify({ 
          error: 'Failed to update SEO configuration',
          details: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      result = data;
    } else {
      // Insert new configuration
      config.created_at = new Date().toISOString();
      const { data, error } = await client
        .from('seo_config')
        .insert([config])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting SEO config:', error);
        return new Response(JSON.stringify({ 
          error: 'Failed to save SEO configuration',
          details: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      result = data;
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      data: result,
      message: 'SEO configuration saved successfully'
    }), {
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