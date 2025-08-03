-- ============================================
-- Phase 2: Partner Ecosystem Tables
-- Deploy when launching partner program (Months 7-8)
-- ============================================

-- Partner organizations (CPA firms, real estate brokerages)
CREATE TABLE IF NOT EXISTS partner_organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Organization Details
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('cpa_firm', 'real_estate_brokerage', 'financial_advisor', 'law_firm')),
    tax_id TEXT UNIQUE,
    website_url TEXT,
    
    -- Contact Information
    primary_contact_name TEXT NOT NULL,
    primary_contact_email TEXT NOT NULL,
    primary_contact_phone TEXT,
    billing_email TEXT,
    billing_address JSONB,
    
    -- Partnership Details
    partnership_tier TEXT DEFAULT 'standard' CHECK (partnership_tier IN ('standard', 'premium', 'enterprise')),
    revenue_share_percentage DECIMAL(5,2) DEFAULT 20.00 CHECK (revenue_share_percentage BETWEEN 0 AND 100),
    white_label_enabled BOOLEAN DEFAULT FALSE,
    custom_terms JSONB,
    
    -- API Access
    api_key_hash TEXT,
    api_key_created_at TIMESTAMPTZ,
    api_rate_limit INTEGER DEFAULT 1000, -- requests per hour
    allowed_endpoints JSONB DEFAULT '["leads", "appointments", "documents"]'::jsonb,
    
    -- Compliance
    w9_on_file BOOLEAN DEFAULT FALSE,
    insurance_verified BOOLEAN DEFAULT FALSE,
    background_check_completed BOOLEAN DEFAULT FALSE,
    agreement_signed_date DATE,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    suspension_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    activated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Individual partners linked to organizations
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES partner_organizations(id) ON DELETE CASCADE,
    
    -- Personal Information
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    mobile_phone TEXT,
    
    -- Professional Details
    title TEXT,
    license_number TEXT,
    license_state TEXT,
    license_expiry DATE,
    specializations TEXT[],
    years_experience INTEGER,
    bio TEXT,
    headshot_url TEXT,
    
    -- Access Control
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
    permissions JSONB DEFAULT '{
        "view_leads": true,
        "create_leads": true,
        "view_reports": false,
        "manage_team": false,
        "view_revenue": false
    }'::jsonb,
    
    -- Notifications
    notification_preferences JSONB DEFAULT '{
        "email": {
            "new_lead": true,
            "appointment_scheduled": true,
            "revenue_earned": true
        },
        "sms": {
            "new_lead": false,
            "appointment_scheduled": true,
            "revenue_earned": false
        }
    }'::jsonb,
    
    -- Activity Tracking
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    total_revenue_generated DECIMAL(12,2) DEFAULT 0,
    
    -- Performance Metrics
    average_lead_quality_score DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    response_time_hours DECIMAL(5,2),
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    deactivation_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_activity_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add referral tracking to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_partner_id UUID REFERENCES partners(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_fee_percentage DECIMAL(5,2);

-- Revenue sharing tracking
CREATE TABLE IF NOT EXISTS revenue_share_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES partner_organizations(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'referral_commission', 
        'subscription_share', 
        'service_fee',
        'bonus',
        'adjustment'
    )),
    source_type TEXT NOT NULL, -- 'lead', 'subscription', 'service'
    source_id UUID, -- Reference to source record
    source_lead_id UUID REFERENCES leads(id),
    source_description TEXT,
    
    -- Financial Details
    gross_amount DECIMAL(12,2) NOT NULL,
    share_percentage DECIMAL(5,2) NOT NULL,
    share_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Payment Processing
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 
        'approved',
        'scheduled', 
        'processing',
        'paid', 
        'failed',
        'cancelled'
    )),
    payment_batch_id TEXT,
    payment_date DATE,
    payment_method TEXT CHECK (payment_method IN ('ach', 'wire', 'check', 'credit')),
    payment_reference TEXT,
    
    -- Accounting
    invoice_number TEXT,
    tax_withheld DECIMAL(12,2) DEFAULT 0,
    net_payment DECIMAL(12,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

-- Partner referral tracking
CREATE TABLE IF NOT EXISTS partner_referral_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    
    -- Link Details
    link_code TEXT UNIQUE NOT NULL,
    link_url TEXT NOT NULL,
    campaign_name TEXT,
    
    -- Tracking
    click_count INTEGER DEFAULT 0,
    lead_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    
    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_clicked_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_partner_organizations_status ON partner_organizations(status);
CREATE INDEX idx_partners_organization ON partners(organization_id);
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_leads_referral_partner ON leads(referral_partner_id);
CREATE INDEX idx_revenue_share_partner ON revenue_share_transactions(partner_id);
CREATE INDEX idx_revenue_share_status ON revenue_share_transactions(payment_status);
CREATE INDEX idx_revenue_share_date ON revenue_share_transactions(created_at);
CREATE INDEX idx_referral_links_partner ON partner_referral_links(partner_id);
CREATE INDEX idx_referral_links_code ON partner_referral_links(link_code);

-- Create updated_at triggers
CREATE TRIGGER update_partner_organizations_updated_at BEFORE UPDATE ON partner_organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE partner_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_share_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_referral_links ENABLE ROW LEVEL SECURITY;

-- Partners can only see their own organization
CREATE POLICY "Partners view own organization" ON partner_organizations
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM partners p
            WHERE p.organization_id = partner_organizations.id
            AND p.email = auth.jwt() ->> 'email'
        )
    );

-- Partners can see other partners in their organization
CREATE POLICY "Partners view organization members" ON partners
    FOR SELECT TO authenticated
    USING (
        organization_id IN (
            SELECT organization_id FROM partners
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Partners can view their own revenue transactions
CREATE POLICY "Partners view own revenue" ON revenue_share_transactions
    FOR SELECT TO authenticated
    USING (
        partner_id IN (
            SELECT id FROM partners
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Partners can manage their own referral links
CREATE POLICY "Partners manage own links" ON partner_referral_links
    FOR ALL TO authenticated
    USING (
        partner_id IN (
            SELECT id FROM partners
            WHERE email = auth.jwt() ->> 'email'
        )
    );