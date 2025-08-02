-- ============================================
-- Step 8: Performance Indexes
-- ============================================

-- ============================================
-- Core Lead Management Indexes
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

-- ============================================
-- Activity & Analytics Indexes
-- ============================================

-- Activity tracking indexes
CREATE INDEX IF NOT EXISTS idx_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_session ON lead_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON lead_activities(created_at);

-- ============================================
-- Integration Management Indexes
-- ============================================

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

-- ============================================
-- Admin System Indexes
-- ============================================

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_logs(created_at);

-- ============================================
-- Platform Feature Indexes
-- ============================================

-- Platform feature indexes
CREATE INDEX IF NOT EXISTS idx_properties_lead ON customer_properties(lead_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON customer_properties(status);
CREATE INDEX IF NOT EXISTS idx_documents_lead ON documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lead ON subscriptions(lead_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- Performance & Caching Indexes
-- ============================================

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_availability_cache_key ON availability_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_availability_expires ON availability_cache(expires_at);

-- ============================================
-- Composite Indexes for Advanced Queries
-- ============================================

-- Lead performance analysis
CREATE INDEX IF NOT EXISTS idx_leads_source_status ON leads(lead_source, lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score_created ON leads(lead_score DESC, created_at DESC);

-- Appointment booking patterns
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_appointments_specialist_date ON appointments(assigned_specialist_id, appointment_date);

-- Activity analysis
CREATE INDEX IF NOT EXISTS idx_activities_lead_type_created ON lead_activities(lead_id, activity_type, created_at DESC);

-- Integration monitoring
CREATE INDEX IF NOT EXISTS idx_integrations_type_success_created ON highlevel_integrations(integration_type, success, created_at DESC);

-- Admin audit queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_resource ON admin_audit_logs(resource_type, resource_id, created_at DESC);