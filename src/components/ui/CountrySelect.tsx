import React from 'react';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'Other', label: 'Other' }
];

interface CountrySelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required
}) => {
  return (
    <div>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
      >
        <option value="">Select Country...</option>
        {COUNTRIES.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};