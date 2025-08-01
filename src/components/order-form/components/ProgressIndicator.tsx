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
  1: 'Basic Info',
  2: 'Property Details',
  3: 'Timeline',
  4: 'Exchange Goals',
  5: 'Your Team',
  6: 'Preferences'
};

const stepDescriptions: Record<FormStep, string> = {
  1: 'Contact information',
  2: 'Property being sold',
  3: 'Important dates',
  4: 'Exchange strategy',
  5: 'Professional team',
  6: 'Service preferences'
};

// ============================================
// Component Props
// ============================================

interface ProgressIndicatorProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
  onStepClick?: (step: FormStep) => void;
}

// ============================================
// Progress Indicator Component
// ============================================

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps: FormStep[] = [1, 2, 3, 4, 5, 6];
  
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
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${(completedSteps.length / 6) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-900 transition-all duration-500 ease-out"
          />
        </div>
        
        {/* Step Count */}
        <div className="text-center mb-6">
          <span className="text-sm text-gray-600">
            Step {currentStep} of 6
          </span>
        </div>
      </div>
      
      {/* Desktop Step Indicators */}
      <div className="hidden md:block">
        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const status = getStepStatus(step);
            const clickable = isClickable(step);
            
            return (
              <div
                key={step}
                className={`flex-1 ${step < 6 ? 'pr-4' : ''}`}
              >
                <button
                  onClick={() => clickable && onStepClick?.(step)}
                  disabled={!clickable || !onStepClick}
                  className={`
                    w-full text-left
                    ${clickable && onStepClick ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="relative">
                    {/* Connector Line */}
                    {step < 6 && (
                      <div
                        className={`
                          absolute top-5 left-10 w-full h-0.5
                          ${completedSteps.includes(step) ? 'bg-blue-900' : 'bg-gray-300'}
                        `}
                      />
                    )}
                    
                    {/* Step Circle */}
                    <div className="flex items-center">
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
                          <span className="text-sm font-semibold">{step}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Step Label */}
                    <div className="mt-2">
                      <div
                        className={`
                          text-xs font-medium
                          ${status === 'current' ? 'text-blue-900' : 'text-gray-600'}
                        `}
                      >
                        {stepLabels[step]}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {stepDescriptions[step]}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
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
            {currentStep < 6 && (
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