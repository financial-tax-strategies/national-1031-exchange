#!/usr/bin/env node
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('📋 Netlify Environment Variables Setup\n');
console.log('Go to: https://app.netlify.com/sites/national-1031-exchange/configuration/env\n');
console.log('Add these environment variables:\n');

const requiredVars = [
  'PUBLIC_HIGHLEVEL_API_KEY',
  'PUBLIC_HIGHLEVEL_LOCATION_ID', 
  'PUBLIC_HIGHLEVEL_CALENDAR_ID',
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PUBLIC_GA_MEASUREMENT_ID'
];

console.log('Copy each line below into Netlify:\n');
console.log('─'.repeat(80));

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`${varName}=${value}`);
    console.log('─'.repeat(80));
  } else {
    console.log(`${varName}=<NOT SET>`);
    console.log('─'.repeat(80));
  }
});

console.log('\n✅ All values above ready to copy!\n');
console.log('⚠️  IMPORTANT: Keep SUPABASE_SERVICE_ROLE_KEY secret!');
console.log('🔄 After adding, trigger a redeploy from Netlify dashboard.');