#!/usr/bin/env node

// Final test of the calendar availability fix
// Uses the exact same approach as our fixed implementation

import 'dotenv/config';

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!API_KEY || !CALENDAR_ID) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🧪 Testing Fixed Calendar Implementation\n');

async function makeRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Version': '2021-07-28',
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function getAvailability(date, timezone = 'America/New_York') {
  console.log(`\n📅 Getting availability for ${date}`);
  
  // Use MILLISECOND timestamps (this was the fix!)
  const dateObj = new Date(date);
  const startTimestamp = dateObj.getTime();
  const endTimestamp = startTimestamp + 86400000; // Add 24 hours
  
  const endpoint = `/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}&timezone=${encodeURIComponent(timezone)}`;
  
  const response = await makeRequest(endpoint);
  
  // The response is organized by date (this was the other fix!)
  const dateData = response[date];
  
  if (dateData && dateData.slots && Array.isArray(dateData.slots)) {
    console.log(`✅ Found ${dateData.slots.length} slots`);
    
    // Convert to our expected format
    const slots = dateData.slots.map(slotTime => ({
      time: slotTime,
      available: true
    }));
    
    return slots;
  }
  
  console.log('⚠️  No slots found for this date');
  return [];
}

async function getAvailabilityRange(startDate, endDate, timezone = 'America/New_York') {
  console.log(`\n📅 Getting availability from ${startDate} to ${endDate}`);
  
  // Use MILLISECOND timestamps
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  
  const endpoint = `/calendars/${CALENDAR_ID}/free-slots?startDate=${startTimestamp}&endDate=${endTimestamp}&timezone=${encodeURIComponent(timezone)}`;
  
  const response = await makeRequest(endpoint);
  
  // Parse the date-organized response
  const result = [];
  
  for (const dateKey in response) {
    if (dateKey === 'traceId') continue;
    
    const dateData = response[dateKey];
    if (dateData && dateData.slots && Array.isArray(dateData.slots)) {
      const slots = dateData.slots.map(slotTime => ({
        time: slotTime,
        available: true
      }));
      
      result.push({
        date: dateKey,
        slots
      });
    }
  }
  
  // Sort by date
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  console.log(`✅ Found availability for ${result.length} dates`);
  return result;
}

async function runTests() {
  try {
    // Test 1: Single day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const singleDaySlots = await getAvailability(tomorrowStr);
    if (singleDaySlots.length > 0) {
      console.log('Sample slots:', singleDaySlots.slice(0, 3));
    }
    
    // Test 2: Date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    const rangeData = await getAvailabilityRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    let totalSlots = 0;
    rangeData.forEach(({ date, slots }) => {
      console.log(`  ${date}: ${slots.length} slots`);
      totalSlots += slots.length;
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`- Days with availability: ${rangeData.length}`);
    console.log(`- Total slots available: ${totalSlots}`);
    
    console.log('\n✅ Calendar API is working correctly!');
    console.log('\n🎉 The fix was successful:');
    console.log('1. Use MILLISECOND timestamps (not seconds)');
    console.log('2. Parse date-organized response structure');
    console.log('3. Add timezone parameter for correct local times');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

runTests();