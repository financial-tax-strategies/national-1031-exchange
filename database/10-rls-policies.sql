-- ============================================
-- Step 10: Row Level Security (RLS) Policies
-- ============================================

-- ============================================
-- Enable RLS on All Tables
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

-- ============================================
-- Public Access Policies (for frontend)
-- ============================================

-- Public access for lead management
CREATE POLICY "Allow public insert on leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on leads" ON leads
    FOR SELECT USING (true);

-- Public access for calculator submissions
CREATE POLICY "Allow public insert on calculator_submissions" ON calculator_submissions
    FOR INSERT WITH CHECK (true);

-- Public access for order form submissions
CREATE POLICY "Allow public insert on order_form_submissions" ON order_form_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on order_form_submissions" ON order_form_submissions
    FOR UPDATE USING (true);

-- Public access for appointments
CREATE POLICY "Allow public insert on appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on appointments" ON appointments
    FOR SELECT USING (true);

-- Public access for lead activities
CREATE POLICY "Allow public insert on lead_activities" ON lead_activities
    FOR INSERT WITH CHECK (true);

-- Read-only public access for configuration
CREATE POLICY "Allow public read on highlevel_config" ON highlevel_config
    FOR SELECT USING (is_active = true);

-- Public read on availability cache
CREATE POLICY "Allow public read on availability_cache" ON availability_cache
    FOR SELECT USING (expires_at > NOW());

-- ============================================
-- Service Role Policies (for backend operations)
-- ============================================

-- Full access policies for service role
CREATE POLICY "Allow service role all on leads" ON leads
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on calculator_submissions" ON calculator_submissions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on order_form_submissions" ON order_form_submissions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on appointments" ON appointments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on lead_activities" ON lead_activities
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on highlevel_integrations" ON highlevel_integrations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on webhooks" ON webhooks
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on highlevel_config" ON highlevel_config
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on admin_users" ON admin_users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on admin_audit_logs" ON admin_audit_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on customer_properties" ON customer_properties
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on documents" ON documents
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on market_intelligence" ON market_intelligence
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role all on availability_cache" ON availability_cache
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Admin User Policies (for authenticated admin users)
-- ============================================

-- Admin users can read/update their own profile
CREATE POLICY "Admin users can view own profile" ON admin_users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update own profile" ON admin_users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Super admins can manage all admin users
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- Admins can view audit logs for their actions
CREATE POLICY "Admins can view own audit logs" ON admin_audit_logs
    FOR SELECT USING (admin_user_id::text = auth.uid()::text);

-- Super admins can view all audit logs
CREATE POLICY "Super admins can view all audit logs" ON admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- ============================================
-- Customer Access Policies (future customer portal)
-- ============================================

-- Customers can view their own leads
CREATE POLICY "Customers can view own leads" ON leads
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Customers can view their own calculator submissions
CREATE POLICY "Customers can view own calculator submissions" ON calculator_submissions
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Customers can view their own order form submissions
CREATE POLICY "Customers can view own order form submissions" ON order_form_submissions
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Customers can view their own appointments
CREATE POLICY "Customers can view own appointments" ON appointments
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Customers can view their own properties
CREATE POLICY "Customers can view own properties" ON customer_properties
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Customers can view their own documents
CREATE POLICY "Customers can view own documents" ON documents
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
        AND access_level IN ('private', 'shared')
    );

-- Customers can view their own subscriptions
CREATE POLICY "Customers can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        )
    );

-- ============================================
-- Market Intelligence Policies
-- ============================================

-- Public read access for market intelligence (non-sensitive data)
CREATE POLICY "Allow public read on market intelligence" ON market_intelligence
    FOR SELECT USING (data_source != 'internal');

-- Service role and admins can manage all market intelligence
CREATE POLICY "Allow admin access to market intelligence" ON market_intelligence
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text 
            AND is_active = true
        )
    );