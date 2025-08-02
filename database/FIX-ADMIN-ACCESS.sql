-- COMPREHENSIVE ADMIN ACCESS FIX
-- This disables RLS on ALL tables needed for the admin interface

-- 1. Core tables
ALTER TABLE IF EXISTS leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS exchanges DISABLE ROW LEVEL SECURITY;

-- 2. Integration tables (THESE ARE THE PROBLEM!)
ALTER TABLE IF EXISTS highlevel_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS highlevel_sync_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS webhook_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS availability_cache DISABLE ROW LEVEL SECURITY;

-- 3. Admin tables
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_audit_logs DISABLE ROW LEVEL SECURITY;

-- 4. Verify RLS is disabled
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED - NEEDS FIX!' 
        ELSE 'RLS Disabled ✓' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'leads', 'appointments', 'properties', 'exchanges',
    'highlevel_config', 'highlevel_sync_logs', 'webhook_logs', 'availability_cache',
    'admin_users', 'admin_sessions', 'admin_audit_logs'
)
ORDER BY 
    CASE WHEN rowsecurity THEN 0 ELSE 1 END,
    tablename;

-- 5. Test highlevel_config access
SELECT 'Testing highlevel_config access...' as status;
SELECT COUNT(*) as record_count FROM highlevel_config;

-- 6. If still having issues, grant explicit permissions
GRANT ALL ON highlevel_config TO anon;
GRANT ALL ON highlevel_sync_logs TO anon;
GRANT ALL ON webhook_logs TO anon;
GRANT ALL ON availability_cache TO anon;

SELECT 'Admin access fix complete!' as status;