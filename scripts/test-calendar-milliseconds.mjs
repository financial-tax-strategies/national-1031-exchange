#!/usr/bin/env node

// Test calendar availability with MILLISECOND timestamps
// Based on the working reference implementation

import 'dotenv/config';

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!API_KEY || !CALENDAR_ID) {
  console.error('❌ Missing required environment variables');
  console.error('Required: PUBLIC_HIGHLEVEL_API_KEY, PUBLIC_HIGHLEVEL_CALENDAR_ID');
  process.exit(1);
}

console.log('🔍 Testing HighLevel Calendar Availability with MILLISECOND timestamps');
console.log('Calendar ID:', CALENDAR_ID);
console.log('');

async function testWithMilliseconds() {
  try {
    // Test date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Start of day
    
    const endDate = new Date(tomorrow);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    // Use MILLISECONDS (not seconds!)
    const startTimestamp = tomorrow.getTime();
    const endTimestamp = endDate.getTime();
    
    console.log('📅 Test Date:', tomorrow.toISOString().split('T')[0]);
    console.log('Start Timestamp (ms):', startTimestamp, '(' + new Date(startTimestamp).toISOString() + ')');
    console.log('End Timestamp (ms):', endTimestamp, '(' + new Date(endTimestamp).toISOString() + ')');
    console.log('');
    
    const url = `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`;
    console.log('🌐 API URL:', url);
    console.log('');
    
    console.log('⏳ Fetching availability with MILLISECOND timestamps...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('');
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      return;
    }
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    if (data.slots && Array.isArray(data.slots)) {
      console.log(`📋 Found ${data.slots.length} available slots`);
      
      if (data.slots.length > 0) {
        console.log('\n🕐 First 5 slots:');
        data.slots.slice(0, 5).forEach((slot, i) => {
          console.log(`${i + 1}. ${new Date(slot.time || slot.slot).toLocaleString()}`);
        });
      }
    } else {
      console.log('⚠️  No slots array in response');
      console.log('Response structure:', Object.keys(data));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run the test
console.log('🚀 Testing with MILLISECOND timestamps (like the working reference)...\n');
testWithMilliseconds();