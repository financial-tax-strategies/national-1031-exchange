#!/usr/bin/env node

// Simple script to test PATCH endpoint
// Run with: node scripts/test-patch.mjs

async function testPatch() {
  const url = 'https://the1031center.com/api/team-members';
  
  console.log('Testing PATCH endpoint...\n');
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'test-id',
        name: 'Test Update',
      }),
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch {
      console.log('Response (text):', text);
    }
    
    if (response.status === 405) {
      console.log('\n❌ PATCH method is still not supported');
      console.log('The deployment may not have completed yet.');
    } else {
      console.log('\n✅ PATCH method is working!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPatch();