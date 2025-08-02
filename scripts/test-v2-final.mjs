#!/usr/bin/env node
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;

console.log('🔍 Testing HighLevel V2 API with corrected configuration\n');
console.log(`API Key: ${API_KEY?.substring(0, 20)}...`);
console.log(`Location ID: ${LOCATION_ID}`);
console.log(`Calendar ID: ${CALENDAR_ID}\n`);

async function testEndpoint(name, url, options) {
  console.log(`\n📍 Testing: ${name}`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${options.method || 'GET'}`);
  
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok && text.length > 0) {
      try {
        const json = JSON.parse(text);
        console.log(`✅ SUCCESS - Valid response received`);
        console.log(`Response preview:`, JSON.stringify(json, null, 2).substring(0, 200) + '...');
        return { success: true, response, json };
      } catch (e) {
        console.log(`❌ Invalid JSON response`);
        console.log(`Raw response:`, text.substring(0, 200));
      }
    } else if (!response.ok) {
      console.log(`❌ Failed - Status ${response.status}`);
      if (text) {
        try {
          const error = JSON.parse(text);
          console.log(`Error message:`, error.message || error.error || text);
        } catch {
          console.log(`Raw error:`, text.substring(0, 200));
        }
      }
    } else {
      console.log(`⚠️ Empty response body`);
    }
    
    return { success: false, response, text };
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return { success: false, error };
  }
}

async function runV2Tests() {
  const baseUrl = 'https://rest.gohighlevel.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  console.log('=== Testing HighLevel V2 API ===');
  console.log(`Base URL: ${baseUrl}\n`);

  // Test 1: Location endpoint
  const locationResult = await testEndpoint(
    'Get Location Details',
    `${baseUrl}/locations/${LOCATION_ID}`,
    { method: 'GET', headers }
  );

  // Test 2: Create contact
  const contactData = {
    locationId: LOCATION_ID,
    email: `test-v2-${Date.now()}@example.com`,
    firstName: 'V2Test',
    lastName: 'User',
    phone: '+15551234567',
    tags: ['v2-api-test'],
    customFields: [
      { key: 'source', value: 'v2-test-script' }
    ]
  };
  
  const contactResult = await testEndpoint(
    'Create Contact',
    `${baseUrl}/contacts/`,
    { 
      method: 'POST', 
      headers,
      body: JSON.stringify(contactData)
    }
  );

  // Test 3: Calendar availability (if contact creation succeeded)
  if (contactResult.success && contactResult.json?.contact?.id) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Try Unix timestamp in seconds
    const startTimestamp = Math.floor(today.getTime() / 1000);
    const endTimestamp = Math.floor(tomorrow.getTime() / 1000);
    
    await testEndpoint(
      'Calendar Availability',
      `${baseUrl}/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`,
      { method: 'GET', headers }
    );

    // Test appointment creation
    const appointmentData = {
      calendarId: CALENDAR_ID,
      contactId: contactResult.json.contact.id,
      startTime: startTimestamp + 3600, // 1 hour from now
      endTime: startTimestamp + 5400,   // 1.5 hours from now
      title: 'V2 API Test Appointment',
      appointmentStatus: 'new'
    };
    
    await testEndpoint(
      'Create Appointment',
      `${baseUrl}/appointments/`,
      { 
        method: 'POST', 
        headers,
        body: JSON.stringify(appointmentData)
      }
    );
  }

  console.log('\n✨ Test complete!');
}

runV2Tests();