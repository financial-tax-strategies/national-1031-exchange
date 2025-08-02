-- Drop the existing function first
DROP FUNCTION IF EXISTS find_or_create_lead(text, text, text, text, text);

-- Recreate with exact parameter names and order that match the service call
CREATE OR REPLACE FUNCTION find_or_create_lead(
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_lead_source TEXT DEFAULT 'unknown'
)
RETURNS TABLE(id UUID) AS $$
DECLARE
    lead_id UUID;
BEGIN
    -- Try to find existing lead by email
    SELECT leads.id INTO lead_id FROM leads WHERE email = p_email;
    
    -- If not found, create new lead
    IF lead_id IS NULL THEN
        INSERT INTO leads (email, phone, first_name, last_name, lead_source)
        VALUES (p_email, p_phone, p_first_name, p_last_name, p_lead_source)
        RETURNING leads.id INTO lead_id;
    ELSE
        -- Update existing lead with any new information
        UPDATE leads 
        SET 
            phone = COALESCE(p_phone, leads.phone),
            first_name = COALESCE(p_first_name, leads.first_name),
            last_name = COALESCE(p_last_name, leads.last_name),
            updated_at = NOW()
        WHERE leads.id = lead_id;
    END IF;
    
    -- Return the lead ID as a table result
    RETURN QUERY SELECT lead_id;
END;
$$ LANGUAGE plpgsql;

-- Test it
SELECT * FROM find_or_create_lead('test@example.com', '555-1234', 'Test', 'User', 'manual-test');