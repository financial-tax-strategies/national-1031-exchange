/**
 * Login Form Component
 * Handles user authentication for admin and customer portals
 */

import React, { useState } from 'react';
import { AuthService } from '../../lib/services/auth.service';
import type { LoginCredentials, AuthError } from '../../lib/types/auth.types';

interface LoginFormProps {
  redirectUrl?: string;
  isAdminLogin?: boolean;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  redirectUrl = '/admin', 
  isAdminLogin = false,
  onSuccess 
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const authService = AuthService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Handle successful login
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to intended destination
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect') || redirectUrl;
          window.location.href = redirect;
        }
      } else {
        setError(response.error || { code: 'LOGIN_FAILED', message: 'Login failed' });
      }
    } catch (err) {
      setError({
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      setError({
        code: 'EMAIL_REQUIRED',
        message: 'Please enter your email address first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.requestPasswordReset({
        email: credentials.email
      });
      
      if (response.success) {
        setError({
          code: 'SUCCESS',
          message: 'Password reset instructions have been sent to your email'
        });
      } else {
        setError(response.error || { 
          code: 'RESET_FAILED', 
          message: 'Failed to send reset email' 
        });
      }
    } catch (err) {
      setError({
        code: 'UNEXPECTED_ERROR',
        message: 'Failed to send reset email. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {isAdminLogin ? 'Admin Login' : 'Customer Portal Login'}
          </h2>
          <p className="text-gray-600 text-center mt-2">
            {isAdminLogin 
              ? 'Access your admin dashboard' 
              : 'Access your 1031 exchange portal'}
          </p>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded ${
            error.code === 'SUCCESS' 
              ? 'bg-green-100 text-green-700 border border-green-400' 
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 leading-tight"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        {!isAdminLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact us
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};