/**
 * FIXED VERSION - FormField Component
 *
 * Critical Fix: Properly handles helpText prop to prevent React warnings
 * Issue: helpText prop was being spread to DOM elements
 *
 * Replace any form components that spread props to DOM elements
 */

import React from 'react';

interface FormFieldProps {
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  // All other HTML input attributes
  [key: string]: any;
}

/**
 * FIXED: Text Input Component
 * Extracts non-DOM props before spreading to input element
 */
export const TextInput: React.FC<FormFieldProps> = ({
  label,
  helpText,
  error,
  required,
  className = '',
  ...inputProps // Only DOM-valid props remain after destructuring
}) => {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={inputProps.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        {...inputProps}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />

      {helpText && (
        <p className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * FIXED: Select/Dropdown Component
 * Extracts non-DOM props before spreading to select element
 */
export const SelectInput: React.FC<FormFieldProps & { children: React.ReactNode }> = ({
  label,
  helpText,
  error,
  required,
  className = '',
  children,
  ...selectProps // Only DOM-valid props remain
}) => {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={selectProps.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        {...selectProps}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        {children}
      </select>

      {helpText && (
        <p className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * FIXED: Textarea Component
 * Extracts non-DOM props before spreading to textarea element
 */
export const TextAreaInput: React.FC<FormFieldProps> = ({
  label,
  helpText,
  error,
  required,
  className = '',
  ...textareaProps
}) => {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={textareaProps.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        {...textareaProps}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />

      {helpText && (
        <p className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * FIXED: Radio Group Component
 * Properly handles custom props without passing to DOM
 */
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  options: RadioOption[];
  name: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  helpText,
  error,
  required,
  options,
  name,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </legend>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {helpText && (
        <p className="mt-2 text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * FIXED: Checkbox Component
 * Properly handles custom props
 */
interface CheckboxProps {
  label: string;
  helpText?: string;
  error?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  name?: string;
  required?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helpText,
  error,
  checked,
  onChange,
  className = '',
  name,
  required
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
        />
        <div className="ml-2">
          <span className="text-sm text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {helpText && (
            <p className="mt-1 text-sm text-gray-600">
              {helpText}
            </p>
          )}
        </div>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Export all components
export default {
  TextInput,
  SelectInput,
  TextAreaInput,
  RadioGroup,
  Checkbox
};
