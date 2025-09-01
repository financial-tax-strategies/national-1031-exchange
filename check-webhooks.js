#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const client = createClient(supabaseUrl, serviceRoleKey);

async function checkWebhooks() {
  console.log('🔍 Checking webhook configuration and logs...');
  console.log('=====================================\n');
  
  // Check webhook configuration
  console.log('📋 Webhook Configuration:');
  const webhookUrls = process.env.ORDER_FORM_WEBHOOK_URLS;
  console.log('  ORDER_FORM_WEBHOOK_URLS:', webhookUrls || 'NOT CONFIGURED');
  console.log('  WEBHOOK_SECRET:', process.env.WEBHOOK_SECRET ? 'SET' : 'NOT SET');
  console.log('');
  
  try {
    // Check recent webhook logs
    console.log('📊 Recent Webhook Logs (last 24 hours):');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: webhookLogs, error } = await client
      .from('order_form_webhooks')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching webhook logs:', error.message);
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table order_form_webhooks does not exist - webhooks may not be configured');
      }
      return;
    }
    
    if (!webhookLogs || webhookLogs.length === 0) {
      console.log('📭 No webhook logs found in the last 24 hours');
      console.log('   This could mean:');
      console.log('   1. No webhooks are configured (ORDER_FORM_WEBHOOK_URLS not set)');
      console.log('   2. Webhooks are failing before logging');
      console.log('   3. No submissions have been processed recently');
    } else {
      console.log(`✅ Found ${webhookLogs.length} webhook log(s):\n`);
      
      webhookLogs.forEach((log, index) => {
        console.log(`Webhook ${index + 1}:`);
        console.log('  Submission ID:', log.submission_id);
        console.log('  URL:', log.webhook_url);
        console.log('  Status:', log.status_code);
        console.log('  Success:', log.success ? '✅' : '❌');
        console.log('  Created:', new Date(log.created_at).toLocaleString());
        if (log.error_message) {
          console.log('  Error:', log.error_message);
        }
        console.log('---');
      });
    }
    
    // Check the specific order submission status
    console.log('\n📋 Your Recent Order Status:');
    const orderId = 'ad64589b-9503-4ae1-aece-276491f42728';
    
    const { data: order, error: orderError } = await client
      .from('order_form_submissions')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (order) {
      console.log('  Order ID:', order.id);
      console.log('  Status:', order.completion_status);
      console.log('  Created:', new Date(order.created_at).toLocaleString());
      console.log('  Updated:', new Date(order.updated_at).toLocaleString());
      
      const formData = order.form_data || {};
      if (formData.highlevel_contact_id) {
        console.log('  HighLevel Contact ID:', formData.highlevel_contact_id);
      }
      if (formData.admin_email_sent) {
        console.log('  Admin Email Sent:', formData.admin_email_sent);
      }
      if (formData.user_email_sent) {
        console.log('  User Email Sent:', formData.user_email_sent);
      }
      if (formData.error_message) {
        console.log('  ❌ Error:', formData.error_message);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkWebhooks();