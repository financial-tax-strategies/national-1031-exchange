# HighLevel Integration Troubleshooting - Next Steps

## What We've Done

1. **Reverted all changes** back to the original implementation:
   - Base URL: `https://services.leadconnectorhq.com`
   - No `/api/v2/` prefixes on endpoints
   - Original authentication headers

2. **Discovered the confusion**:
   - There's no "V2 API" for Private Integration apps
   - The working wagh50 project uses the same base URL and structure
   - The issue isn't with the API endpoints themselves

## Current Status

The code is now identical to the working implementation in the wagh50 project, which means the issue is likely:
- Configuration-related (API keys, IDs)
- Permission-related (API key permissions)
- Environment-specific

## Troubleshooting Steps

### 1. Verify Environment Variables
Check that these are correctly set in both local `.env` and Netlify:
```bash
PUBLIC_HIGHLEVEL_API_KEY=
PUBLIC_HIGHLEVEL_LOCATION_ID=
PUBLIC_HIGHLEVEL_CALENDAR_ID=
```

### 2. Test API Key Permissions
Run the test script to verify basic connectivity:
```bash
npm run test:highlevel
# or
node scripts/test-highlevel-api.mjs
```

### 3. Check Specific Errors
The original issue wasn't clearly defined. We need to identify:
- Are contacts not being created?
- Are appointments failing?
- Are calendar slots not showing?
- Are there console errors?

### 4. Debug with Detailed Logging
Add console.log statements in key places:
- In `HighLevelService.makeRequest()` - log requests and responses
- In `leadCapture.syncToHighLevel()` - log the sync process
- In appointment booking flows - log each step

### 5. Verify HighLevel Configuration
In HighLevel dashboard, verify:
- API key is active and has correct permissions
- Location ID matches the subaccount
- Calendar ID exists and is accessible
- Custom fields exist with correct keys

### 6. Test Each Component Individually

#### Test Contact Creation:
```javascript
// In the browser console or a test script
const testContact = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  locationId: 'YOUR_LOCATION_ID'
};

// Make direct API call to test
```

#### Test Calendar Availability:
```javascript
// Test if calendar endpoint works
const calendarId = 'YOUR_CALENDAR_ID';
const startDate = Math.floor(Date.now() / 1000);
const endDate = startDate + 86400;
```

### 7. Compare with Working Implementation
Since wagh50 project works, compare:
- Exact API key format
- Location ID format
- How the integration is triggered
- Any middleware or edge functions

## Common Issues and Solutions

1. **401 Unauthorized**
   - API key is invalid or expired
   - Wrong format (missing "Bearer " prefix)

2. **404 Not Found**
   - Wrong location ID
   - Calendar doesn't exist
   - Custom field keys don't match

3. **400 Bad Request**
   - Missing required fields
   - Wrong data format
   - Invalid phone number format

4. **No Response / Timeout**
   - Network issues
   - CSP blocking (check browser console)
   - CORS issues (should not happen with server-side calls)

## Next Actions

1. Run `npm run test:highlevel` and share the exact error messages
2. Check browser console for any errors when submitting forms
3. Check Netlify function logs for server-side errors
4. Verify all IDs and keys match between environments

## Contact Support

If basic troubleshooting doesn't resolve the issue:
1. Contact HighLevel support with:
   - Your location ID
   - Exact error messages
   - API endpoints being called
2. Ask specifically about Private Integration app requirements

---
*Created: January 2025*