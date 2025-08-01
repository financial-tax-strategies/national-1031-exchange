# Environment Variables Setup for HighLevel Integration

This guide explains how to configure the required environment variables for the HighLevel booking integration.

## ⚠️ CRITICAL SECURITY WARNING

**NEVER commit .env files to Git!** They contain sensitive API keys that could:
- Compromise your accounts
- Allow unauthorized API usage
- Result in unexpected charges
- Expose customer data

The `.gitignore` file is configured to exclude `.env` files, but always double-check before committing.

## Quick Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your actual values in the `.env` file

## Required Environment Variables

### HighLevel API Configuration

```env
# HighLevel API credentials (required for booking)
PUBLIC_HIGHLEVEL_API_KEY=your-api-key-here
PUBLIC_HIGHLEVEL_LOCATION_ID=your-location-id-here
PUBLIC_HIGHLEVEL_CALENDAR_ID=your-calendar-id-here
```

**How to find these values:**
1. **API Key**: HighLevel → Settings → Business Profile → API Keys
2. **Location ID**: HighLevel → Settings → Business Profile → Copy Location ID
3. **Calendar ID**: HighLevel → Calendars → Select your calendar → Copy ID from URL

### Supabase Configuration

```env
# Supabase credentials (required for data storage)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### Webhook Configuration (Server-side)

```env
# Webhook security (for Netlify Edge Functions)
HIGHLEVEL_WEBHOOK_SECRET=generate-a-secure-secret-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Generate webhook secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Environment Variables by Context

### Client-side (Browser)
- `PUBLIC_HIGHLEVEL_API_KEY` - For API calls
- `PUBLIC_HIGHLEVEL_LOCATION_ID` - For contact/appointment creation
- `PUBLIC_HIGHLEVEL_CALENDAR_ID` - For availability and booking
- `PUBLIC_SUPABASE_URL` - For database connection
- `PUBLIC_SUPABASE_ANON_KEY` - For database authentication

### Server-side (Edge Functions)
- `HIGHLEVEL_WEBHOOK_SECRET` - For webhook verification
- `SUPABASE_SERVICE_ROLE_KEY` - For admin database operations

## Setting Environment Variables

### Local Development

1. Create `.env` file in project root
2. Add your values (never commit this file!)
3. Restart dev server after changes

### Netlify Production

1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Add each variable with its production value
4. Deploy or trigger rebuild

### Important Notes

1. **Security**: Never commit `.env` files to git
2. **Prefixes**: 
   - Use `PUBLIC_` for all client-side variables in Astro
   - No prefix for server-side only variables
3. **Validation**: The app will show clear error messages if variables are missing

## Troubleshooting

### "HighLevel configuration is incomplete"
- Check all three HighLevel variables are set
- Ensure no typos in variable names
- Verify values don't have extra spaces

### "Failed to initialize Supabase"
- Check Supabase URL format (https://xxxxx.supabase.co)
- Verify anon key is the correct one (not service role)
- Ensure variables use PUBLIC_ prefix

### Booking calendar not showing
1. Open browser console
2. Look for configuration errors
3. Verify all required variables are set
4. Check Network tab for failed API calls

## Example .env File

```env
# HighLevel
PUBLIC_HIGHLEVEL_API_KEY=ghl_a3f8d9e7b2c5f1a8d3e9b7c2f5a1d8e3
PUBLIC_HIGHLEVEL_LOCATION_ID=loc_ABC123XYZ789
PUBLIC_HIGHLEVEL_CALENDAR_ID=cal_DEF456UVW012

# Supabase
PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhooks (Netlify only)
HIGHLEVEL_WEBHOOK_SECRET=a3f8d9e7b2c5f1a8d3e9b7c2f5a1d8e3b9c7f2a5d1e8b3c9f7a2d5e1b8c3f9
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Production Deployment

**Important**: Environment variables for production must be set in your hosting platform (e.g., Netlify), NOT in Git!

See [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md) for detailed instructions on:
- Setting environment variables in Netlify Dashboard
- Security best practices
- Common deployment issues

## Need Help?

1. Check error messages in browser console
2. Review [Troubleshooting Guide](./HIGHLEVEL_TROUBLESHOOTING.md)
3. Review [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md) for production setup
4. Verify values in HighLevel and Supabase dashboards
5. Contact support with specific error messages