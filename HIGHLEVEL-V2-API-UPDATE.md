# HighLevel API Update - January 2025 (DEPRECATED)

## ⚠️ IMPORTANT: This Document Contains Incorrect Information

**Please refer to [HIGHLEVEL-API-CLARIFICATION.md](./HIGHLEVEL-API-CLARIFICATION.md) for accurate information.**

## What Happened

1. We initially thought HighLevel had a "V2 API" that required changing to `rest.gohighlevel.com`
2. After investigation, we discovered this was incorrect for Private Integration apps
3. The correct base URL remains `https://services.leadconnectorhq.com`
4. We have reverted all changes back to the original, correct implementation

## Lessons Learned

- HighLevel has two different API implementations:
  - Private Integration (API Key) - uses `services.leadconnectorhq.com`
  - Public App (OAuth2) - uses `rest.gohighlevel.com`
- The `Version: '2021-07-28'` header is not the same as "V2 API"
- Always verify API changes with working implementations before making sweeping changes

---
*This document is kept for historical reference only*
*Updated: January 2025*