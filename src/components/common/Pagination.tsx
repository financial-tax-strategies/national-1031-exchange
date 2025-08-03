import { useMemo } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  showPageInfo?: boolean;
  showQuickJump?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple' | 'minimal';
  maxPageButtons?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  showPageInfo = true,
  showQuickJump = false,
  className = '',
  size = 'md',
  variant = 'default',
  maxPageButtons = 7,
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPageButtons) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      const halfMax = Math.floor(maxPageButtons / 2);
      const startPage = Math.max(1, currentPage - halfMax);
      const endPage = Math.min(totalPages, currentPage + halfMax);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleQuickJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 min-w-[32px]',
    md: 'px-3 py-2 min-w-[40px]',
    lg: 'px-4 py-3 min-w-[48px]',
  };

  const baseButtonClasses = `
    ${buttonSizeClasses[size]}
    font-medium rounded-md transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `;

  const pageButtonClasses = (page: number | string) => {
    if (page === '...') {
      return `${baseButtonClasses} cursor-default text-gray-400`;
    }
    if (page === currentPage) {
      return `${baseButtonClasses} bg-blue-600 text-white cursor-default`;
    }
    return `${baseButtonClasses} text-gray-700 hover:bg-gray-100 cursor-pointer`;
  };

  const navigationButtonClasses = (disabled: boolean) => {
    return `${baseButtonClasses} ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
    }`;
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-between ${sizeClasses[size]} ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={navigationButtonClasses(currentPage === 1)}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={navigationButtonClasses(currentPage === totalPages)}
        >
          Next
        </button>
      </div>
    );
  }

  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items per page selector and page info */}
        <div className="flex items-center gap-4">
          {showItemsPerPage && onItemsPerPageChange && (
            <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
              <label htmlFor="items-per-page" className="text-gray-700">
                Show
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-gray-700">per page</span>
            </div>
          )}

          {showPageInfo && totalItems && (
            <div className={`text-gray-700 ${sizeClasses[size]}`}>
              Showing {startItem} to {endItem} of {totalItems} results
            </div>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {variant === 'default' && (
            <>
              {/* Previous button */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={navigationButtonClasses(currentPage === 1)}
                aria-label="Previous page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(page)}
                    className={pageButtonClasses(page)}
                    disabled={page === '...'}
                    aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={navigationButtonClasses(currentPage === totalPages)}
                aria-label="Next page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {variant === 'simple' && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={navigationButtonClasses(currentPage === 1)}
              >
                ← Previous
              </button>
              <div className={`px-4 text-gray-700 ${sizeClasses[size]}`}>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={navigationButtonClasses(currentPage === totalPages)}
              >
                Next →
              </button>
            </>
          )}

          {/* Quick jump */}
          {showQuickJump && (
            <div className={`ml-4 flex items-center gap-2 ${sizeClasses[size]}`}>
              <label htmlFor="page-jump" className="text-gray-700">
                Go to page
              </label>
              <input
                id="page-jump"
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={handleQuickJump}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}