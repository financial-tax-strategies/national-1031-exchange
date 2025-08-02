#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

console.log('🔧 Quick Database Fix Script\n');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Service Key: ${supabaseServiceKey.substring(0, 20)}...`);
console.log('');

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runFix() {
  console.log('1️⃣ Checking table access...\n');

  // Check each table
  const tables = ['leads', 'highlevel_config', 'appointments', 'highlevel_sync_logs'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible (${count || 0} records)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  console.log('\n2️⃣ Testing find_or_create_lead function...\n');
  
  // Test with correct parameter names
  const testData = {
    p_email: 'fix-test@example.com',
    p_phone: '555-0001',
    p_first_name: 'Fix',
    p_last_name: 'Test',
    p_lead_source: 'db-fix-script'
  };

  console.log('Test data:', testData);
  
  try {
    const { data, error } = await supabase.rpc('find_or_create_lead', testData);

    if (error) {
      console.log(`\n❌ Function call failed: ${error.message}`);
      console.log('Error details:', error);
      
      // Try alternate parameter order
      console.log('\n3️⃣ Trying alternate parameter order...\n');
      const altData = {
        p_email: testData.p_email,
        p_first_name: testData.p_first_name,
        p_last_name: testData.p_last_name,
        p_lead_source: testData.p_lead_source,
        p_phone: testData.p_phone
      };
      
      const { data: altResult, error: altError } = await supabase.rpc('find_or_create_lead', altData);
      if (altError) {
        console.log(`❌ Alternate order also failed: ${altError.message}`);
      } else {
        console.log(`✅ Alternate order worked! Lead ID: ${altResult}`);
      }
    } else {
      console.log(`\n✅ Function works! Lead ID: ${data}`);
    }
  } catch (e) {
    console.log(`\n❌ Unexpected error: ${e.message}`);
  }

  console.log('\n📝 Summary:');
  console.log('- If tables show as accessible with service key, RLS is the issue');
  console.log('- If function fails, parameter order mismatch is the issue');
  console.log('- Run the SQL fixes provided earlier to resolve these issues');
}

runFix();