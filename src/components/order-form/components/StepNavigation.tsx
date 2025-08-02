// ============================================
// Step Navigation Component
// National 1031 Center - Order Form UI
// ============================================

import React from 'react';

// ============================================
// Component Props
// ============================================

interface StepNavigationProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
}

// ============================================
// Step Navigation Component
// ============================================

export const StepNavigation: React.FC<StepNavigationProps> = ({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onSubmit,
  isLoading = false,
  isLastStep = false,
  nextButtonText = 'Continue',
  previousButtonText = 'Back'
}) => {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      onNext();
    }
  };
  
  const getNextButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isLastStep) return 'Submit Application';
    return nextButtonText;
  };
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {/* Save Progress Indicator */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500">
          <span className="flex items-center justify-center">
            <svg 
              className="w-4 h-4 mr-1 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
            Progress saved automatically
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${canGoPrevious && !isLoading
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          `}
        >
          <span className="flex items-center justify-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {previousButtonText}
          </span>
        </button>
        
        {/* Next/Submit Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading || (!canGoNext && !isLastStep)}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isLoading || (!canGoNext && !isLastStep)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isLastStep
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500'
              : 'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-700 focus:ring-blue-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
        >
          <span className="flex items-center justify-center">
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
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
                {getNextButtonText()}
              </>
            ) : (
              <>
                {getNextButtonText()}
                {!isLastStep && (
                  <svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {isLastStep && (
                  <svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};