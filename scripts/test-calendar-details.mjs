#!/usr/bin/env node

// Test HighLevel calendar configuration
// Lists calendars and checks their setup

import 'dotenv/config';

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;
const CALENDAR_ID = process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!API_KEY || !LOCATION_ID || !CALENDAR_ID) {
  console.error('❌ Missing required environment variables');
  console.error('Required: PUBLIC_HIGHLEVEL_API_KEY, PUBLIC_HIGHLEVEL_LOCATION_ID, PUBLIC_HIGHLEVEL_CALENDAR_ID');
  process.exit(1);
}

console.log('🔍 Testing HighLevel Calendar Configuration');
console.log('Location ID:', LOCATION_ID);
console.log('Calendar ID:', CALENDAR_ID);
console.log('');

async function testCalendarConfiguration() {
  try {
    // Step 1: List all calendars for the location
    console.log('1️⃣ Listing all calendars for location...\n');
    
    const calendarsUrl = `${BASE_URL}/calendars/?locationId=${LOCATION_ID}`;
    console.log('API URL:', calendarsUrl);
    
    const calendarsResponse = await fetch(calendarsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response Status:', calendarsResponse.status, calendarsResponse.statusText);
    
    if (!calendarsResponse.ok) {
      const errorText = await calendarsResponse.text();
      console.error('❌ Failed to list calendars:', errorText);
      return;
    }
    
    const calendarsData = await calendarsResponse.json();
    console.log('\n📋 Calendars found:', calendarsData.calendars?.length || 0);
    
    if (calendarsData.calendars && calendarsData.calendars.length > 0) {
      calendarsData.calendars.forEach((cal, i) => {
        console.log(`\n${i + 1}. ${cal.name}`);
        console.log(`   ID: ${cal.id}`);
        console.log(`   Type: ${cal.calendarType || 'N/A'}`);
        console.log(`   Active: ${cal.isActive || 'N/A'}`);
        console.log(`   Team Members: ${cal.teamMembers?.length || 0}`);
        
        if (cal.id === CALENDAR_ID) {
          console.log('   ✅ This is the configured calendar');
        }
      });
    }
    
    // Step 2: Get specific calendar details
    console.log('\n\n2️⃣ Getting details for configured calendar...\n');
    
    const calendarDetailsUrl = `${BASE_URL}/calendars/${CALENDAR_ID}`;
    console.log('API URL:', calendarDetailsUrl);
    
    const detailsResponse = await fetch(calendarDetailsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response Status:', detailsResponse.status, detailsResponse.statusText);
    
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error('❌ Failed to get calendar details:', errorText);
      
      // Try alternative endpoints
      console.log('\n3️⃣ Trying alternative calendar endpoint...\n');
      
      const altUrl = `${BASE_URL}/locations/${LOCATION_ID}/calendars/${CALENDAR_ID}`;
      console.log('Alternative URL:', altUrl);
      
      const altResponse = await fetch(altUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      });
      
      console.log('Alternative Response Status:', altResponse.status);
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        console.log('Alternative response:', JSON.stringify(altData, null, 2));
      } else {
        console.log('Alternative endpoint also failed');
      }
    } else {
      const calendarDetails = await detailsResponse.json();
      console.log('\n📅 Calendar Details:');
      console.log(JSON.stringify(calendarDetails, null, 2));
      
      // Check for availability configuration
      console.log('\n🔍 Availability Configuration Check:');
      console.log('Working Hours:', calendarDetails.workingHours ? 'Configured' : 'NOT CONFIGURED');
      console.log('Appointment Duration:', calendarDetails.slotDuration || 'NOT SET');
      console.log('Buffer Time:', calendarDetails.slotBuffer || 'NOT SET');
      console.log('Active:', calendarDetails.isActive || false);
      
      if (calendarDetails.workingHours) {
        console.log('\nWorking Hours Details:');
        Object.entries(calendarDetails.workingHours).forEach(([day, hours]) => {
          console.log(`  ${day}:`, hours);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run the test
console.log('🚀 Starting calendar configuration test...\n');
testCalendarConfiguration();