-- Drop all existing versions of the function
DROP FUNCTION IF EXISTS find_or_create_lead(text, text, text, text, text);

-- Create function with EXACT parameter order that PostgREST expects
-- Order from error: (p_email, p_first_name, p_last_name, p_lead_source, p_phone)
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

-- Test with the exact parameter order
SELECT find_or_create_lead('test4@example.com', 'Test4', 'User4', 'exact-order-test', '555-4444');

-- Force multiple cache reloads
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(1);
NOTIFY pgrst, 'reload schema';