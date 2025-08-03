import { useState, useRef, useEffect, type ReactNode } from 'react';

export interface BulkAction {
  id: string;
  label: string;
  icon?: ReactNode;
  action: (selectedItems: any[]) => void | Promise<void>;
  confirmRequired?: boolean;
  confirmMessage?: string;
  variant?: 'default' | 'danger' | 'warning';
  disabled?: boolean | ((selectedItems: any[]) => boolean);
}

export interface BulkActionsProps {
  actions: BulkAction[];
  selectedItems: any[];
  onClearSelection?: () => void;
  position?: 'top' | 'bottom' | 'sticky';
  className?: string;
  showSelectedCount?: boolean;
  dropdownDirection?: 'up' | 'down';
  confirmComponent?: (props: ConfirmDialogProps) => ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  action: BulkAction;
}

// Default confirmation dialog component
function DefaultConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  message,
  action,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    default: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md font-medium transition-colors ${
                variantStyles[action.variant || 'default']
              }`}
            >
              {action.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BulkActions({
  actions,
  selectedItems,
  onClearSelection,
  position = 'top',
  className = '',
  showSelectedCount = true,
  dropdownDirection = 'down',
  confirmComponent: ConfirmComponent = DefaultConfirmDialog,
}: BulkActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = async (action: BulkAction) => {
    setIsDropdownOpen(false);

    if (action.confirmRequired) {
      setConfirmAction(action);
    } else {
      await executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    setIsProcessing(true);
    try {
      await action.action(selectedItems);
      if (onClearSelection) {
        onClearSelection();
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await executeAction(confirmAction);
      setConfirmAction(null);
    }
  };

  const handleCancel = () => {
    setConfirmAction(null);
  };

  const isActionDisabled = (action: BulkAction) => {
    if (typeof action.disabled === 'function') {
      return action.disabled(selectedItems);
    }
    return action.disabled || false;
  };

  if (selectedItems.length === 0) {
    return null;
  }

  const positionClasses = {
    top: '',
    bottom: '',
    sticky: 'sticky top-0 z-40',
  };

  const dropdownPositionClasses = {
    up: 'bottom-full mb-2',
    down: 'top-full mt-2',
  };

  const variantStyles = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-red-600 hover:bg-red-50',
    warning: 'text-yellow-600 hover:bg-yellow-50',
  };

  return (
    <>
      <div
        className={`
          flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3
          ${positionClasses[position]}
          ${className}
        `}
      >
        <div className="flex items-center gap-4">
          {showSelectedCount && (
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
            </span>
          )}
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Actions</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                className={`
                  absolute left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg
                  ${dropdownPositionClasses[dropdownDirection]}
                `}
              >
                <div className="py-1">
                  {actions.map((action) => {
                    const disabled = isActionDisabled(action);
                    
                    return (
                      <button
                        key={action.id}
                        onClick={() => !disabled && handleActionClick(action)}
                        disabled={disabled}
                        className={`
                          w-full px-4 py-2 text-left flex items-center gap-2 transition-colors
                          ${variantStyles[action.variant || 'default']}
                          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {action.icon && <span className="w-5 h-5">{action.icon}</span>}
                        <span className="text-sm">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing...</span>
            </div>
          )}
        </div>

        {onClearSelection && (
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear selection
          </button>
        )}
      </div>

      {confirmAction && (
        <ConfirmComponent
          isOpen={true}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={confirmAction.confirmMessage || `Are you sure you want to ${confirmAction.label.toLowerCase()} ${selectedItems.length} item(s)?`}
          action={confirmAction}
        />
      )}
    </>
  );
}