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

async function checkRecentOrders() {
  console.log('🔍 Checking for recent order submissions...');
  console.log('=====================================');
  
  try {
    // Get orders from the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data, error } = await client
      .from('order_form_submissions')
      .select('*')
      .gte('created_at', thirtyMinutesAgo)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching orders:', error.message);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('📭 No orders found in the last 30 minutes');
      return;
    }
    
    console.log(`✅ Found ${data.length} recent order(s):\n`);
    
    data.forEach((order, index) => {
      const formData = order.form_data || {};
      console.log(`Order ${index + 1}:`);
      console.log('  ID:', order.id);
      console.log('  Created:', new Date(order.created_at).toLocaleString());
      console.log('  Name:', formData['1031x_order_first_name'], formData['1031x_order_last_name']);
      console.log('  Email:', formData['1031x_order_email']);
      console.log('  Phone:', formData['1031x_order_phone']);
      console.log('  Status:', order.completion_status);
      console.log('  Lead ID:', order.lead_id || 'None (nullable)');
      console.log('---');
    });
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkRecentOrders();