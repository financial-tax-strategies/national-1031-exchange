#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Database Debug Script');
console.log('======================');
console.log('Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('Anon Key:', supabaseAnonKey ? 'SET' : 'MISSING');
console.log('Service Key:', supabaseServiceKey ? 'SET' : 'MISSING');
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function debugDatabase() {
  console.log('📊 Checking database contents...');
  console.log('');
  
  // Check leads table
  console.log('1. LEADS TABLE:');
  console.log('---------------');
  try {
    const { data: leads, error: leadsError } = await anonClient
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (leadsError) {
      console.error('❌ Leads query error:', leadsError);
    } else {
      console.log(`✅ Found ${leads?.length || 0} leads`);
      if (leads && leads.length > 0) {
        leads.forEach(lead => {
          console.log(`  - ${lead.first_name} ${lead.last_name} (${lead.email}) - ${new Date(lead.created_at).toISOString()}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Leads table error:', error.message);
  }
  
  console.log('');
  
  // Check order_form_submissions table with anon client
  console.log('2. ORDER FORM SUBMISSIONS (Anon Client):');
  console.log('----------------------------------------');
  try {
    const { data: submissions, error: submissionsError } = await anonClient
      .from('order_form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (submissionsError) {
      console.error('❌ Submissions query error (anon):', submissionsError);
    } else {
      console.log(`✅ Found ${submissions?.length || 0} submissions with anon client`);
      if (submissions && submissions.length > 0) {
        submissions.forEach(sub => {
          const name = `${sub['1031x_order_first_name'] || 'N/A'} ${sub['1031x_order_last_name'] || 'N/A'}`;
          const email = sub['1031x_order_email'] || 'N/A';
          const created = new Date(sub.created_at).toISOString();
          console.log(`  - ${name} (${email}) - ${created} - Status: ${sub.status || 'N/A'}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Order submissions table error (anon):', error.message);
  }
  
  console.log('');
  
  // Check order_form_submissions table with service client if available
  if (serviceClient) {
    console.log('3. ORDER FORM SUBMISSIONS (Service Client):');
    console.log('------------------------------------------');
    try {
      const { data: submissions, error: submissionsError } = await serviceClient
        .from('order_form_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (submissionsError) {
        console.error('❌ Submissions query error (service):', submissionsError);
      } else {
        console.log(`✅ Found ${submissions?.length || 0} submissions with service client`);
        if (submissions && submissions.length > 0) {
          submissions.forEach(sub => {
            const name = `${sub['1031x_order_first_name'] || 'N/A'} ${sub['1031x_order_last_name'] || 'N/A'}`;
            const email = sub['1031x_order_email'] || 'N/A';
            const created = new Date(sub.created_at).toISOString();
            console.log(`  - ${name} (${email}) - ${created} - Status: ${sub.status || 'N/A'}`);
          });
        }
      }
    } catch (error) {
      console.error('❌ Order submissions table error (service):', error.message);
    }
  } else {
    console.log('3. ORDER FORM SUBMISSIONS (Service Client): SKIPPED - No service key');
  }
  
  console.log('');
  
  // Check for the specific submission with reference 6A8848FC
  console.log('4. SEARCHING FOR SUBMISSION 6A8848FC:');
  console.log('-------------------------------------');
  try {
    const { data: specificSubmission, error: specificError } = await anonClient
      .from('order_form_submissions')
      .select('*')
      .or(`id.like.%6A8848FC%,session_id.like.%6A8848FC%,"1031x_order_email".like.%6A8848FC%`);
    
    if (specificError) {
      console.error('❌ Specific submission search error:', specificError);
    } else {
      console.log(`✅ Found ${specificSubmission?.length || 0} submissions matching 6A8848FC`);
      if (specificSubmission && specificSubmission.length > 0) {
        specificSubmission.forEach(sub => {
          console.log(`  - Found: ${sub.id} - ${sub['1031x_order_email']} - ${new Date(sub.created_at).toISOString()}`);
        });
      } else {
        console.log('❌ No submissions found with reference 6A8848FC');
      }
    }
  } catch (error) {
    console.error('❌ Specific submission search error:', error.message);
  }
  
  console.log('');
  console.log('🔍 Database inspection complete.');
}

debugDatabase().catch(console.error);