-- ============================================
-- Step 6: Future Platform Features (Architecture Ready)
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