-- ============================================
-- Phase 2: White-Label and Communication Tables
-- Deploy when launching enterprise clients (Months 9-12)
-- ============================================

-- White-label tenant configuration
CREATE TABLE IF NOT EXISTS white_label_tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES partner_organizations(id) ON DELETE CASCADE,
    
    -- Tenant Identification
    tenant_subdomain TEXT UNIQUE NOT NULL,
    tenant_code TEXT UNIQUE NOT NULL,
    
    -- Branding
    brand_name TEXT NOT NULL,
    brand_tagline TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    
    -- Color Scheme
    primary_color TEXT DEFAULT '#1e40af',
    secondary_color TEXT DEFAULT '#3b82f6',
    accent_color TEXT DEFAULT '#f59e0b',
    text_color TEXT DEFAULT '#1f2937',
    background_color TEXT DEFAULT '#ffffff',
    
    -- Custom Styling
    custom_css TEXT,
    custom_fonts JSONB,
    
    -- Custom Content
    home_page_content JSONB,
    about_page_content JSONB,
    footer_content JSONB,
    legal_pages JSONB, -- privacy policy, terms, etc.
    
    -- Feature Configuration
    enabled_features TEXT[] DEFAULT ARRAY[
        'calculator', 
        'appointments', 
        'documents',
        'portal',
        'blog'
    ],
    disabled_features TEXT[] DEFAULT ARRAY[]::text[],
    feature_customizations JSONB,
    
    -- Workflow Customization
    custom_workflows JSONB,
    approval_required_actions TEXT[],
    
    -- Pricing Configuration
    show_pricing BOOLEAN DEFAULT TRUE,
    custom_pricing JSONB,
    payment_methods TEXT[] DEFAULT ARRAY['credit_card', 'ach'],
    
    -- Integration Settings
    custom_scripts TEXT,
    tracking_codes JSONB, -- GA, GTM, etc.
    webhook_endpoints JSONB,
    
    -- Domain Configuration
    custom_domain TEXT,
    ssl_certificate_id TEXT,
    
    -- Limits
    max_users INTEGER,
    max_leads_per_month INTEGER,
    storage_limit_gb INTEGER DEFAULT 100,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),
    suspension_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    activated_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add tenant isolation to existing tables
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES white_label_tenants(id);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES white_label_tenants(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES white_label_tenants(id);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES white_label_tenants(id);

-- Communication templates and campaigns
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES white_label_tenants(id) ON DELETE CASCADE,
    
    -- Template Identification
    template_name TEXT NOT NULL,
    template_code TEXT UNIQUE NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'push', 'in_app')),
    template_category TEXT CHECK (template_category IN (
        'welcome',
        'onboarding', 
        'reminder',
        'notification',
        'marketing',
        'transactional',
        'educational'
    )),
    
    -- Content
    subject TEXT, -- For emails
    preview_text TEXT, -- Email preview
    content_html TEXT,
    content_text TEXT NOT NULL,
    content_amp TEXT, -- AMP for email
    
    -- Dynamic Variables
    content_variables JSONB DEFAULT '[]'::jsonb, -- [{"key": "first_name", "default": "Friend"}]
    required_variables TEXT[],
    
    -- Sender Configuration
    from_name TEXT,
    from_email TEXT,
    reply_to_email TEXT,
    
    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    is_system_template BOOLEAN DEFAULT FALSE, -- Cannot be deleted
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES admin_users(id),
    approved_at TIMESTAMPTZ,
    
    -- Automation
    is_automated BOOLEAN DEFAULT FALSE,
    automation_trigger TEXT CHECK (automation_trigger IN (
        'lead_created',
        'appointment_scheduled',
        'appointment_reminder',
        'document_uploaded',
        'milestone_reached',
        'subscription_created',
        'payment_received',
        'custom_event'
    )),
    automation_delay_minutes INTEGER DEFAULT 0,
    automation_conditions JSONB,
    
    -- A/B Testing
    is_variant BOOLEAN DEFAULT FALSE,
    parent_template_id UUID REFERENCES communication_templates(id),
    variant_name TEXT,
    variant_percentage INTEGER DEFAULT 50,
    
    -- Performance Metrics
    send_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    delivery_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN send_count > 0 
        THEN (delivered_count::decimal / send_count * 100) 
        ELSE 0 END
    ) STORED,
    open_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN delivered_count > 0 
        THEN (open_count::decimal / delivered_count * 100) 
        ELSE 0 END
    ) STORED,
    click_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN open_count > 0 
        THEN (click_count::decimal / open_count * 100) 
        ELSE 0 END
    ) STORED,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_sent_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Communication sends tracking
