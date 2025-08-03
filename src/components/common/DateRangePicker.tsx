import { useState, useRef, useEffect, type ChangeEvent } from 'react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  format?: 'date' | 'datetime';
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helpText?: string;
  className?: string;
  presets?: DateRangePreset[];
  allowSingleDate?: boolean;
  maxDays?: number;
  clearable?: boolean;
}

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

// Common date range presets
export const COMMON_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { start: today, end: today };
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return { start: yesterday, end: yesterday };
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  {
    label: 'This month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  {
    label: 'Last month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
  {
    label: 'This year',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    },
  },
];

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date range',
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  format = 'date',
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  label,
  helpText,
  className = '',
  presets = COMMON_PRESETS,
  allowSingleDate = false,
  maxDays,
  clearable = true,
}: DateRangePickerProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [localValue, setLocalValue] = useState<DateRange>(value);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(event.target as Node)) {
        setShowPresets(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    
    if (format === 'datetime') {
      // Format: YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStart = parseDateFromInput(e.target.value);
    const newValue = { ...localValue, start: newStart };
    
    // Validate date range
    if (newStart && localValue.end && newStart > localValue.end) {
      if (allowSingleDate) {
        newValue.end = null;
      } else {
        newValue.end = newStart;
      }
    }
    
    // Check max days constraint
    if (maxDays && newStart && localValue.end) {
      const diffDays = Math.floor((localValue.end.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > maxDays) {
        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + maxDays);
        newValue.end = newEnd;
      }
    }
    
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseDateFromInput(e.target.value);
    const newValue = { ...localValue, end: newEnd };
    
    // Validate date range
    if (newEnd && localValue.start && newEnd < localValue.start) {
      if (allowSingleDate) {
        newValue.start = null;
      } else {
        newValue.start = newEnd;
      }
    }
    
    // Check max days constraint
    if (maxDays && localValue.start && newEnd) {
      const diffDays = Math.floor((newEnd.getTime() - localValue.start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > maxDays) {
        const newStart = new Date(newEnd);
        newStart.setDate(newStart.getDate() - maxDays);
        newValue.start = newStart;
      }
    }
    
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    const newValue = preset.getValue();
    setLocalValue(newValue);
    onChange(newValue);
    setShowPresets(false);
  };

  const handleClear = () => {
    const newValue = { start: null, end: null };
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getMinDate = (): string | undefined => {
    if (minDate) {
      return formatDateForInput(minDate);
    }
    return undefined;
  };

  const getMaxDate = (): string | undefined => {
    if (maxDate) {
      return formatDateForInput(maxDate);
    }
    return undefined;
  };

  const inputType = format === 'datetime' ? 'datetime-local' : 'date';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type={inputType}
              value={formatDateForInput(localValue.start)}
              onChange={handleStartChange}
              min={getMinDate()}
              max={getMaxDate()}
              disabled={disabled}
              required={required}
              placeholder={startPlaceholder}
              className={`
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-300' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
          </div>

          <span className="text-gray-500">to</span>

          <div className="flex-1">
            <input
              type={inputType}
              value={formatDateForInput(localValue.end)}
              onChange={handleEndChange}
              min={formatDateForInput(localValue.start) || getMinDate()}
              max={getMaxDate()}
              disabled={disabled}
              required={required && !allowSingleDate}
              placeholder={endPlaceholder}
              className={`
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-300' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
          </div>

          {clearable && (localValue.start || localValue.end) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear date range"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {presets.length > 0 && !disabled && (
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Show date presets"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>

        {showPresets && presets.length > 0 && (
          <div
            ref={presetsRef}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            <div className="py-1">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}