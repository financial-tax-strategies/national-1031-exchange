-- COMPLETE FIX - Handles missing tables and RLS issues
-- Run this in Supabase SQL Editor

-- 1. Create any missing tables first
CREATE TABLE IF NOT EXISTS highlevel_sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sync_type TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    details JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    error TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    calendar_id TEXT NOT NULL,
    date DATE NOT NULL,
    slots JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE(calendar_id, date)
);

-- 2. Now disable RLS on all integration tables (only if they exist)
DO $$ 
BEGIN
    -- highlevel_config
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'highlevel_config') THEN
        ALTER TABLE highlevel_config DISABLE ROW LEVEL SECURITY;
    END IF;
    
    -- highlevel_sync_logs
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'highlevel_sync_logs') THEN
        ALTER TABLE highlevel_sync_logs DISABLE ROW LEVEL SECURITY;
    END IF;
    
    -- webhook_logs
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'webhook_logs') THEN
        ALTER TABLE webhook_logs DISABLE ROW LEVEL SECURITY;
    END IF;
    
    -- availability_cache
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'availability_cache') THEN
        ALTER TABLE availability_cache DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 3. Fix the function with correct parameter order
-- Drop any existing function first
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

-- 4. Verify everything works
SELECT 'Testing find_or_create_lead...' as status;
SELECT find_or_create_lead('complete-fix@example.com', 'Complete', 'Fix', 'sql-complete', '555-DONE');

-- 5. Check what tables exist and their RLS status
SELECT 'Checking tables and RLS status...' as status;
SELECT 
    tablename, 
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled' 
        ELSE 'RLS Disabled' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('highlevel_config', 'highlevel_sync_logs', 'webhook_logs', 'availability_cache', 'leads', 'appointments')
ORDER BY tablename;

SELECT 'Done! Your integration should work now.' as status;