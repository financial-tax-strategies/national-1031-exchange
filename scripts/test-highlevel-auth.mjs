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

if (!API_KEY || !LOCATION_ID) {
  console.error('❌ Missing HighLevel environment variables');
  process.exit(1);
}

console.log('🔐 Testing HighLevel Authentication\n');
console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
console.log(`Location ID: ${LOCATION_ID}\n`);

async function testAuth() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  // Test 1: Basic connectivity
  console.log('1️⃣ Testing basic API connectivity...');
  try {
    const response = await fetch(`${baseUrl}/locations/${LOCATION_ID}`, {
      method: 'GET',
      headers
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.log('   ❌ Authentication failed - API key is invalid or expired');
      const text = await response.text();
      console.log('   Error:', text);
      return false;
    } else if (response.status === 404) {
      console.log('   ❌ Location not found - Location ID may be incorrect');
      return false;
    } else if (response.ok) {
      console.log('   ✅ Authentication successful!');
      const data = await response.json();
      console.log(`   Location Name: ${data.name || 'N/A'}`);
      console.log(`   Location Email: ${data.email || 'N/A'}`);
      return true;
    } else {
      console.log(`   ❌ Unexpected response: ${response.status}`);
      const text = await response.text();
      console.log('   Response:', text);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
    return false;
  }
}

async function testMinimalContact() {
  if (!(await testAuth())) {
    console.log('\n⚠️  Skipping contact test due to auth failure');
    return;
  }

  console.log('\n2️⃣ Testing minimal contact creation...');
  
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  const contactData = {
    locationId: LOCATION_ID,
    email: `auth-test-${Date.now()}@example.com`
  };

  try {
    const response = await fetch(`${baseUrl}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactData)
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Contact created successfully!');
      console.log(`   Contact ID: ${data.contact?.id || data.id}`);
    } else {
      console.log('   ❌ Contact creation failed');
      console.log('   Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`   ❌ Request error: ${error.message}`);
  }
}

async function testHeaders() {
  console.log('\n3️⃣ Testing different header configurations...');
  
  const baseUrl = 'https://services.leadconnectorhq.com';
  const variations = [
    {
      name: 'Standard headers',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    },
    {
      name: 'Without Version header',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'With Accept header',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28'
      }
    }
  ];

  for (const variant of variations) {
    console.log(`\n   Testing: ${variant.name}`);
    try {
      const response = await fetch(`${baseUrl}/locations/${LOCATION_ID}`, {
        method: 'GET',
        headers: variant.headers
      });
      console.log(`   Result: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

// Run all tests
async function runTests() {
  await testMinimalContact();
  await testHeaders();
  
  console.log('\n✨ Authentication tests complete!');
}

runTests();