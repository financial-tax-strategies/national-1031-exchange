#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Environment variables
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test results collector
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(name, passed, details = '') {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}`);
  }
  if (details) console.log(`   ${details}`);
}

// HighLevel API helper
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

console.log('🧪 HighLevel Integration Comprehensive Test Suite\n');
console.log('Environment Configuration:');
console.log(`- API Key: ${API_KEY?.substring(0, 20)}...`);
console.log(`- Location ID: ${LOCATION_ID}`);
console.log(`- Calendar ID: ${CALENDAR_ID}`);
console.log(`- Supabase URL: ${SUPABASE_URL}\n`);

// Test 1: Environment Variables
async function testEnvironmentVariables() {
  console.log('\n1️⃣ Testing Environment Variables...\n');
  
  logTest('API Key exists', !!API_KEY);
  logTest('Location ID exists', !!LOCATION_ID);
  logTest('Calendar ID exists', !!CALENDAR_ID);
  logTest('Supabase URL exists', !!SUPABASE_URL);
  logTest('Supabase Anon Key exists', !!SUPABASE_ANON_KEY);
}

// Test 2: Database Configuration
async function testDatabaseConfig() {
  console.log('\n2️⃣ Testing Database Configuration...\n');
  
  try {
    const { data: config, error } = await supabase
      .from('highlevel_config')
      .select('*')
      .eq('is_active', true)
      .single();

    logTest('Database config exists', !error && !!config);
    
    if (config) {
      logTest('Config API key matches ENV', 
        config.api_key === API_KEY,
        config.api_key === API_KEY ? 'Keys match' : 'Keys do not match!'
      );
      logTest('Config location ID matches ENV', 
        config.location_id === LOCATION_ID,
        config.location_id === LOCATION_ID ? 'IDs match' : 'IDs do not match!'
      );
      logTest('Config calendar ID matches ENV', 
        config.calendar_id === CALENDAR_ID,
        config.calendar_id === CALENDAR_ID ? 'IDs match' : 'IDs do not match!'
      );
    }
  } catch (error) {
    logTest('Database config query', false, error.message);
  }
}

// Test 3: API Authentication
async function testAPIAuthentication() {
  console.log('\n3️⃣ Testing API Authentication...\n');
  
  try {
    const response = await makeHighLevelRequest(`/locations/${LOCATION_ID}`, {
      method: 'GET'
    });
    logTest('API authentication', true, `Location accessible`);
  } catch (error) {
    logTest('API authentication', false, error.message);
  }

  // Test without Version header
  try {
    const baseUrl = 'https://services.leadconnectorhq.com';
    const response = await fetch(`${baseUrl}/locations/${LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    logTest('Version header required', response.status === 401, 
      'API correctly rejects requests without Version header');
  } catch (error) {
    logTest('Version header test', false, error.message);
  }
}

// Test 4: Contact Creation
async function testContactCreation() {
  console.log('\n4️⃣ Testing Contact Creation...\n');
  
  const timestamp = Date.now();
  const testEmail = `test-comprehensive-${timestamp}@example.com`;
  
  // Test minimal contact
  try {
    const response = await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: testEmail
      })
    });
    logTest('Minimal contact creation', true, `Contact ID: ${response.contact?.id}`);
  } catch (error) {
    logTest('Minimal contact creation', false, error.message);
  }

  // Test contact with all fields
  const fullEmail = `test-full-${timestamp}@example.com`;
  try {
    const response = await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: fullEmail,
        firstName: 'Test',
        lastName: 'User',
        phone: `+1555${timestamp.toString().slice(-7)}`, // Unique phone
        tags: ['test-suite'],
        customFields: [
          { key: 'source', value: 'comprehensive-test' },
          { key: 'timestamp', value: timestamp.toString() }
        ]
      })
    });
    logTest('Full contact creation', true, `Contact ID: ${response.contact?.id}`);
  } catch (error) {
    logTest('Full contact creation', false, error.message);
  }

  // Test duplicate email handling
  try {
    await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: testEmail // Same email as before
      })
    });
    logTest('Duplicate email rejection', false, 'Duplicate was allowed (unexpected)');
  } catch (error) {
    logTest('Duplicate email rejection', 
      error.message.includes('duplicated contacts'),
      'Duplicates properly rejected'
    );
  }
}

