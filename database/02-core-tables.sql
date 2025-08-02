-- ============================================
-- Step 2: Core Lead Management Tables
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