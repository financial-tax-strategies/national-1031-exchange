#!/usr/bin/env node

// Comprehensive calendar availability test
// Tries multiple approaches based on reference implementation

import 'dotenv/config';

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!API_KEY || !CALENDAR_ID) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🔍 Comprehensive Calendar Availability Test');
console.log('Calendar ID:', CALENDAR_ID);
console.log('');

async function testApproach(name, url, description) {
  console.log(`\n🧪 ${name}`);
  console.log(`📝 ${description}`);
  console.log(`🌐 URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Version': '2021-07-28',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch {
      console.log('📄 Raw response:', text);
      return;
    }
    
    console.log('📦 Response:', JSON.stringify(data, null, 2));
    
    // Check different possible response structures
    if (data.slots) {
      console.log(`✅ Found ${data.slots.length} slots in 'slots' field`);
    } else if (data.data && data.data.slots) {
      console.log(`✅ Found ${data.data.slots.length} slots in 'data.slots' field`);
    } else if (data.availability) {
      console.log(`✅ Found availability data in 'availability' field`);
    } else if (Array.isArray(data)) {
      console.log(`✅ Response is an array with ${data.length} items`);
    } else {
      console.log('⚠️  No recognized slot structure found');
      console.log('Response keys:', Object.keys(data));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const endDate = new Date(tomorrow);
  endDate.setDate(endDate.getDate() + 7); // 7 days from tomorrow
  
  // Test 1: Millisecond timestamps (like reference implementation)
  const msStart = tomorrow.getTime();
  const msEnd = endDate.getTime();
  await testApproach(
    'Test 1: Millisecond Timestamps',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${msStart}&endDate=${msEnd}`,
    'Using millisecond timestamps like the reference implementation'
  );
  
  // Test 2: Second timestamps (HighLevel docs mention seconds)
  const secStart = Math.floor(msStart / 1000);
  const secEnd = Math.floor(msEnd / 1000);
  await testApproach(
    'Test 2: Second Timestamps',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${secStart}&endDate=${secEnd}`,
    'Using second timestamps as some docs suggest'
  );
  
  // Test 3: ISO date strings
  const isoStart = tomorrow.toISOString();
  const isoEnd = endDate.toISOString();
  await testApproach(
    'Test 3: ISO Date Strings',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${isoStart}&endDate=${isoEnd}`,
    'Using ISO date strings'
  );
  
  // Test 4: YYYY-MM-DD format
  const dateStart = tomorrow.toISOString().split('T')[0];
  const dateEnd = endDate.toISOString().split('T')[0];
  await testApproach(
    'Test 4: YYYY-MM-DD Format',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${dateStart}&endDate=${dateEnd}`,
    'Using YYYY-MM-DD date format'
  );
  
  // Test 5: With timezone parameter
  await testApproach(
    'Test 5: With Timezone',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${msStart}&endDate=${msEnd}&timezone=America/New_York`,
    'Adding timezone parameter'
  );
  
  // Test 6: Alternative endpoint structure
  await testApproach(
    'Test 6: Alternative Endpoint',
    `${BASE_URL}/locations/${LOCATION_ID}/calendars/${CALENDAR_ID}/free-slots?startDate=${msStart}&endDate=${msEnd}`,
    'Using location-based endpoint'
  );
  
  // Test 7: Without any parameters (to see default behavior)
  await testApproach(
    'Test 7: No Parameters',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots`,
    'No date parameters to see default response'
  );
  
  // Test 8: Single date parameter
  await testApproach(
    'Test 8: Single Date',
    `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?date=${dateStart}`,
    'Using single date parameter instead of range'
  );
}

console.log('🚀 Running comprehensive calendar tests...\n');
runTests();