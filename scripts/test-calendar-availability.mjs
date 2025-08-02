#!/usr/bin/env node

// Test calendar availability endpoint
// Usage: node scripts/test-calendar-availability.mjs

import 'dotenv/config';

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!API_KEY || !CALENDAR_ID) {
  console.error('❌ Missing required environment variables');
  console.error('Required: PUBLIC_HIGHLEVEL_API_KEY, PUBLIC_HIGHLEVEL_CALENDAR_ID');
  process.exit(1);
}

console.log('🔍 Testing HighLevel Calendar Availability');
console.log('Calendar ID:', CALENDAR_ID);
console.log('');

async function testCalendarAvailability() {
  try {
    // Test date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Convert to Unix timestamps (HighLevel requirement)
    const startTimestamp = Math.floor(tomorrow.getTime() / 1000);
    const endTimestamp = startTimestamp + 86400; // Add 24 hours
    
    console.log('📅 Test Date:', tomorrow.toISOString().split('T')[0]);
    console.log('Start Timestamp:', startTimestamp, '(' + new Date(startTimestamp * 1000).toISOString() + ')');
    console.log('End Timestamp:', endTimestamp, '(' + new Date(endTimestamp * 1000).toISOString() + ')');
    console.log('');
    
    const url = `${BASE_URL}/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}`;
    console.log('🌐 API URL:', url);
    console.log('');
    
    console.log('⏳ Fetching availability...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
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
          console.log(`${i + 1}. ${new Date(slot.time).toLocaleString()} - Duration: ${slot.duration}min`);
        });
      }
    } else {
      console.log('⚠️  No slots found in response');
      console.log('Full response:', data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run the test
console.log('🚀 Starting calendar availability test...\n');
testCalendarAvailability();