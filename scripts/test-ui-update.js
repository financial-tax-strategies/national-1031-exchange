#!/usr/bin/env node

// Test what the UI is actually sending
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 Testing UI Update Scenario\n');

// Simulate what the UI sends
const uiData = {
  id: 'e1660fc9-b0a7-4863-b690-7a2a33008d82',
  name: 'Ruth Benjamin',
  slug: 'ruth-benjamin', 
  job_title: 'UI Test Update - ' + Date.now(),
  works_for: 'The 1031 Center',
  email: 'ruth.benjamin@the1031center.com',
  telephone: null,
  description: "Ruth has an extensive background in real estate tax strategy with deep expertise in title, escrow, foreclosures, evictions, bankruptcy, mortgages, and legal matters. Over the past 35 years, she has served as president of two different 1031 Exchange Companies. Recognized throughout the industry as a subject matter expert in 1031 exchanges and tax-deferred cash-out strategies, Ruth's approach is distinctive—she listens first, thinks creatively, and delivers elegant solutions to her clients.",
  image: null,
  years_experience: 35,
  display_order: 1,
  knows_about: [
    '1031 exchanges',
    'Tax-deferred strategies', 
    'Real estate tax strategy',
    'Client success',
    'Creative problem solving'
  ],
  same_as: ['https://linkedin.com/in/ruthbenjamin1031'],
  is_active: true
};

async function testUIUpdate() {
  console.log('1. Simulating UI form submission...');
  console.log('   Data being sent:', JSON.stringify(uiData, null, 2));
  
  try {
    // Remove id from update data (like the UI does)
    const { id, ...updateData } = uiData;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('\n2. Response status:', response.status);
    const responseText = await response.text();
    console.log('   Response body:', responseText);
    
    // Check what's in the database
    console.log('\n3. Checking database...');
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${id}&select=name,job_title,updated_at`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    
    const checkData = await checkResponse.json();
    console.log('   Current data:', checkData[0]);
    console.log('   Update successful?', checkData[0]?.job_title === uiData.job_title);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testMinimalUIUpdate() {
  console.log('\n4. Testing minimal update (only changed fields)...');
  
  const minimalUpdate = {
    job_title: 'Minimal UI Test - ' + Date.now()
  };
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${uiData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify(minimalUpdate)
    });
    
    console.log('   Response status:', response.status);
    
    // Verify
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${uiData.id}&select=job_title`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    
    const checkData = await checkResponse.json();
    console.log('   Updated job_title:', checkData[0]?.job_title);
    console.log('   Minimal update successful?', checkData[0]?.job_title === minimalUpdate.job_title);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUIUpdate().then(() => testMinimalUIUpdate());