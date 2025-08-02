-- Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Specifically check for integration tables
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'highlevel_config') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as highlevel_config,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'highlevel_sync_logs') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as highlevel_sync_logs,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webhook_logs') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as webhook_logs,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'availability_cache') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as availability_cache;