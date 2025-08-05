# 🚨 Immediate Calendar Fix Instructions

## What's Wrong

Your booking calendar is spinning because it's missing the required environment variables with the correct prefixes.

## Quick Fix for Local Development

### 1. Get Your HighLevel Calendar ID

1. Log into HighLevel
2. Navigate to Calendars
3. Click on your calendar
4. Look at the URL - it will be something like: `/calendars/ABC123XYZ`
5. Copy the ID part: `ABC123XYZ`

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one if needed)
3. Go to Settings → API
4. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 3. Update Your .env File

Open your `.env` file and update these values:

```env
# Replace YOUR_CALENDAR_ID_HERE with your actual calendar ID
PUBLIC_HIGHLEVEL_CALENDAR_ID=ABC123XYZ

# Replace with your actual API key and location ID
PUBLIC_HIGHLEVEL_API_KEY=your-api-key-here
PUBLIC_HIGHLEVEL_LOCATION_ID=your-location-id-here

# Replace with your Supabase project URL
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Replace with your Supabase anon key
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate a webhook secret (run this in terminal):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
HIGHLEVEL_WEBHOOK_SECRET=your-generated-secret-here

# Get from Supabase Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## For Production (Netlify)

**NEVER commit your .env file!** Instead:

1. Go to Netlify Dashboard
2. Site settings → Environment variables
3. Add each variable from your .env file
4. Deploy your site

See [Netlify Deployment Guide](./docs/NETLIFY_DEPLOYMENT.md) for detailed instructions.

## Still Having Issues?

Check the browser console for specific error messages. Common issues:

- Missing PUBLIC_HIGHLEVEL_CALENDAR_ID - get from HighLevel
- Missing PUBLIC_HIGHLEVEL_API_KEY or PUBLIC_HIGHLEVEL_LOCATION_ID
- Missing Supabase credentials - create a project at supabase.com
- Wrong variable names (missing PUBLIC\_ prefix for client-side variables)

---

_Remember: Your .env file contains secrets - keep it local only!_
