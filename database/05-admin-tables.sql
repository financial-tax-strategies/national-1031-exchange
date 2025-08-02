-- ============================================
-- Step 5: Admin User Management
-- ============================================

-- Admin users with role-based access
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Authentication
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Will use Supabase Auth, this is backup
    
    -- Authorization
    role TEXT NOT NULL DEFAULT 'admin', -- super_admin, admin, manager, support
    permissions JSONB DEFAULT '{}', -- Granular permissions object
    
    -- Profile
    first_name TEXT,
    last_name TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ
);

-- Admin activity audit log
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    
    -- Action Details
    action_type TEXT NOT NULL, -- create, update, delete, view, export
    resource_type TEXT NOT NULL, -- lead, appointment, integration, etc.
    resource_id TEXT, -- ID of affected resource
    
    -- Action Context
    action_details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);