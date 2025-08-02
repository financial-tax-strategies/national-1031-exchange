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

if (!API_KEY || !LOCATION_ID || !CALENDAR_ID) {
  console.error('❌ Missing HighLevel environment variables');
  process.exit(1);
}

console.log('🔧 Testing HighLevel API v2\n');
console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
console.log(`Location ID: ${LOCATION_ID}`);
console.log(`Calendar ID: ${CALENDAR_ID}\n`);

async function testAPI() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  // Test 1: Create Contact
  console.log('1️⃣ Testing Contact Creation...\n');
  
  const contactData = {
    email: `test-${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    phone: '555-123-4567',
    locationId: LOCATION_ID,
    tags: ['api-test'],
    customFields: [
      { key: 'source', value: 'api-test' }
    ]
  };

  try {
    const response = await fetch(`${baseUrl}/api/v2/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Contact creation failed: ${response.status}`);
      console.log('Error:', JSON.stringify(data, null, 2));
    } else {
      console.log('✅ Contact created successfully!');
      console.log(`Contact ID: ${data.contact?.id || data.id}`);
    }
  } catch (error) {
    console.log(`❌ Contact creation error: ${error.message}`);
  }

  // Test 2: Get Calendar Slots
  console.log('\n2️⃣ Testing Calendar Availability...\n');
  
  const today = new Date().toISOString().split('T')[0];
  const calendarUrl = `${baseUrl}/api/v2/calendars/events/slots?calendarId=${CALENDAR_ID}&startDate=${today}&endDate=${today}&timezone=America/New_York`;
  
  console.log(`URL: ${calendarUrl}\n`);
  
  try {
    const response = await fetch(calendarUrl, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Calendar request failed: ${response.status}`);
      console.log('Error:', JSON.stringify(data, null, 2));
      
      // Try alternative endpoints
      console.log('\n3️⃣ Trying alternative calendar endpoints...\n');
      
      // Try with location in path
      const altUrl1 = `${baseUrl}/api/v2/locations/${LOCATION_ID}/calendars/${CALENDAR_ID}/free-slots?startDate=${today}&endDate=${today}`;
      console.log(`Trying: ${altUrl1}`);
      
      const altResponse1 = await fetch(altUrl1, { method: 'GET', headers });
      if (altResponse1.ok) {
        console.log('✅ Alternative endpoint 1 worked!');
      } else {
        console.log(`❌ Alternative 1 failed: ${altResponse1.status}`);
      }
      
      // Try v1 style endpoint
      const altUrl2 = `${baseUrl}/api/v2/calendars/${CALENDAR_ID}/free-slots?startDate=${today}&endDate=${today}`;
      console.log(`\nTrying: ${altUrl2}`);
      
      const altResponse2 = await fetch(altUrl2, { method: 'GET', headers });
      if (altResponse2.ok) {
        console.log('✅ Alternative endpoint 2 worked!');
      } else {
        console.log(`❌ Alternative 2 failed: ${altResponse2.status}`);
      }
      
      // Try appointments endpoint
      const altUrl3 = `${baseUrl}/api/v2/appointments/slots?calendarId=${CALENDAR_ID}&startDate=${today}&endDate=${today}&locationId=${LOCATION_ID}`;
      console.log(`\nTrying: ${altUrl3}`);
      
      const altResponse3 = await fetch(altUrl3, { method: 'GET', headers });
      if (altResponse3.ok) {
        console.log('✅ Alternative endpoint 3 (appointments) worked!');
        const data3 = await altResponse3.json();
        console.log(`Slots found: ${JSON.stringify(data3, null, 2)}`);
      } else {
        console.log(`❌ Alternative 3 failed: ${altResponse3.status}`);
      }
    } else {
      console.log('✅ Calendar request successful!');
      console.log(`Available slots: ${data.slots?.length || 0}`);
    }
  } catch (error) {
    console.log(`❌ Calendar request error: ${error.message}`);
  }

  // Test 3: Get Location Info
  console.log('\n4️⃣ Testing Location Access...\n');
  
  try {
    const response = await fetch(`${baseUrl}/api/v2/locations/${LOCATION_ID}`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Location request failed: ${response.status}`);
      console.log('Error:', JSON.stringify(data, null, 2));
    } else {
      console.log('✅ Location access successful!');
      console.log(`Location Name: ${data.location?.name || data.name}`);
    }
  } catch (error) {
    console.log(`❌ Location request error: ${error.message}`);
  }
}

testAPI();