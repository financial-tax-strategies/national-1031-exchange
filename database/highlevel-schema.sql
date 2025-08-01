-- ============================================
-- HighLevel Integration Database Schema
-- National 1031 Center - Simplified Single Calendar System
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Core Configuration Table
-- ============================================

CREATE TABLE IF NOT EXISTS highlevel_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key TEXT NOT NULL, -- Encrypted HighLevel API key
    location_id TEXT NOT NULL, -- HighLevel location ID
    calendar_id TEXT NOT NULL, -- Single calendar ID for all appointments
    webhook_secret TEXT, -- Webhook validation secret
    webhook_url TEXT, -- Full webhook URL for HighLevel
    timezone TEXT DEFAULT 'America/New_York',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Appointments Tracking Table
-- ============================================

CREATE TYPE appointment_status AS ENUM (
    'pending_assignment',  -- Waiting for HighLevel round-robin assignment
    'confirmed',          -- Assignment complete with specialist
    'failed',            -- Booking failed
    'cancelled',         -- User or system cancelled
    'completed',         -- Appointment took place
    'no_show'           -- User didn't show up
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- HighLevel Correlation IDs
    highlevel_appointment_id TEXT UNIQUE NOT NULL,
    highlevel_contact_id TEXT NOT NULL,
    
    -- Appointment Status
    status appointment_status DEFAULT 'pending_assignment' NOT NULL,
    
    -- Assignment Details (populated by webhook)
    assigned_specialist_id TEXT, -- HighLevel user ID who got assigned
    assigned_specialist_name TEXT, -- Name for display
    meeting_location TEXT, -- Zoom link, phone, etc.
    
    -- Appointment Details
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_time TEXT NOT NULL, -- Original selected time slot
    timezone TEXT NOT NULL DEFAULT 'America/New_York',
    duration_minutes INTEGER DEFAULT 30,
    
    -- Contact Information (from calculator)
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    contact_first_name TEXT NOT NULL,
    contact_last_name TEXT NOT NULL,
    
    -- 1031 Exchange Context
    tax_savings_amount DECIMAL(12,2), -- From calculator
    property_sale_price DECIMAL(12,2), -- From calculator
    property_type TEXT, -- residential, commercial, etc.
    exchange_timeline TEXT, -- immediate, 3-6 months, etc.
    
    -- Technical Tracking
    source_url TEXT, -- Where they came from
    form_data JSONB DEFAULT '{}', -- Original form submission
    webhook_payload JSONB, -- Last webhook received
    webhook_received_at TIMESTAMPTZ, -- When webhook was processed
    
    -- Polling Fallback
    polling_attempts INTEGER DEFAULT 0,
    last_polled_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Webhook Processing Log
-- ============================================

CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    webhook_type TEXT NOT NULL, -- 'appointment_created', 'appointment_updated', etc.
    payload JSONB NOT NULL,
    headers JSONB,
    processed BOOLEAN DEFAULT false,
    processing_error TEXT,
    received_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ
);

-- ============================================
-- Availability Cache Table
-- ============================================

CREATE TABLE IF NOT EXISTS availability_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cache_key TEXT UNIQUE NOT NULL, -- Format: calendar_id:date:timezone
    calendar_id TEXT NOT NULL,
    date DATE NOT NULL,
    timezone TEXT NOT NULL,
    slots JSONB NOT NULL, -- Available time slots
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_highlevel_id ON appointments(highlevel_appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(contact_email);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at);

-- Webhook logs indexes
CREATE INDEX IF NOT EXISTS idx_webhook_logs_appointment ON webhook_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_received ON webhook_logs(received_at);

-- Availability cache indexes
CREATE INDEX IF NOT EXISTS idx_availability_cache_key ON availability_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_availability_expires ON availability_cache(expires_at);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE highlevel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache ENABLE ROW LEVEL SECURITY;

-- Public read policy for configuration (needed by frontend)
CREATE POLICY "Allow public read on highlevel_config" ON highlevel_config
    FOR SELECT USING (is_active = true);

-- Public insert/read on appointments (frontend needs this)
CREATE POLICY "Allow public insert on appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on appointments" ON appointments
    FOR SELECT USING (true);

CREATE POLICY "Allow service role update on appointments" ON appointments
    FOR UPDATE USING (true);

-- Service role only for webhook logs
CREATE POLICY "Allow service role all on webhook_logs" ON webhook_logs
    FOR ALL USING (true);

-- Public read on availability cache
CREATE POLICY "Allow public read on availability_cache" ON availability_cache
    FOR SELECT USING (expires_at > NOW());

CREATE POLICY "Allow service role all on availability_cache" ON availability_cache
    FOR ALL USING (true);

-- ============================================
-- Updated Timestamp Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at columns
CREATE TRIGGER update_highlevel_config_updated_at 
    BEFORE UPDATE ON highlevel_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Cache Cleanup Function
-- ============================================

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM availability_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Sample Configuration Insert
-- ============================================

-- Insert sample configuration (to be updated with real values)
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
    'https://national1031center.com/.netlify/functions/highlevel-webhook',
    'America/New_York',
    true
) ON CONFLICT DO NOTHING;

-- ============================================
-- Useful Queries for Management
-- ============================================

-- Get appointment statistics
/*
SELECT 
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_assignment_time_minutes
FROM appointments 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY status
ORDER BY count DESC;
*/

-- Get webhook processing success rate
/*
SELECT 
    processed,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM webhook_logs 
WHERE received_at > NOW() - INTERVAL '7 days'
GROUP BY processed;
*/

-- Clean up old cache entries (run periodically)
/*
SELECT cleanup_expired_cache();
*/