import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

// Custom render function that includes common providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: ReactNode }) {
    // Add any global providers here (e.g., Theme, Router, etc.)
    return <>{children}</>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    user: userEvent.setup(),
  };
}

// Helper to create mock data
export const createMockLead = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '(555) 123-4567',
  lead_source: 'website',
  lead_score: 0,
  status: 'new',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockAppointment = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174001',
  lead_id: '123e4567-e89b-12d3-a456-426614174000',
  appointment_date: new Date().toISOString(),
  appointment_type: 'consultation',
  status: 'scheduled',
  notes: '',
  duration_minutes: 60,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174002',
  email: 'admin@example.com',
  role: 'admin',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockCalculatorResult = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174003',
  lead_id: '123e4567-e89b-12d3-a456-426614174000',
  property_value: 1000000,
  mortgage_balance: 400000,
  capital_gains: 200000,
  tax_owed: 50000,
  potential_savings: 50000,
  created_at: new Date().toISOString(),
  ...overrides,
});

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to create mock fetch responses
export const createMockResponse = (data: any, options: ResponseInit = {}) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
};

// Helper to mock window location
export const mockWindowLocation = (url: string) => {
  delete (window as any).location;
  window.location = new URL(url) as any;
};

// Helper to create form data
export const createFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  return formData;
};

// Helper for testing async errors
export const expectAsyncError = async (
  asyncFunc: () => Promise<any>,
  errorMessage?: string
) => {
  let error: Error | null = null;
  try {
    await asyncFunc();
  } catch (e) {
    error = e as Error;
  }
  expect(error).not.toBeNull();
  if (errorMessage) {
    expect(error?.message).toContain(errorMessage);
  }
  return error;
};

// Helper to create mock file
export const createMockFile = (
  name = 'test.pdf',
  size = 1024,
  type = 'application/pdf'
): File => {
  const content = new Array(size).fill('a').join('');
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// Re-export commonly used testing utilities
export { renderWithProviders as render };
export { screen, fireEvent, waitFor } from '@testing-library/react';
export { userEvent };