import { DatabaseService } from '../src/lib/services/database.service';
import { HighLevelService } from '../src/lib/services/highlevel.service';

console.log('🔍 HighLevel Integration Check\n');

// Check environment variables
console.log('1. Checking Environment Variables:');
const requiredEnvVars = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY'
];

let envVarsOk = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar} is set`);
  } else {
    console.log(`   ❌ ${envVar} is missing`);
    envVarsOk = false;
  }
}

if (!envVarsOk) {
  console.log('\n❌ Missing environment variables. Please check your .env file.');
  process.exit(1);
}

// Check database connection
console.log('\n2. Checking Database Connection:');
try {
  const db = DatabaseService.getInstance();
  const { count, error } = await db.getTable('leads')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`);
  } else {
    console.log(`   ✅ Database connected successfully`);
    console.log(`   📊 Leads table has ${count || 0} records`);
  }
} catch (error: any) {
  console.log(`   ❌ Database error: ${error.message}`);
}

// Check HighLevel configuration
console.log('\n3. Checking HighLevel Configuration:');
try {
  const db = DatabaseService.getInstance();
  const { data: config, error } = await db.getTable('highlevel_config')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error || !config) {
    console.log('   ⚠️  No active HighLevel configuration found');
    console.log('   👉 Please configure HighLevel at /admin/highlevel-config');
  } else {
    console.log('   ✅ HighLevel configuration found');
    console.log(`   📍 Location ID: ${config.location_id}`);
    console.log(`   📅 Calendar ID: ${config.calendar_id}`);
    console.log(`   🔑 API Key: ${config.api_key.substring(0, 10)}...`);
    
    // Test HighLevel connection
    console.log('\n4. Testing HighLevel API Connection:');
    try {
      const highLevel = new HighLevelService();
      const testDate = new Date().toISOString().split('T')[0];
      const slots = await highLevel.getAvailability({ date: testDate });
      
      console.log(`   ✅ HighLevel API connected successfully`);
      console.log(`   📅 Found ${slots.length} available slots for today`);
    } catch (error: any) {
      console.log(`   ❌ HighLevel API error: ${error.message}`);
      console.log('   👉 Please check your API credentials');
    }
  }
} catch (error: any) {
  console.log(`   ❌ Configuration error: ${error.message}`);
}

// Check webhook setup
console.log('\n5. Webhook Configuration:');
console.log(`   🔗 Webhook URL: ${process.env.URL || 'http://localhost:4321'}/.netlify/functions/highlevel-webhook`);
console.log('   👉 Add this URL to HighLevel Settings → Webhooks');

console.log('\n✨ Integration check complete!\n');