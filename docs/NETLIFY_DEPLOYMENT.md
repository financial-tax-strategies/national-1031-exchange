# Netlify Deployment & Environment Variables Guide

## ⚠️ Critical Security Information

**NEVER commit .env files to Git!** They contain sensitive API keys that could compromise your accounts and incur charges.

## Understanding Environment Variables in Deployment

### How Environment Variables Work

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Local Development│         │ Git Repository  │         │   Production    │
│                 │         │                 │         │   (Netlify)     │
│  .env file      │ ──NO──▶ │  .env.example   │ ◀──────│ Dashboard Vars  │
│  (API keys)     │         │  (templates)    │         │  (API keys)     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     ↓                                                         ↓
┌─────────────────┐                                    ┌─────────────────┐
│  Your Local     │                                    │  Your Live      │
│  Development    │                                    │  Website        │
└─────────────────┘                                    └─────────────────┘
```

### Key Points:
- **Local**: Use `.env` file (git-ignored)
- **Git**: Only `.env.example` with placeholders
- **Production**: Netlify Dashboard environment variables

## Setting Up Netlify Environment Variables

### Step 1: Access Netlify Dashboard

1. Log in to [Netlify](https://app.netlify.com)
2. Select your site
3. Navigate to: **Site settings** → **Environment variables**

### Step 2: Add Required Variables

Click "Add a variable" for each of these:

#### HighLevel Variables (Required for Booking)
```
VITE_HIGHLEVEL_API_KEY = your-actual-api-key
VITE_HIGHLEVEL_LOCATION_ID = your-actual-location-id
VITE_HIGHLEVEL_CALENDAR_ID = your-actual-calendar-id
```

**How to find these:**
- **API Key**: HighLevel → Settings → Business Profile → API Keys → Create App → Copy API Key
- **Location ID**: HighLevel → Settings → Business Profile → Copy Location ID
- **Calendar ID**: HighLevel → Calendars → Select your calendar → Copy ID from URL

#### Supabase Variables (Required for Data Storage)
```
PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to find these:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `PUBLIC_SUPABASE_URL`
   - anon/public key → `PUBLIC_SUPABASE_ANON_KEY`

#### Webhook Security (For Edge Functions)
```
HIGHLEVEL_WEBHOOK_SECRET = generate-a-secure-secret
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

**Generate webhook secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Find service role key:**
- Supabase Dashboard → Settings → API → service_role key

#### Analytics (Optional but Recommended)
```
GA_MEASUREMENT_ID = G-XXXXXXXXXX
```

### Step 3: Configure Scopes

For each variable, set the scope:
- **All scopes**: For most variables (default)
- **Production only**: For production API keys
- **Preview only**: For testing configurations

### Step 4: Deploy Changes

After adding all variables:
1. Click "Save" for each variable
2. Trigger a new deploy:
   - Option 1: Push a commit to trigger automatic deploy
   - Option 2: Netlify Dashboard → Deploys → "Trigger deploy" → "Clear cache and deploy site"

## Verifying Your Configuration

### Local Development Test
```bash
# Your .env file should have actual values
cat .env | grep VITE_HIGHLEVEL

# Should show:
# VITE_HIGHLEVEL_API_KEY=your-actual-key
# VITE_HIGHLEVEL_LOCATION_ID=your-actual-id
# VITE_HIGHLEVEL_CALENDAR_ID=your-actual-calendar-id
```

### Production Test
1. Open browser developer console on your live site
2. If missing variables, you'll see errors like:
   - "HighLevel configuration is incomplete"
   - "Failed to initialize Supabase"

## Common Issues & Solutions

### Issue: Calendar keeps spinning
**Cause**: Missing or incorrect environment variables
**Solution**: 
1. Verify all VITE_ and PUBLIC_ prefixed variables are set in Netlify
2. Check browser console for specific missing variables
3. Ensure you triggered a new deploy after adding variables

### Issue: Works locally but not on Netlify
**Cause**: Environment variables not set in Netlify Dashboard
**Solution**: Double-check all variables from .env are added to Netlify

### Issue: "Failed to initialize booking system"
**Cause**: Missing VITE_HIGHLEVEL_CALENDAR_ID
**Solution**: 
1. In HighLevel, go to Calendars
2. Click on your calendar
3. Copy the ID from the URL: `/calendars/YOUR_CALENDAR_ID_HERE`
4. Add to Netlify environment variables

### Issue: Webhooks not working
**Cause**: Missing server-side environment variables
**Solution**: Ensure HIGHLEVEL_WEBHOOK_SECRET and SUPABASE_SERVICE_ROLE_KEY are set

## Security Best Practices

### DO ✅
- Use strong, unique API keys
- Rotate keys regularly
- Use different keys for development and production
- Keep .env files out of version control
- Use read-only (anon) keys for client-side code

### DON'T ❌
- Commit .env files to Git
- Share API keys in issues or PRs
- Use service role keys in client-side code
- Hardcode API keys in your source code
- Use production keys in development

## Environment Variable Reference

| Variable | Required | Client/Server | Description |
|----------|----------|---------------|-------------|
| `VITE_HIGHLEVEL_API_KEY` | ✅ | Client | HighLevel API authentication |
| `VITE_HIGHLEVEL_LOCATION_ID` | ✅ | Client | Your HighLevel location/account |
| `VITE_HIGHLEVEL_CALENDAR_ID` | ✅ | Client | Calendar for bookings |
| `PUBLIC_SUPABASE_URL` | ✅ | Client | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client | Supabase public key |
| `HIGHLEVEL_WEBHOOK_SECRET` | ✅ | Server | Webhook verification |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server | Supabase admin operations |
| `GA_MEASUREMENT_ID` | ⚪ | Client | Google Analytics tracking |

## Deployment Checklist

Before deploying:
- [ ] All required variables added to Netlify Dashboard
- [ ] Variable names match exactly (including VITE_ and PUBLIC_ prefixes)
- [ ] No trailing spaces in variable values
- [ ] Calendar ID obtained from HighLevel
- [ ] Supabase project created and configured
- [ ] Webhook secret generated and saved
- [ ] Test booking flow after deployment

## Need Help?

1. Check browser console for specific error messages
2. Review [Troubleshooting Guide](./HIGHLEVEL_TROUBLESHOOTING.md)
3. Verify all variables in Netlify Dashboard
4. Ensure latest deploy includes all changes

---

*Remember: Your .env file is for local development only. Production secrets must be configured in Netlify Dashboard!*