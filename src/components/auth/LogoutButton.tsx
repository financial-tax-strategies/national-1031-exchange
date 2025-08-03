/**
 * Logout Button Component
 * Handles user logout functionality
 */

import React, { useState } from 'react';
import { AuthService } from '../../lib/services/auth.service';

interface LogoutButtonProps {
  redirectUrl?: string;
  className?: string;
  variant?: 'button' | 'link' | 'icon';
  showConfirmation?: boolean;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  redirectUrl = '/login',
  className = '',
  variant = 'button',
  showConfirmation = false,
  onLogout
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const authService = AuthService.getInstance();

  const handleLogout = async () => {
    if (showConfirmation && !confirm('Are you sure you want to logout?')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.logout();
      
      if (response.success) {
        if (onLogout) {
          onLogout();
        } else {
          window.location.href = redirectUrl;
        }
      } else {
        console.error('Logout failed:', response.error);
        alert('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Icon variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
        title="Logout"
        aria-label="Logout"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
      </button>
    );
  }

  // Link variant
  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`text-blue-600 hover:text-blue-800 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 rounded font-medium transition-colors ${
        isLoading 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-red-600 hover:bg-red-700 text-white'
      } ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </span>
      ) : (
        'Logout'
      )}
    </button>
  );
};