import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client for build time when env vars are not available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null as any

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}