#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;

console.log('🔄 Testing Complete Supabase → HighLevel Flow\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simulate the HighLevel service makeRequest method
async function makeHighLevelRequest(endpoint, options) {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28',
    ...options.headers
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HighLevel API error: ${response.status}`);
  }
  
  return data;
}

// Simulate the service's syncContact method
async function syncContact(params) {
  const payload = {
    email: params.email,
    phone: params.phone,
    firstName: params.firstName,
    lastName: params.lastName,
    locationId: LOCATION_ID,
    tags: params.tags || ['1031-exchange-lead'],
    customFields: params.customFields ? 
      Object.entries(params.customFields).map(([key, value]) => ({ key, value: String(value) })) : 
      []
  };

  let contactId;
  let integrationData = {
    lead_id: params.leadId,
    integration_type: 'contact_create',
    payload_sent: payload,
    success: false
  };

  try {
    // Try to create contact
    console.log('   Attempting to create contact...');
    const response = await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    contactId = response.contact.id;
    integrationData.response_received = response;
    integrationData.success = true;
    integrationData.highlevel_entity_id = contactId;
    
    console.log('   ✅ Contact created successfully');
  } catch (error) {
    console.log(`   ❌ Create failed: ${error.message}`);
    
    // If contact exists, try to update
    if (error.message?.includes('duplicated contacts')) {
      console.log('   🔄 Contact exists, attempting update...');
      try {
        // Search for contact by email
        const searchResponse = await makeHighLevelRequest(
          `/contacts/lookup?email=${encodeURIComponent(params.email)}`,
          { method: 'GET' }
        );
        
        if (searchResponse.contacts && searchResponse.contacts.length > 0) {
          contactId = searchResponse.contacts[0].id;
          console.log(`   Found existing contact: ${contactId}`);
          
          // Update existing contact
          const updateResponse = await makeHighLevelRequest(
            `/contacts/${contactId}`,
            {
              method: 'PUT',
              body: JSON.stringify(payload)
            }
          );
          
          integrationData.integration_type = 'contact_update';
          integrationData.response_received = updateResponse;
          integrationData.success = true;
          integrationData.highlevel_entity_id = contactId;
          
          console.log('   ✅ Contact updated successfully');
        } else {
          throw new Error('Contact not found for update');
        }
      } catch (updateError) {
        integrationData.error_message = updateError.message;
        throw updateError;
      }
    } else {
      integrationData.error_message = error.message;
      throw error;
    }
  }

  // Log to highlevel_integrations table
  console.log('   📝 Logging integration attempt...');
  const { error: logError } = await supabase
    .from('highlevel_integrations')
    .insert(integrationData);

  if (logError) {
    console.log('   ⚠️  Failed to log integration:', logError.message);
  } else {
    console.log('   ✅ Integration logged');
  }

  return contactId;
}

async function testServiceFlow() {
  const timestamp = Date.now();
  
  // Test 1: Create new lead in Supabase
  console.log('1️⃣ Creating lead in Supabase...');
  const leadData = {
    email: `service-test-${timestamp}@example.com`,
    first_name: 'Service',
    last_name: 'Test',
    phone: null, // Avoid duplicate phone issues
    lead_source: 'test-script',
    lead_status: 'new',
    lead_score: 50
  };

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single();

  if (leadError) {
    console.log('   ❌ Failed to create lead:', leadError.message);
    return;
  }

  console.log('   ✅ Lead created');
  console.log(`   Lead ID: ${lead.id}`);

  // Test 2: Sync to HighLevel
  console.log('\n2️⃣ Syncing lead to HighLevel...');
  try {
    const contactId = await syncContact({
      leadId: lead.id,
      email: lead.email,
      firstName: lead.first_name,
      lastName: lead.last_name,
      phone: lead.phone,
      tags: ['test-integration', 'service-flow'],
      customFields: {
        lead_source: lead.lead_source,
        lead_score: lead.lead_score
      }
    });

    console.log(`   HighLevel Contact ID: ${contactId}`);

    // Update lead with HighLevel contact ID
    console.log('\n3️⃣ Updating lead with HighLevel contact ID...');
    const { error: updateError } = await supabase
      .from('leads')
      .update({ highlevel_contact_id: contactId })
      .eq('id', lead.id);

    if (updateError) {
      console.log('   ❌ Failed to update lead:', updateError.message);
    } else {
      console.log('   ✅ Lead updated with HighLevel contact ID');
    }
  } catch (error) {
    console.log(`   ❌ Sync failed: ${error.message}`);
  }

  // Test 3: Test with duplicate email
  console.log('\n4️⃣ Testing duplicate email handling...');
  const duplicateLead = {
    email: leadData.email, // Same email
    first_name: 'Duplicate',
    last_name: 'Test',
    lead_source: 'test-duplicate',
    lead_status: 'new',
    lead_score: 75
  };

  const { data: dupLead, error: dupError } = await supabase
    .from('leads')
    .insert(duplicateLead)
    .select()
    .single();

  if (dupError) {
    console.log('   ❌ Failed to create duplicate lead:', dupError.message);
  } else {
    console.log('   ✅ Duplicate lead created');
    
    try {
      await syncContact({
        leadId: dupLead.id,
        email: dupLead.email,
        firstName: dupLead.first_name,
        lastName: dupLead.last_name,
        tags: ['duplicate-test'],
        customFields: {
          lead_source: dupLead.lead_source,
          lead_score: dupLead.lead_score
        }
      });
    } catch (error) {
      console.log(`   ❌ Duplicate sync failed: ${error.message}`);
    }
  }

  // Test 4: Check integration logs
  console.log('\n5️⃣ Checking integration logs...');
  const { data: logs, error: logsError } = await supabase
    .from('highlevel_integrations')
    .select('*')
    .or(`lead_id.eq.${lead.id},lead_id.eq.${dupLead?.id}`)
    .order('created_at', { ascending: false });

  if (logsError) {
    console.log('   ❌ Failed to fetch logs:', logsError.message);
  } else {
    console.log(`   📋 Found ${logs.length} integration log(s):`);
    logs.forEach(log => {
      console.log(`      - ${log.integration_type}: ${log.success ? '✅' : '❌'} ${log.error_message || ''}`);
    });
  }

  // Test 5: Test calendar availability
  console.log('\n6️⃣ Testing calendar availability...');
  try {
    const today = new Date();
    const startTimestamp = Math.floor(today.getTime() / 1000);
    const endTimestamp = startTimestamp + 86400;
    
    const response = await makeHighLevelRequest(
      `/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`,
      { method: 'GET' }
    );
    
    console.log('   ✅ Calendar request successful');
    console.log(`   Available slots: ${response.slots ? Object.keys(response.slots).length : 0}`);
  } catch (error) {
    console.log(`   ❌ Calendar request failed: ${error.message}`);
  }
}

// Run test
testServiceFlow().then(() => {
  console.log('\n✨ Service flow test complete!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});