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

console.log('🔍 Testing HighLevel V2 API with detailed debugging\n');

async function testEndpoint(name, url, options) {
  console.log(`\n📍 Testing: ${name}`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${options.method || 'GET'}`);
  
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers));
    console.log(`Response Length: ${text.length} characters`);
    
    if (text.length > 0) {
      try {
        const json = JSON.parse(text);
        console.log(`✅ Valid JSON Response:`);
        console.log(JSON.stringify(json, null, 2).substring(0, 500) + '...');
      } catch (e) {
        console.log(`❌ Invalid JSON. Raw response:`);
        console.log(text.substring(0, 500) + '...');
      }
    } else {
      console.log(`⚠️ Empty response body`);
    }
    
    return { response, text };
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return null;
  }
}

async function runTests() {
  const baseUrl = 'https://services.leadconnectorhq.com';
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  // Test 1: Check if we need different headers
  await testEndpoint(
    'Locations Endpoint',
    `${baseUrl}/api/v2/locations/${LOCATION_ID}`,
    { method: 'GET', headers }
  );

  // Test 2: Try without Version header
  const headersNoVersion = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };
  
  await testEndpoint(
    'Locations (No Version Header)',
    `${baseUrl}/api/v2/locations/${LOCATION_ID}`,
    { method: 'GET', headers: headersNoVersion }
  );

  // Test 3: Test contact creation with minimal data
  const contactData = {
    locationId: LOCATION_ID,
    email: `test-v2-${Date.now()}@example.com`
  };
  
  await testEndpoint(
    'Contact Creation',
    `${baseUrl}/api/v2/contacts/`,
    { 
      method: 'POST', 
      headers,
      body: JSON.stringify(contactData)
    }
  );

  // Test 4: Try V1 endpoint for comparison
  await testEndpoint(
    'V1 Locations (for comparison)',
    `${baseUrl}/locations/${LOCATION_ID}`,
    { method: 'GET', headers }
  );
}

runTests();