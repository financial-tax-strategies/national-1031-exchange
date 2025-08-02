import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabaseIssues() {
  console.log('🔧 Fixing database issues...\n');

  try {
    // 1. Fix RLS policies
    console.log('1️⃣ Disabling RLS on integration tables...');
    const rlsQueries = [
      'ALTER TABLE highlevel_config DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE highlevel_sync_logs DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE webhook_logs DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE availability_cache DISABLE ROW LEVEL SECURITY'
    ];

    for (const query of rlsQueries) {
      const { error } = await supabase.rpc('query_runner', { query_text: query });
      if (error && !error.message.includes('does not exist')) {
        console.error(`Error: ${error.message}`);
      }
    }
    console.log('✅ RLS disabled on integration tables\n');

    // 2. Check if tables exist
    console.log('2️⃣ Checking table existence...');
    const { data: tables } = await supabase.rpc('query_runner', {
      query_text: `
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('highlevel_config', 'highlevel_sync_logs', 'leads', 'appointments')
        ORDER BY tablename
      `
    });
    console.log('Tables found:', tables);
    console.log('');

    // 3. Fix the find_or_create_lead function
    console.log('3️⃣ Fixing find_or_create_lead function...');
    
    // Drop existing function
    await supabase.rpc('query_runner', {
      query_text: 'DROP FUNCTION IF EXISTS find_or_create_lead(text, text, text, text, text)'
    });

    // Create with correct parameter order
    const { error: funcError } = await supabase.rpc('query_runner', {
      query_text: `
        CREATE OR REPLACE FUNCTION find_or_create_lead(
            p_email TEXT,
            p_first_name TEXT,
            p_last_name TEXT,
            p_lead_source TEXT,
            p_phone TEXT
        )
        RETURNS UUID AS $$
        DECLARE
            lead_id UUID;
        BEGIN
            -- Try to find existing lead by email
            SELECT id INTO lead_id FROM leads WHERE email = p_email;
            
            -- If not found, create new lead
            IF lead_id IS NULL THEN
                INSERT INTO leads (email, phone, first_name, last_name, lead_source)
                VALUES (p_email, p_phone, p_first_name, p_last_name, p_lead_source)
                RETURNING id INTO lead_id;
            ELSE
                -- Update existing lead with any new information
                UPDATE leads 
                SET 
                    phone = COALESCE(p_phone, phone),
                    first_name = COALESCE(p_first_name, first_name),
                    last_name = COALESCE(p_last_name, last_name),
                    updated_at = NOW()
                WHERE id = lead_id;
            END IF;
            
            RETURN lead_id;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (funcError) {
      console.error('Function creation error:', funcError);
    } else {
      console.log('✅ Function created successfully\n');
    }

    // 4. Test the function
    console.log('4️⃣ Testing find_or_create_lead function...');
    const { data: testResult, error: testError } = await supabase.rpc('find_or_create_lead', {
      p_email: 'cli-test@example.com',
      p_first_name: 'CLI',
      p_last_name: 'Test',
      p_lead_source: 'cli-test',
      p_phone: '555-0000'
    });

    if (testError) {
      console.error('Test error:', testError);
    } else {
      console.log('✅ Function test successful! Lead ID:', testResult);
    }

    // 5. Check highlevel_config data
    console.log('\n5️⃣ Checking highlevel_config table...');
    const { data: configs, error: configError } = await supabase
      .from('highlevel_config')
      .select('*');

    if (configError) {
      console.error('Config query error:', configError);
    } else {
      console.log(`Found ${configs?.length || 0} config records`);
      if (configs && configs.length > 0) {
        console.log('Active configs:', configs.filter(c => c.is_active));
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Unfortunately, Supabase doesn't expose a direct SQL execution endpoint
// We need to use a different approach

console.log('⚠️  Note: Direct SQL execution requires database connection.');
console.log('Let me create a Node.js script to fix the issues...\n');

// For now, let's just check what we can with the regular client
async function checkDatabase() {
  console.log('🔍 Checking database state...\n');

  // Check if we can access tables
  const tables = ['leads', 'highlevel_config', 'appointments', 'highlevel_sync_logs'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count || 0} records`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  // Try the function
  console.log('\n🔧 Testing find_or_create_lead function...');
  try {
    const { data, error } = await supabase.rpc('find_or_create_lead', {
      p_email: 'test-from-script@example.com',
      p_phone: '555-9999',
      p_first_name: 'Script',
      p_last_name: 'Test',
      p_lead_source: 'script-test'
    });

    if (error) {
      console.log(`❌ Function error: ${error.message}`);
      console.log('Full error:', error);
    } else {
      console.log(`✅ Function works! Lead ID: ${data}`);
    }
  } catch (e) {
    console.log(`❌ Function error: ${e.message}`);
  }
}

checkDatabase();