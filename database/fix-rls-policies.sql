-- Check current RLS status on integration tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('highlevel_config', 'highlevel_sync_logs', 'webhook_logs', 'availability_cache');

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'highlevel_config';

-- Disable RLS temporarily to allow anon access (for testing)
ALTER TABLE highlevel_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE highlevel_sync_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache DISABLE ROW LEVEL SECURITY;

-- Or better: Create proper policies for anon access
-- First, enable RLS
ALTER TABLE highlevel_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Service role has full access to highlevel_config" ON highlevel_config;
DROP POLICY IF EXISTS "Authenticated users can read active highlevel_config" ON highlevel_config;

-- Create new policies that allow anon access
CREATE POLICY "Anyone can read active highlevel_config" ON highlevel_config
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can do everything with highlevel_config" ON highlevel_config
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Also check if the table has any data
SELECT COUNT(*) as config_count FROM highlevel_config;
SELECT * FROM highlevel_config WHERE is_active = true;