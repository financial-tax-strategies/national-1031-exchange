import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
  min?: number | string;
  max?: number | string;
  defaultValue?: any;
}

export interface FilterValue {
  [key: string]: any;
}

export interface SearchFilterProps {
  filters: FilterConfig[];
  onFilterChange: (filters: FilterValue) => void;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showClearAll?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'compact';
  debounceDelay?: number;
}

export function SearchFilter({
  filters,
  onFilterChange,
  onSearch,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showClearAll = true,
  className = '',
  layout = 'horizontal',
  debounceDelay = 300,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize filter values with defaults
  useEffect(() => {
    const initialValues: FilterValue = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initialValues[filter.id] = filter.defaultValue;
      }
    });
    setFilterValues(initialValues);
  }, [filters]);

  const debouncedCallback = useCallback(
    (callback: () => void) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const timer = setTimeout(callback, debounceDelay);
      setDebounceTimer(timer);
    },
    [debounceTimer, debounceDelay]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      debouncedCallback(() => onSearch(value));
    }
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilterValues = { ...filterValues, [filterId]: value };
    setFilterValues(newFilterValues);
    
    debouncedCallback(() => onFilterChange(newFilterValues));
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setFilterValues({});
    onFilterChange({});
    if (onSearch) {
      onSearch('');
    }
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== '' ||
      Object.keys(filterValues).some((key) => {
        const value = filterValues[key];
        return value !== undefined && value !== '' && value !== null;
      })
    );
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{filter.placeholder || 'Select...'}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  {option.label}
                  {option.count !== undefined && (
                    <span className="text-gray-500 ml-1">({option.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            min={filter.min as string}
            max={filter.max as string}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'daterange':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={value?.start || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, { ...value, start: e.target.value })
              }
              min={filter.min as string}
              max={filter.max as string}
              placeholder="Start"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={value?.end || ''}
              onChange={(e) =>
                handleFilterChange(filter.id, { ...value, end: e.target.value })
              }
              min={filter.min as string}
              max={filter.max as string}
              placeholder="End"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            min={filter.min as number}
            max={filter.max as number}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">{filter.placeholder || filter.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  const containerClasses = {
    horizontal: 'flex flex-wrap items-end gap-4',
    vertical: 'space-y-4',
    compact: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  };

  return (
    <div className={`${className}`}>
      <div className={containerClasses[layout]}>
        {showSearch && (
          <div className={layout === 'horizontal' ? 'flex-1 min-w-[200px]' : 'w-full'}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {filters.map((filter) => (
          <div
            key={filter.id}
            className={
              layout === 'horizontal'
                ? filter.type === 'multiselect'
                  ? 'min-w-[200px]'
                  : 'min-w-[150px]'
                : 'w-full'
            }
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            {renderFilter(filter)}
          </div>
        ))}

        {showClearAll && hasActiveFilters() && (
          <div className={layout === 'horizontal' ? 'flex items-end' : 'w-full'}>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}