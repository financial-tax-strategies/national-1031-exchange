-- Create the missing highlevel_config table
CREATE TABLE IF NOT EXISTS highlevel_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key TEXT NOT NULL,
    location_id TEXT NOT NULL,
    calendar_id TEXT NOT NULL,
    webhook_secret TEXT,
    webhook_url TEXT,
    timezone TEXT DEFAULT 'America/New_York' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for active configs
CREATE INDEX IF NOT EXISTS idx_highlevel_config_active ON highlevel_config(is_active);

-- Add RLS policies
ALTER TABLE highlevel_config ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to highlevel_config" ON highlevel_config
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Allow authenticated users to read active config
CREATE POLICY "Authenticated users can read active highlevel_config" ON highlevel_config
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Create trigger to update updated_at
CREATE TRIGGER update_highlevel_config_updated_at
    BEFORE UPDATE ON highlevel_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'highlevel_config'
ORDER BY ordinal_position;