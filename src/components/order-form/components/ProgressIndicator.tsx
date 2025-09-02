// ============================================
// Progress Indicator Component
// National 1031 Center - Order Form UI
// ============================================

import React from 'react';
import type { FormStep } from '../../../lib/types/orderForm';

// ============================================
// Step Labels
// ============================================

const stepLabels: Record<FormStep, string> = {
  1: 'Contact Info',
  2: 'Entity Info',
  3: 'Property Details',
  4: 'Second Property',
  5: 'Timeline',
  6: 'Your Team',
  7: 'Exchange Goals',
  8: 'Preferences',
  9: 'Review & Submit'
};

const stepDescriptions: Record<FormStep, string> = {
  1: 'Contact information',
  2: 'Taxpayer details',
  3: 'Property being sold',
  4: 'Additional property',
  5: 'Important dates',
  6: 'Professional team',
  7: 'Exchange strategy',
  8: 'Service preferences',
  9: 'Review and submit'
};

// ============================================
// Component Props
// ============================================

interface ProgressIndicatorProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
  onStepClick?: (step: FormStep) => void;
  hasSecondProperty?: boolean;
}

// ============================================
// Progress Indicator Component
// ============================================

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  hasSecondProperty = false
}) => {
  // Include or exclude step 4 based on hasSecondProperty
  const steps: FormStep[] = hasSecondProperty ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 5, 6, 7, 8, 9];
  
  // Get display step number (accounting for skipped step 4)
  const getDisplayStepNumber = (step: FormStep): number => {
    if (!hasSecondProperty && step > 4) {
      return steps.indexOf(step) + 1;
    }
    return step;
  };
  
  const displayStepNumber = getDisplayStepNumber(currentStep);
  
  const getStepStatus = (step: FormStep) => {
    if (step === currentStep) return 'current';
    if (completedSteps.includes(step)) return 'completed';
    return 'upcoming';
  };
  
  const isClickable = (step: FormStep) => {
    // Can click on completed steps or the next uncompleted step
    return completedSteps.includes(step) || step === completedSteps.length + 1;
  };
  
  return (
    <div className="w-full">
      {/* Progress Bar - Moved to top */}
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
        <div
          style={{ width: `${(completedSteps.length / (hasSecondProperty ? 9 : 8)) * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-900 transition-all duration-500 ease-out"
        />
      </div>
      
      {/* Step Count */}
      <div className="text-center mb-6">
        <span className="text-sm text-gray-600">
          Step {displayStepNumber} of {hasSecondProperty ? 9 : 8}
        </span>
      </div>
      
      {/* Desktop Step Indicators */}
      <div className="hidden md:block">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center gap-8">
            {steps.map((step, index) => {
            const status = getStepStatus(step);
            const clickable = isClickable(step);
            
            return (
              <div
                key={step}
                className="relative"
              >
                {/* Connector Line - positioned between steps */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      absolute top-5 left-full w-8 h-0.5
                      ${completedSteps.includes(step) ? 'bg-blue-900' : 'bg-gray-300'}
                    `}
                  />
                )}
                
                <button
                  onClick={() => clickable && onStepClick?.(step)}
                  disabled={!clickable || !onStepClick}
                  className={`
                    text-center
                    ${clickable && onStepClick ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="relative">
                    
                    {/* Step Circle */}
                    <div className="flex items-center justify-center">
                      <div
                        className={`
                          relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                          transition-all duration-200
                          ${status === 'completed' ? 'bg-blue-900 text-white' : ''}
                          ${status === 'current' ? 'bg-yellow-400 text-blue-900 ring-4 ring-yellow-200' : ''}
                          ${status === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
                          ${clickable && onStepClick ? 'hover:ring-2 hover:ring-blue-500' : ''}
                        `}
                      >
                        {status === 'completed' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">{getDisplayStepNumber(step)}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-2 text-center w-24">
                      <div
                        className={`
                          text-xs font-medium
                          ${status === 'current' ? 'text-blue-900' : 'text-gray-600'}
                        `}
                      >
                        {stepLabels[step]}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 h-8 flex items-start justify-center">
                        <span>{stepDescriptions[step]}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
          </div>
        </div>
      </div>
      
      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6">
          {/* Previous Step Info */}
          <div className="text-left">
            {currentStep > 1 && (
              <div className="text-xs text-gray-500">
                Previous: {stepLabels[(currentStep - 1) as FormStep]}
              </div>
            )}
          </div>
          
          {/* Current Step */}
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-900">
              {stepLabels[currentStep]}
            </div>
            <div className="text-xs text-gray-600">
              {stepDescriptions[currentStep]}
            </div>
          </div>
          
          {/* Next Step Info */}
          <div className="text-right">
            {currentStep < (hasSecondProperty ? 9 : 8) && (
              <div className="text-xs text-gray-500">
                Next: {stepLabels[(currentStep + 1) as FormStep]}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Step Dots */}
        <div className="flex justify-center space-x-2">
          {steps.map((step) => {
            const status = getStepStatus(step);
            
            return (
              <button
                key={step}
                onClick={() => isClickable(step) && onStepClick?.(step)}
                disabled={!isClickable(step) || !onStepClick}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${status === 'completed' ? 'bg-blue-900 w-8' : ''}
                  ${status === 'current' ? 'bg-yellow-400 w-8' : ''}
                  ${status === 'upcoming' ? 'bg-gray-300' : ''}
                `}
                aria-label={`Go to ${stepLabels[step]}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};