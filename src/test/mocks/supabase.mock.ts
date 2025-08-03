import { vi } from 'vitest';

// Mock Supabase Auth
export const mockAuth = {
  signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  resetPasswordForEmail: vi.fn().mockResolvedValue({ data: null, error: null }),
  updateUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  }),
};

// Mock Supabase Storage
export const mockStorage = {
  from: vi.fn().mockReturnValue({
    upload: vi.fn().mockResolvedValue({ data: null, error: null }),
    download: vi.fn().mockResolvedValue({ data: null, error: null }),
    remove: vi.fn().mockResolvedValue({ data: null, error: null }),
    list: vi.fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/file.pdf' } }),
  }),
};

// Mock Supabase Database query builder
export const createMockQueryBuilder = (initialData: any[] = []) => {
  let data = initialData;
  let error: any = null;
  let count: number | null = null;

  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation((values) => {
      if (Array.isArray(values)) {
        data = [...data, ...values];
      } else {
        data = [...data, values];
      }
      return queryBuilder;
    }),
    update: vi.fn().mockImplementation((_updates) => {
      // In real implementation, this would update matching records
      return queryBuilder;
    }),
    delete: vi.fn().mockImplementation(() => {
      // In real implementation, this would delete matching records
      return queryBuilder;
    }),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => {
      queryBuilder.data = data[0] || null;
      return queryBuilder;
    }),
    maybeSingle: vi.fn().mockImplementation(() => {
      queryBuilder.data = data[0] || null;
      return queryBuilder;
    }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    // Return data property
    data,
    error,
    count,
    // Methods that execute the query
    then: vi.fn().mockImplementation((resolve) => {
      resolve({ data: queryBuilder.data || data, error, count });
    }),
  };

  return queryBuilder;
};

// Mock Supabase client
export const createMockSupabaseClient = (options: {
  auth?: Partial<typeof mockAuth>;
  storage?: Partial<typeof mockStorage>;
  tables?: Record<string, any[]>;
} = {}) => {
  const auth = { ...mockAuth, ...options.auth };
  const storage = { ...mockStorage, ...options.storage };
  const tables = options.tables || {};

  return {
    auth,
    storage,
    from: vi.fn().mockImplementation((table: string) => {
      const tableData = tables[table] || [];
      return createMockQueryBuilder(tableData);
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue('subscribed'),
      unsubscribe: vi.fn(),
    }),
  };
};

// Export a default mock client
export const mockSupabaseClient = createMockSupabaseClient();

// Mock the createClient function
export const createClient = vi.fn().mockReturnValue(mockSupabaseClient);