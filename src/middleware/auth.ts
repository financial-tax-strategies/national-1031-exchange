/**
 * Authentication Middleware for Astro
 * Protects routes and manages authentication state
 */

import type { MiddlewareHandler } from 'astro';
import { AuthService } from '../lib/services/auth.service';
import { AuthLevel, type RouteProtection } from '../lib/types/auth.types';

// Route protection configuration
const PROTECTED_ROUTES: Record<string, RouteProtection> = {
  '/admin': {
    level: AuthLevel.ADMIN,
    redirectTo: '/admin/login'
  },
  '/admin/leads': {
    level: AuthLevel.ADMIN,
    permissions: ['leads.read'],
    redirectTo: '/admin/login'
  },
  '/admin/appointments': {
    level: AuthLevel.ADMIN,
    permissions: ['appointments.read'],
    redirectTo: '/admin/login'
  },
  '/admin/orders': {
    level: AuthLevel.ADMIN,
    permissions: ['orders.read'],
    redirectTo: '/admin/login'
  },
  '/admin/customers': {
    level: AuthLevel.ADMIN,
    permissions: ['customers.read'],
    redirectTo: '/admin/login'
  },
  '/admin/settings': {
    level: AuthLevel.ADMIN,
    permissions: ['settings.read'],
    redirectTo: '/admin/login'
  },
  '/admin/reports': {
    level: AuthLevel.ADMIN,
    permissions: ['reports.view'],
    redirectTo: '/admin/login'
  },
  '/portal': {
    level: AuthLevel.AUTHENTICATED,
    redirectTo: '/login'
  }
};

// Public routes that should bypass auth
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/admin/login',
  '/reset-password',
  '/calculator',
  '/order-form',
  '/services',
  '/resources',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/api'
];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;
  const authService = AuthService.getInstance();
  
  // Skip auth check for public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return next();
  }
  
  // Check if route requires protection
  const protection = getRouteProtection(pathname);
  if (!protection) {
    return next();
  }
  
  // Get current user
  const userResponse = await authService.getCurrentUser();
  
  // Handle unauthenticated users
  if (!userResponse.success || !userResponse.data) {
    // Store intended destination for redirect after login
    const redirectUrl = new URL(protection.redirectTo || '/login', context.url.origin);
    redirectUrl.searchParams.set('redirect', pathname);
    return context.redirect(redirectUrl.toString());
  }
  
  const { adminProfile } = userResponse.data;
  
  // Check authentication level
  switch (protection.level) {
    case AuthLevel.AUTHENTICATED:
      // User is authenticated, allow access
      break;
      
    case AuthLevel.ADMIN:
      if (!adminProfile) {
        return context.redirect(protection.redirectTo || '/login');
      }
      
      // Check specific permissions if required
      if (protection.permissions) {
        const hasPermissions = protection.permissions.every(permission => {
          const [resource, action] = permission.split('.');
          return authService.hasPermission(adminProfile, resource, action);
        });
        
        if (!hasPermissions) {
          // Redirect to unauthorized page or dashboard
          return context.redirect('/admin?error=unauthorized');
        }
      }
      break;
      
    case AuthLevel.SUPER_ADMIN:
      if (!adminProfile || adminProfile.role !== 'super_admin') {
        return context.redirect(protection.redirectTo || '/admin');
      }
      break;
  }
  
  // Add auth context to locals for use in pages
  context.locals.auth = {
    user: userResponse.data.user,
    adminProfile: userResponse.data.adminProfile,
    isAuthenticated: true,
    isAdmin: !!adminProfile
  };
  
  // Log admin activity
  if (adminProfile && !pathname.includes('/api/')) {
    logAdminActivity(adminProfile.id, pathname);
  }
  
  return next();
};

/**
 * Get route protection configuration
 */
function getRouteProtection(pathname: string): RouteProtection | null {
  // Exact match
  if (PROTECTED_ROUTES[pathname]) {
    return PROTECTED_ROUTES[pathname];
  }
  
  // Prefix match (for nested routes)
  for (const [route, protection] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return protection;
    }
  }
  
  return null;
}

/**
 * Log admin activity (fire and forget)
 */
async function logAdminActivity(adminId: string, path: string): Promise<void> {
  try {
    // This would typically write to admin_audit_logs table
    // For now, just console log
    console.log(`[Admin Activity] User: ${adminId}, Path: ${path}, Time: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}