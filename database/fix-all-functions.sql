-- Run the complete functions and triggers setup
-- This ensures all required functions are created

-- First, let's check what functions already exist
SELECT proname AS function_name, pg_get_function_identity_arguments(oid) AS arguments
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN (
    'find_or_create_lead',
    'update_updated_at_column',
    'update_lead_activity',
    'update_lead_score',
    'cleanup_expired_cache',
    'get_conversion_funnel_stats'
)
ORDER BY proname;