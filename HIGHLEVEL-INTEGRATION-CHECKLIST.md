# HighLevel Integration Testing Checklist

## 🚀 Quick Start Testing

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your Supabase credentials:
  ```
  PUBLIC_SUPABASE_URL=https://fweohnekiahcvnfcpfic.supabase.co
  PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_KEY=your-service-key
  ```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Admin Panel
Navigate to: `http://localhost:4321/admin`

### 4. Configure HighLevel
1. Go to **HighLevel Config** (`/admin/highlevel-config`)
2. Enter your HighLevel credentials:
   - **API Key**: Get from HighLevel Settings → Business Profile → API Key
   - **Location ID**: Get from HighLevel Settings → Business Profile
   - **Calendar ID**: Get from HighLevel Calendars → Select Calendar → Settings
3. Click **Save Configuration**
4. Click **Test Connection**

✅ **Success Indicator**: "Connection successful! Found X available slots for today."

### 5. Run Integration Test
1. Go to **Test Integration** (`/admin/test-integration`)
2. Use default test data or enter your own
3. Click **Run Integration Test**

✅ **Success Indicators**:
- Lead created/found ✓
- Activity tracked ✓
- HighLevel contact synced ✓
- Appointment created ✓
- HighLevel appointment synced ✓
- Calendar availability retrieved ✓

## 🔍 Verification Steps

### Check in HighLevel
1. Log into HighLevel
2. Go to **Contacts** → Search for test email
3. Verify contact has:
   - Correct name and phone
   - Tag: "test-integration"
4. Go to **Calendar** → Verify appointment exists

### Check in Database (Supabase)
Run in SQL Editor:
```sql
-- View recent leads
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;

-- View recent activities
SELECT la.*, l.email 
FROM lead_activities la
JOIN leads l ON la.lead_id = l.id
ORDER BY la.created_at DESC 
LIMIT 5;

-- View sync logs
SELECT * FROM highlevel_sync_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🛠️ Troubleshooting

### Common Issues & Solutions

**1. "Connection failed: 401 Unauthorized"**
- Double-check your API Key
- Ensure it has proper permissions in HighLevel

**2. "No calendar slots available"**
- Verify Calendar ID is correct
- Check calendar has available slots in HighLevel
- Ensure calendar is published

**3. Lead creates but sync fails**
- Check HighLevel API rate limits
- Look at sync logs in database
- Verify network connectivity

**4. Database connection errors**
- Verify Supabase credentials in `.env.local`
- Check if tables are created in Supabase
- Ensure service role key has proper permissions

## 📝 Integration Points

### Forms to Update
Once testing is successful, update these forms to use the new lead capture:

1. **Contact Form** → Use `LeadService.findOrCreateLead()`
2. **Calculator Form** → Track as lead activity
3. **Appointment Booking** → Use `AppointmentService.createAppointment()`
4. **Download Forms** → Track downloads as activities

### Example Implementation
See `/src/components/forms/ContactFormExample.tsx` for a complete example of form integration.

## 🚨 Production Deployment

### Before Going Live
- [ ] Test with production HighLevel credentials
- [ ] Set up webhook URL in HighLevel
- [ ] Configure production environment variables
- [ ] Test all forms with real data
- [ ] Monitor sync logs for 24 hours
- [ ] Set up error notifications

### Environment Variables for Production
```bash
# Netlify/Vercel environment variables
PUBLIC_SUPABASE_URL=your-production-url
PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_KEY=your-production-service-key
```

## 📊 Monitoring

### Key Metrics to Track
- Lead capture rate
- HighLevel sync success rate
- Appointment booking conversion
- API error rate
- Response times

### SQL Queries for Monitoring
```sql
-- Daily lead count
SELECT DATE(created_at) as date, COUNT(*) as leads
FROM leads
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Sync success rate
SELECT 
  sync_type,
  status,
  COUNT(*) as count
FROM highlevel_sync_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY sync_type, status;
```

## ✅ Sign-off Checklist

- [ ] All test cases pass
- [ ] HighLevel connection verified
- [ ] Database records created correctly
- [ ] No errors in console or logs
- [ ] Forms ready for integration
- [ ] Documentation reviewed
- [ ] Team trained on admin panel

---

**Need Help?** 
- Check `/docs/HIGHLEVEL-INTEGRATION-TESTING.md` for detailed guide
- Review sync logs in database
- Check HighLevel API documentation