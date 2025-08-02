-- ============================================
-- Step 9: Database Functions & Automated Triggers
-- ============================================

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update last_activity_at on leads
CREATE OR REPLACE FUNCTION update_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE leads 
    SET last_activity_at = NOW() 
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- BUSINESS LOGIC FUNCTIONS
-- ============================================

-- Function to calculate and update lead score
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Calculate lead score based on activities
    -- Base score for having basic contact info
    IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL AND NEW.email IS NOT NULL THEN
        score := score + 10;
    END IF;
    
    -- Calculator completion bonus
    IF EXISTS (SELECT 1 FROM calculator_submissions WHERE lead_id = NEW.id) THEN
        score := score + 20;
    END IF;
    
    -- Order form progress bonus (5 points per step)
    SELECT COALESCE(MAX(step_completed), 0) * 5 INTO score
    FROM order_form_submissions 
    WHERE lead_id = NEW.id;
    
    score := score + COALESCE((SELECT MAX(step_completed) FROM order_form_submissions WHERE lead_id = NEW.id), 0) * 5;
    
    -- Appointment booking major bonus
    IF EXISTS (SELECT 1 FROM appointments WHERE lead_id = NEW.id) THEN
        score := score + 50;
    END IF;
    
    -- High-value property bonus
    IF EXISTS (SELECT 1 FROM calculator_submissions WHERE lead_id = NEW.id AND calculated_tax_savings > 50000) THEN
        score := score + 15;
    END IF;
    
    -- Update the lead score (cap at 100)
    NEW.lead_score := LEAST(score, 100);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to find or create lead by email
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

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM availability_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get lead conversion funnel stats
CREATE OR REPLACE FUNCTION get_conversion_funnel_stats(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
    stage TEXT,
    count BIGINT,
    percentage DECIMAL(5,2)
) AS $$
DECLARE
    total_leads BIGINT;
BEGIN
    -- Get total leads in period
    SELECT COUNT(*) INTO total_leads
    FROM leads 
    WHERE created_at BETWEEN start_date AND end_date;
    
    -- Return funnel stages
    RETURN QUERY
    SELECT 
        'Total Visitors' as stage,
        total_leads as count,
        100.00 as percentage
    UNION ALL
    SELECT 
        'Calculator Users' as stage,
        COUNT(DISTINCT cs.lead_id) as count,
        ROUND((COUNT(DISTINCT cs.lead_id)::DECIMAL / total_leads) * 100, 2) as percentage
    FROM calculator_submissions cs
    JOIN leads l ON cs.lead_id = l.id
    WHERE l.created_at BETWEEN start_date AND end_date
    UNION ALL
    SELECT 
        'Form Starters' as stage,
        COUNT(DISTINCT ofs.lead_id) as count,
        ROUND((COUNT(DISTINCT ofs.lead_id)::DECIMAL / total_leads) * 100, 2) as percentage
    FROM order_form_submissions ofs
    JOIN leads l ON ofs.lead_id = l.id
    WHERE l.created_at BETWEEN start_date AND end_date
    UNION ALL
    SELECT 
        'Form Completers' as stage,
        COUNT(DISTINCT ofs.lead_id) as count,
        ROUND((COUNT(DISTINCT ofs.lead_id)::DECIMAL / total_leads) * 100, 2) as percentage
    FROM order_form_submissions ofs
    JOIN leads l ON ofs.lead_id = l.id
    WHERE l.created_at BETWEEN start_date AND end_date
    AND ofs.completion_status = 'completed'
    UNION ALL
    SELECT 
        'Appointment Bookers' as stage,
        COUNT(DISTINCT a.lead_id) as count,
        ROUND((COUNT(DISTINCT a.lead_id)::DECIMAL / total_leads) * 100, 2) as percentage
    FROM appointments a
    JOIN leads l ON a.lead_id = l.id
    WHERE l.created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- AUTOMATED TRIGGERS
-- ============================================

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_forms_updated_at BEFORE UPDATE ON order_form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON customer_properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_highlevel_config_updated_at BEFORE UPDATE ON highlevel_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for lead activity tracking
CREATE TRIGGER track_calculator_activity AFTER INSERT ON calculator_submissions FOR EACH ROW EXECUTE FUNCTION update_lead_activity();
CREATE TRIGGER track_order_form_activity AFTER INSERT OR UPDATE ON order_form_submissions FOR EACH ROW EXECUTE FUNCTION update_lead_activity();
CREATE TRIGGER track_appointment_activity AFTER INSERT OR UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_lead_activity();

-- Add trigger for lead scoring
CREATE TRIGGER update_lead_score_trigger BEFORE INSERT OR UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_lead_score();