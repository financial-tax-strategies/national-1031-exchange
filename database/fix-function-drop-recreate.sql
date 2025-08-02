-- First drop the existing function
DROP FUNCTION IF EXISTS find_or_create_lead(text, text, text, text, text);

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Create the function without default parameters
CREATE OR REPLACE FUNCTION find_or_create_lead(
    p_email TEXT,
    p_phone TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_lead_source TEXT
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

-- Test it
SELECT find_or_create_lead('test3@example.com', '555-9999', 'Test3', 'User3', 'manual-test');

-- Force another cache reload
NOTIFY pgrst, 'reload schema';