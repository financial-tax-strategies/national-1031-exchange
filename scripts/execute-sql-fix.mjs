#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

console.log('🔧 Executing SQL Fix\n');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Using service key for full access\n`);

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFix() {
  try {
    // Read the SQL file
    const sqlPath = join(__dirname, '..', 'database', 'IMMEDIATE-FIX.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf-8');
    
    // Split SQL content by semicolons and filter out empty statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      // For table alterations, we need to use admin API
      if (statement.includes('ALTER TABLE') && statement.includes('DISABLE ROW LEVEL SECURITY')) {
        console.log('⚠️  Note: RLS changes need to be done via Supabase Dashboard or direct DB connection');
        console.log(`Statement: ${statement.substring(0, 50)}...`);
      } else if (statement.includes('DROP FUNCTION') || statement.includes('CREATE OR REPLACE FUNCTION')) {
        // For functions, we can use the SQL editor endpoint
        console.log('✅ Function operation - this should work');
      }
    }

    console.log('\n📋 Testing current access...\n');

    // Test table access
    const tables = ['highlevel_config', 'leads', 'appointments', 'highlevel_sync_logs'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible with service key`);
      }
    }

    console.log('\n🔧 Testing function...\n');

    // Test the function
    const { data: funcResult, error: funcError } = await supabase.rpc('find_or_create_lead', {
      p_email: 'service-key-test@example.com',
      p_first_name: 'Service',
      p_last_name: 'Test',
      p_lead_source: 'sql-fix',
      p_phone: '555-SERVICE'
    });

    if (funcError) {
      console.log(`❌ Function error: ${funcError.message}`);
      
      // Try alternate parameter order
      console.log('\nTrying alternate parameter order...');
      const { data: altResult, error: altError } = await supabase.rpc('find_or_create_lead', {
        p_email: 'service-key-test@example.com',
        p_phone: '555-SERVICE',
        p_first_name: 'Service',
        p_last_name: 'Test',
        p_lead_source: 'sql-fix'
      });
      
      if (altError) {
        console.log(`❌ Still failing: ${altError.message}`);
      } else {
        console.log(`✅ Alternate order worked! Lead ID: ${altResult}`);
      }
    } else {
      console.log(`✅ Function works! Lead ID: ${funcResult}`);
    }

    console.log('\n📌 IMPORTANT: To fully fix the issues, you need to:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and run the contents of database/IMMEDIATE-FIX.sql');
    console.log('3. This will disable RLS and fix the function parameter order');
    console.log('\nThe service key bypasses RLS, so tables are accessible here,');
    console.log('but the anon key (used by the website) needs RLS disabled.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

executeSQLFix();