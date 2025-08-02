-- ============================================
-- Step 12: Sample Configuration Data
-- ============================================

-- ============================================
-- HighLevel Configuration
-- ============================================

-- Insert sample HighLevel configuration (to be updated with real values)
INSERT INTO highlevel_config (
    api_key, 
    location_id, 
    calendar_id, 
    webhook_secret,
    webhook_url,
    timezone,
    is_active
) VALUES (
    'REPLACE_WITH_ENCRYPTED_API_KEY',
    'REPLACE_WITH_LOCATION_ID', 
    'REPLACE_WITH_CALENDAR_ID',
    'REPLACE_WITH_WEBHOOK_SECRET',
    'https://the1031center.com/.netlify/functions/highlevel-webhook',
    'America/New_York',
    true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Admin User Setup
-- ============================================

-- Insert sample admin user (to be updated with real credentials)
INSERT INTO admin_users (
    email,
    role,
    first_name,
    last_name,
    is_active,
    permissions
) VALUES (
    'admin@the1031center.com',
    'super_admin',
    'Admin',
    'User',
    true,
    '{
        "leads": {"read": true, "write": true, "delete": true},
        "appointments": {"read": true, "write": true, "delete": true},
        "analytics": {"read": true},
        "admin_users": {"read": true, "write": true, "delete": true},
        "system_config": {"read": true, "write": true}
    }'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert additional admin roles
INSERT INTO admin_users (
    email,
    role,
    first_name,
    last_name,
    is_active,
    permissions
) VALUES 
(
    'manager@the1031center.com',
    'manager',
    'Manager',
    'User',
    true,
    '{
        "leads": {"read": true, "write": true, "delete": false},
        "appointments": {"read": true, "write": true, "delete": false},
        "analytics": {"read": true},
        "admin_users": {"read": true, "write": false, "delete": false}
    }'::jsonb
),
(
    'support@the1031center.com',
    'support',
    'Support',
    'User',
    true,
    '{
        "leads": {"read": true, "write": false, "delete": false},
        "appointments": {"read": true, "write": false, "delete": false},
        "analytics": {"read": false}
    }'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Sample Market Intelligence Data
-- ============================================

-- Insert sample market intelligence data for major metropolitan areas
INSERT INTO market_intelligence (
    location_type,
    location_identifier,
    location_name,
    property_type,
    property_subtype,
    market_data,
    data_source,
    data_quality_score,
    expires_at
) VALUES 
(
    'city',
    'new-york-ny',
    'New York, NY',
    'commercial',
    'office',
    '{
        "median_price_per_sqft": 850,
        "cap_rate": 4.2,
        "vacancy_rate": 12.5,
        "market_trend": "stable",
        "quarterly_change": -2.1,
        "total_inventory": 15420,
        "days_on_market": 145
    }'::jsonb,
    'mls',
    0.92,
    NOW() + INTERVAL '30 days'
),
(
    'city',
    'los-angeles-ca',
    'Los Angeles, CA',
    'residential',
    'multi_family',
    '{
        "median_price": 1250000,
        "cap_rate": 3.8,
        "vacancy_rate": 6.2,
        "market_trend": "rising",
        "quarterly_change": 8.5,
        "total_inventory": 8940,
        "days_on_market": 67
    }'::jsonb,
    'mls',
    0.89,
    NOW() + INTERVAL '30 days'
),
(
    'city',
    'chicago-il',
    'Chicago, IL',
    'commercial',
    'retail',
    '{
        "median_price_per_sqft": 425,
        "cap_rate": 5.8,
        "vacancy_rate": 18.3,
        "market_trend": "declining",
        "quarterly_change": -5.2,
        "total_inventory": 3250,
        "days_on_market": 210
    }'::jsonb,
    'government',
    0.95,
    NOW() + INTERVAL '30 days'
) ON CONFLICT DO NOTHING;

-- ============================================
-- Sample Lead Data (for testing)
-- ============================================

