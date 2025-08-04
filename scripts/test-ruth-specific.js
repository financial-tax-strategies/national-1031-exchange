#!/usr/bin/env node

// Test Ruth's specific data issue
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Ruth Benjamin Specific Issue\n');

const ruthId = 'e1660fc9-b0a7-4863-b690-7a2a33008d82';

async function getCurrentData() {
  const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${ruthId}`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  });
  
  const data = await response.json();
  return data[0];
}

async function testSpecificUpdate() {
  console.log('1. Getting current Ruth data...');
  const currentData = await getCurrentData();
  console.log('   Current job_title:', currentData.job_title);
  console.log('   Current image:', currentData.image);
  console.log('   Current updated_at:', currentData.updated_at);
  
  // Test if image field is causing issues
  console.log('\n2. Testing update with current image URL...');
  const updateWithImage = {
    job_title: 'Test with Image - ' + Date.now(),
    image: currentData.image // Use the current image
  };
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${ruthId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify(updateWithImage)
    });
    
    console.log('   Response status:', response.status);
    
    const updated = await getCurrentData();
    console.log('   Updated job_title:', updated.job_title);
    console.log('   Success?', updated.job_title === updateWithImage.job_title);
    
  } catch (error) {
    console.error('   Error:', error);
  }
  
  // Test with exactly what the UI would send
  console.log('\n3. Testing with exact UI data structure...');
  const uiExactData = {
    name: currentData.name,
    slug: currentData.slug,
    job_title: 'Exact UI Test - ' + Date.now(),
    works_for: currentData.works_for,
    email: currentData.email,
    telephone: currentData.telephone,
    description: currentData.description,
    image: currentData.image,
    years_experience: currentData.years_experience,
    display_order: currentData.display_order,
    knows_about: currentData.knows_about,
    same_as: currentData.same_as,
    is_active: currentData.is_active
  };
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/team_members?id=eq.${ruthId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify(uiExactData)
    });
    
    console.log('   Response status:', response.status);
    
    const updated = await getCurrentData();
    console.log('   Updated job_title:', updated.job_title);
    console.log('   Success?', updated.job_title === uiExactData.job_title);
    
  } catch (error) {
    console.error('   Error:', error);
  }
}

testSpecificUpdate();