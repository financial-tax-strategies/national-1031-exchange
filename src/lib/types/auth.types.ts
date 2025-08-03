/**
 * Authentication Types for National 1031 Exchange Platform
 */

import type { User, Session } from '@supabase/supabase-js';
import type { AdminUser } from './database.types';

/**
 * Auth context containing user and session information
 */
export interface AuthContext {
  user: User | null;
  session: Session | null;
  adminProfile: AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data for new admin users
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
  redirectTo?: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  newPassword: string;
  currentPassword?: string;
}

/**
 * Auth service response types
 */
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

/**
 * Auth error structure
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Admin permissions structure
 */
export interface AdminPermissions {
  leads: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  appointments: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  orders: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  customers: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  settings: {
    read: boolean;
    write: boolean;
  };
  reports: {
    view: boolean;
    export: boolean;
  };
}

/**
 * Session data stored in cookies/localStorage
 */
export interface SessionData {
  userId: string;
  email: string;
  role: string;
  permissions: AdminPermissions;
  expiresAt: string;
}

/**
 * Auth state for components/pages
 */
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  adminProfile: AdminUser | null;
  error: AuthError | null;
}

/**
 * Auth route protection levels
 */
export enum AuthLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

/**
 * Route protection configuration
 */
export interface RouteProtection {
  level: AuthLevel;
  redirectTo?: string;
  permissions?: string[];
}