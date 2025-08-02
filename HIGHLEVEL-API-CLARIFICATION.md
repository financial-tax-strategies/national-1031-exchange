# HighLevel API Clarification - January 2025

## Important Discovery: V1 vs V2 Confusion

After extensive investigation and comparison with working implementations, we've discovered an important clarification about HighLevel's API versions.

## Key Finding

**There is no functional "V2" API for Private Integration apps using API Key authentication.**

### Two Different HighLevel Implementations

1. **Private Integration (API Key Authentication)**
   - Base URL: `https://services.leadconnectorhq.com`
   - Authentication: Bearer token with API key
   - Endpoints: Direct paths without `/api/v2/` prefix
   - This is what we use

2. **Public App (OAuth2 Authentication)**
   - Base URL: `https://rest.gohighlevel.com`
   - Authentication: OAuth2
   - Endpoints: May use different patterns
   - Not applicable to our implementation

## What This Means

### Correct Implementation (Reverted)
```javascript
// Correct base URL for Private Integration apps
const baseUrl = 'https://services.leadconnectorhq.com';

// Correct endpoint paths (no /api/v2/ prefix)
const endpoints = {
  contacts: '/contacts/',
  appointments: '/appointments/',
  calendars: '/calendars/{calendarId}/free-slots'
};

// Correct headers
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'Version': '2021-07-28'  // This is an API version header, not "V2 API"
};
```

### Common Misconception
The `Version: '2021-07-28'` header is often confused as indicating "V2 API", but it's actually just an API version header for the services.leadconnectorhq.com endpoint.

## Technical Details

### Authentication
- Uses API Key with Bearer token
- No OAuth2 required for Private Integration apps

### Date Formats
Appointments use Unix timestamps in seconds:
```javascript
const startTimestamp = Math.floor(startDate.getTime() / 1000);
```

### Custom Fields
Custom fields use array format:
```javascript
customFields: [
  { key: 'field_key', value: 'field_value' }
]
```

## Environment Variables
Required for Private Integration:
- `PUBLIC_HIGHLEVEL_API_KEY`
- `PUBLIC_HIGHLEVEL_LOCATION_ID`
- `PUBLIC_HIGHLEVEL_CALENDAR_ID`

## Troubleshooting

If the integration isn't working, check:
1. **API Key Permissions** - Ensure the key has proper permissions
2. **Location ID** - Verify it matches the subaccount
3. **Calendar ID** - Confirm the calendar exists and is accessible
4. **Custom Field Keys** - Ensure they match exactly in HighLevel
5. **Network Access** - Verify `services.leadconnectorhq.com` is accessible

## Support Resources

- HighLevel Private Integration Documentation
- API Key management in HighLevel settings
- Contact HighLevel support for API-specific issues

---
*Clarified: January 2025*