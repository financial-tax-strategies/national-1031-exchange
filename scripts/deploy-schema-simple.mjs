#!/usr/bin/env node

// ============================================
// Simple Schema Deployment Script
// Deploy master schema to Supabase using direct SQL execution
// ============================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
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
  console.log('🚀 Starting schema deployment to Supabase...');
  
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔑 Using Supabase URL:', supabaseUrl);
    console.log('🔑 Service key length:', supabaseServiceKey?.length || 0);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('❌ Missing Supabase configuration. Check your .env file.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'master-schema.sql');
    console.log('📄 Reading schema:', schemaPath);
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log(`📊 Schema loaded: ${Math.round(schemaSQL.length / 1024)}KB`);
    
    // Test connection with a simple query
    console.log('🔍 Testing database connection...');
    try {
      const { data, error } = await supabase.rpc('version');
      if (error) {
        console.log('⚠️  Direct connection test inconclusive, proceeding with deployment...');
      } else {
        console.log('✅ Database connection successful!');
      }
    } catch (err) {
      console.log('⚠️  Connection test inconclusive, proceeding with deployment...');
    }
    
    // Execute schema using pg connection string approach
    console.log('🚀 Executing master schema...');
    
    // Split SQL into smaller chunks to avoid timeout
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 10 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        console.log(`⚡ [${i + 1}/${statements.length}] Executing: ${statement.substring(0, 80)}...`);
        
        // Use raw SQL execution
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`⏭️  Skipping (already exists): ${statement.substring(0, 50)}...`);
            skipCount++;
          } else {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
          }
        } else {
          successCount++;
        }
        
        // Progress indicator every 25 statements
        if ((i + 1) % 25 === 0) {
          console.log(`📊 Progress: ${i + 1}/${statements.length} completed`);
        }
        
      } catch (err) {
        console.warn(`⚠️  Error on statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('\n🎉 Schema deployment completed!');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    
    // Verify key tables exist
    console.log('\n🔍 Verifying schema deployment...');
    
    const tablesToCheck = ['leads', 'calculator_submissions', 'order_form_submissions', 'appointments'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${tableName}' verification failed:`, error.message);
        } else {
          console.log(`✅ Table '${tableName}' exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${tableName}':`, err.message);
      }
    }
    
    console.log('\n🚀 Schema deployment process complete!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Execute deployment
deploySchema();