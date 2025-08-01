# HighLevel Integration Troubleshooting Guide

This guide helps diagnose and resolve common issues with the HighLevel CRM integration.

## Quick Diagnostics

### System Health Check

Run through this checklist first:

1. ✅ **API Keys Valid**: Test in HighLevel API explorer
2. ✅ **Database Connected**: Check Supabase dashboard
3. ✅ **Webhooks Active**: Verify in HighLevel settings
4. ✅ **Edge Functions Running**: Check Netlify Functions tab
5. ✅ **Real-time Enabled**: Verify in Supabase Replication

## Common Issues & Solutions

### 1. Availability Not Loading

#### Symptoms
- Calendar shows "Loading..." indefinitely
- No dates appear for selection
- Console shows 404 or 401 errors

#### Diagnosis
```javascript
// Check browser console for:
// - Network tab → failed requests to HighLevel
// - Console errors → API key issues
// - Application tab → missing env variables
```

#### Solutions

**Invalid API Key**
```bash
# Verify API key in .env
HIGHLEVEL_API_KEY=ghl_xxxxx

# Test directly:
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://services.leadconnectorhq.com/locations/YOUR_LOCATION_ID
```

**Wrong Calendar ID**
1. Log into HighLevel
2. Navigate to calendar
3. Check URL: `/calendars/YOUR_CALENDAR_ID`
4. Update environment variable

**Hardcoded Calendar ID (404 Error)**
```
# Error: GET .../calendars/will-be-loaded-from-config/... 404
# Root Cause: Calendar ID not loaded from environment variables

# Solution: Add getter to HighLevelService
getCalendarId(): string {
  return this.config.calendarId;
}

# Use in components:
calendarId: highlevelService.current.getCalendarId()
```

**CORS Issues**
- Ensure API calls go through your backend
- Never call HighLevel directly from frontend

**Content Security Policy (CSP) Blocking**
```
# Error: Refused to connect to 'https://services.leadconnectorhq.com/...'
# Solution: Update netlify.toml
Content-Security-Policy = "... connect-src 'self' https://www.google-analytics.com https://services.leadconnectorhq.com https://*.supabase.co wss://*.supabase.co;"
```

### 2. Appointments Not Creating

#### Symptoms
- "Schedule" button spins indefinitely
- Error message appears
- Appointment not in HighLevel

#### Diagnosis
```sql
-- Check recent appointments in Supabase
SELECT * FROM appointments 
ORDER BY created_at DESC 
LIMIT 10;

-- Check webhook logs
SELECT * FROM webhook_logs 
WHERE appointment_id IS NULL 
ORDER BY received_at DESC;
```

#### Solutions

**Missing Required Fields**
```typescript
// Ensure all required fields are provided:
const required = {
  email: 'required',
  firstName: 'required',
  lastName: 'required',
  appointmentDate: 'ISO string required',
  timezone: 'required'
};
```

**Contact Creation Failed**
- Check custom fields exist in HighLevel
- Verify email format is valid
- Check for duplicate contact restrictions

**Rate Limiting**
```javascript
// Look for 429 status codes
// Solution: Implement exponential backoff
await delay(60000); // Wait 1 minute
```

### 3. Webhooks Not Received

#### Symptoms
- Appointments stuck in "pending_assignment"
- No entries in webhook_logs table
- Polling activates after 2 minutes

#### Diagnosis
```bash
# Test webhook endpoint
curl -X POST https://your-site.netlify.app/api/webhooks/highlevel \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your_secret" \
  -d '{"type":"AppointmentUpdate","appointmentId":"test"}'
```

#### Solutions

**Webhook URL Incorrect**
1. Verify URL in HighLevel webhook settings
2. Ensure it includes `/api/webhooks/highlevel`
3. Use HTTPS (not HTTP)

**Signature Verification Failed**
```typescript
// Ensure webhook secret matches in both:
// 1. HighLevel webhook headers
// 2. Netlify environment variables
HIGHLEVEL_WEBHOOK_SECRET=same_value_both_places
```

**Edge Function Not Deployed**
```bash
# Check Netlify Functions tab
# Should see: highlevel-webhook

# Redeploy if missing:
git push origin main
```

### 4. Real-time Updates Not Working

