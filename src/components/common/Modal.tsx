import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  centered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  preventScroll?: boolean;
  zIndex?: number;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  centered = true,
  scrollBehavior = 'inside',
  preventScroll = true,
  zIndex = 50,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, preventScroll]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      // Restore focus to the previous element
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 transition-opacity
    ${centered ? 'flex items-center justify-center' : 'flex items-start justify-center pt-16'}
    ${scrollBehavior === 'outside' ? 'overflow-y-auto' : ''}
    ${overlayClassName}
  `;

  const modalClasses = `
    relative bg-white rounded-lg shadow-xl w-full
    ${sizeClasses[size]}
    ${scrollBehavior === 'inside' ? 'flex flex-col max-h-[90vh]' : ''}
    ${className}
  `;

  const contentClasses = `
    ${scrollBehavior === 'inside' ? 'flex flex-col h-full' : ''}
    ${contentClassName}
  `;

  const headerClasses = `
    flex items-center justify-between px-6 py-4 border-b border-gray-200
    ${headerClassName}
  `;

  const bodyClasses = `
    px-6 py-4
    ${scrollBehavior === 'inside' ? 'flex-1 overflow-y-auto' : ''}
    ${bodyClassName}
  `;

  const footerClasses = `
    px-6 py-4 border-t border-gray-200
    ${footerClassName}
  `;

  const modalContent = (
    <div
      className={overlayClasses}
      style={{ zIndex }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={contentClasses}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={headerClasses}>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={bodyClasses}>{children}</div>

          {/* Footer */}
          {footer && <div className={footerClasses}>{footer}</div>}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
}

// Convenience component for modal footer buttons
export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'end' | 'center' | 'between';
}

export function ModalFooter({
  children,
  className = '',
  justify = 'end',
}: ModalFooterProps) {
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  };

  return (
    <div className={`flex items-center gap-3 ${justifyClasses[justify]} ${className}`}>
      {children}
    </div>
  );
}