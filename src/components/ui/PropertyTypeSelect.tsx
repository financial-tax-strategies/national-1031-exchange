import React from 'react';

const PROPERTY_TYPES = [
  { value: 'single_family_rental', label: 'Single Family Rental' },
  { value: 'multi_family_2_4', label: 'Multi-Family (2-4 units)' },
  { value: 'apartment_5_plus', label: 'Apartment Building (5+ units)' },
  { value: 'office', label: 'Office Building' },
  { value: 'retail', label: 'Retail Property' },
  { value: 'industrial', label: 'Industrial/Warehouse' },
  { value: 'land', label: 'Land/Vacant Lot' },
  { value: 'mixed_use', label: 'Mixed Use' },
  { value: 'other', label: 'Other Investment Property' }
];

interface PropertyTypeSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const PropertyTypeSelect: React.FC<PropertyTypeSelectProps> = ({
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
        <option value="">Select Property Type...</option>
        {PROPERTY_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
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