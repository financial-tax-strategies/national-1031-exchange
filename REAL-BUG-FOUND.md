# Real Bug Found - Field Name Mismatch

## The Actual Problem

After pulling from GitHub, I found the **real bug** is different from what I saw in the live form testing.

### Field Name Mismatch

**Location**: Step 7 (Exchange Goals)

**Component Fields** ([ExchangeGoalsStep.tsx](src/components/order-form/steps/ExchangeGoalsStep.tsx)):
- Line 84: `'1031x_order_replacement_identified'`
- Line 120: `'1031x_order_exchange_type'` ✅
- Line 159: `'1031x_order_cash_out_needed'`
- Line 198: `'1031x_order_dst_interest'` ✅

**Schema Fields** ([orderFormSchemas.ts](src/lib/schemas/orderFormSchemas.ts) lines 271-300):
- Line 272: `'1031x_order_replacement_property_identified'` ❌ has `_property`
- Line 279: `'1031x_order_exchange_type'` ✅
- Line 286: `'1031x_order_cash_out_amount'` ❌ says `_amount` not `_needed`
- Line 294: `'1031x_order_dst_interest'` ✅

**Result**: 2 of 4 fields don't match → validation always fails → Continue button stays disabled

---

## The Fix

You need to align the field names. Choose one of these options:

### Option 1: Fix the Component (Recommended)
Update [ExchangeGoalsStep.tsx](src/components/order-form/steps/ExchangeGoalsStep.tsx):

**Line 84** - Change:
```typescript
'1031x_order_replacement_identified'
```
To:
```typescript
'1031x_order_replacement_property_identified'
```

**Line 159** - Change:
```typescript
'1031x_order_cash_out_needed'
```
To:
```typescript
'1031x_order_cash_out_amount'
```

This requires changing it in 3 places for each field (value, onChange, onFocus).

### Option 2: Fix the Schema
Update [orderFormSchemas.ts](src/lib/schemas/orderFormSchemas.ts) lines 272 and 286:

**Line 272** - Change:
```typescript
'1031x_order_replacement_property_identified'
```
To:
```typescript
'1031x_order_replacement_identified'
```

**Line 286** - Change:
```typescript
'1031x_order_cash_out_amount'
```
To:
```typescript
'1031x_order_cash_out_needed'
```

---

## Quick Fix Commands

### Option 1: Fix Component (3 changes per field = 6 total)

```bash
# Backup first
cp src/components/order-form/steps/ExchangeGoalsStep.tsx src/components/order-form/steps/ExchangeGoalsStep.tsx.backup

# Fix replacement_identified field (3 occurrences)
sed -i '' 's/1031x_order_replacement_identified/1031x_order_replacement_property_identified/g' \
  src/components/order-form/steps/ExchangeGoalsStep.tsx

# Fix cash_out field (3 occurrences)
sed -i '' 's/1031x_order_cash_out_needed/1031x_order_cash_out_amount/g' \
  src/components/order-form/steps/ExchangeGoalsStep.tsx
```

### Option 2: Fix Schema (2 changes)

```bash
# Backup first
cp src/lib/schemas/orderFormSchemas.ts src/lib/schemas/orderFormSchemas.ts.backup

# Fix field names in schema
sed -i '' 's/1031x_order_replacement_property_identified/1031x_order_replacement_identified/g' \
  src/lib/schemas/orderFormSchemas.ts

sed -i '' 's/1031x_order_cash_out_amount/1031x_order_cash_out_needed/g' \
  src/lib/schemas/orderFormSchemas.ts
```

---

## Which Option?

**Recommendation**: Fix the Component (Option 1)

**Why**: The schema field names are more descriptive:
- `replacement_property_identified` is clearer than just `replacement_identified`
- `cash_out_amount` is clearer than `cash_out_needed`

Plus, the schema names are likely used in the database, so changing them might affect data storage.

---

## Testing

After applying fix:

```bash
# Start dev server
npm run dev

# Navigate to form
# Fill Steps 1-6
# On Step 7, fill all 4 dropdowns
# Verify Continue button enables
# Complete form to Step 8
```

---

## Impact

**Current**: 100% of users blocked at Step 7 (Exchange Goals)
**After Fix**: Users can proceed normally
**Time to Fix**: 2 minutes
**Risk**: Very low (simple field name change)

---

## Files to Change

### Option 1 (Recommended):
- `src/components/order-form/steps/ExchangeGoalsStep.tsx` (6 changes)

### Option 2:
- `src/lib/schemas/orderFormSchemas.ts` (2 changes)

---

## Summary

**Bug**: Field name mismatch between component and schema
**Fix**: Align field names (choose component OR schema)
**Time**: 2 minutes
**Deploy**: Immediately after testing
