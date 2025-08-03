-- ============================================
-- Step 16: Schema.org Content Management System
-- Provides database-driven content for AEO optimization
-- ============================================

-- ============================================
-- Team Members Table (Person Schema)
-- ============================================

-- Team members following Schema.org Person specification
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES white_label_tenants(id),
    
    -- URL & Display
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Person Schema Required Fields
    name TEXT NOT NULL,
    
    -- Person Schema Optional Fields  
    job_title TEXT,
    works_for TEXT,
    url TEXT,
    image TEXT,
    description TEXT,
    birth_date DATE,
    nationality TEXT,
    
    -- Address (structured as JSONB)
    address JSONB, -- {streetAddress, addressLocality, addressRegion, postalCode, addressCountry}
    
    -- Contact
    telephone TEXT,
    email TEXT,
    
    -- Social & Professional
    same_as TEXT[], -- Array of social media URLs
    knows_about TEXT[], -- Areas of expertise
    alumni_of TEXT[], -- Educational institutions
    
    -- Additional professional fields
    honorific_prefix TEXT, -- Dr., Prof., etc.
    honorific_suffix TEXT, -- PhD, MD, CPA, etc.
    job_title_details JSONB, -- For complex titles/roles
    awards TEXT[],
    publications TEXT[],
    certifications TEXT[],
    languages_spoken TEXT[],
    years_experience INTEGER,
    specializations TEXT[],
    
    -- Internal fields
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Reviews Table (Review Schema)
-- ============================================

-- Customer reviews following Schema.org Review specification
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES white_label_tenants(id),
    
    -- Display Control
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Review Schema Required Fields
    item_reviewed_type TEXT NOT NULL DEFAULT 'Service',
    item_reviewed_name TEXT NOT NULL DEFAULT '1031 Exchange Services',
    review_rating_value INTEGER NOT NULL CHECK (review_rating_value >= 1 AND review_rating_value <= 5),
    author_name TEXT NOT NULL,
    
    -- Review Schema Optional Fields
    review_body TEXT,
    date_published DATE DEFAULT CURRENT_DATE,
    headline TEXT,
    
    -- Extended author information
    author_email TEXT,
    author_location TEXT,
    author_details JSONB, -- {verified_buyer, company, title, etc.}
    
    -- Service/Transaction specific
    service_type TEXT, -- standard_exchange, reverse_exchange, consultation
    transaction_value_range TEXT, -- under_500k, 500k_1m, 1m_5m, over_5m
    property_type TEXT, -- residential, commercial, land, mixed
    
    -- Moderation & Quality
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderation_notes TEXT,
    approved_by UUID REFERENCES admin_users(id),
    approved_at TIMESTAMPTZ,
    
    -- Source tracking
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'email', 'google', 'yelp', 'import', 'api')),
    external_id TEXT, -- For imported reviews
    external_url TEXT, -- Link to original review
    
    -- Response from business
    response_text TEXT,
    response_date DATE,
    response_by UUID REFERENCES admin_users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Content Media Table
-- ============================================

-- Centralized media management for all content types
CREATE TABLE IF NOT EXISTS content_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES white_label_tenants(id),
    
    -- Reference to content
    entity_type TEXT NOT NULL, -- team_member, review, article, event, etc.
    entity_id UUID NOT NULL,
    
    -- Media details
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document', 'audio')),
    media_url TEXT NOT NULL,
    media_title TEXT,
    media_alt_text TEXT,
    media_caption TEXT,
    
    -- File metadata
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    dimensions JSONB, -- {width, height} for images/video
    duration_seconds INTEGER, -- For video/audio
    
    -- Display
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Processing status
    processing_status TEXT DEFAULT 'complete', -- uploading, processing, complete, failed
    processing_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    uploaded_by UUID REFERENCES admin_users(id)
);

-- ============================================
-- Future Content Types (Structure Ready)
-- ============================================

-- Placeholder for future Schema.org content types
COMMENT ON TABLE team_members IS 'Schema.org Person entities for team member display';
COMMENT ON TABLE reviews IS 'Schema.org Review entities for customer testimonials';
COMMENT ON TABLE content_media IS 'Media assets for all content types';

-- Future tables can follow same pattern:
-- - events (Event schema)
-- - articles (Article/BlogPosting schema)  
-- - faqs (FAQPage schema)
-- - services (Service schema)
-- - locations (LocalBusiness schema)

-- ============================================
-- Indexes for Performance
-- ============================================

-- Team members indexes
CREATE INDEX idx_team_members_tenant_active ON team_members(tenant_id, is_active);
CREATE INDEX idx_team_members_slug ON team_members(slug);
CREATE INDEX idx_team_members_display ON team_members(tenant_id, display_order) WHERE is_active = true;

-- Reviews indexes
CREATE INDEX idx_reviews_tenant_status ON reviews(tenant_id, status, is_active);
CREATE INDEX idx_reviews_featured ON reviews(tenant_id, is_featured) WHERE is_featured = true;
CREATE INDEX idx_reviews_rating ON reviews(review_rating_value) WHERE status = 'approved';
CREATE INDEX idx_reviews_date ON reviews(date_published DESC) WHERE status = 'approved';

