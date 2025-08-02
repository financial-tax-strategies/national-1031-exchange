-- ============================================
-- Step 3: Activity & Analytics Tracking
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