-- Fix permissions for SEO config table
-- Run this in Supabase SQL Editor

-- Grant permissions to anon role (used by the frontend)
GRANT SELECT, INSERT, UPDATE ON seo_config TO anon;

-- Grant permissions to authenticated role
GRANT ALL ON seo_config TO authenticated;

-- Verify the table exists and check current data
SELECT * FROM seo_config;

-- Test insert/update capability
-- This will create or update the default tenant configuration
INSERT INTO seo_config (tenant_id, analytics, meta, schema, ai_bots)
VALUES (
  'default',
  '{}',
  '{}',
  '{}',
  '{
    "gpt_bot": true,
    "claude_web": true,
    "perplexity_bot": true,
    "you_bot": true,
    "cohere_ai": true
  }'
)
ON CONFLICT (tenant_id) 
DO UPDATE SET 
  updated_at = NOW()
RETURNING *;