// Test 5: Contact Search and Update
async function testContactSearchUpdate() {
  console.log('\n5️⃣ Testing Contact Search & Update...\n');
  
  const timestamp = Date.now();
  const testEmail = `test-search-${timestamp}@example.com`;
  
  // First create a contact
  let contactId;
  try {
    const createResponse = await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: testEmail,
        firstName: 'Search',
        lastName: 'Test'
      })
    });
    contactId = createResponse.contact?.id;
    logTest('Contact created for search test', true, `Contact ID: ${contactId}`);
  } catch (error) {
    logTest('Contact created for search test', false, error.message);
    return;
  }

  // Search for contact
  try {
    const searchResponse = await makeHighLevelRequest(
      `/contacts/lookup?email=${encodeURIComponent(testEmail)}`,
      { method: 'GET' }
    );
    logTest('Contact search', 
      searchResponse.contacts && searchResponse.contacts.length > 0,
      `Found ${searchResponse.contacts?.length || 0} contact(s)`
    );
  } catch (error) {
    logTest('Contact search', false, error.message);
  }

  // Update contact
  if (contactId) {
    try {
      await makeHighLevelRequest(`/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify({
          firstName: 'Updated',
          tags: ['updated-test']
        })
      });
      logTest('Contact update', true, 'Contact updated successfully');
    } catch (error) {
      logTest('Contact update', false, error.message);
    }
  }
}

// Test 6: Calendar Availability
async function testCalendarAvailability() {
  console.log('\n6️⃣ Testing Calendar Availability...\n');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Test with Unix timestamps (seconds)
  const startTimestamp = Math.floor(today.getTime() / 1000);
  const endTimestamp = Math.floor(tomorrow.getTime() / 1000);
  
  try {
    const response = await makeHighLevelRequest(
      `/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`,
      { method: 'GET' }
    );
    logTest('Calendar availability request', true, 
      `Response received with ${Object.keys(response.slots || {}).length} dates`
    );
  } catch (error) {
    logTest('Calendar availability request', false, error.message);
  }
}

// Test 7: Integration Logging
async function testIntegrationLogging() {
  console.log('\n7️⃣ Testing Integration Logging...\n');
  
  try {
    const { error } = await supabase
      .from('highlevel_integrations')
      .insert({
        integration_type: 'test_comprehensive',
        payload_sent: { test: true },
        response_received: { success: true },
        success: true,
        highlevel_entity_id: 'test-entity-123'
      });
    
    logTest('Integration logging', !error, error?.message || 'Log created successfully');
  } catch (error) {
    logTest('Integration logging', false, error.message);
  }
}

// Test 8: Common Issues
async function testCommonIssues() {
  console.log('\n8️⃣ Testing Common Issues...\n');
  
  // Test wrong customField format
  try {
    await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: `wrong-field-${Date.now()}@example.com`,
        customField: { test: 'value' } // Wrong - should be customFields
      })
    });
    logTest('Wrong customField format rejection', false, 'Wrong format was accepted');
  } catch (error) {
    logTest('Wrong customField format rejection', 
      error.message.includes('customField'),
      'Wrong format properly rejected'
    );
  }

  // Test common test phone number
  try {
    await makeHighLevelRequest('/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: `common-phone-${Date.now()}@example.com`,
        phone: '+15551234567' // Common test number
      })
    });
    logTest('Common test phone rejection', false, 'Common phone was accepted');
  } catch (error) {
    logTest('Common test phone rejection', 
      error.message.includes('duplicated contacts'),
      'Common test phone properly rejected'
    );
  }
}

// Run all tests
async function runAllTests() {
  const startTime = Date.now();
  
  await testEnvironmentVariables();
  await testDatabaseConfig();
  await testAPIAuthentication();
  await testContactCreation();
  await testContactSearchUpdate();
  await testCalendarAvailability();
  await testIntegrationLogging();
  await testCommonIssues();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n📊 Test Results Summary\n');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Duration: ${duration}s`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`   - ${t.name}: ${t.details}`));
  }
  
  console.log('\n✨ Comprehensive test suite complete!');
  process.exit(testResults.failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});