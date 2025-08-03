-- Lead Scoring Triggers and Functions
-- Auto-calculates lead scores based on activities and engagements

-- Create a function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(p_lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_score INTEGER := 0;
    v_has_phone BOOLEAN;
    v_has_full_name BOOLEAN;
    v_calculator_count INTEGER;
    v_high_value_count INTEGER;
    v_order_form RECORD;
    v_appointment_count INTEGER;
    v_activity_counts JSONB;
    v_document_count INTEGER;
BEGIN
    -- Get lead basic info
    SELECT 
        phone IS NOT NULL,
        first_name IS NOT NULL AND last_name IS NOT NULL
    INTO v_has_phone, v_has_full_name
    FROM leads
    WHERE id = p_lead_id;

    -- Basic information scoring
    IF v_has_phone THEN
        v_score := v_score + 5; -- phoneProvided
    END IF;
    
    IF v_has_full_name THEN
        v_score := v_score + 3; -- fullNameProvided
    END IF;

    -- Calculator submissions
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN property_sale_price >= 1000000 THEN 1 END)
    INTO v_calculator_count, v_high_value_count
    FROM calculator_submissions
    WHERE lead_id = p_lead_id;

    IF v_calculator_count > 0 THEN
        v_score := v_score + 20; -- calculatorCompletion
        
        IF v_high_value_count > 0 THEN
            v_score := v_score + 10; -- highValueProperty
        END IF;
    END IF;

    -- Order form submission
    SELECT 
        step_completed,
        completion_status,
        urgency_level
    INTO v_order_form
    FROM order_form_submissions
    WHERE lead_id = p_lead_id
    LIMIT 1;

    IF v_order_form.step_completed IS NOT NULL THEN
        -- 5 points per step completed
        v_score := v_score + (COALESCE(v_order_form.step_completed, 0) * 5);
        
        -- Completed form bonus
        IF v_order_form.completion_status = 'completed' THEN
            v_score := v_score + 15; -- formSubmission
        END IF;
        
        -- Urgent timeline bonus
        IF v_order_form.urgency_level IN ('urgent', 'very_urgent') THEN
            v_score := v_score + 15; -- urgentTimeline
        END IF;
    END IF;

    -- Appointments
    SELECT COUNT(*)
    INTO v_appointment_count
    FROM appointments
    WHERE lead_id = p_lead_id
    AND status IN ('scheduled', 'confirmed');

    IF v_appointment_count > 0 THEN
        v_score := v_score + 30; -- appointmentBooking
    END IF;

    -- Activity-based scoring
    SELECT 
        jsonb_object_agg(activity_type, count) AS counts
    INTO v_activity_counts
    FROM (
        SELECT activity_type, COUNT(*) as count
        FROM lead_activities
        WHERE lead_id = p_lead_id
        GROUP BY activity_type
    ) t;

    -- Website visits (max 10 points)
    IF v_activity_counts->>'page_view' IS NOT NULL THEN
        v_score := v_score + LEAST((v_activity_counts->>'page_view')::INTEGER * 1, 10);
        
        -- Repeat visit bonus
        IF (v_activity_counts->>'page_view')::INTEGER > 3 THEN
            v_score := v_score + 3; -- repeatVisit
        END IF;
    END IF;

    -- Document uploads
    SELECT COUNT(*)
    INTO v_document_count
    FROM documents
    WHERE lead_id = p_lead_id;

    IF v_document_count > 0 THEN
        v_score := v_score + (v_document_count * 10); -- documentUpload
    END IF;

    -- Email opens (max 10 points)
    IF v_activity_counts->>'email_open' IS NOT NULL THEN
        v_score := v_score + LEAST((v_activity_counts->>'email_open')::INTEGER * 2, 10);
    END IF;

    -- Cap score at 100
    RETURN LEAST(v_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Create a function to update lead score and log the calculation
CREATE OR REPLACE FUNCTION update_lead_score(p_lead_id UUID)
RETURNS VOID AS $$
DECLARE
    v_new_score INTEGER;
    v_old_score INTEGER;
BEGIN
    -- Get current score
    SELECT lead_score INTO v_old_score
    FROM leads
    WHERE id = p_lead_id;

    -- Calculate new score
    v_new_score := calculate_lead_score(p_lead_id);

    -- Update only if score changed
    IF v_new_score != COALESCE(v_old_score, 0) THEN
        -- Update lead score
        UPDATE leads
        SET 
            lead_score = v_new_score,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_lead_id;

        -- Log the score calculation
        INSERT INTO lead_activities (
            lead_id,
            activity_type,
            activity_data
        ) VALUES (
            p_lead_id,
            'score_calculated',
            jsonb_build_object(
                'old_score', v_old_score,
                'new_score', v_new_score,
                'calculated_at', CURRENT_TIMESTAMP
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for lead activities
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update lead score for the affected lead
    PERFORM update_lead_score(NEW.lead_id);
    
    -- Also update last_activity_at on the lead
    UPDATE leads
    SET last_activity_at = CURRENT_TIMESTAMP
    WHERE id = NEW.lead_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for calculator submissions
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_calculator()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_lead_score(NEW.lead_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for order form submissions
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_order_form()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_lead_score(NEW.lead_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for appointments
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_appointment()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_lead_score(NEW.lead_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for documents
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_document()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_lead_score(NEW.lead_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for lead updates
CREATE OR REPLACE FUNCTION trigger_update_lead_score_on_lead_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only recalculate if phone or name fields changed
    IF (OLD.phone IS DISTINCT FROM NEW.phone) OR 
       (OLD.first_name IS DISTINCT FROM NEW.first_name) OR
       (OLD.last_name IS DISTINCT FROM NEW.last_name) THEN
        PERFORM update_lead_score(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_score_on_activity ON lead_activities;
DROP TRIGGER IF EXISTS update_score_on_calculator ON calculator_submissions;
DROP TRIGGER IF EXISTS update_score_on_order_form ON order_form_submissions;
DROP TRIGGER IF EXISTS update_score_on_appointment ON appointments;
DROP TRIGGER IF EXISTS update_score_on_document ON documents;
DROP TRIGGER IF EXISTS update_score_on_lead_change ON leads;

-- Create triggers
CREATE TRIGGER update_score_on_activity
    AFTER INSERT ON lead_activities
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_activity();

CREATE TRIGGER update_score_on_calculator
    AFTER INSERT OR UPDATE ON calculator_submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_calculator();

CREATE TRIGGER update_score_on_order_form
    AFTER INSERT OR UPDATE ON order_form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_order_form();

CREATE TRIGGER update_score_on_appointment
    AFTER INSERT OR UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_appointment();

CREATE TRIGGER update_score_on_document
    AFTER INSERT ON documents
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_document();

CREATE TRIGGER update_score_on_lead_change
    AFTER UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_lead_score_on_lead_change();

-- Function to recalculate all lead scores (for initial setup or batch updates)
CREATE OR REPLACE FUNCTION recalculate_all_lead_scores()
RETURNS TABLE(lead_id UUID, score INTEGER) AS $$
BEGIN
    RETURN QUERY
    WITH updated_leads AS (
        SELECT 
            l.id,
            calculate_lead_score(l.id) as new_score
        FROM leads l
    )
    UPDATE leads l
    SET 
        lead_score = ul.new_score,
        updated_at = CURRENT_TIMESTAMP
    FROM updated_leads ul
    WHERE l.id = ul.id
    RETURNING l.id, l.lead_score;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_lead_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_lead_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_all_lead_scores() TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION calculate_lead_score(UUID) IS 'Calculates the lead score based on various activities and engagements';
COMMENT ON FUNCTION update_lead_score(UUID) IS 'Updates the lead score if it has changed and logs the calculation';
COMMENT ON FUNCTION recalculate_all_lead_scores() IS 'Batch function to recalculate scores for all leads';

-- To run initial scoring for all existing leads, uncomment and run:
-- SELECT * FROM recalculate_all_lead_scores();