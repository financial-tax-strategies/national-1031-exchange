import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fweohnekiahcvnfcpfic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZW9obmVraWFoY3ZuZmNwZmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTYxMTUsImV4cCI6MjA2OTY3MjExNX0.xrf4cPeAfinjJijGRz13etUMS54ftwm5bfXKGDMbSVA";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZW9obmVraWFoY3ZuZmNwZmljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA5NjExNSwiZXhwIjoyMDY5NjcyMTE1fQ.kgovBpHHePgL8q6yak0mTlVj-VdZMGjp9hm2OfcC5cM";
const supabase = createClient(supabaseUrl, supabaseAnonKey) ;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) ;
const isSupabaseConfigured = () => {
  return Boolean(supabaseAnonKey);
};
const isSupabaseAdminConfigured = () => {
  return Boolean(supabaseServiceKey);
};

export { isSupabaseAdminConfigured as a, supabaseAdmin as b, isSupabaseConfigured as i, supabase as s };
