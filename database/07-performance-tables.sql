-- ============================================
-- Step 7: Performance & Caching Tables
-- ============================================

-- Availability cache (for appointment booking performance)
CREATE TABLE IF NOT EXISTS availability_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Cache Key
    cache_key TEXT UNIQUE NOT NULL, -- Format: calendar_id:date:timezone
    calendar_id TEXT NOT NULL,
    date DATE NOT NULL,
    timezone TEXT NOT NULL,
    
    -- Cached Data
    slots JSONB NOT NULL, -- Available time slots
    
    -- Cache Management
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);