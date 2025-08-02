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

console.log('📱 Testing Phone Number Duplicate Issue\n');

const baseUrl = 'https://services.leadconnectorhq.com';
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'Version': '2021-07-28'
};

async function createContact(contactData) {
  const response = await fetch(`${baseUrl}/contacts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId: LOCATION_ID,
      ...contactData
    })
  });

  const data = await response.json();
  return { response, data };
}

async function testPhoneDuplicates() {
  const timestamp = Date.now();
  
  // Test 1: Create contact with unique phone
  console.log('1️⃣ Creating contact with unique phone number...');
  const uniquePhone = `+1555${timestamp.toString().slice(-7)}`;
  const { response: r1, data: d1 } = await createContact({
    email: `unique-phone-${timestamp}@example.com`,
    firstName: 'Unique',
    lastName: 'Phone',
    phone: uniquePhone
  });

  console.log(`   Phone: ${uniquePhone}`);
  console.log(`   Result: ${r1.ok ? '✅ Success' : '❌ Failed'}`);
  if (!r1.ok) {
    console.log(`   Error: ${d1.message}`);
  } else {
    console.log(`   Contact ID: ${d1.contact?.id || d1.id}`);
  }

  // Test 2: Create contact without phone
  console.log('\n2️⃣ Creating contact without phone number...');
  const { response: r2, data: d2 } = await createContact({
    email: `no-phone-${timestamp}@example.com`,
    firstName: 'No',
    lastName: 'Phone'
  });

  console.log(`   Result: ${r2.ok ? '✅ Success' : '❌ Failed'}`);
  if (!r2.ok) {
    console.log(`   Error: ${d2.message}`);
  } else {
    console.log(`   Contact ID: ${d2.contact?.id || d2.id}`);
  }

  // Test 3: Create another contact without phone (should work)
  console.log('\n3️⃣ Creating another contact without phone...');
  const { response: r3, data: d3 } = await createContact({
    email: `no-phone-2-${timestamp}@example.com`,
    firstName: 'Also No',
    lastName: 'Phone'
  });

  console.log(`   Result: ${r3.ok ? '✅ Success' : '❌ Failed'}`);
  if (!r3.ok) {
    console.log(`   Error: ${d3.message}`);
  } else {
    console.log(`   Contact ID: ${d3.contact?.id || d3.id}`);
  }

  // Test 4: Try the common phone number that's causing issues
  console.log('\n4️⃣ Testing with common test phone number...');
  const commonPhones = ['+15551234567', '555-123-4567', '5551234567'];
  
  for (const phone of commonPhones) {
    console.log(`\n   Testing phone: ${phone}`);
    const { response, data } = await createContact({
      email: `test-common-${timestamp}-${Math.random().toString(36).slice(2)}@example.com`,
      firstName: 'Test',
      lastName: 'Common',
      phone: phone
    });
    
    console.log(`   Result: ${response.ok ? '✅ Success' : '❌ Failed'}`);
    if (!response.ok && data.message?.includes('duplicated')) {
      console.log(`   Duplicate detected! Matching contact: ${data.meta?.contactId}`);
    }
  }

  // Test 5: Empty string phone
  console.log('\n5️⃣ Testing with empty string phone...');
  const { response: r5, data: d5 } = await createContact({
    email: `empty-phone-${timestamp}@example.com`,
    firstName: 'Empty',
    lastName: 'Phone',
    phone: ''
  });

  console.log(`   Result: ${r5.ok ? '✅ Success' : '❌ Failed'}`);
  if (!r5.ok) {
    console.log(`   Error: ${d5.message}`);
  }

  // Test 6: Phone validation formats
  console.log('\n6️⃣ Testing phone number formats...');
  const phoneFormats = [
    { format: 'E.164', value: '+12125551234' },
    { format: 'US with dashes', value: '212-555-1234' },
    { format: 'US with dots', value: '212.555.1234' },
    { format: 'US with spaces', value: '212 555 1234' },
    { format: 'US with parentheses', value: '(212) 555-1234' },
    { format: 'Invalid', value: '123' }
  ];

  for (const { format, value } of phoneFormats) {
    console.log(`\n   Testing ${format}: ${value}`);
    const { response, data } = await createContact({
      email: `phone-format-${timestamp}-${Math.random().toString(36).slice(2)}@example.com`,
      firstName: 'Format',
      lastName: 'Test',
      phone: value
    });
    
    console.log(`   Result: ${response.ok ? '✅ Accepted' : '❌ Rejected'}`);
    if (!response.ok) {
      console.log(`   Error: ${data.message}`);
    }
  }
}

// Run tests
testPhoneDuplicates().then(() => {
  console.log('\n✨ Phone duplicate tests complete!');
});