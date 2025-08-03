import type { ReactNode } from 'react';

export type StatusVariant = 
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'primary'
  | 'secondary';

export type StatusSize = 'xs' | 'sm' | 'md' | 'lg';

export interface StatusBadgeProps {
  variant?: StatusVariant;
  size?: StatusSize;
  children: ReactNode;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
}

// Predefined status configurations
export const STATUS_PRESETS = {
  // Common statuses
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'default', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
  draft: { variant: 'secondary', label: 'Draft' },
  published: { variant: 'primary', label: 'Published' },
  archived: { variant: 'default', label: 'Archived' },
  
  // Order/Transaction statuses
  processing: { variant: 'info', label: 'Processing' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  refunded: { variant: 'warning', label: 'Refunded' },
  
  // User statuses
  online: { variant: 'success', label: 'Online', dot: true },
  offline: { variant: 'default', label: 'Offline', dot: true },
  away: { variant: 'warning', label: 'Away', dot: true },
  busy: { variant: 'error', label: 'Busy', dot: true },
  
  // Priority levels
  high: { variant: 'error', label: 'High Priority' },
  medium: { variant: 'warning', label: 'Medium Priority' },
  low: { variant: 'info', label: 'Low Priority' },
} as const;

export function StatusBadge({
  variant = 'default',
  size = 'md',
  children,
  icon,
  dot = false,
  pulse = false,
  rounded = false,
  className = '',
  onClick,
}: StatusBadgeProps) {
  const variantStyles: Record<StatusVariant, string> = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const dotColors: Record<StatusVariant, string> = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-500',
    primary: 'bg-indigo-500',
    secondary: 'bg-purple-500',
  };

  const sizeStyles: Record<StatusSize, string> = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes: Record<StatusSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const dotSizes: Record<StatusSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium border
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;

  return (
    <span className={baseClasses} onClick={onClick}>
      {dot && (
        <span className="relative flex">
          <span
            className={`${dotSizes[size]} ${dotColors[variant]} rounded-full ${
              pulse ? 'animate-ping absolute' : ''
            }`}
          />
          <span className={`${dotSizes[size]} ${dotColors[variant]} rounded-full`} />
        </span>
      )}
      {icon && <span className={iconSizes[size]}>{icon}</span>}
      {children}
    </span>
  );
}

// Convenience component for using predefined statuses
export interface PresetStatusBadgeProps extends Omit<StatusBadgeProps, 'variant' | 'children'> {
  status: keyof typeof STATUS_PRESETS;
  label?: string;
}

export function PresetStatusBadge({
  status,
  label,
  ...props
}: PresetStatusBadgeProps) {
  const preset = STATUS_PRESETS[status];
  
  return (
    <StatusBadge
      variant={preset.variant as StatusVariant}
      dot={preset.dot}
      {...props}
    >
      {label || preset.label}
    </StatusBadge>
  );
}

// Utility function to get status badge props from a value
export function getStatusBadgeProps(
  value: string | number | boolean,
  mapping?: Record<string, { variant: StatusVariant; label: string }>
): { variant: StatusVariant; children: ReactNode } {
  // Default mappings for common boolean and string values
  const defaultMapping: Record<string, { variant: StatusVariant; label: string }> = {
    // Boolean values
    'true': { variant: 'success', label: 'Yes' },
    'false': { variant: 'default', label: 'No' },
    // Common status strings
    'active': { variant: 'success', label: 'Active' },
    'inactive': { variant: 'default', label: 'Inactive' },
    'enabled': { variant: 'success', label: 'Enabled' },
    'disabled': { variant: 'default', label: 'Disabled' },
    'success': { variant: 'success', label: 'Success' },
    'error': { variant: 'error', label: 'Error' },
    'warning': { variant: 'warning', label: 'Warning' },
    'pending': { variant: 'warning', label: 'Pending' },
    'completed': { variant: 'success', label: 'Completed' },
    'failed': { variant: 'error', label: 'Failed' },
  };

  const valueStr = String(value).toLowerCase();
  const config = mapping?.[valueStr] || defaultMapping[valueStr];

  if (config) {
    return config;
  }

  // Fallback for unmapped values
  return {
    variant: 'default',
    children: String(value),
  };
}