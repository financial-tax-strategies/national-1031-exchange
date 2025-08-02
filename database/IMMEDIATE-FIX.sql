-- IMMEDIATE FIX FOR YOUR ISSUES
-- Run this in Supabase SQL Editor

-- 1. FIX RLS ISSUES (this is why you're getting 404 errors)
ALTER TABLE highlevel_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE highlevel_sync_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache DISABLE ROW LEVEL SECURITY;

-- 2. FIX THE FUNCTION WITH CORRECT PARAMETER ORDER
-- Drop the old function
DROP FUNCTION IF EXISTS find_or_create_lead(text, text, text, text, text);

-- Create with the EXACT parameter order PostgREST expects
CREATE OR REPLACE FUNCTION find_or_create_lead(
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_lead_source TEXT,
    p_phone TEXT
)
RETURNS UUID AS $$
DECLARE
    lead_id UUID;
BEGIN
    -- Try to find existing lead by email
    SELECT id INTO lead_id FROM leads WHERE email = p_email;
    
    -- If not found, create new lead
    IF lead_id IS NULL THEN
        INSERT INTO leads (email, phone, first_name, last_name, lead_source)
        VALUES (p_email, p_phone, p_first_name, p_last_name, p_lead_source)
        RETURNING id INTO lead_id;
    ELSE
        -- Update existing lead with any new information
        UPDATE leads 
        SET 
            phone = COALESCE(p_phone, phone),
            first_name = COALESCE(p_first_name, first_name),
            last_name = COALESCE(p_last_name, last_name),
            updated_at = NOW()
        WHERE id = lead_id;
    END IF;
    
    RETURN lead_id;
END;
$$ LANGUAGE plpgsql;

-- 3. VERIFY EVERYTHING WORKS
SELECT 'Testing find_or_create_lead...' as status;
SELECT find_or_create_lead('final-test@example.com', 'Final', 'Test', 'sql-fix', '555-DONE');

SELECT 'Checking RLS status...' as status;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('highlevel_config', 'highlevel_sync_logs', 'webhook_logs', 'availability_cache');

SELECT 'Done! Your integration should work now.' as status;