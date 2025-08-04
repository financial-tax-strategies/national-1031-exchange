#!/usr/bin/env node

// Script to verify Netlify Function deployment and configuration
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('Netlify Function Verification');
console.log('=============================\n');

// Check environment variables
console.log('1. Environment Variables Check:');
console.log('   PUBLIC_SUPABASE_URL:', process.env.PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('   PUBLIC_SUPABASE_ANON_KEY:', process.env.PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Found' : '❌ Missing');

console.log('\n2. Netlify Function Location:');
console.log('   Expected at: netlify/functions/team-members-update.ts');

// Test local vs production URLs
console.log('\n3. Function URLs:');
console.log('   Local: http://localhost:8888/.netlify/functions/team-members-update');
console.log('   Production: https://[your-site].netlify.app/.netlify/functions/team-members-update');

console.log('\n4. Testing Instructions:');
console.log('   a) Run locally: npm run dev');
console.log('   b) Visit: http://localhost:4321/admin/test-team-update');
console.log('   c) Click "Test Update" and check the results');

console.log('\n5. Common Issues:');
console.log('   - If using production site, ensure SUPABASE_SERVICE_ROLE_KEY is set in Netlify env vars');
console.log('   - Check Netlify Function logs: netlify functions:log team-members-update');
console.log('   - Ensure the function is deployed: check Netlify dashboard > Functions tab');

// Test if we can update with service key
if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.PUBLIC_SUPABASE_URL) {
  console.log('\n6. Testing Direct Update with Service Key...');
  
  const testUpdate = async () => {
    const id = 'e1660fc9-b0a7-4863-b690-7a2a33008d82';
    const url = `${process.env.PUBLIC_SUPABASE_URL}/rest/v1/team_members?id=eq.${id}`;
    const updateData = { job_title: 'Verification Test - ' + new Date().toISOString() };
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      if (data.length > 0) {
        console.log('   ✅ Service key update successful!');
        console.log('   Updated job title to:', data[0].job_title);
      } else {
        console.log('   ❌ Service key update returned empty array');
      }
    } catch (error) {
      console.log('   ❌ Service key update failed:', error.message);
    }
  };
  
  await testUpdate();
} else {
  console.log('\n6. Cannot test service key update - missing configuration');
}

console.log('\n✨ Verification complete!');