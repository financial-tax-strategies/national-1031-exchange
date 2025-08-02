-- IMMEDIATE FIX: Disable RLS on tables accessed by the admin interface
-- This allows the anon key to read/write these tables

ALTER TABLE highlevel_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE highlevel_sync_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('highlevel_config', 'highlevel_sync_logs', 'webhook_logs', 'availability_cache');

-- Check if there's any data in highlevel_config
SELECT * FROM highlevel_config;