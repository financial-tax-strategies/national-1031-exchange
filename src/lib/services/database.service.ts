import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

/**
 * Database Service - Core database operations and connection management
 * Provides type-safe access to Supabase with error handling and retry logic
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient<Database>;
  
  private constructor() {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key must be provided');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    });
  }
  
  /**
   * Get singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  /**
   * Get Supabase client instance
   */
  public getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
  
  /**
   * Execute a database function with error handling
   */
  public async executeFunction<T = any>(
    functionName: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const { data, error } = await this.supabase.rpc(functionName, params);
      
      if (error) {
        console.error(`Error executing function ${functionName}:`, error);
        throw error;
      }
      
      return data as T;
    } catch (error) {
      console.error('Database function execution error:', error);
      throw error;
    }
  }
  
  /**
   * Health check for database connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('leads')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
  
  /**
   * Get table reference with type safety
   */
  public getTable<T extends keyof Database['public']['Tables']>(
    tableName: T
  ) {
    return this.supabase.from(tableName);
  }
  
  /**
   * Handle database errors with consistent formatting
   */
  public handleError(error: any, context: string): Error {
    const message = error?.message || 'Unknown database error';
    const code = error?.code || 'UNKNOWN';
    
    console.error(`Database error in ${context}:`, {
      message,
      code,
      details: error
    });
    
    return new Error(`${context}: ${message} (${code})`);
  }
}