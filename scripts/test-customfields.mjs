#\!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const API_KEY = process.env.PUBLIC_HIGHLEVEL_API_KEY;
const LOCATION_ID = process.env.PUBLIC_HIGHLEVEL_LOCATION_ID;

async function test() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  // Test customFields formats
  const contact1 = {
    locationId: LOCATION_ID,
    email: `cf-test1-${Date.now()}@example.com`,
    firstName: 'CF',
    lastName: 'Test1',
    customFields: [
      { key: 'source', value: 'test1' }
    ]
  };

  const contact2 = {
    locationId: LOCATION_ID,
    email: `cf-test2-${Date.now()}@example.com`,
    firstName: 'CF',
    lastName: 'Test2',
    customFields: {
      'source': 'test2'
    }
  };

  console.log('Test 1: customFields as array [{key, value}]');
  const res1 = await fetch(`${baseUrl}/api/v2/contacts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contact1)
  });
  const data1 = await res1.json();
  console.log(res1.ok ? '✅ SUCCESS' : '❌ FAILED');
  if (\!res1.ok) console.log(data1.message);

  console.log('\nTest 2: customFields as object {key: value}');
  const res2 = await fetch(`${baseUrl}/api/v2/contacts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contact2)
  });
  const data2 = await res2.json();
  console.log(res2.ok ? '✅ SUCCESS' : '❌ FAILED');
  if (\!res2.ok) console.log(data2.message);
}

test();
