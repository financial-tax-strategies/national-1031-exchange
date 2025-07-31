# HighLevel Integration Setup Guide

This guide walks you through setting up the HighLevel CRM integration for the National 1031 Center website.

## Prerequisites

Before starting, ensure you have:

1. **HighLevel Account**
   - Agency or Location access
   - API permissions enabled
   - Calendar created for appointments

2. **Supabase Account**
   - New project created
   - Database URL and keys available

3. **Netlify Account**
   - Site deployed
   - Edge Functions enabled

4. **Development Environment**
   - Node.js 18+ installed
   - Git configured
   - Code editor ready

## Step 1: HighLevel Configuration

### 1.1 Create API Key

1. Log into HighLevel
2. Navigate to **Settings** → **Business Profile** → **API Keys**
3. Click **Generate New Key**
4. Name it: "National 1031 Center Integration"
5. Save the API key securely

### 1.2 Get Location ID

1. In HighLevel, go to **Settings** → **Business Profile**
2. Copy the **Location ID** (also called Company ID)
3. Save this for configuration

### 1.3 Create Calendar

1. Navigate to **Calendars** → **Calendar Settings**
2. Create new calendar: "1031 Exchange Consultations"
3. Configure:
   - Duration: 30 minutes
   - Availability: Business hours
   - Round-robin assignment (if using teams)
4. Copy the **Calendar ID** from the URL

### 1.4 Configure Custom Fields

Create these custom fields in **Settings** → **Custom Fields**:

```
Field Name: tax_savings_amount
Field Type: Number
Field Name: property_sale_price
Field Type: Number
Field Name: lead_source
Field Type: Text
Field Name: calculator_completed
Field Type: Checkbox
```

## Step 2: Supabase Setup

### 2.1 Create Database

