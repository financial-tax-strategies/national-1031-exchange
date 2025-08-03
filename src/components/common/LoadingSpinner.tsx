import type { CSSProperties } from 'react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  fullScreen?: boolean;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

export function LoadingSpinner({
  size = 'md',
  color = 'currentColor',
  className = '',
  label,
  labelPosition = 'bottom',
  variant = 'spinner',
  fullScreen = false,
  overlay = false,
  overlayColor = 'white',
  overlayOpacity = 0.75,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const labelSpacing = {
    xs: 'gap-1',
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-3',
    xl: 'gap-4',
  };

  const labelPositionClasses = {
    top: 'flex-col-reverse',
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={`animate-spin ${sizeClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke={color}
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill={color}
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      case 'dots':
        const dotSize = {
          xs: 'w-1 h-1',
          sm: 'w-1.5 h-1.5',
          md: 'w-2 h-2',
          lg: 'w-3 h-3',
          xl: 'w-4 h-4',
        };

        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${dotSize[size]} rounded-full animate-pulse`}
                style={{
                  backgroundColor: color,
                  animationDelay: `${index * 0.15}s`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} rounded-full animate-ping absolute`}
              style={{ backgroundColor: color, opacity: 0.75 }}
            />
            <div
              className={`${sizeClasses[size]} rounded-full`}
              style={{ backgroundColor: color }}
            />
          </div>
        );

      case 'bars':
        const barWidth = {
          xs: 'w-0.5',
          sm: 'w-1',
          md: 'w-1.5',
          lg: 'w-2',
          xl: 'w-2.5',
        };

        const barHeight = {
          xs: 'h-3',
          sm: 'h-4',
          md: 'h-8',
          lg: 'h-12',
          xl: 'h-16',
        };

        return (
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`${barWidth[size]} ${barHeight[size]} animate-pulse`}
                style={{
                  backgroundColor: color,
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '0.8s',
                  transform: `scaleY(${0.4 + (index % 2) * 0.6})`,
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const spinnerContent = (
    <div
      className={`inline-flex items-center justify-center ${
        label ? `${labelPositionClasses[labelPosition]} ${labelSpacing[size]}` : ''
      } ${className}`}
    >
      {renderSpinner()}
      {label && (
        <span
          className="text-sm font-medium"
          style={{ color: color === 'currentColor' ? undefined : color }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    const overlayStyle: CSSProperties = {
      backgroundColor: overlayColor,
      opacity: overlayOpacity,
    };

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="absolute inset-0" style={overlayStyle} />
        <div className="relative z-10">{spinnerContent}</div>
      </div>
    );
  }

  return spinnerContent;
}

// Convenience component for inline loading states
export interface InlineLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  spinnerProps?: LoadingSpinnerProps;
  showChildrenWhileLoading?: boolean;
  className?: string;
}

export function InlineLoading({
  loading,
  children,
  spinnerProps = {},
  showChildrenWhileLoading = false,
  className = '',
}: InlineLoadingProps) {
  if (!loading && !showChildrenWhileLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {(showChildrenWhileLoading || !loading) && (
        <div className={loading ? 'opacity-50' : ''}>{children}</div>
      )}
      {loading && (
        <LoadingSpinner
          overlay
          size="sm"
          {...spinnerProps}
        />
      )}
    </div>
  );
}

// Page-level loading component
export interface PageLoadingProps {
  message?: string;
  spinnerProps?: LoadingSpinnerProps;
}

export function PageLoading({
  message = 'Loading...',
  spinnerProps = {},
}: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <LoadingSpinner
        size="lg"
        label={message}
        {...spinnerProps}
      />
    </div>
  );
}