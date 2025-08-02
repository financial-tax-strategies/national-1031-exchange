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

console.log('🔍 Testing exact HighLevel API formats\n');

async function testCalendarFormats() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  console.log('📅 Testing Calendar Date Formats...\n');
  
  // Test 1: Unix timestamp in seconds
  const timestampSeconds = Math.floor(today.getTime() / 1000);
  const endTimestampSeconds = Math.floor(tomorrow.getTime() / 1000);
  
  console.log('Test 1: Unix timestamp in seconds');
  console.log(`startDate: ${timestampSeconds}`);
  console.log(`endDate: ${endTimestampSeconds}`);
  
  try {
    const url1 = `${baseUrl}/api/v2/calendars/${CALENDAR_ID}/free-slots?startDate=${timestampSeconds}&endDate=${endTimestampSeconds}`;
    const response1 = await fetch(url1, { method: 'GET', headers });
    const data1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ SECONDS FORMAT WORKS!');
      console.log('Response:', JSON.stringify(data1, null, 2));
    } else {
      console.log(`❌ Seconds format failed: ${response1.status}`);
      console.log('Error:', data1.message);
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Test 2: Unix timestamp in milliseconds
  const timestampMs = today.getTime();
  const endTimestampMs = tomorrow.getTime();
  
  console.log('Test 2: Unix timestamp in milliseconds');
  console.log(`startDate: ${timestampMs}`);
  console.log(`endDate: ${endTimestampMs}`);
  
  try {
    const url2 = `${baseUrl}/api/v2/calendars/${CALENDAR_ID}/free-slots?startDate=${timestampMs}&endDate=${endTimestampMs}`;
    const response2 = await fetch(url2, { method: 'GET', headers });
    const data2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ MILLISECONDS FORMAT WORKS!');
      console.log('Response:', JSON.stringify(data2, null, 2));
    } else {
      console.log(`❌ Milliseconds format failed: ${response2.status}`);
      console.log('Error:', data2.message);
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Test 3: ISO date string
  const isoDate = today.toISOString().split('T')[0];
  const endIsoDate = tomorrow.toISOString().split('T')[0];
  
  console.log('Test 3: ISO date string (current implementation)');
  console.log(`startDate: ${isoDate}`);
  console.log(`endDate: ${endIsoDate}`);
  
  try {
    const url3 = `${baseUrl}/api/v2/calendars/${CALENDAR_ID}/free-slots?startDate=${isoDate}&endDate=${endIsoDate}`;
    const response3 = await fetch(url3, { method: 'GET', headers });
    const data3 = await response3.json();
    
    if (response3.ok) {
      console.log('✅ ISO DATE FORMAT WORKS!');
      console.log('Response:', JSON.stringify(data3, null, 2));
    } else {
      console.log(`❌ ISO date format failed: ${response3.status}`);
      console.log('Error:', data3.message);
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

async function testContactCreation() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };
  
  console.log('\n\n👤 Testing Contact Creation...\n');
  
  // Test with minimal required fields
  const minimalContact = {
    locationId: LOCATION_ID,
    email: `test-minimal-${Date.now()}@example.com`
  };
  
  console.log('Test 1: Minimal contact (just email + locationId)');
  console.log('Payload:', JSON.stringify(minimalContact, null, 2));
  
  try {
    const response1 = await fetch(`${baseUrl}/api/v2/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(minimalContact)
    });
    
    const data1 = await response1.json();
    
    if (response1.ok) {
      console.log('✅ MINIMAL CONTACT WORKS!');
      console.log('Contact ID:', data1.contact?.id || data1.id);
    } else {
      console.log(`❌ Failed: ${response1.status}`);
      console.log('Error:', JSON.stringify(data1, null, 2));
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Test with all fields
  const fullContact = {
    locationId: LOCATION_ID,
    email: `test-full-${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    phone: '+15551234567',
    tags: ['api-test'],
    customFields: [
      { id: 'source', value: 'api-test' }
    ]
  };
  
  console.log('Test 2: Full contact with all fields');
  console.log('Payload:', JSON.stringify(fullContact, null, 2));
  
  try {
    const response2 = await fetch(`${baseUrl}/api/v2/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(fullContact)
    });
    
    const data2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ FULL CONTACT WORKS!');
      console.log('Contact ID:', data2.contact?.id || data2.id);
    } else {
      console.log(`❌ Failed: ${response2.status}`);
      console.log('Error:', JSON.stringify(data2, null, 2));
      
      // If customFields failed, try with key/value format
      if (data2.message?.includes('customField')) {
        console.log('\nTrying alternate customFields format...');
        fullContact.customFields = [
          { key: 'source', value: 'api-test' }
        ];
        
        const response3 = await fetch(`${baseUrl}/api/v2/contacts/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...fullContact,
            email: `test-alt-${Date.now()}@example.com`
          })
        });
        
        const data3 = await response3.json();
        
        if (response3.ok) {
          console.log('✅ ALTERNATE CUSTOMFIELDS FORMAT WORKS!');
          console.log('Contact ID:', data3.contact?.id || data3.id);
        } else {
          console.log(`❌ Alternate also failed: ${response3.status}`);
          console.log('Error:', JSON.stringify(data3, null, 2));
        }
      }
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

async function runTests() {
  await testCalendarFormats();
  await testContactCreation();
}

runTests();