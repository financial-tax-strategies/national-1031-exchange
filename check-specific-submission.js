#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const client = createClient(supabaseUrl, supabaseAnonKey);

async function checkSpecificSubmission() {
  const targetId = '4c876a0d-f103-452f-a29d-21006ce26dde';
  console.log(`🔍 Searching for submission: ${targetId}`);
  
  // Check if it exists in order_form_submissions
  const { data: submission, error } = await client
    .from('order_form_submissions')
    .select('*')
    .eq('id', targetId)
    .single();
  
  if (error) {
    console.error('❌ Not found in order_form_submissions:', error.message);
  } else {
    console.log('✅ Found in order_form_submissions!');
    console.log('Structure:', Object.keys(submission));
    console.log('Sample data:', {
      firstName: submission['1031x_order_first_name'],
      lastName: submission['1031x_order_last_name'],
      email: submission['1031x_order_email']
    });
  }
  
  // Check if it exists as a lead
  const { data: lead, error: leadError } = await client
    .from('leads')
    .select('*')
    .eq('id', targetId)
    .single();
  
  if (leadError) {
    console.error('❌ Not found in leads:', leadError.message);
  } else {
    console.log('✅ Found in leads!');
    console.log('Lead data:', {
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email
    });
  }
}

checkSpecificSubmission();