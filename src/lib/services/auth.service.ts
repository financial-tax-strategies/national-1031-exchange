/**
 * Authentication Service for National 1031 Exchange Platform
 * Handles admin authentication, session management, and authorization
 */

import type { User, Session } from '@supabase/supabase-js';
import { DatabaseService } from './database.service';
import type { 
  AuthContext, 
  LoginCredentials, 
  RegisterData, 
  PasswordResetRequest,
  PasswordUpdateRequest,
  AuthResponse,
  AuthError,
  AdminPermissions,
  SessionData,
  AuthState
} from '../types/auth.types';
import type { AdminUser } from '../types/database.types';

export class AuthService {
  private static instance: AuthService;
  private dbService: DatabaseService;
  
  private constructor() {
    this.dbService = DatabaseService.getInstance();
  }
  
  /**
   * Get singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  /**
   * Login with email and password
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse<AuthContext>> {
    try {
      const { email, password } = credentials;
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await this.dbService.getClient().auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        return {
          success: false,
          error: this.mapAuthError(authError)
        };
      }
      
      if (!authData.user) {
        return {
          success: false,
          error: {
            code: 'NO_USER',
            message: 'Authentication failed'
          }
        };
      }
      
      // Get admin profile
      const adminProfile = await this.getAdminProfile(authData.user.id);
      
      if (!adminProfile) {
        // Sign out if no admin profile exists
        await this.logout();
        return {
          success: false,
          error: {
            code: 'NOT_ADMIN',
            message: 'Access denied. Admin privileges required.'
          }
        };
      }
      
      if (!adminProfile.is_active) {
        await this.logout();
        return {
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: 'Your account has been disabled. Please contact support.'
          }
        };
      }
      
      // Update last login
      await this.updateLastLogin(adminProfile.id);
      
      const context: AuthContext = {
        user: authData.user,
        session: authData.session,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      
      return {
        success: true,
        data: context
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'An error occurred during login',
          details: error
        }
      };
    }
  }
  
  /**
   * Logout current user
   */
  public async logout(): Promise<AuthResponse<void>> {
    try {
      const { error } = await this.dbService.getClient().auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'An error occurred during logout',
          details: error
        }
      };
    }
  }
  
  /**
   * Get current user session
   */
  public async getSession(): Promise<AuthResponse<Session | null>> {
    try {
      const { data: { session }, error } = await this.dbService.getClient().auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      
      return {
        success: true,
        data: session
      };
      
    } catch (error) {
      console.error('Get session error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: 'Failed to retrieve session',
          details: error
        }
      };
    }
  }
  
  /**
   * Get current authenticated user
   */
  public async getCurrentUser(): Promise<AuthResponse<AuthContext | null>> {
    try {
      const { data: { user }, error } = await this.dbService.getClient().auth.getUser();
      
      if (error || !user) {
        return {
          success: true,
          data: null
        };
      }
      
      const sessionResponse = await this.getSession();
      if (!sessionResponse.success || !sessionResponse.data) {
        return {
          success: true,
          data: null
        };
      }
      
      const adminProfile = await this.getAdminProfile(user.id);
      
      if (!adminProfile || !adminProfile.is_active) {
        return {
          success: true,
          data: null
        };
      }
      
      const context: AuthContext = {
        user,
        session: sessionResponse.data,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      
      return {
        success: true,
        data: context
      };
      
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: {
          code: 'USER_ERROR',
          message: 'Failed to get current user',
          details: error
        }
      };
    }
  }
  
  /**
   * Register new admin user (super admin only)
   */
  public async register(data: RegisterData): Promise<AuthResponse<AuthContext>> {
    try {
      // Check if current user is super admin
      const currentUser = await this.getCurrentUser();
      if (!currentUser.success || !currentUser.data || 
          currentUser.data.adminProfile?.role !== 'super_admin') {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Only super admins can create new admin users'
          }
        };
      }
      
      // Create auth user
      const { data: authData, error: authError } = await this.dbService.getClient().auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
      });
      
      if (authError) {
        return {
          success: false,
          error: this.mapAuthError(authError)
        };
      }
      
      if (!authData.user) {
        return {
          success: false,
          error: {
            code: 'REGISTRATION_FAILED',
            message: 'Failed to create user account'
          }
        };
      }
      
      // Create admin profile
      const adminProfile = await this.createAdminProfile({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role || 'admin',
        permissions: this.getDefaultPermissions(data.role || 'admin')
      });
      
      const context: AuthContext = {
        user: authData.user,
        session: authData.session,
        adminProfile,
        isAuthenticated: true,
        isAdmin: true
      };
      
      return {
        success: true,
        data: context
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'Failed to register admin user',
          details: error
        }
      };
    }
  }
  
  /**
   * Request password reset
   */
  public async requestPasswordReset(request: PasswordResetRequest): Promise<AuthResponse<void>> {
    try {
      const { error } = await this.dbService.getClient().auth.resetPasswordForEmail(request.email, {
        redirectTo: request.redirectTo || `${window.location.origin}/reset-password`
      });
      
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: {
          code: 'RESET_ERROR',
          message: 'Failed to send password reset email',
          details: error
        }
      };
    }
  }
  
  /**
   * Update password
   */
  public async updatePassword(request: PasswordUpdateRequest): Promise<AuthResponse<void>> {
    try {
      const { error } = await this.dbService.getClient().auth.updateUser({
        password: request.newPassword
      });
      
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update password',
          details: error
        }
      };
    }
  }
  
  /**
   * Refresh session
   */
  public async refreshSession(): Promise<AuthResponse<Session | null>> {
    try {
      const { data: { session }, error } = await this.dbService.getClient().auth.refreshSession();
      
      if (error) {
        return {
          success: false,
          error: this.mapAuthError(error)
        };
      }
      
      return {
        success: true,
        data: session
      };
      
    } catch (error) {
      console.error('Session refresh error:', error);
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: 'Failed to refresh session',
          details: error
        }
      };
    }
  }
  
  /**
   * Check if user has specific permission
   */
  public hasPermission(adminProfile: AdminUser | null, resource: string, action: string): boolean {
    if (!adminProfile) return false;
    
    // Super admins have all permissions
    if (adminProfile.role === 'super_admin') return true;
    
    const permissions = adminProfile.permissions as any;
    return permissions?.[resource]?.[action] === true;
  }
  
  /**
   * Get admin profile from database
   */
  private async getAdminProfile(userId: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await this.dbService.getClient()
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.error('Failed to get admin profile:', error);
        return null;
      }
      
      return data as AdminUser;
      
    } catch (error) {
      console.error('Get admin profile error:', error);
      return null;
    }
  }
  
  /**
   * Create admin profile in database
   */
  private async createAdminProfile(data: Partial<AdminUser>): Promise<AdminUser> {
    const { data: profile, error } = await this.dbService.getClient()
      .from('admin_users')
      .insert({
        ...data,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !profile) {
      throw new Error('Failed to create admin profile');
    }
    
    return profile as AdminUser;
  }
  
  /**
   * Update last login timestamp
   */
  private async updateLastLogin(adminId: string): Promise<void> {
    await this.dbService.getClient()
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminId);
  }
  
  /**
   * Get default permissions based on role
   */
  private getDefaultPermissions(role: string): AdminPermissions {
    const fullAccess = {
      read: true,
      write: true,
      delete: true
    };
    
    const readOnly = {
      read: true,
      write: false,
      delete: false
    };
    
    switch (role) {
      case 'super_admin':
        return {
          leads: fullAccess,
          appointments: fullAccess,
          orders: fullAccess,
          customers: fullAccess,
          settings: { read: true, write: true },
          reports: { view: true, export: true }
        };
        
      case 'admin':
        return {
          leads: fullAccess,
          appointments: fullAccess,
          orders: fullAccess,
          customers: { read: true, write: true, delete: false },
          settings: { read: true, write: false },
          reports: { view: true, export: true }
        };
        
      case 'manager':
        return {
          leads: { read: true, write: true, delete: false },
          appointments: { read: true, write: true, delete: false },
          orders: { read: true, write: true, delete: false },
          customers: readOnly,
          settings: { read: false, write: false },
          reports: { view: true, export: false }
        };
        
      default:
        return {
          leads: readOnly,
          appointments: readOnly,
          orders: readOnly,
          customers: readOnly,
          settings: { read: false, write: false },
          reports: { view: false, export: false }
        };
    }
  }
  
  /**
   * Map Supabase auth errors to our error structure
   */
  private mapAuthError(error: any): AuthError {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email address',
      'User not found': 'No account found with this email',
      'Invalid password': 'Password does not meet requirements'
    };
    
    return {
      code: error.code || 'AUTH_ERROR',
      message: errorMap[error.message] || error.message || 'Authentication error',
      details: error
    };
  }
}