import React from 'react';

interface CheckboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  name: string;
  description?: string;
  error?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  name,
  description,
  error,
  className = '',
  onChange,
  ...props
}) => {
  // Wrap onChange to extract checked value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      // Call onChange with boolean value, not event object
      (onChange as any)(e.target.checked);
    }
  };

  return (
    <div>
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          id={name}
          name={name}
          className={`
            mt-0.5 h-4 w-4 text-blue-600
            focus:ring-blue-500 border-gray-300 rounded
            ${className}
          `}
          aria-describedby={description ? `${name}-description` : error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          onChange={handleChange}
          {...props}
        />
        <div className="ml-3">
          <span className="block text-sm font-medium text-gray-700">
            {label}
          </span>
          {description && (
            <span 
              id={`${name}-description`}
              className="block text-sm text-gray-500 mt-0.5"
            >
              {description}
            </span>
          )}
        </div>
      </label>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600 ml-7">
          {error}
        </p>
      )}
    </div>
  );
};