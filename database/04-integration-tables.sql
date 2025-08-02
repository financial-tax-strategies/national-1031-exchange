-- ============================================
-- Step 4: HighLevel Integration Management
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