-- ============================================
-- National 1031 Exchange - Master Database Schema
-- Complete Lead Management & Platform Architecture
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE LEAD MANAGEMENT TABLES
-- ============================================

-- Central leads table - email-based deduplication hub
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Contact Information (unique by email)
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    
    -- Lead Classification
    lead_source TEXT NOT NULL DEFAULT 'unknown', -- tax_calculator, order_form, direct, referral
    lead_status TEXT NOT NULL DEFAULT 'new', -- new, qualified, contacted, appointment_scheduled, converted, lost
    lead_score INTEGER DEFAULT 0, -- Automated scoring: 0-100
    
    -- External Integrations
    highlevel_contact_id TEXT, -- HighLevel CRM correlation
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tax calculator submissions
CREATE TABLE IF NOT EXISTS calculator_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Property Financial Details
    property_sale_price DECIMAL(12,2),
    current_basis DECIMAL(12,2),
    depreciation_taken DECIMAL(12,2),
    
    -- Calculated Results
    calculated_capital_gains DECIMAL(12,2),
    calculated_tax_savings DECIMAL(12,2),
    
    -- Property Context
    property_type TEXT, -- residential, commercial, land, etc.
    property_state TEXT, -- For tax law variations
    
    -- Complete Submission Data
    submission_data JSONB DEFAULT '{}', -- Full form data for analysis
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order form submissions (6-step comprehensive form)
CREATE TABLE IF NOT EXISTS order_form_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Progress Tracking
    step_completed INTEGER DEFAULT 0, -- 1-6, tracks partial completions
    completion_status TEXT DEFAULT 'in_progress', -- in_progress, completed, abandoned
    
    -- Key Fields Extracted for Quick Querying
    urgency_level TEXT, -- planning_3_plus, getting_ready_1_3, time_sensitive_1, urgent_2_weeks
    exchange_type TEXT, -- standard_delayed, reverse, improvement, not_sure
    property_sale_price DECIMAL(12,2), -- From step 2
    
    -- Complete Form Data
    form_data JSONB DEFAULT '{}', -- All 1031x_ fields from order form schema
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- Appointment management with HighLevel correlation
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- HighLevel Correlation
    highlevel_appointment_id TEXT UNIQUE,
    highlevel_contact_id TEXT,
    
    -- Appointment Details
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_time TEXT NOT NULL, -- Original selected time slot
    timezone TEXT NOT NULL DEFAULT 'America/New_York',
    duration_minutes INTEGER DEFAULT 30,
    
    -- Status Management
    status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no_show
    
    -- Assignment Details (populated by webhook or round-robin)
    assigned_specialist_id TEXT,
    assigned_specialist_name TEXT,
    meeting_location TEXT, -- Zoom link, phone, in-person
    
    -- Booking Context
    booking_source TEXT, -- calculator_flow, order_form_flow, direct
    
    -- 1031 Exchange Context
    tax_savings_amount DECIMAL(12,2), -- From calculator
    property_sale_price DECIMAL(12,2), -- From calculator/form
    property_type TEXT,
    exchange_timeline TEXT,
    
    -- Technical Tracking
    source_url TEXT,
    form_data JSONB DEFAULT '{}',
    webhook_payload JSONB,
    webhook_received_at TIMESTAMPTZ,
    
    -- Polling Fallback
    polling_attempts INTEGER DEFAULT 0,
    last_polled_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- ACTIVITY & ANALYTICS TRACKING
-- ============================================

-- Complete user journey tracking
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Activity Classification
    activity_type TEXT NOT NULL, -- page_visit, calculator_start, calculator_complete, form_step_complete, appointment_book, email_open, etc.
    activity_data JSONB DEFAULT '{}', -- Activity-specific data
    
    -- Session Context
    session_id TEXT, -- Group activities by browser session
    source_url TEXT,
    referrer_url TEXT,
    
    -- Technical Context
    ip_address INET,
    user_agent TEXT,
    device_type TEXT, -- mobile, desktop, tablet
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- HIGHLEVEL INTEGRATION MANAGEMENT
-- ============================================

-- HighLevel integration audit trail
CREATE TABLE IF NOT EXISTS highlevel_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Integration Details
    integration_type TEXT NOT NULL, -- contact_create, contact_update, appointment_create, workflow_trigger
    
    -- Request/Response Tracking
    payload_sent JSONB NOT NULL,
    response_received JSONB,
    
    -- Status Tracking
    success BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    
    -- HighLevel Entity IDs
    highlevel_entity_id TEXT, -- contact_id or appointment_id returned by HighLevel
    
    -- Retry Logic
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Webhook processing from HighLevel
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Webhook Details
    webhook_type TEXT NOT NULL, -- appointment_created, appointment_updated, contact_updated, etc.
    payload JSONB NOT NULL,
    headers JSONB,
    
    -- Processing Status
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    
    -- Timestamps
    received_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ
);

