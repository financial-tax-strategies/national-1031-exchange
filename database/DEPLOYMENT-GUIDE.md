# Database Schema Deployment Guide

## Overview

This guide will walk you through deploying the comprehensive master database schema to your new Supabase project. The schema transforms the National 1031 Exchange platform from a simple appointment booking system to a complete lead management and platform business architecture.

## Prerequisites

1. **Supabase Project**: https://fweohnekiahcvnfcpfic.supabase.co
2. **Admin Access**: You have admin access to the Supabase dashboard
3. **SQL Editor**: Access to the Supabase SQL Editor

## Schema Components

The master schema includes:

- **15+ Core Tables**: Comprehensive lead management, appointments, activities, integrations
- **Automated Triggers**: Lead scoring, activity tracking, timestamp management
- **Database Functions**: Lead deduplication, analytics, cache cleanup
- **RLS Policies**: Row-level security for multi-user access
- **Performance Indexes**: Optimized for scale and fast queries
- **Future Platform Tables**: Customer portals, subscriptions, document management

## Deployment Steps

### Step 1: Deploy Core Schema

1. **Navigate to Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/fweohnekiahcvnfcpfic/sql
   - Open the SQL Editor

2. **Execute the Complete Master Schema**
   - Copy the entire contents of `database/master-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute all statements

### Step 2: Verify Deployment

After running the schema, verify these key tables exist:

```sql
-- Check core tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

Expected tables:
- `leads` (central lead management)
- `calculator_submissions` 
- `order_form_submissions`
- `appointments`
- `lead_activities`
- `highlevel_integrations`
- `webhooks`
- `admin_users`
- `admin_audit_logs`
- `customer_properties`
- `documents`
- `market_intelligence`
- `subscriptions`
- `availability_cache`
- `highlevel_config`

### Step 3: Test Core Functionality

1. **Test Lead Creation Function**
```sql
SELECT find_or_create_lead(
    'test@example.com',
    '(555) 123-4567',
    'John',
    'Doe',
    'tax_calculator'
);
```

2. **Test Conversion Funnel Analytics**
```sql
SELECT * FROM get_conversion_funnel_stats();
```

3. **Verify Views Work**
```sql
SELECT * FROM lead_performance LIMIT 5;
SELECT * FROM appointment_performance LIMIT 5;
SELECT * FROM integration_health LIMIT 5;
```

### Step 4: Configure HighLevel Integration

Update the HighLevel configuration with your actual API credentials:

```sql
UPDATE highlevel_config 
SET 
    api_key = 'YOUR_ACTUAL_API_KEY',
    location_id = 'YOUR_ACTUAL_LOCATION_ID',
    calendar_id = 'YOUR_ACTUAL_CALENDAR_ID',
    webhook_secret = 'YOUR_ACTUAL_WEBHOOK_SECRET'
WHERE id = (SELECT id FROM highlevel_config LIMIT 1);
```

### Step 5: Create First Admin User

```sql
UPDATE admin_users 
SET 
    email = 'your-admin@the1031center.com',
    first_name = 'Your',
    last_name = 'Name'
WHERE email = 'admin@the1031center.com';
```

## Schema Features Deployed

### ✅ Lead Management
- Email-based lead deduplication
- Automated lead scoring (0-100 scale)
- Complete customer journey tracking
- Multi-source lead capture support

### ✅ Analytics & Reporting
- Activity timeline for every lead
- Conversion funnel analysis
- Performance metrics and KPIs
- Integration health monitoring

### ✅ HighLevel Integration
- Full audit trail of API calls
- Webhook processing with error handling
- Automated retry logic
- Status synchronization

### ✅ Admin Capabilities
- Role-based access control
- Comprehensive audit logging
- Multi-user admin support
- Granular permissions

### ✅ Platform Features (Future Ready)
- Customer property portfolio tracking
- Document management with OCR support
- Market intelligence collection
- Subscription revenue management

### ✅ Performance & Security
- Comprehensive indexing for scale
- Row Level Security (RLS) policies
- Automated triggers and functions
- Caching for high-performance booking

## Business Transformation Enabled

This schema supports transformation from **service business** to **platform business**:

1. **Complete Customer Lifecycle Management**: From first website visit to ongoing subscription
2. **Advanced Analytics**: Deep insights into lead behavior and conversion patterns
3. **Scalable Architecture**: Handles multiple clients, advisors, and service offerings
4. **Revenue Diversification**: Foundation for subscriptions, premium services, and partnerships
5. **Operational Efficiency**: Automated lead scoring, activity tracking, and integration management

## Next Steps (After Deployment)

1. **Service Layer Development**: Create TypeScript services to interact with new schema
2. **Admin Interface**: Build comprehensive admin dashboard
3. **Customer Portal**: Develop self-service customer portal
4. **Analytics Dashboard**: Create business intelligence reporting
5. **Mobile App**: Progressive Web App with offline capabilities

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure you're using the service role key for admin operations
2. **Foreign Key Violations**: Deploy tables in the correct order (parent tables first)
3. **Extension Errors**: Enable required extensions (uuid-ossp, pgcrypto) first
4. **RLS Policy Issues**: Policies are designed for both public access and admin operations

### Support

If you encounter issues during deployment:
1. Check the Supabase logs in the dashboard
2. Verify your project URL and API keys are correct
3. Ensure you have the latest schema file
4. Contact support with specific error messages

## Schema Statistics

- **Total Lines**: 900+
- **Tables**: 15
- **Indexes**: 25+
- **Triggers**: 8
- **Functions**: 4
- **Views**: 3
- **RLS Policies**: 30+

This comprehensive schema provides the foundation for transforming National 1031 Exchange into a leading platform in the 1031 exchange industry.