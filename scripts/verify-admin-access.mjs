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
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

console.log('🔍 Verifying Admin Access\n');

// Test with ANON key (what the website uses)
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

// Test with SERVICE key (bypasses RLS)
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function testAccess() {
  console.log('1️⃣ Testing with ANON key (website access):\n');
  
  const tables = ['highlevel_config', 'leads', 'appointments', 'admin_users'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await anonClient
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        
        // Try with service key
        const { count: serviceCount } = await serviceClient
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   → With service key: ${serviceCount || 0} records (RLS is blocking anon access!)`);
      } else {
        console.log(`✅ ${table}: Accessible (${count || 0} records)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }
  
  console.log('\n2️⃣ Testing highlevel_config specifically:\n');
  
  // Test exact query the admin panel uses
  try {
    const { data, error } = await anonClient
      .from('highlevel_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.log(`❌ Admin query failed: ${error.message}`);
      console.log('   This is why you see 404 in the admin panel!');
    } else {
      console.log('✅ Admin query works!');
      console.log('   Config found:', data ? 'Yes' : 'No');
    }
  } catch (e) {
    console.log(`❌ Admin query error: ${e.message}`);
  }
  
  console.log('\n📋 Summary:');
  console.log('If you see ❌ above, run the FIX-ADMIN-ACCESS.sql script');
  console.log('If you see ✅ for highlevel_config, try refreshing the admin page');
}

testAccess();