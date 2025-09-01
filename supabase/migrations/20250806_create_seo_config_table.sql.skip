-- Create SEO configuration table to store analytics, meta, and schema settings
-- This table allows the admin interface to persist SEO-related configuration

-- Create the table
CREATE TABLE IF NOT EXISTS seo_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  
  -- Analytics configuration (Google Analytics, Facebook Pixel, etc.)
  analytics JSONB DEFAULT '{}' NOT NULL,
  
  -- Meta tags configuration (default description, author, keywords)
  meta JSONB DEFAULT '{}' NOT NULL,
  
  -- Schema.org configuration (organization info, social profiles)
  schema JSONB DEFAULT '{}' NOT NULL,
  
  -- AI bot access configuration (GPTBot, Claude-Web, etc.)
  ai_bots JSONB DEFAULT '{
    "gpt_bot": true,
    "claude_web": true,
    "perplexity_bot": true,
    "you_bot": true,
    "cohere_ai": true
  }' NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure only one configuration per tenant
  UNIQUE(tenant_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seo_config_tenant_id ON seo_config(tenant_id);

-- Enable Row Level Security
ALTER TABLE seo_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow public read access (so the site can load SEO configuration)
CREATE POLICY "Allow public read access" ON seo_config
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert new configurations
CREATE POLICY "Allow authenticated insert" ON seo_config
  FOR INSERT 
  WITH CHECK (true);
  -- In production, you might want to check for admin role:
  -- WITH CHECK (auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated users to update existing configurations
CREATE POLICY "Allow authenticated update" ON seo_config
  FOR UPDATE 
  USING (true);
  -- In production, you might want to check for admin role:
  -- USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated users to delete configurations
CREATE POLICY "Allow authenticated delete" ON seo_config
  FOR DELETE 
  USING (true);
  -- In production, you might want to check for admin role:
  -- USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'admin');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_seo_config_updated_at
  BEFORE UPDATE ON seo_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default configuration if none exists
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
ON CONFLICT (tenant_id) DO NOTHING;

-- Grant necessary permissions (adjust based on your needs)
-- For anonymous access (public read):
GRANT SELECT ON seo_config TO anon;

-- For authenticated users (if you have authentication set up):
GRANT ALL ON seo_config TO authenticated;

-- For service role (full access):
GRANT ALL ON seo_config TO service_role;