-- Media indexes
CREATE INDEX idx_content_media_entity ON content_media(entity_type, entity_id);
CREATE INDEX idx_content_media_primary ON content_media(entity_type, entity_id) WHERE is_primary = true;

-- ============================================
-- Functions and Triggers
-- ============================================

-- Auto-generate slug for team members
CREATE OR REPLACE FUNCTION generate_team_member_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM team_members WHERE slug = NEW.slug AND id != NEW.id) LOOP
            NEW.slug := NEW.slug || '-' || substring(md5(random()::text) from 1 for 4);
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_team_member_slug_trigger
    BEFORE INSERT OR UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION generate_team_member_slug();

-- Update timestamps
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;

-- Team Members Policies
CREATE POLICY "Public can view active team members" ON team_members
    FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Admins have full access to team members" ON team_members
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = auth.jwt() ->> 'email'
            AND admin_users.is_active = true
        )
    );

-- Reviews Policies
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT 
    USING (status = 'approved' AND is_active = true);

CREATE POLICY "Public can submit reviews" ON reviews
    FOR INSERT 
    WITH CHECK (status = 'pending');

CREATE POLICY "Admins have full access to reviews" ON reviews
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = auth.jwt() ->> 'email'
            AND admin_users.is_active = true
        )
    );

-- Content Media Policies
CREATE POLICY "Public can view content media" ON content_media
    FOR SELECT 
    USING (true);

CREATE POLICY "Admins can manage content media" ON content_media
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = auth.jwt() ->> 'email'
            AND admin_users.is_active = true
        )
    );

-- ============================================
-- Helper Views
-- ============================================

-- Team members with full details
CREATE VIEW team_members_public AS
SELECT 
    tm.id,
    tm.slug,
    tm.name,
    tm.job_title,
    tm.works_for,
    tm.url,
    tm.image,
    tm.description,
    tm.telephone,
    tm.email,
    tm.address,
    tm.same_as,
    tm.knows_about,
    tm.alumni_of,
    tm.honorific_prefix,
    tm.honorific_suffix,
    tm.awards,
    tm.publications,
    tm.certifications,
    tm.years_experience,
    tm.specializations,
    tm.display_order,
    cm.media_url as primary_image_url,
    cm.media_alt_text as primary_image_alt
FROM team_members tm
LEFT JOIN content_media cm ON 
    cm.entity_type = 'team_member' 
    AND cm.entity_id = tm.id 
    AND cm.is_primary = true
WHERE tm.is_active = true
ORDER BY tm.display_order, tm.name;

-- Featured reviews with ratings summary
CREATE VIEW reviews_summary AS
SELECT 
    COUNT(*) as total_reviews,
    AVG(review_rating_value)::DECIMAL(3,2) as average_rating,
    COUNT(CASE WHEN review_rating_value = 5 THEN 1 END) as five_star_count,
    COUNT(CASE WHEN review_rating_value = 4 THEN 1 END) as four_star_count,
    COUNT(CASE WHEN review_rating_value = 3 THEN 1 END) as three_star_count,
    COUNT(CASE WHEN review_rating_value = 2 THEN 1 END) as two_star_count,
    COUNT(CASE WHEN review_rating_value = 1 THEN 1 END) as one_star_count
FROM reviews
WHERE status = 'approved' AND is_active = true;

-- ============================================
-- Seed Data
-- ============================================

-- Run the team members seed data
\i seed-team-members.sql

-- Sample reviews
INSERT INTO reviews (
    author_name,
    author_location,
    review_rating_value,
    headline,
    review_body,
    service_type,
    transaction_value_range,
    property_type,
    status,
    is_featured
) VALUES 
(
    'John Smith',
    'Los Angeles, CA',
    5,
    'Exceptional 1031 Exchange Service',
    'The team at The 1031 Center made our exchange seamless. They handled all the complex paperwork and timing requirements perfectly. Highly recommend!',
    'standard_exchange',
    '1m_5m',
    'commercial',
    'approved',
    true
),
(
    'Sarah Johnson',
    'Dallas, TX',
    5,
    'Professional and Knowledgeable Team',
    'Ruth Benjamin and her team guided us through a complex reverse exchange. Their expertise saved us significant tax dollars and made the process stress-free.',
    'reverse_exchange',
    'over_5m',
    'commercial',
    'approved',
    true
),
(
    'Michael Davis',
    'Phoenix, AZ',
    5,
    'Smooth Transaction from Start to Finish',
    'First time doing a 1031 exchange and the team made it simple. They answered all our questions promptly and ensured we met all deadlines.',
    'standard_exchange',
    '500k_1m',
    'residential',
    'approved',
    false
),
(
    'Emily Chen',
    'San Francisco, CA',
    4,
    'Great Service with Minor Delays',
    'Overall excellent service. There were some minor communication delays but the team resolved everything professionally. Would use again.',
    'standard_exchange',
    '1m_5m',
    'mixed',
    'approved',
    false
),
(
    'Robert Williams',
    'Miami, FL',
    5,
    'Experts in Complex Exchanges',
    'Completed an improvement exchange with multiple properties. The 1031 Center team handled every detail perfectly. Their experience really shows.',
    'improvement_exchange',
    'over_5m',
    'commercial',
    'approved',
    true
)
ON CONFLICT DO NOTHING;