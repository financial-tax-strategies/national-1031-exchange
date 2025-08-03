# Testing Guide

This guide covers testing practices for the National 1031 Exchange platform.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Organization](#test-organization)
- [Mocking](#mocking)
- [Best Practices](#best-practices)
- [Continuous Integration](#continuous-integration)

## Testing Stack

Our testing infrastructure is built on:

- **Vitest**: Fast unit test framework with excellent Vite integration
- **React Testing Library**: Testing utilities focused on user behavior
- **Happy DOM**: Lightweight DOM implementation for faster tests
- **Testing Library Jest DOM**: Additional DOM matchers

## Running Tests

### Available Commands

```bash
# Run all tests once
npm run test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci

# Open Vitest UI for interactive test exploration
npm run test:ui
```

### Test Coverage

We aim for the following coverage thresholds:

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

Coverage reports are generated in the `coverage/` directory.

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, userEvent } from '@test/utils/test-helpers';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(screen.getByText('Button clicked')).toBeInTheDocument();
  });
});
```

### Testing React Components

```typescript
import { render, screen, waitFor } from '@test/utils/test-helpers';
import { createMockLead } from '@test/utils/test-helpers';
import LeadCard from './LeadCard';

describe('LeadCard', () => {
  it('should display lead information', () => {
    const mockLead = createMockLead({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com'
    });

    render(<LeadCard lead={mockLead} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### Testing Async Operations

```typescript
import { render, screen, waitFor } from '@test/utils/test-helpers';
import { vi } from 'vitest';
import DataFetcher from './DataFetcher';

describe('DataFetcher', () => {
  it('should fetch and display data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test data' })
    });
    global.fetch = mockFetch;

    render(<DataFetcher />);

    await waitFor(() => {
      expect(screen.getByText('test data')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/data');
  });
});
```

## Test Organization

### File Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── Form/
│       ├── Form.tsx
│       └── Form.test.tsx
├── lib/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── auth.service.test.ts
│   └── utils/
│       ├── calculator.ts
│       └── calculator.test.ts
└── test/
    ├── setup.ts
    ├── mocks/
    │   └── supabase.mock.ts
    └── utils/
        └── test-helpers.ts
```

### Naming Conventions

- Test files should be colocated with the code they test
- Test files should have the `.test.ts(x)` or `.spec.ts(x)` extension
- Describe blocks should match the component/function name
- Test descriptions should be clear and behavior-focused

## Mocking

### Mocking Supabase

```typescript
import { vi } from 'vitest';
import { createMockSupabaseClient } from '@test/mocks/supabase.mock';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () =>
    createMockSupabaseClient({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: '123', email: 'test@example.com' } },
          error: null,
        }),
      },
    }),
}));
```

### Mocking Modules

```typescript
// Mock a module
vi.mock('@/lib/services/email.service', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock with custom implementation
vi.mock('@/lib/utils/calculator', () => ({
  calculateTaxes: vi.fn().mockImplementation((value) => value * 0.2),
}));
```

## Best Practices

### 1. Test User Behavior, Not Implementation

❌ Bad:

```typescript
expect(component.state.isOpen).toBe(true);
```

✅ Good:

```typescript
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

### 2. Use Descriptive Test Names

❌ Bad:

```typescript
it('works', () => {});
```

✅ Good:

```typescript
it('should display error message when form validation fails', () => {});
```

### 3. Keep Tests Independent

Each test should be able to run in isolation:

```typescript
beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
  // Reset any global state
  localStorage.clear();
});
```

### 4. Use Test Helpers

Utilize the provided test helpers to reduce boilerplate:

```typescript
import { render, createMockLead, createMockAppointment } from '@test/utils/test-helpers';

const lead = createMockLead({ status: 'qualified' });
const appointment = createMockAppointment({ lead_id: lead.id });
```

### 5. Test Error Cases

Always test error scenarios:

```typescript
it('should handle API errors gracefully', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
  global.fetch = mockFetch;

  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
});
```

### 6. Use Accessibility Queries

Prefer queries that reflect how users interact with your app:

```typescript
// Preferred queries (in order of preference)
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email address');
screen.getByPlaceholderText('Enter your name');
screen.getByText('Welcome');
screen.getByAltText('Company logo');
screen.getByTitle('Close dialog');

// Only use test IDs as a last resort
screen.getByTestId('custom-element');
```

## Continuous Integration

Tests run automatically on:

- Every push to `main`, `develop`, and `feature/*` branches
- Every pull request

The CI pipeline:

1. Runs linting
2. Runs type checking
3. Runs all tests with coverage
4. Uploads coverage reports to Codecov
5. Builds the project

### Debugging CI Failures

If tests pass locally but fail in CI:

1. Check environment variables in GitHub Secrets
2. Ensure all dependencies are in `package.json`
3. Check for timing issues (use `waitFor` for async operations)
4. Verify file paths (CI is case-sensitive)

## Common Testing Patterns

### Testing Forms

```typescript
import { render, screen, userEvent } from '@test/utils/test-helpers';

it('should submit form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<ContactForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Testing Loading States

```typescript
it('should show loading state while fetching data', async () => {
  render(<DataList />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### Testing Error Boundaries

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

it('should catch and display errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
