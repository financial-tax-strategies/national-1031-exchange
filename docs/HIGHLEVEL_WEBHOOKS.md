# HighLevel Webhook Configuration Guide

Complete guide for setting up and managing HighLevel webhooks for appointment notifications.

## Table of Contents

1. [Webhook Overview](#webhook-overview)
2. [Edge Function Setup](#edge-function-setup)
3. [Security Configuration](#security-configuration)
4. [Event Types & Payloads](#event-types--payloads)
5. [Local Development](#local-development)
6. [Testing Webhooks](#testing-webhooks)
7. [Monitoring & Health](#monitoring--health)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Webhook Overview

The webhook system enables real-time updates when appointments are assigned in HighLevel's round-robin system.

### Architecture

```
HighLevel → Webhook Event → Netlify Edge Function → Supabase → Real-time Update → UI
```

### Key Features

- **Edge Deployment**: Low-latency processing
- **Signature Verification**: Secure webhook validation
- **Database Logging**: Complete audit trail
- **Error Handling**: Graceful failure recovery
- **Real-time Updates**: Instant UI feedback

## Edge Function Setup

### File Location

```
netlify/edge-functions/highlevel-webhook.ts
```

### Function Configuration

```typescript
export const config: Config = {
  path: '/api/webhooks/highlevel'
};
```

### Deployment

Edge Functions deploy automatically with your site:

```bash
git push origin main
# Netlify builds and deploys edge functions
```

### Verify Deployment

1. Netlify Dashboard → Functions
2. Look for `highlevel-webhook`
3. Check logs for recent invocations

## Security Configuration

### 1. Generate Webhook Secret

```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Example: a3f8d9e7b2c5f1a8d3e9b7c2f5a1d8e3b9c7f2a5d1e8b3c9f7a2d5e1b8c3f9

# Add to .env
HIGHLEVEL_WEBHOOK_SECRET=your_generated_secret
```

### 2. Configure in HighLevel

1. Go to HighLevel → Settings → Webhooks
2. Add custom header:
   - Key: `X-Webhook-Secret`
   - Value: Your generated secret

### 3. Signature Verification

The Edge Function verifies each webhook:

```typescript
async function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const data = encoder.encode(JSON.stringify(payload));
  const expectedSignature = await crypto.subtle.sign('HMAC', key, data);
  
  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedHex === signature.replace(/^sha256=/, '');
}
```

### 4. Environment Variables

Set in Netlify Dashboard:

```bash
HIGHLEVEL_WEBHOOK_SECRET=your_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Event Types & Payloads

### Appointment Update Event

Triggered when appointment is assigned to a specialist.

```json
{
  "id": "evt_123456789",
  "type": "AppointmentUpdate",
  "locationId": "loc_ABC123",
  "contactId": "con_DEF456",
  "calendarId": "cal_GHI789",
  "appointmentId": "apt_JKL012",
  "assignedUserId": "usr_MNO345",
  "assignedUserName": "John Specialist",
  "selectedTimezone": "America/New_York",
  "selectedSlot": "2025-02-15T14:00:00",
  "status": "confirmed",
  "appointmentStatus": "confirmed",
  "meetingLocation": "https://zoom.us/j/123456789",
  "meetingLocationType": "zoom",
  "notes": "1031 Exchange Consultation",
  "createdAt": "2025-02-01T10:30:00Z",
  "updatedAt": "2025-02-01T10:35:00Z"
}
```

### Appointment Create Event

Triggered when appointment is initially created.

```json
{
  "id": "evt_987654321",
  "type": "AppointmentCreate",
  "locationId": "loc_ABC123",
  "contactId": "con_DEF456",
  "calendarId": "cal_GHI789",
  "appointmentId": "apt_JKL012",
  "selectedTimezone": "America/New_York",
  "selectedSlot": "2025-02-15T14:00:00",
  "status": "scheduled",
  "appointmentStatus": "scheduled",
  "createdAt": "2025-02-01T10:30:00Z"
}
```

### Appointment Delete Event

Triggered when appointment is cancelled.

```json
{
  "id": "evt_456789123",
  "type": "AppointmentDelete",
  "appointmentId": "apt_JKL012",
  "reason": "Customer requested cancellation",
  "deletedAt": "2025-02-01T11:00:00Z"
}
```

## Local Development

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Start Local Server

```bash
# In project root
netlify dev

# Starts on http://localhost:8888
# Edge functions available at http://localhost:8888/api/webhooks/highlevel
```

### 3. Expose Local Endpoint

Use ngrok for webhook testing:

```bash
# Install ngrok
brew install ngrok # macOS
# or download from https://ngrok.com

# Expose local server
ngrok http 8888

# Output:
# Forwarding https://abc123.ngrok.io -> http://localhost:8888
```

### 4. Configure Test Webhook

In HighLevel:
1. Create test webhook
2. URL: `https://abc123.ngrok.io/api/webhooks/highlevel`
3. Test with real appointments

## Testing Webhooks

### 1. Manual Testing

Send test webhook with curl:

```bash
curl -X POST http://localhost:8888/api/webhooks/highlevel \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your_secret" \
  -d '{
    "type": "AppointmentUpdate",
    "appointmentId": "test_123",
    "assignedUserId": "usr_test",
    "assignedUserName": "Test Specialist",
    "appointmentStatus": "confirmed",
    "meetingLocation": "https://zoom.us/j/test"
  }'
```

### 2. Test Script

Create `test-webhook.js`:

```javascript
const crypto = require('crypto');

async function testWebhook() {
  const payload = {
    type: 'AppointmentUpdate',
    appointmentId: 'apt_test_' + Date.now(),
    assignedUserId: 'usr_test',
    assignedUserName: 'Test Specialist',
    appointmentStatus: 'confirmed',
    meetingLocation: 'https://zoom.us/j/123456789'
  };

  const secret = process.env.HIGHLEVEL_WEBHOOK_SECRET;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  const response = await fetch('http://localhost:8888/api/webhooks/highlevel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': `sha256=${signature}`
    },
    body: JSON.stringify(payload)
  });

  console.log('Response:', response.status, await response.text());
}

testWebhook();
```

### 3. HighLevel Test Button

1. Go to HighLevel → Webhooks
2. Find your webhook
3. Click "Test" button
4. Check logs for receipt

## Monitoring & Health

### 1. Webhook Logs

Query recent webhooks:

```sql
-- Recent webhook receipts
SELECT 
  id,
  webhook_type,
  processed,
  processing_error,
  received_at
FROM webhook_logs
ORDER BY received_at DESC
LIMIT 20;

-- Failed webhooks
SELECT * FROM webhook_logs
WHERE processing_error IS NOT NULL
ORDER BY received_at DESC;

-- Webhook processing time
SELECT 
  webhook_type,
  AVG(EXTRACT(EPOCH FROM (processed_at - received_at))) as avg_seconds,
  COUNT(*) as total
FROM webhook_logs
WHERE processed = true
GROUP BY webhook_type;
```

### 2. Health Check Endpoint

Add health check to Edge Function:

```typescript
if (request.method === 'GET' && request.url.includes('/health')) {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: Deno.env.get('DENO_DEPLOYMENT_ID')
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 3. Monitoring Setup

Configure alerts:

```sql
-- Alert if no webhooks received in 1 hour
SELECT COUNT(*) as webhook_count
FROM webhook_logs
WHERE received_at > NOW() - INTERVAL '1 hour';

-- Alert if high failure rate
SELECT 
  COUNT(*) FILTER (WHERE processing_error IS NOT NULL) as failed,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE processing_error IS NOT NULL)::numeric / COUNT(*) * 100, 2) as failure_rate
FROM webhook_logs
WHERE received_at > NOW() - INTERVAL '1 hour';
```

### 4. Netlify Function Analytics

View in Netlify Dashboard:
- Function invocations
- Error rates
- Duration metrics
- Log streams

## Troubleshooting

### Common Issues

#### 1. Webhook Not Received

**Check HighLevel Configuration:**
```bash
# Verify webhook URL
https://your-site.netlify.app/api/webhooks/highlevel

# Test with curl
curl -I https://your-site.netlify.app/api/webhooks/highlevel
```

**Check Netlify Logs:**
1. Netlify Dashboard → Functions
2. Click `highlevel-webhook`
3. View real-time logs

#### 2. Signature Verification Failed

**Debug signature:**
```typescript
console.log('Received signature:', signature);
console.log('Expected signature:', expectedHex);
console.log('Secret exists:', !!secret);
```

**Common causes:**
- Secret mismatch between HighLevel and Netlify
- Missing `sha256=` prefix handling
- Character encoding issues

#### 3. Database Update Failed

**Check Supabase:**
```sql
-- Check if appointment exists
SELECT * FROM appointments
WHERE highlevel_appointment_id = 'apt_xxx';

-- Check service role permissions
SELECT * FROM pg_policies
WHERE tablename = 'appointments';
```

#### 4. Real-time Updates Not Working

**Verify Supabase replication:**
1. Dashboard → Database → Replication
2. Ensure `appointments` table enabled
3. Check for subscription errors

### Debug Mode

Enable verbose logging:

```typescript
const DEBUG = Deno.env.get('WEBHOOK_DEBUG') === 'true';

if (DEBUG) {
  console.log('Webhook received:', {
    method: request.method,
    headers: Object.fromEntries(request.headers),
    url: request.url
  });
}
```

## Best Practices

### 1. Idempotency

Handle duplicate webhooks:

```typescript
// Check if already processed
const existing = await supabase
  .from('webhook_logs')
  .select('id')
  .eq('payload->id', payload.id)
  .single();

if (existing) {
  console.log('Webhook already processed:', payload.id);
  return new Response('Already processed', { status: 200 });
}
```

### 2. Timeout Handling

Set reasonable timeouts:

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(timeout);
}
```

### 3. Error Recovery

Implement retry queue:

```sql
-- Create retry queue table
CREATE TABLE webhook_retry_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webhook_payload JSONB NOT NULL,
  retry_count INT DEFAULT 0,
  next_retry_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process retries
SELECT * FROM webhook_retry_queue
WHERE next_retry_at <= NOW()
AND retry_count < 5;
```

### 4. Security Headers

Always validate:

```typescript
// Validate content type
if (request.headers.get('content-type') !== 'application/json') {
  return new Response('Invalid content type', { status: 400 });
}

// Validate payload size
const body = await request.text();
if (body.length > 100000) { // 100KB limit
  return new Response('Payload too large', { status: 413 });
}
```

### 5. Monitoring

Track key metrics:

```typescript
// Log webhook metrics
await supabase.from('webhook_metrics').insert({
  event_type: payload.type,
  processing_time_ms: Date.now() - startTime,
  success: !error,
  appointment_id: payload.appointmentId
});
```

## Webhook Testing Checklist

- [ ] Webhook URL correctly configured in HighLevel
- [ ] Secret key matches in both systems
- [ ] Edge Function deployed and accessible
- [ ] Database permissions configured
- [ ] Real-time subscriptions enabled
- [ ] Error logging in place
- [ ] Monitoring alerts configured
- [ ] Backup polling mechanism tested
- [ ] Load testing performed
- [ ] Security headers validated

---

*For webhook issues, check Edge Function logs first, then database webhook_logs table.*