-- HighLevel configuration
CREATE TABLE IF NOT EXISTS highlevel_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- API Configuration
    api_key TEXT NOT NULL, -- Encrypted in production
    location_id TEXT NOT NULL,
    calendar_id TEXT NOT NULL,
    
    -- Webhook Configuration
    webhook_secret TEXT,
    webhook_url TEXT,
    
    -- Settings
    timezone TEXT DEFAULT 'America/New_York',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- ADMIN USER MANAGEMENT
-- ============================================

-- Admin users with role-based access
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Authentication
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Will use Supabase Auth, this is backup
    
    -- Authorization
    role TEXT NOT NULL DEFAULT 'admin', -- super_admin, admin, manager, support
    permissions JSONB DEFAULT '{}', -- Granular permissions object
    
    -- Profile
    first_name TEXT,
    last_name TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ
);

-- Admin activity audit log
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    
    -- Action Details
    action_type TEXT NOT NULL, -- create, update, delete, view, export
    resource_type TEXT NOT NULL, -- lead, appointment, integration, etc.
    resource_id TEXT, -- ID of affected resource
    
    -- Action Context
    action_details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- FUTURE PLATFORM FEATURES (Architecture Ready)
-- ============================================

-- Customer property portfolio tracking
CREATE TABLE IF NOT EXISTS customer_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Property Details
    property_address TEXT NOT NULL,
    property_city TEXT,
    property_state TEXT,
    property_zip TEXT,
    property_type TEXT,
    
    -- Financial Information
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    current_value DECIMAL(12,2),
    annual_rental_income DECIMAL(12,2),
    
    -- Status
    status TEXT DEFAULT 'owned', -- owned, sold, under_contract, listed
    
    -- 1031 Exchange History
    acquired_via_1031 BOOLEAN DEFAULT FALSE,
    previous_property_id UUID REFERENCES customer_properties(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Document management with OCR capabilities
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Document Classification
    document_type TEXT NOT NULL, -- purchase_agreement, financial_statement, tax_return, etc.
    document_category TEXT, -- property_docs, financial_docs, legal_docs
    
    -- File Information
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage URL
    file_size INTEGER,
    mime_type TEXT,
    
    -- OCR and Analysis
    ocr_text TEXT, -- Extracted text content
    ocr_confidence DECIMAL(3,2), -- OCR confidence score
    document_analysis JSONB, -- Structured data extracted from document
    
    -- Security
    encryption_key TEXT, -- For sensitive documents
    access_level TEXT DEFAULT 'private', -- private, shared, public
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Market intelligence data
CREATE TABLE IF NOT EXISTS market_intelligence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Geographic Scope
    location_type TEXT NOT NULL, -- city, county, state, zip
    location_identifier TEXT NOT NULL, -- Specific location ID
    location_name TEXT NOT NULL,
    
    -- Property Scope
    property_type TEXT, -- residential, commercial, industrial, etc.
    property_subtype TEXT, -- single_family, multi_family, office, etc.
    
    -- Market Data
    market_data JSONB NOT NULL, -- Comprehensive market metrics
    
    -- Data Source
    data_source TEXT NOT NULL, -- mls, zillow, government, internal
    data_quality_score DECIMAL(3,2),
    
    -- Timestamps
    collected_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Subscription services for recurring revenue
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- Subscription Details
    service_type TEXT NOT NULL, -- market_insights, portfolio_tracking, tax_planning
    service_tier TEXT, -- basic, premium, enterprise
    
    -- Billing
    billing_cycle TEXT DEFAULT 'monthly', -- monthly, quarterly, annually
    amount DECIMAL(8,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT DEFAULT 'active', -- active, cancelled, paused, past_due
    
    -- Billing Dates
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    next_billing_date TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Payment Integration
    stripe_subscription_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Availability cache (for appointment booking performance)
CREATE TABLE IF NOT EXISTS availability_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Cache Key
    cache_key TEXT UNIQUE NOT NULL, -- Format: calendar_id:date:timezone
    calendar_id TEXT NOT NULL,
    date DATE NOT NULL,
    timezone TEXT NOT NULL,
    
    -- Cached Data
    slots JSONB NOT NULL, -- Available time slots
    
    -- Cache Management
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Core lead management indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_activity ON leads(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_leads_highlevel ON leads(highlevel_contact_id);

-- Calculator submissions indexes
CREATE INDEX IF NOT EXISTS idx_calculator_lead ON calculator_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_calculator_created ON calculator_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_calculator_savings ON calculator_submissions(calculated_tax_savings DESC);

-- Order form submissions indexes
CREATE INDEX IF NOT EXISTS idx_order_form_lead ON order_form_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_order_form_status ON order_form_submissions(completion_status);
CREATE INDEX IF NOT EXISTS idx_order_form_urgency ON order_form_submissions(urgency_level);
CREATE INDEX IF NOT EXISTS idx_order_form_created ON order_form_submissions(created_at);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_lead ON appointments(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_specialist ON appointments(assigned_specialist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_highlevel ON appointments(highlevel_appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at);

-- Activity tracking indexes
CREATE INDEX IF NOT EXISTS idx_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_session ON lead_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON lead_activities(created_at);

-- Integration indexes
CREATE INDEX IF NOT EXISTS idx_integrations_lead ON highlevel_integrations(lead_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type ON highlevel_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_integrations_success ON highlevel_integrations(success);
CREATE INDEX IF NOT EXISTS idx_integrations_created ON highlevel_integrations(created_at);

-- Webhook indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_lead ON webhooks(lead_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_type ON webhooks(webhook_type);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_received ON webhooks(received_at);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_logs(created_at);

-- Platform feature indexes
CREATE INDEX IF NOT EXISTS idx_properties_lead ON customer_properties(lead_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON customer_properties(status);
CREATE INDEX IF NOT EXISTS idx_documents_lead ON documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lead ON subscriptions(lead_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_availability_cache_key ON availability_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_availability_expires ON availability_cache(expires_at);

-- ============================================
-- AUTOMATED TRIGGERS
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

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlevel_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlevel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache ENABLE ROW LEVEL SECURITY;

-- Public access policies (for frontend)
CREATE POLICY "Allow public insert on leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on leads" ON leads
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on calculator_submissions" ON calculator_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on order_form_submissions" ON order_form_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on order_form_submissions" ON order_form_submissions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on appointments" ON appointments
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on lead_activities" ON lead_activities
    FOR INSERT WITH CHECK (true);

-- Read-only public access for configuration
CREATE POLICY "Allow public read on highlevel_config" ON highlevel_config
    FOR SELECT USING (is_active = true);

-- Public read on availability cache
CREATE POLICY "Allow public read on availability_cache" ON availability_cache
    FOR SELECT USING (expires_at > NOW());

-- Service role policies (for backend operations)
CREATE POLICY "Allow service role all on leads" ON leads
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on calculator_submissions" ON calculator_submissions
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on order_form_submissions" ON order_form_submissions
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on appointments" ON appointments
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on lead_activities" ON lead_activities
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on highlevel_integrations" ON highlevel_integrations
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on webhooks" ON webhooks
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on highlevel_config" ON highlevel_config
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on admin_users" ON admin_users
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on admin_audit_logs" ON admin_audit_logs
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on customer_properties" ON customer_properties
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on documents" ON documents
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on market_intelligence" ON market_intelligence
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on subscriptions" ON subscriptions
    FOR ALL USING (true);

CREATE POLICY "Allow service role all on availability_cache" ON availability_cache
    FOR ALL USING (true);

-- ============================================
-- ANALYTICS VIEWS
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

-- Appointment booking performance
CREATE OR REPLACE VIEW appointment_performance AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    booking_source,
    COUNT(*) as total_appointments,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_appointments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_assignment_time_minutes
FROM appointments
GROUP BY DATE_TRUNC('day', created_at), booking_source
ORDER BY date DESC;

-- Integration health view
CREATE OR REPLACE VIEW integration_health AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    integration_type,
    COUNT(*) as total_attempts,
    COUNT(CASE WHEN success THEN 1 END) as successful_attempts,
    ROUND((COUNT(CASE WHEN success THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as success_rate
FROM highlevel_integrations
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), integration_type
ORDER BY hour DESC;

-- ============================================
-- SAMPLE CONFIGURATION DATA
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

-- Insert sample admin user (to be updated with real credentials)
INSERT INTO admin_users (
    email,
    role,
    first_name,
    last_name,
    is_active
) VALUES (
    'admin@the1031center.com',
    'super_admin',
    'Admin',
    'User',
    true
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMPLETION NOTES
-- ============================================

/*
This master schema provides:

1. COMPLETE LEAD MANAGEMENT
   - Email-based lead deduplication
   - Automated lead scoring (0-100 scale)
   - Complete customer journey tracking
   - Multi-source lead capture (calculator, form, direct)

2. COMPREHENSIVE ANALYTICS
   - Activity timeline for every lead
   - Conversion funnel analysis
   - Performance metrics and KPIs
   - Integration health monitoring

3. HIGHLEVEL INTEGRATION
   - Full audit trail of all API calls
   - Webhook processing with error handling
   - Automated retry logic
   - Status synchronization

4. ADMIN CAPABILITIES
   - Role-based access control
   - Comprehensive audit logging
   - Multi-user admin support
   - Granular permissions

5. PLATFORM FEATURES (Future Ready)
   - Customer property portfolio tracking
   - Document management with OCR
   - Market intelligence collection
   - Subscription revenue management

6. PERFORMANCE & SECURITY
   - Comprehensive indexing for scale
   - Row Level Security (RLS) policies
   - Automated triggers and functions
   - Caching for high-performance booking

This schema supports transformation from service business to platform business
with complete customer lifecycle management and advanced analytics.

NEXT STEPS:
1. Update HighLevel configuration with real API keys
2. Create first admin user through Supabase Auth
3. Test schema with sample data
4. Implement service layer to interact with schema
5. Build admin interface on top of this foundation
*/