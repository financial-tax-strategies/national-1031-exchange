#!/usr/bin/env node

// Test the deployed Netlify function
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testDeployedFunction() {
  const siteUrl = await new Promise(resolve => {
    rl.question('Enter your Netlify site URL (e.g., https://amazing-site-123.netlify.app): ', resolve);
  });
  
  rl.close();
  
  console.log('\n🧪 Testing deployed Netlify function...\n');
  
  const functionUrl = `${siteUrl}/.netlify/functions/team-members-update`;
  const testData = {
    id: 'e1660fc9-b0a7-4863-b690-7a2a33008d82', // Ruth Benjamin
    job_title: 'Deployed Function Test - ' + new Date().toISOString()
  };
  
  console.log('URL:', functionUrl);
  console.log('Data:', JSON.stringify(testData, null, 2));
  
  try {
    console.log('\n📤 Sending PATCH request...');
    const response = await fetch(functionUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📥 Response received:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\nRaw response:', responseText);
    
    try {
      const result = JSON.parse(responseText);
      console.log('\n📊 Parsed response:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('\n✅ Function reports SUCCESS');
        if (result.debug) {
          console.log('Debug info:', result.debug);
        }
      } else {
        console.log('\n❌ Function reports FAILURE');
        if (result.error) {
          console.log('Error:', result.error);
        }
        if (result.debug) {
          console.log('Debug info:', result.debug);
        }
      }
    } catch (e) {
      console.log('\n⚠️  Response is not valid JSON');
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
  
  console.log('\n💡 Next steps:');
  console.log('1. Check Netlify dashboard > Functions tab to see if function is deployed');
  console.log('2. Check Netlify dashboard > Site settings > Environment variables');
  console.log('3. Ensure SUPABASE_SERVICE_ROLE_KEY is set in Netlify env vars');
  console.log('4. View function logs: netlify functions:log team-members-update');
}

testDeployedFunction();