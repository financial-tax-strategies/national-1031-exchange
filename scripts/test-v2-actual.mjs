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

console.log('🔍 Testing HighLevel API - Finding correct V2 format\n');

async function testEndpoint(name, url, options) {
  console.log(`\n📍 Testing: ${name}`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok && text.length > 0) {
      try {
        const json = JSON.parse(text);
        console.log(`✅ SUCCESS - Valid response received`);
        return { success: true, response, json };
      } catch (e) {
        console.log(`❌ Invalid JSON response`);
      }
    } else {
      console.log(`❌ Failed - Status ${response.status}`);
    }
    
    return { success: false, response, text };
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return { success: false, error };
  }
}

async function findCorrectEndpoints() {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  // Test different possible V2 formats
  const baseUrls = [
    'https://services.leadconnectorhq.com',
    'https://rest.gohighlevel.com',
    'https://api.gohighlevel.com'
  ];

  const v2Patterns = [
    '/v2/',
    '/api/v2/',
    '/'  // Maybe V2 is the default now
  ];

  console.log('Testing different URL patterns for V2 API...\n');

  for (const baseUrl of baseUrls) {
    for (const pattern of v2Patterns) {
      const result = await testEndpoint(
        `${baseUrl}${pattern}locations/${LOCATION_ID}`,
        `${baseUrl}${pattern}locations/${LOCATION_ID}`,
        { method: 'GET', headers }
      );
      
      if (result.success) {
        console.log(`\n🎯 FOUND WORKING ENDPOINT!`);
        console.log(`Base URL: ${baseUrl}`);
        console.log(`Pattern: ${pattern}`);
        
        // Now test contacts endpoint
        console.log('\nTesting contacts endpoint with same pattern...');
        const contactData = {
          locationId: LOCATION_ID,
          email: `test-${Date.now()}@example.com`,
          firstName: 'Test',
          lastName: 'User'
        };
        
        await testEndpoint(
          'Contact Creation',
          `${baseUrl}${pattern}contacts/`,
          { 
            method: 'POST', 
            headers,
            body: JSON.stringify(contactData)
          }
        );
        
        return { baseUrl, pattern };
      }
    }
  }
  
  console.log('\n⚠️ No working V2 endpoint found. V1 may still be the current version.');
}

findCorrectEndpoints();