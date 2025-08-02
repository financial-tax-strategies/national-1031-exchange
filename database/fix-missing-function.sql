-- Fix for missing find_or_create_lead function
-- Run this in Supabase SQL Editor

-- Function to find or create a lead by email
CREATE OR REPLACE FUNCTION find_or_create_lead(
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_lead_source TEXT DEFAULT 'unknown'
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

-- Also ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- And the lead activity update function
CREATE OR REPLACE FUNCTION update_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE leads 
    SET last_activity_at = NOW() 
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Test the function
SELECT find_or_create_lead('test@example.com', '555-1234', 'Test', 'User', 'manual-test');