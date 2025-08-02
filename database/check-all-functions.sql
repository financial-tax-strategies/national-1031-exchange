-- Check all versions of find_or_create_lead function
SELECT 
    n.nspname as schema_name,
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'find_or_create_lead'
ORDER BY n.nspname, p.proname;

-- Check if there are any overloaded versions
SELECT 
    proname,
    pronargs as num_args,
    proargtypes,
    proargnames
FROM pg_proc
WHERE proname = 'find_or_create_lead';

-- Force schema cache reload multiple times
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';