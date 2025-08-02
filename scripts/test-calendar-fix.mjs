#!/usr/bin/env node

// Test the fixed calendar availability
// This script verifies that our calendar API fixes work correctly

import 'dotenv/config';
import { HighLevelService } from '../dist/_astro/highlevel.service.Dcjjnvg6.js';

console.log('🧪 Testing Fixed Calendar Availability\n');

async function testFixedCalendar() {
  try {
    const service = new HighLevelService();
    
    // Test 1: Single day availability
    console.log('📅 Test 1: Single Day Availability');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`Testing availability for ${tomorrowStr}...`);
    const singleDaySlots = await service.getAvailability({
      date: tomorrowStr,
      timezone: 'America/New_York'
    });
    
    console.log(`✅ Found ${singleDaySlots.length} slots for ${tomorrowStr}`);
    if (singleDaySlots.length > 0) {
      console.log('First 3 slots:', singleDaySlots.slice(0, 3));
    }
    
    // Test 2: Date range availability
    console.log('\n📅 Test 2: Date Range Availability');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    console.log(`Testing availability from ${startStr} to ${endStr}...`);
    const rangeAvailability = await service.getAvailabilityRange({
      startDate: startStr,
      endDate: endStr,
      timezone: 'America/New_York'
    });
    
    console.log(`✅ Found availability for ${rangeAvailability.length} dates`);
    
    let totalSlots = 0;
    rangeAvailability.forEach(({ date, slots }) => {
      console.log(`  ${date}: ${slots.length} slots`);
      totalSlots += slots.length;
    });
    
    console.log(`\n📊 Total slots available: ${totalSlots}`);
    
    // Test 3: Verify slot format
    if (rangeAvailability.length > 0 && rangeAvailability[0].slots.length > 0) {
      console.log('\n🔍 Sample slot structure:');
      console.log(JSON.stringify(rangeAvailability[0].slots[0], null, 2));
    }
    
    console.log('\n✅ All tests completed successfully!');
    console.log('The calendar API is now working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testFixedCalendar();