-- ============================================
-- Step 11: Analytics Views
-- ============================================

-- ============================================
-- Lead Performance Analytics
-- ============================================

-- Lead performance view
CREATE OR REPLACE VIEW lead_performance AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    lead_source,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN lead_score >= 50 THEN 1 END) as qualified_leads,
    AVG(lead_score) as avg_score,
    COUNT(CASE WHEN lead_status = 'converted' THEN 1 END) as conversions
FROM leads
GROUP BY DATE_TRUNC('day', created_at), lead_source
ORDER BY date DESC;

-- ============================================
-- Appointment Performance Analytics
-- ============================================

-- Appointment booking performance
CREATE OR REPLACE VIEW appointment_performance AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    booking_source,
    COUNT(*) as total_appointments,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_appointments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_assignment_time_minutes,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
    COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show_appointments
FROM appointments
GROUP BY DATE_TRUNC('day', created_at), booking_source
ORDER BY date DESC;

-- ============================================
-- Integration Health Monitoring
-- ============================================

-- Integration health view
CREATE OR REPLACE VIEW integration_health AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    integration_type,
    COUNT(*) as total_attempts,
    COUNT(CASE WHEN success THEN 1 END) as successful_attempts,
    ROUND((COUNT(CASE WHEN success THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as success_rate,
    COUNT(CASE WHEN NOT success THEN 1 END) as failed_attempts,
    AVG(retry_count) as avg_retry_count
FROM highlevel_integrations
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), integration_type
ORDER BY hour DESC;

-- ============================================
-- Business Intelligence Views
-- ============================================

-- Daily business metrics
CREATE OR REPLACE VIEW daily_metrics AS
SELECT 
    DATE_TRUNC('day', l.created_at) as date,
    COUNT(DISTINCT l.id) as new_leads,
    COUNT(DISTINCT cs.id) as calculator_submissions,
    COUNT(DISTINCT ofs.id) as order_form_submissions,
    COUNT(DISTINCT a.id) as appointments_booked,
    AVG(l.lead_score) as avg_lead_score,
    SUM(cs.calculated_tax_savings) as total_potential_savings,
    COUNT(CASE WHEN ofs.completion_status = 'completed' THEN 1 END) as completed_forms
FROM leads l
LEFT JOIN calculator_submissions cs ON l.id = cs.lead_id
LEFT JOIN order_form_submissions ofs ON l.id = ofs.lead_id
LEFT JOIN appointments a ON l.id = a.lead_id AND DATE_TRUNC('day', a.created_at) = DATE_TRUNC('day', l.created_at)
WHERE l.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', l.created_at)
ORDER BY date DESC;

-- Lead source performance
CREATE OR REPLACE VIEW lead_source_performance AS
SELECT 
    lead_source,
    COUNT(*) as total_leads,
    AVG(lead_score) as avg_score,
    COUNT(CASE WHEN lead_score >= 50 THEN 1 END) as qualified_leads,
    ROUND((COUNT(CASE WHEN lead_score >= 50 THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as qualification_rate,
    COUNT(CASE WHEN lead_status = 'converted' THEN 1 END) as conversions,
    ROUND((COUNT(CASE WHEN lead_status = 'converted' THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as conversion_rate,
    COUNT(DISTINCT a.id) as appointments_booked,
    ROUND((COUNT(DISTINCT a.id)::DECIMAL / COUNT(*)) * 100, 2) as appointment_rate
FROM leads l
LEFT JOIN appointments a ON l.id = a.lead_id
WHERE l.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY lead_source
ORDER BY total_leads DESC;

-- ============================================
-- Customer Journey Analytics
-- ============================================

-- Customer journey funnel
CREATE OR REPLACE VIEW customer_journey_funnel AS
WITH journey_steps AS (
    SELECT 
        l.id as lead_id,
        l.created_at as lead_created,
        l.lead_source,
        l.lead_score,
        CASE WHEN cs.id IS NOT NULL THEN 1 ELSE 0 END as used_calculator,
        CASE WHEN ofs.id IS NOT NULL THEN 1 ELSE 0 END as started_form,
        CASE WHEN ofs.completion_status = 'completed' THEN 1 ELSE 0 END as completed_form,
        CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END as booked_appointment,
        CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END as attended_appointment,
        CASE WHEN l.lead_status = 'converted' THEN 1 ELSE 0 END as converted
    FROM leads l
    LEFT JOIN calculator_submissions cs ON l.id = cs.lead_id
    LEFT JOIN order_form_submissions ofs ON l.id = ofs.lead_id
    LEFT JOIN appointments a ON l.id = a.lead_id
    WHERE l.created_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    'Total Leads' as stage,
    COUNT(*) as count,
    100.0 as percentage,
    0 as drop_off_count,
    0.0 as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Used Calculator' as stage,
    SUM(used_calculator) as count,
    ROUND((SUM(used_calculator)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(used_calculator) as drop_off_count,
    ROUND(((COUNT(*) - SUM(used_calculator))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Started Form' as stage,
    SUM(started_form) as count,
    ROUND((SUM(started_form)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(started_form) as drop_off_count,
    ROUND(((COUNT(*) - SUM(started_form))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Completed Form' as stage,
    SUM(completed_form) as count,
    ROUND((SUM(completed_form)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(completed_form) as drop_off_count,
    ROUND(((COUNT(*) - SUM(completed_form))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Booked Appointment' as stage,
    SUM(booked_appointment) as count,
    ROUND((SUM(booked_appointment)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(booked_appointment) as drop_off_count,
    ROUND(((COUNT(*) - SUM(booked_appointment))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Attended Appointment' as stage,
    SUM(attended_appointment) as count,
    ROUND((SUM(attended_appointment)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(attended_appointment) as drop_off_count,
    ROUND(((COUNT(*) - SUM(attended_appointment))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps
UNION ALL
SELECT 
    'Converted' as stage,
    SUM(converted) as count,
    ROUND((SUM(converted)::DECIMAL / COUNT(*)) * 100, 2) as percentage,
    COUNT(*) - SUM(converted) as drop_off_count,
    ROUND(((COUNT(*) - SUM(converted))::DECIMAL / COUNT(*)) * 100, 2) as drop_off_rate
FROM journey_steps;