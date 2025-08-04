# Supabase Setup Instructions for Order Form

## Database Migration Required

The order form submission error is occurring because the required database tables don't exist in your Supabase instance.

## Steps to Fix:

### 1. Access Supabase Dashboard

- Go to https://app.supabase.com
- Navigate to your project (fweohnekiahcvnfcpfic)

### 2. Run the Migration

- Click on "SQL Editor" in the left sidebar
- Click "New query"
- Copy the entire contents of `/supabase/migrations/20250804_create_order_form_submissions.sql`
- Paste it into the SQL editor
- Click "Run" to execute the migration

### 3. Verify Tables Created

After running the migration, you should see these new tables:

- `order_form_submissions` - Main table for storing form data
- `order_form_webhooks` - Webhook logging table
- `order_form_emails` - Email logging table

### 4. Check RLS Policies

The migration includes Row Level Security (RLS) policies that:

- Allow anonymous users to insert new submissions
- Restrict read/update/delete to service role only

### 5. Test the Form

- Clear your browser cache
- Navigate to the order form
- Try submitting a test order
- Check the browser console for any remaining errors

## Troubleshooting

### If you see "permission denied" errors:

1. Check that RLS is enabled on the tables
2. Verify the policies were created correctly
3. Make sure you're using the correct anon key

### If you see "relation does not exist" errors:

1. The migration didn't run successfully
2. Try running it again
3. Check for any SQL syntax errors

### To verify everything is working:

1. Go to Table Editor in Supabase
2. Look for the `order_form_submissions` table
3. It should have all the columns defined in the migration

## Environment Variables

Make sure these are set in your production environment (Netlify):

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Alternative Quick Fix

If you need the form working immediately without setting up the database:

1. We can modify the form to send submissions directly to email/webhook
2. Or save to a different service temporarily
3. Contact me if you need this workaround implemented
