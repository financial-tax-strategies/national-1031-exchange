// ============================================
// Field Error Component
// National 1031 Center - Order Form UI
// ============================================

import React from 'react';

// ============================================
// Component Props
// ============================================

interface FieldErrorProps {
  error?: string;
  fieldId?: string;
}

// ============================================
// Field Error Component
// ============================================

export const FieldError: React.FC<FieldErrorProps> = ({ error, fieldId }) => {
  if (!error) return null;
  
  return (
    <div 
      role="alert"
      aria-live="polite"
      id={fieldId ? `${fieldId}-error` : undefined}
      className="mt-1 text-sm text-red-600 flex items-start"
    >
      <svg 
        className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{error}</span>
    </div>
  );
};