# HighLevel Integration Testing Guide

## Overview
This guide will help you test the HighLevel CRM integration to ensure everything is working correctly before going live.

## Prerequisites

### 1. HighLevel Account Setup
You'll need the following from your HighLevel account:

- **API Key**: Found in Settings → Business Profile → API Key
- **Location ID**: Found in Settings → Business Profile
- **Calendar ID**: Found in Calendars → Select Calendar → Settings
- **Webhook Secret** (Optional): For webhook verification

### 2. Database Ready
- Supabase database is deployed ✓
- All tables and functions are created ✓
- Service layer is implemented ✓

## Testing Steps

### Step 1: Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:4321/admin`

### Step 2: Configure HighLevel Integration

1. Go to **HighLevel Config** page (`/admin/highlevel-config`)
2. Enter your HighLevel credentials:
   - API Key
   - Location ID
   - Calendar ID
   - Webhook Secret (optional)
3. Click **Save Configuration**
4. Click **Test Connection**

**Expected Result**: You should see "Connection successful! Found X available slots for today."

### Step 3: Test Integration Flow

1. Go to **Test Integration** page (`/admin/test-integration`)
2. Enter test lead data:
   - Email: test@example.com (or any test email)
   - Phone: 555-123-4567
   - First Name: Test
   - Last Name: User
3. Click **Run Integration Test**

**Expected Results**:
- ✅ Lead created/found in Supabase
- ✅ Activity tracked successfully
- ✅ HighLevel contact synced
- ✅ Appointment created in database
- ✅ HighLevel appointment created
- ✅ Calendar availability retrieved

### Step 4: Verify in HighLevel

1. Log into your HighLevel account
2. Go to **Contacts** and search for the test email
3. Verify the contact was created with:
   - Correct name and phone
   - Tag: "test-integration"
4. Go to **Calendar** and verify the appointment was created

### Step 5: Check Database Records

Run these queries in Supabase SQL Editor:

```sql
-- Check leads
SELECT * FROM leads WHERE email = 'test@example.com';

-- Check activities
SELECT * FROM lead_activities 
WHERE lead_id IN (SELECT id FROM leads WHERE email = 'test@example.com')
ORDER BY created_at DESC;

-- Check appointments
SELECT * FROM appointments 
WHERE lead_id IN (SELECT id FROM leads WHERE email = 'test@example.com');

-- Check HighLevel sync status
SELECT * FROM highlevel_sync_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 6: Test Webhook (Optional)

1. Set up webhook in HighLevel:
   - Go to Settings → Webhooks
   - Add new webhook
   - URL: `https://your-domain.com/.netlify/functions/highlevel-webhook`
   - Events: contact.create, contact.update, appointment.create, appointment.update

2. Create a contact in HighLevel manually
3. Check if it syncs back to your database:

```sql
-- Check webhook logs
SELECT * FROM webhook_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **"Connection failed: 401 Unauthorized"**
   - Verify your API Key is correct
   - Ensure the API Key has proper permissions

2. **"Connection failed: Location not found"**
   - Double-check your Location ID
   - Ensure you're using the Location ID, not the Agency ID

3. **"No calendar slots available"**
   - Verify your Calendar ID is correct
   - Check if the calendar has available time slots configured
   - Ensure calendar is published and active

4. **Lead creates but HighLevel sync fails**
   - Check API rate limits (HighLevel has rate limiting)
   - Verify network connectivity
   - Check error logs in database

### Debug Mode

To enable detailed logging, update your `.env.local`:

```bash
# Add these for debugging
HIGHLEVEL_DEBUG=true
DATABASE_DEBUG=true
```

Then check browser console and server logs for detailed information.

## Production Checklist

Before going live:

- [ ] Remove test data from database
- [ ] Set up production webhook URL
- [ ] Configure production API credentials
- [ ] Test with real form submission
- [ ] Verify email notifications work
- [ ] Check appointment reminders
- [ ] Test on mobile devices
- [ ] Monitor error logs for 24 hours

## API Rate Limits

HighLevel has the following rate limits:
- 200 requests per minute per location
- 5,000 requests per hour per location

Our integration includes retry logic with exponential backoff to handle rate limiting gracefully.

## Next Steps

Once testing is complete:

1. Update your contact forms to use the new `LeadService`
2. Set up monitoring for failed syncs
3. Create admin notifications for errors
4. Document any custom workflows for your team

## Support

If you encounter issues:
1. Check the sync logs in the database
2. Review browser console for errors
3. Check HighLevel API status
4. Contact HighLevel support for API-specific issues