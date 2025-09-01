import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {helperText && !error && (
        <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};