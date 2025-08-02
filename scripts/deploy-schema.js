#!/usr/bin/env node

// ============================================
// Schema Deployment Script
// Deploy master schema to Supabase
// ============================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables manually
function loadEnvVars() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

loadEnvVars();

async function deploySchema() {
  console.log('🚀 Starting schema deployment...');
  
  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Check your .env file.');
    }
    
    console.log('📡 Connecting to Supabase:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'master-schema.sql');
    console.log('📄 Reading schema file:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log(`📊 Schema file loaded: ${schemaSQL.length} characters`);
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    console.log(`🔄 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        // Use the raw SQL execution
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Try alternative approach using the REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: statement })
          });
          
          if (!response.ok) {
            console.warn(`⚠️  Statement ${i + 1} failed:`, error?.message || 'Unknown error');
            console.warn(`Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
            continue;
          }
        }
        
        successCount++;
        
        // Show progress every 10 statements
        if ((i + 1) % 10 === 0) {
          console.log(`✅ Completed ${i + 1}/${statements.length} statements`);
        }
        
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} failed:`, err.message);
        console.warn(`Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Schema deployment completed!');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`⚠️  Failed statements: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🚀 All schema statements executed successfully!');
    } else {
      console.log('⚠️  Some statements failed. Check the logs above for details.');
    }
    
    // Test the connection by querying a simple table
    console.log('\n🔍 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database test failed:', testError.message);
    } else {
      console.log('✅ Database connection successful!');
    }
    
  } catch (error) {
    console.error('❌ Schema deployment failed:', error.message);
    process.exit(1);
  }
}

// Run the deployment
deploySchema();