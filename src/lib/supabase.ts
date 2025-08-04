import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create a dummy client for build time when env vars are not available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null as any

// Admin client with service role key - bypasses RLS policies
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null as any

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Helper function to check if admin Supabase is properly configured
export const isSupabaseAdminConfigured = () => {
  return Boolean(supabaseUrl && supabaseServiceKey)
}