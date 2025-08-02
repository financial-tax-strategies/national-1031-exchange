# HighLevel V2 API Update - January 2025

## Overview
This document details the critical updates made to ensure compatibility with HighLevel's V2 API endpoints. All API calls have been updated to use the required `/api/v2/` prefix.

## Changes Made

### 1. API Endpoint Updates in `src/lib/services/highlevel.service.ts`

All HighLevel API endpoints have been updated to include the `/api/v2/` prefix:

| Old Endpoint | New Endpoint |
|--------------|--------------|
| `/contacts/` | `/api/v2/contacts/` |
| `/contacts/lookup?email=...` | `/api/v2/contacts/lookup?email=...` |
| `/contacts/{contactId}` | `/api/v2/contacts/{contactId}` |
| `/appointments/` | `/api/v2/appointments/` |
| `/calendars/{id}/free-slots` | `/api/v2/calendars/{id}/free-slots` |

### 2. Method Name Fix in `src/services/leadCapture.ts`

Fixed incorrect method call:
- **Old**: `highLevel.createOrUpdateContact()`
- **New**: `highLevel.syncContact()`

Also updated parameters to match the method signature and fixed TypeScript type issues.

### 3. Test Scripts Updated

All test scripts now use V2 endpoints:
- `scripts/test-highlevel-api.mjs`
- `scripts/test-exact-api.mjs`  
- `scripts/test-customfields.mjs`

## Technical Details

### Headers Configuration
The API continues to use the correct headers:
```javascript
{
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'Version': '2021-07-28'
}
```

### Date Format for Appointments
Appointments correctly use Unix timestamps in seconds (not milliseconds):
```javascript
const startTimestamp = Math.floor(startDate.getTime() / 1000);
```

### Custom Fields Format
Custom fields use the array format:
```javascript
customFields: [
  { key: 'source', value: 'api-test' }
]
```

## Testing Checklist

Before deployment, verify:

- [ ] Contact creation works with V2 endpoints
- [ ] Contact lookup by email functions correctly
- [ ] Contact updates succeed for existing contacts
- [ ] Appointment creation completes successfully
- [ ] Calendar availability fetches properly
- [ ] Webhook processing handles V2 payloads
- [ ] Form submissions create leads without errors

## Environment Variables

Ensure these are set in Netlify:
- `PUBLIC_HIGHLEVEL_API_KEY`
- `PUBLIC_HIGHLEVEL_LOCATION_ID`
- `PUBLIC_HIGHLEVEL_CALENDAR_ID`

## Known Issues

1. **Calendar Endpoint**: The exact V2 calendar endpoint format may need verification with HighLevel support
2. **TypeScript Warnings**: Some type definition warnings exist but don't affect functionality

## Deployment Notes

1. Changes are backward compatible - no database migrations needed
2. Webhooks will continue to work with existing data
3. All forms and integrations will use V2 automatically after deployment

## Support

If issues arise after deployment:
1. Check Netlify function logs for API errors
2. Verify environment variables are set correctly
3. Run test scripts to isolate specific endpoint issues
4. Contact HighLevel support for V2-specific questions

---
*Updated: January 2025*