CREATE TABLE IF NOT EXISTS communication_sends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES communication_templates(id) ON DELETE CASCADE,
    
    -- Recipient
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('lead', 'partner', 'admin')),
    recipient_id UUID NOT NULL,
    recipient_email TEXT,
    recipient_phone TEXT,
    
    -- Send Details
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
    subject TEXT,
    content TEXT,
    
    -- Variables Used
    variables_used JSONB,
    
    -- Status Tracking
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',
        'queued',
        'sending',
        'sent',
        'delivered',
        'opened',
        'clicked',
        'bounced',
        'failed',
        'unsubscribed'
    )),
    
    -- Delivery Details
    provider TEXT, -- sendgrid, twilio, etc.
    provider_message_id TEXT,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    
    -- Error Tracking
    error_code TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sent_at TIMESTAMPTZ
);

-- Communication preferences
CREATE TABLE IF NOT EXISTS communication_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Entity
    entity_type TEXT NOT NULL CHECK (entity_type IN ('lead', 'partner')),
    entity_id UUID NOT NULL,
    
    -- Channel Preferences
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    
    -- Category Preferences
    marketing_enabled BOOLEAN DEFAULT TRUE,
    transactional_enabled BOOLEAN DEFAULT TRUE,
    educational_enabled BOOLEAN DEFAULT TRUE,
    
    -- Frequency Preferences
    max_emails_per_day INTEGER DEFAULT 3,
    max_emails_per_week INTEGER DEFAULT 10,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Unsubscribe
    unsubscribed_all BOOLEAN DEFAULT FALSE,
    unsubscribed_categories TEXT[] DEFAULT ARRAY[]::text[],
    unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Unique constraint
    UNIQUE(entity_type, entity_id)
);

-- Create indexes
CREATE INDEX idx_white_label_subdomain ON white_label_tenants(tenant_subdomain);
CREATE INDEX idx_white_label_status ON white_label_tenants(status);
CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_templates_tenant ON communication_templates(tenant_id);
CREATE INDEX idx_templates_category ON communication_templates(template_category);
CREATE INDEX idx_templates_trigger ON communication_templates(automation_trigger);
CREATE INDEX idx_sends_template ON communication_sends(template_id);
CREATE INDEX idx_sends_recipient ON communication_sends(recipient_type, recipient_id);
CREATE INDEX idx_sends_status ON communication_sends(status);
CREATE INDEX idx_sends_created ON communication_sends(created_at);
CREATE INDEX idx_preferences_entity ON communication_preferences(entity_type, entity_id);

-- Create triggers
CREATE TRIGGER update_white_label_tenants_updated_at BEFORE UPDATE ON white_label_tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at BEFORE UPDATE ON communication_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_preferences_updated_at BEFORE UPDATE ON communication_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE white_label_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_preferences ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY "Tenant data isolation" ON white_label_tenants
    FOR ALL TO authenticated
    USING (
        id = current_setting('app.current_tenant_id', true)::uuid
        OR EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
            AND role = 'super_admin'
        )
    );

-- Templates are tenant-specific
CREATE POLICY "Templates tenant isolation" ON communication_templates
    FOR ALL TO authenticated
    USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
        OR tenant_id IS NULL -- System templates
    );

-- Communication sends are private
CREATE POLICY "Sends are private" ON communication_sends
    FOR SELECT TO authenticated
    USING (
        recipient_id::text = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );