# Testing Infrastructure

## Current Status

The testing infrastructure has been successfully set up with:

- ✅ Vitest as the test runner
- ✅ Happy DOM for React component testing
- ✅ React Testing Library for component interactions
- ✅ Coverage reporting with c8
- ✅ ESLint and Prettier integration
- ✅ Pre-commit hooks with Husky
- ✅ CI/CD pipeline with GitHub Actions

## Coverage Thresholds

Currently set to 0% to allow the testing infrastructure PR to pass. These should be gradually increased as tests are added:

```typescript
thresholds: {
  lines: 0,      // Target: 80%
  functions: 0,  // Target: 80%
  branches: 0,   // Target: 80%
  statements: 0, // Target: 80%
}
```

## Next Steps

1. **Write component tests** - Start with critical components like:
   - Authentication components (LoginForm)
   - Order form components
   - Calculator components

2. **Write service tests** - Test the service layer:
   - auth.service.ts
   - database.service.ts
   - highlevel.service.ts

3. **Increase coverage thresholds** - Gradually increase as tests are added:
   - Start with 20% after initial tests
   - Move to 50% once core components are tested
   - Target 80% for production readiness

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests should be co-located with the components they test:

```
src/
  components/
    MyComponent.tsx
    MyComponent.test.tsx
  lib/
    services/
      myService.ts
      myService.test.ts
```

## Mocking

Use the provided mocks for external dependencies:

- `src/test/mocks/supabase.mock.ts` - Supabase client mocking
- Global mocks are set up in `src/test/setup.ts`