#### Symptoms
- UI doesn't update when appointment assigned
- Have to refresh to see changes
- Subscription errors in console

#### Diagnosis
```javascript
// Check browser console for:
// - WebSocket connection errors
// - Subscription state
// - Network tab → WS connections
```

#### Solutions

**Realtime Not Enabled**
1. Supabase Dashboard → Database → Replication
2. Enable for `appointments` table
3. Select all events (INSERT, UPDATE, DELETE)

**RLS Policies Blocking**
```sql
-- Ensure public can read appointments
CREATE POLICY "Public can read appointments" ON appointments
  FOR SELECT USING (true);
```

**Subscription Cleanup**
```typescript
// Always cleanup subscriptions:
useEffect(() => {
  const sub = subscribeToAppointment(id, callback);
  return () => sub.unsubscribe(); // Critical!
}, [id]);
```

### 5. Polling Not Working

#### Symptoms
- No updates after webhook fails
- Appointment stays pending forever
- No polling logs in console

#### Diagnosis
```typescript
// Add debug logging:
console.log('Polling attempt:', attemptNumber);
console.log('Appointment status:', appointment.status);
```

#### Solutions

**Polling Not Started**
- Check 2-minute timer is set
- Verify poller instance created
- Ensure appointment ID is valid

**Max Attempts Reached**
```sql
-- Check polling attempts
SELECT id, polling_attempts, last_polled_at 
FROM appointments 
WHERE status = 'pending_assignment';

-- Reset if needed
UPDATE appointments 
SET polling_attempts = 0 
WHERE id = 'appointment_id';
```

### 6. Performance Issues

#### Symptoms
- Slow availability loading
- Appointment creation takes >5 seconds
- UI feels sluggish

#### Diagnosis
```javascript
// Measure performance:
console.time('availability-load');
await loadAvailability();
console.timeEnd('availability-load');
```

#### Solutions

**Implement Caching**
```typescript
// Check cache before API:
const cached = await getCachedAvailability(cacheKey);
if (cached) return cached;
```

**Optimize Date Ranges**
```typescript
// Don't load too many days:
const MAX_DAYS = 14; // Not 60
```

**Batch Operations**
```typescript
// Group similar requests:
const slots = await Promise.all(dates.map(loadSlots));
```

## Debugging Techniques

### 1. Enable Debug Mode

Add to booking component:
```typescript
options={{
  debugMode: true, // Enables console logging
  timezone: 'America/New_York',
  prefetchDays: 14
}}
```

### 2. Browser DevTools

**Network Tab**
- Filter by "Fetch/XHR"
- Look for failed requests (red)
- Check request/response details

**Console Logging**
```javascript
// Add strategic logs:
console.log('[Booking] State:', currentStep);
console.log('[Booking] Appointment:', appointment);
console.log('[Booking] Error:', error);
```

**Application Tab**
- Check Local Storage for state
- Verify environment variables loaded

### 3. Supabase Logs

**SQL Editor Queries**
```sql
-- Recent appointments
SELECT * FROM appointments 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Failed webhooks
SELECT * FROM webhook_logs 
WHERE processing_error IS NOT NULL
ORDER BY received_at DESC;

-- Appointment lifecycle
SELECT id, status, created_at, updated_at,
       webhook_received_at, polling_attempts
FROM appointments
WHERE contact_email = 'user@example.com';
```

### 4. Netlify Function Logs

1. Netlify Dashboard → Functions
2. Click on `highlevel-webhook`
3. View real-time logs
4. Look for error patterns

## Testing Procedures

### 1. End-to-End Test

```bash
# 1. Start local dev
npm run dev

# 2. Complete calculator
# 3. Click "Schedule Free Consultation"
# 4. Select date and time
# 5. Confirm booking
# 6. Wait for assignment
# 7. Verify success state
```

### 2. Webhook Test

```javascript
// Trigger test webhook:
const testPayload = {
  type: 'AppointmentUpdate',
  appointmentId: 'apt_123',
  assignedUserId: 'user_456',
  assignedUserName: 'John Specialist',
  appointmentStatus: 'confirmed'
};

// Send to your webhook endpoint
```

### 3. Error Simulation

