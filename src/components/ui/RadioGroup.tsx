import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  required,
  orientation = 'vertical'
}) => {
  return (
    <div>
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </legend>
        <div className={`${orientation === 'horizontal' ? 'flex gap-6' : 'space-y-3'}`}>
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-start cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                aria-describedby={option.description ? `${name}-${option.value}-description` : undefined}
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                {option.description && (
                  <span 
                    id={`${name}-${option.value}-description`}
                    className="block text-sm text-gray-500 mt-0.5"
                  >
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};