1. Log into [Supabase](https://supabase.com)
2. Create new project: "national-1031-exchange"
3. Choose region closest to your users
4. Wait for database provisioning

### 2.2 Run Database Schema

1. Open SQL Editor in Supabase
2. Copy contents of `database/highlevel-schema.sql`
3. Run the SQL to create tables
4. Verify tables created:
   - `highlevel_config`
   - `appointments`
   - `webhook_logs`
   - `availability_cache`

### 2.3 Configure Row Level Security

Run this SQL to enable RLS:

```sql
-- Enable RLS on all tables
ALTER TABLE highlevel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_cache ENABLE ROW LEVEL SECURITY;

-- Create service role policy for Edge Functions
CREATE POLICY "Service role can manage all data" ON appointments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage webhooks" ON webhook_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Public read access for appointments (for realtime)
CREATE POLICY "Public can read own appointments" ON appointments
  FOR SELECT USING (true);
```

### 2.4 Enable Realtime

1. Go to **Database** → **Replication**
2. Enable replication for `appointments` table
3. Select all events: INSERT, UPDATE, DELETE

### 2.5 Get Connection Details

From **Settings** → **API**:
- Project URL: `https://[project-id].supabase.co`
- Anon Key: For frontend
- Service Role Key: For Edge Functions

## Step 3: Environment Configuration

### 3.1 Local Development (.env)

Create `.env` file in project root:

```bash
# HighLevel Configuration
HIGHLEVEL_API_KEY=your_highlevel_api_key
HIGHLEVEL_LOCATION_ID=your_location_id
HIGHLEVEL_CALENDAR_ID=your_calendar_id
HIGHLEVEL_WEBHOOK_SECRET=generate_random_secret_here

# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics (existing)
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3.2 Generate Webhook Secret

```bash
# Generate secure webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Netlify Environment Variables

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add all variables from `.env` file
3. Deploy triggers automatically on save

## Step 4: Configure Webhook in HighLevel

### 4.1 Get Webhook URL

Your webhook URL will be:
```
https://your-site.netlify.app/api/webhooks/highlevel
```

### 4.2 Create Webhook

1. In HighLevel, go to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Configure:
   - Name: "Appointment Assignment Webhook"
   - URL: Your webhook URL from above
   - Events: 
     - ✅ Appointment Create
     - ✅ Appointment Update
     - ✅ Appointment Delete
4. Add header:
   - Key: `X-Webhook-Secret`
   - Value: Your webhook secret from `.env`
5. Save and test webhook

## Step 5: Initial Data Setup

### 5.1 Insert HighLevel Configuration

Run in Supabase SQL Editor:

```sql
INSERT INTO highlevel_config (
  api_key,
  location_id,
  calendar_id,
  webhook_secret,
  webhook_url,
  timezone,
  is_active
) VALUES (
  'your_encrypted_api_key', -- Encrypt this!
  'your_location_id',
  'your_calendar_id',
  'your_webhook_secret',
  'https://your-site.netlify.app/api/webhooks/highlevel',
  'America/New_York', -- Adjust for your timezone
  true
);
```

**Important**: In production, encrypt the API key before storing!

## Step 6: Test the Integration

### 6.1 Test Availability Loading

```bash
# Start development server
npm run dev

# Navigate to calculator
# Complete calculation
# Click "Schedule Free Consultation"
# Verify dates load
```

### 6.2 Test Appointment Creation

1. Select a date and time
2. Confirm booking details
3. Monitor:
   - Browser console for events
   - Supabase dashboard for new appointment
   - HighLevel for contact and appointment

### 6.3 Test Webhook

1. In HighLevel, manually assign the appointment
2. Check Supabase `webhook_logs` table
3. Verify appointment status updates to "confirmed"

### 6.4 Test Polling Fallback

1. Temporarily disable webhook in HighLevel
2. Create new appointment
3. Watch console for polling messages
4. Verify appointment updates after assignment

## Step 7: Production Deployment

### 7.1 Pre-deployment Checklist

- [ ] All environment variables set in Netlify
- [ ] Database migrations run in production Supabase
- [ ] Webhook URL uses production domain
- [ ] API keys are production keys (not sandbox)
- [ ] Analytics tracking verified
- [ ] Error monitoring configured

### 7.2 Deploy Process

```bash
# Ensure on feature branch
git status

# Push to GitHub
git push origin feature/highlevel-integration

# Create Pull Request
# Review and merge
# Netlify auto-deploys
```

### 7.3 Post-deployment Verification

1. Test full booking flow on production
2. Verify webhook receipts in logs
3. Check analytics events firing
4. Monitor error logs for 24 hours

## Step 8: Monitoring Setup

### 8.1 Supabase Monitoring

1. Enable email alerts for database errors
2. Set up webhook failure notifications
3. Monitor table growth and performance

### 8.2 HighLevel Monitoring

1. Check webhook delivery status regularly
2. Monitor API usage and limits
3. Review appointment assignment rates

### 8.3 Application Monitoring

1. Set up Sentry or similar for error tracking
2. Configure uptime monitoring for webhook endpoint
3. Create alerts for booking failures

## Troubleshooting Quick Reference

### Common Issues

1. **Dates not loading**
   - Check HighLevel API key
   - Verify calendar ID
   - Check browser console

2. **Appointments not creating**
   - Verify all required fields
   - Check API rate limits
   - Review error messages

3. **Webhooks not received**
   - Verify webhook URL
   - Check webhook secret
   - Review Netlify Function logs

4. **Polling not working**
   - Check Supabase connection
   - Verify subscription setup
   - Review polling logs

## Security Reminders

1. **Never commit `.env` files**
2. **Rotate API keys regularly**
3. **Monitor webhook logs for suspicious activity**
4. **Keep dependencies updated**
5. **Use environment-specific keys**

## Next Steps

After successful setup:

1. Review [HIGHLEVEL_API.md](./HIGHLEVEL_API.md) for API details
2. Read [HIGHLEVEL_TROUBLESHOOTING.md](./HIGHLEVEL_TROUBLESHOOTING.md) for issue resolution
3. Configure team training on appointment management
4. Set up reporting dashboards

---

*For support, contact the development team with your Supabase project ID and error logs.*