```typescript
// Test error handling:
// 1. Use invalid API key
// 2. Disconnect network
// 3. Use past dates
// 4. Submit without required fields
```

## Recovery Procedures

### 1. Stuck Appointments

```sql
-- Find stuck appointments
SELECT * FROM appointments 
WHERE status = 'pending_assignment'
AND created_at < NOW() - INTERVAL '10 minutes';

-- Manual update if needed
UPDATE appointments 
SET status = 'failed',
    webhook_payload = '{"manual_intervention": true}'
WHERE id = 'stuck_appointment_id';
```

### 2. Clear Cache

```sql
-- Clear expired cache
DELETE FROM availability_cache 
WHERE expires_at < NOW();

-- Force cache refresh
TRUNCATE availability_cache;
```

### 3. Reset Integration

If all else fails:

```sql
-- Backup data first!
-- Then clean tables:
DELETE FROM webhook_logs WHERE processed = false;
UPDATE appointments SET status = 'failed' 
WHERE status = 'pending_assignment';
```

## Performance Optimization

### 1. Database Indexes

Ensure these indexes exist:
```sql
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created ON appointments(created_at);
CREATE INDEX idx_webhook_logs_processed ON webhook_logs(processed);
```

### 2. Monitoring Queries

```sql
-- Appointment success rate
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  ROUND(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as success_rate
FROM appointments
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average assignment time
SELECT 
  AVG(EXTRACT(EPOCH FROM (webhook_received_at - created_at))) as avg_seconds
FROM appointments
WHERE status = 'confirmed'
AND webhook_received_at IS NOT NULL;
```

## Error Codes Reference

| Code | Description | Solution |
|------|-------------|----------|
| `API_TIMEOUT` | Request took too long | Retry with backoff |
| `API_RATE_LIMIT` | Too many requests | Wait 60 seconds |
| `NO_AVAILABILITY` | No slots available | Try different dates |
| `CONTACT_CREATION_FAILED` | Can't create contact | Check required fields |
| `APPOINTMENT_CREATION_FAILED` | Can't create appointment | Verify all data |
| `ASSIGNMENT_TIMEOUT` | No specialist assigned | Check HighLevel setup |
| `INVALID_CONFIG` | Missing configuration | Check env variables |
| `NETWORK_ERROR` | Connection failed | Check internet/API |

### BookingErrorCode Undefined in Production

**Symptoms:**
```
ReferenceError: BookingErrorCode is not defined
```

**Root Cause:** TypeScript enum tree-shaking during bundling

**Solution:**
1. Convert enum to const assertion in `highlevel.ts`:
```typescript
export const BookingErrorCode = {
  API_TIMEOUT: 'API_TIMEOUT',
  // ... other codes
} as const;
export type BookingErrorCode = typeof BookingErrorCode[keyof typeof BookingErrorCode];
```

2. Import as value, not type:
```typescript
// Wrong
import type { BookingErrorCode } from './types/highlevel';
// Correct
import { BookingErrorCode } from './types/highlevel';
```

## Monitoring Checklist

### Daily Checks
- [ ] Appointment success rate >90%
- [ ] Average assignment time <2 minutes
- [ ] No stuck appointments >10 minutes
- [ ] Webhook delivery rate >95%

### Weekly Checks
- [ ] Clear expired cache entries
- [ ] Review error logs for patterns
- [ ] Check API usage vs limits
- [ ] Verify backup procedures

### Monthly Checks
- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Performance optimization review
- [ ] Security audit

## Support Escalation

### Level 1: Self-Service
1. Check this troubleshooting guide
2. Review error messages
3. Check system status

### Level 2: Development Team
- Include appointment ID
- Provide error screenshots
- Share browser console logs
- Note time of occurrence

### Level 3: External Support
- **HighLevel Support**: API and webhook issues
- **Supabase Support**: Database and real-time
- **Netlify Support**: Edge Functions and deployment

## Additional Resources

- [HighLevel API Status](https://status.gohighlevel.com)
- [Supabase Status](https://status.supabase.com)
- [Netlify Status](https://www.netlifystatus.com)
- [Browser DevTools Guide](https://developer.chrome.com/docs/devtools)

---

*For urgent production issues, contact the on-call developer with appointment ID and error details.*