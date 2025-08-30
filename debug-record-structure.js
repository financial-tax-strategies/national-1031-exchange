#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Detailed Record Structure Analysis');
console.log('=====================================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);

async function analyzeRecordStructure() {
  try {
    const { data: submissions, error } = await client
      .from('order_form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Query error:', error);
      return;
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('❌ No submissions found');
      return;
    }
    
    const latest = submissions[0];
    console.log('📊 Latest Submission Analysis:');
    console.log('------------------------------');
    console.log(`ID: ${latest.id}`);
    console.log(`Created: ${latest.created_at}`);
    
    // Show all submissions for comparison
    console.log('');
    console.log('📋 All Recent Submissions:');
    submissions.forEach((sub, idx) => {
      console.log(`  ${idx + 1}. ${sub.id} - ${sub.created_at} - First: ${sub['1031x_order_first_name'] || 'NULL'}`);
    });
    console.log('');
    
    console.log('🔍 Form Field Analysis:');
    const formFields = [
      '1031x_order_first_name',
      '1031x_order_last_name', 
      '1031x_order_email',
      '1031x_order_phone',
      '1031x_order_property_address',
      '1031x_order_urgency_level'
    ];
    
    formFields.forEach(field => {
      const value = latest[field];
      console.log(`  ${field}: ${value ? `"${value}"` : 'NULL/UNDEFINED'}`);
    });
    
    console.log('');
    console.log('🔍 All Record Fields:');
    Object.keys(latest).forEach(key => {
      const value = latest[key];
      const type = typeof value;
      const preview = value ? String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '') : 'NULL';
      console.log(`  ${key} (${type}): ${preview}`);
    });
    
    // Test what the admin interface would see
    console.log('');
    console.log('🎯 What Admin Interface Sees:');
    const firstName = latest['1031x_order_first_name'] || 'MISSING';
    const lastName = latest['1031x_order_last_name'] || 'MISSING';
    const email = latest['1031x_order_email'] || 'MISSING';
    const formDataFirstName = latest.form_data?.['1031x_order_first_name'] || 'MISSING';
    
    console.log(`  Name Display: "${firstName} ${lastName}"`);
    console.log(`  Email Display: "${email}"`);
    console.log(`  form_data exists: ${latest.form_data ? 'YES' : 'NO'}`);
    if (latest.form_data) {
      console.log(`  form_data first_name: "${formDataFirstName}"`);
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  }
}

analyzeRecordStructure();