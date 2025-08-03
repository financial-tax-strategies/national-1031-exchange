import { useState, useMemo, useCallback, type ReactNode } from 'react';

export interface Column<T> {
  id: string;
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  selectable?: boolean;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  idKey?: keyof T;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig<T> {
  column: Column<T> | null;
  direction: SortDirection;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  className = '',
  rowClassName = '',
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  selectable = false,
  sortable = true,
  striped = true,
  hoverable = true,
  compact = false,
  stickyHeader = false,
  maxHeight,
  idKey = 'id' as keyof T,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    column: null,
    direction: null,
  });

  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>(selectedRows);

  const getCellValue = useCallback((row: T, column: Column<T>): any => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig.column || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getCellValue(a, sortConfig.column!);
      const bValue = getCellValue(b, sortConfig.column!);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, getCellValue]);

  const handleSort = (column: Column<T>) => {
    if (!sortable || !column.sortable) return;

    setSortConfig((prev) => {
      if (prev.column?.id !== column.id) {
        return { column, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { column: null, direction: null };
      }
      return { column, direction: 'asc' };
    });
  };

  const isRowSelected = (row: T) => {
    const selectedSet = onSelectionChange ? selectedRows : internalSelectedRows;
    return selectedSet.some((selected) => selected[idKey] === row[idKey]);
  };

  const toggleRowSelection = (row: T) => {
    const selectedSet = onSelectionChange ? selectedRows : internalSelectedRows;
    const isSelected = isRowSelected(row);
    
    let newSelection: T[];
    if (isSelected) {
      newSelection = selectedSet.filter((selected) => selected[idKey] !== row[idKey]);
    } else {
      newSelection = [...selectedSet, row];
    }

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const toggleAllRows = () => {
    const selectedSet = onSelectionChange ? selectedRows : internalSelectedRows;
    const allSelected = sortedData.length > 0 && sortedData.every(isRowSelected);

    let newSelection: T[];
    if (allSelected) {
      newSelection = [];
    } else {
      newSelection = [...sortedData];
    }

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    if (sortConfig.column?.id !== column.id) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    );
  };

  const tableClasses = `w-full ${compact ? 'text-sm' : ''} ${className}`;
  const containerClasses = `overflow-x-auto ${maxHeight ? 'overflow-y-auto' : ''}`;
  const headerClasses = `${stickyHeader ? 'sticky top-0 z-10' : ''} bg-gray-50`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const allSelected = sortedData.length > 0 && sortedData.every(isRowSelected);
  const someSelected = sortedData.some(isRowSelected) && !allSelected;

  return (
    <div className={containerClasses} style={{ maxHeight }}>
      <table className={tableClasses}>
        <thead className={headerClasses}>
          <tr className="border-b border-gray-200">
            {selectable && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAllRows}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className={`px-4 py-3 text-left font-medium text-gray-900 ${
                  column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.headerClassName || ''}`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center justify-between">
                  <span>{column.header}</span>
                  {sortable && getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => {
            const isSelected = isRowSelected(row);
            const computedRowClassName = 
              typeof rowClassName === 'function' 
                ? rowClassName(row, index) 
                : rowClassName;
            
            return (
              <tr
                key={row[idKey]}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  ${hoverable ? 'hover:bg-gray-100' : ''}
                  ${isSelected ? 'bg-blue-50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${computedRowClassName}
                `}
                onClick={() => onRowClick?.(row, index)}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleRowSelection(row);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-4 ${compact ? 'py-2' : 'py-3'} ${
                      column.cellClassName || ''
                    } ${column.className || ''}`}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}