-- Insert sample leads for testing (only in development)
-- These should be removed in production
DO $$
BEGIN
    -- Only insert if we're in a development environment
    -- (You can modify this condition based on your environment detection)
    IF current_database() LIKE '%dev%' OR current_database() LIKE '%test%' THEN
        
        -- Sample lead 1: Calculator user
        INSERT INTO leads (email, phone, first_name, last_name, lead_source, lead_status)
        VALUES ('john.doe@example.com', '(555) 123-4567', 'John', 'Doe', 'tax_calculator', 'qualified')
        ON CONFLICT (email) DO NOTHING;
        
        -- Sample lead 2: Order form user
        INSERT INTO leads (email, phone, first_name, last_name, lead_source, lead_status)
        VALUES ('jane.smith@example.com', '(555) 987-6543', 'Jane', 'Smith', 'order_form', 'contacted')
        ON CONFLICT (email) DO NOTHING;
        
        -- Sample lead 3: Direct contact
        INSERT INTO leads (email, first_name, last_name, lead_source, lead_status)
        VALUES ('robert.johnson@example.com', 'Robert', 'Johnson', 'direct', 'new')
        ON CONFLICT (email) DO NOTHING;
        
        -- Note: In a real environment, remove this block or add proper environment detection
        RAISE NOTICE 'Sample test leads inserted for development environment';
        
    END IF;
END $$;

-- ============================================
-- Database Maintenance Tasks
-- ============================================

-- Create a function to initialize the database with real configuration
CREATE OR REPLACE FUNCTION initialize_production_config(
    p_api_key TEXT,
    p_location_id TEXT,
    p_calendar_id TEXT,
    p_webhook_secret TEXT,
    p_admin_email TEXT,
    p_admin_first_name TEXT,
    p_admin_last_name TEXT
)
RETURNS void AS $$
BEGIN
    -- Update HighLevel configuration
    UPDATE highlevel_config 
    SET 
        api_key = p_api_key,
        location_id = p_location_id,
        calendar_id = p_calendar_id,
        webhook_secret = p_webhook_secret,
        updated_at = NOW()
    WHERE is_active = true;
    
    -- Update admin user
    UPDATE admin_users 
    SET 
        email = p_admin_email,
        first_name = p_admin_first_name,
        last_name = p_admin_last_name
    WHERE role = 'super_admin' AND email = 'admin@the1031center.com';
    
    RAISE NOTICE 'Production configuration updated successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Completion Summary
-- ============================================

-- Create a view to check schema deployment status
CREATE OR REPLACE VIEW schema_deployment_status AS
SELECT 
    'Tables' as component,
    COUNT(*) as count,
    array_agg(table_name ORDER BY table_name) as items
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE 'auth.%'
UNION ALL
SELECT 
    'Indexes' as component,
    COUNT(*) as count,
    array_agg(indexname ORDER BY indexname) as items
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname NOT LIKE 'auth_%'
UNION ALL
SELECT 
    'Functions' as component,
    COUNT(*) as count,
    array_agg(routine_name ORDER BY routine_name) as items
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION'
UNION ALL
SELECT 
    'Views' as component,
    COUNT(*) as count,
    array_agg(table_name ORDER BY table_name) as items
FROM information_schema.views 
WHERE table_schema = 'public';

-- Log completion
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'National 1031 Exchange - Database Schema Deployment Complete';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Schema includes:';
    RAISE NOTICE '- 15+ Core Tables for complete lead management';
    RAISE NOTICE '- 25+ Performance Indexes for scale';
    RAISE NOTICE '- 6 Database Functions for business logic';
    RAISE NOTICE '- 11 Automated Triggers for data consistency';
    RAISE NOTICE '- 30+ RLS Policies for security';
    RAISE NOTICE '- 7 Analytics Views for business intelligence';
    RAISE NOTICE '- Sample configuration data';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Update HighLevel configuration with real API keys';
    RAISE NOTICE '2. Create first admin user through Supabase Auth';
    RAISE NOTICE '3. Test schema with sample data';
    RAISE NOTICE '4. Implement service layer to interact with schema';
    RAISE NOTICE '5. Build admin interface on top of this foundation';
    RAISE NOTICE '============================================';
END $$;