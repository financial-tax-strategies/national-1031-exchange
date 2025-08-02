#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

console.log('🔍 Analyzing HighLevel Integration Errors\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function analyzeErrors() {
  console.log('📊 Fetching recent integration errors...\n');
  
  // Get recent failed integrations
  const { data: errors, error: fetchError } = await supabase
    .from('highlevel_integrations')
    .select('*')
    .eq('success', false)
    .order('created_at', { ascending: false })
    .limit(20);

  if (fetchError) {
    console.error('❌ Error fetching data:', fetchError);
    return;
  }

  if (!errors || errors.length === 0) {
    console.log('✅ No errors found in highlevel_integrations table');
    return;
  }

  console.log(`Found ${errors.length} failed integrations:\n`);

  // Group errors by type
  const errorTypes = {};
  errors.forEach(err => {
    const key = err.error_message || 'Unknown error';
    if (!errorTypes[key]) {
      errorTypes[key] = {
        count: 0,
        examples: [],
        types: new Set()
      };
    }
    errorTypes[key].count++;
    errorTypes[key].types.add(err.integration_type);
    if (errorTypes[key].examples.length < 2) {
      errorTypes[key].examples.push({
        id: err.id,
        type: err.integration_type,
        created_at: err.created_at,
        payload: err.payload_sent
      });
    }
  });

  // Display error summary
  console.log('🚨 Error Summary:\n');
  Object.entries(errorTypes).forEach(([error, details]) => {
    console.log(`❌ "${error}"`);
    console.log(`   Count: ${details.count}`);
    console.log(`   Types: ${Array.from(details.types).join(', ')}`);
    console.log(`   First occurred: ${new Date(details.examples[0].created_at).toLocaleString()}`);
    
    // Show payload for 401 errors
    if (error.includes('401')) {
      console.log('   Sample payload:');
      console.log(JSON.stringify(details.examples[0].payload, null, 2));
    }
    console.log('');
  });

  // Check for successful integrations
  console.log('📈 Checking for any successful integrations...\n');
  
  const { data: successes, error: successError } = await supabase
    .from('highlevel_integrations')
    .select('integration_type, created_at')
    .eq('success', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (successError) {
    console.error('❌ Error fetching success data:', successError);
  } else if (successes && successes.length > 0) {
    console.log(`✅ Found ${successes.length} successful integrations:`);
    successes.forEach(s => {
      console.log(`   - ${s.integration_type} at ${new Date(s.created_at).toLocaleString()}`);
    });
  } else {
    console.log('⚠️  No successful integrations found');
  }
}

async function checkConfig() {
  console.log('\n📋 Checking HighLevel Configuration...\n');
  
  const { data: config, error: configError } = await supabase
    .from('highlevel_config')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError) {
    console.error('❌ Error fetching config:', configError);
    return;
  }

  if (!config) {
    console.log('⚠️  No active HighLevel configuration found');
    return;
  }

  console.log('✅ Active configuration found:');
  console.log(`   Location ID: ${config.location_id}`);
  console.log(`   Calendar ID: ${config.calendar_id}`);
  console.log(`   API Key: ${config.api_key ? config.api_key.substring(0, 20) + '...' : 'NOT SET'}`);
  console.log(`   Updated: ${new Date(config.updated_at).toLocaleString()}`);
  console.log(`   Timezone: ${config.timezone}`);
  
  // Compare with environment variables
  console.log('\n🔄 Comparing with environment variables:');
  console.log(`   ENV Location ID: ${process.env.PUBLIC_HIGHLEVEL_LOCATION_ID}`);
  console.log(`   ENV Calendar ID: ${process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID}`);
  console.log(`   ENV API Key: ${process.env.PUBLIC_HIGHLEVEL_API_KEY?.substring(0, 20)}...`);
  
  if (config.location_id !== process.env.PUBLIC_HIGHLEVEL_LOCATION_ID) {
    console.log('   ⚠️  Location ID mismatch!');
  }
  if (config.calendar_id !== process.env.PUBLIC_HIGHLEVEL_CALENDAR_ID) {
    console.log('   ⚠️  Calendar ID mismatch!');
  }
}

async function analyzeErrorPatterns() {
  console.log('\n📊 Analyzing Error Patterns...\n');
  
  // Get error timeline
  const { data: timeline, error: timelineError } = await supabase
    .from('highlevel_integrations')
    .select('created_at, success, error_message')
    .order('created_at', { ascending: false })
    .limit(100);

  if (timelineError || !timeline) {
    console.error('❌ Error fetching timeline:', timelineError);
    return;
  }

  // Find when errors started
  let lastSuccess = null;
  let firstError = null;
  
  for (const entry of timeline.reverse()) {
    if (entry.success && !lastSuccess) {
      lastSuccess = entry.created_at;
    }
    if (!entry.success && !firstError && lastSuccess) {
      firstError = entry.created_at;
      break;
    }
  }

  if (firstError) {
    console.log(`🕐 Errors started at: ${new Date(firstError).toLocaleString()}`);
    if (lastSuccess) {
      console.log(`✅ Last successful integration: ${new Date(lastSuccess).toLocaleString()}`);
    }
  }

  // Calculate success rate
  const total = timeline.length;
  const failures = timeline.filter(t => !t.success).length;
  const successRate = ((total - failures) / total * 100).toFixed(2);
  
  console.log(`\n📈 Success rate: ${successRate}% (${total - failures}/${total})`);
}

// Run all analyses
async function runAnalysis() {
  await analyzeErrors();
  await checkConfig();
  await analyzeErrorPatterns();
  
  console.log('\n✨ Analysis complete!');
  process.exit(0);
}

runAnalysis();