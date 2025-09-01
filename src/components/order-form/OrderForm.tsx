// ============================================
// Order Form Main Component
// National 1031 Center - Multi-Step Form
// ============================================

import React, { useEffect, useRef } from 'react';
import { OrderFormProvider, useOrderForm } from './OrderFormContext';
import { ProgressIndicator } from './components/ProgressIndicator';
import { StepNavigation } from './components/StepNavigation';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { EntityInfoStep } from './steps/EntityInfoStep';
import { PropertyDetailsStep } from './steps/PropertyDetailsStep';
import { AdditionalPropertiesStep } from './steps/AdditionalPropertiesStep';
import { TimelineStep } from './steps/TimelineStep';
import { ProfessionalTeamStep } from './steps/ProfessionalTeamStep';
import { ExchangeGoalsStep } from './steps/ExchangeGoalsStep';
import { ServicePreferencesStep } from './steps/ServicePreferencesStep';
import type { FormStep } from '../../lib/types/orderForm';
import { COMPANY, getPhoneLink } from '../../config/company';

// ============================================
// Step Components Map
// ============================================

const stepComponents = {
  1: ContactInfoStep,
  2: EntityInfoStep,
  3: PropertyDetailsStep,
  4: AdditionalPropertiesStep,
  5: TimelineStep,
  6: ProfessionalTeamStep,
  7: ExchangeGoalsStep,
  8: ServicePreferencesStep
} as const;

// ============================================
// Form Content Component
// ============================================

const OrderFormContent: React.FC = () => {
  const {
    formState,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    isLoading,
    error,
    canGoNext,
    canGoPrevious
  } = useOrderForm();
  
  const formContainerRef = useRef<HTMLDivElement>(null);
  const CurrentStepComponent = stepComponents[formState.currentStep];
  const isLastStep = formState.currentStep === 8;
  
  // Skip step 4 if no second property
  const shouldShowStep = formState.currentStep === 4 ? formState.hasSecondProperty : true;
  
  // Track page view for analytics and scroll to form
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Order Form - Step ' + formState.currentStep,
        page_location: window.location.href
      });
    }
    
    // Scroll to form container on step change
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formState.currentStep]);
  
  return (
    <div className="max-w-4xl mx-auto" ref={formContainerRef}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressIndicator
          currentStep={formState.currentStep}
          completedSteps={formState.completedSteps}
          onStepClick={(step: FormStep) => goToStep(step)}
          hasSecondProperty={formState.hasSecondProperty}
        />
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
      
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Current Step Content */}
        <CurrentStepComponent />
        
        {/* Navigation */}
        <StepNavigation
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={previousStep}
          onNext={nextStep}
          onSubmit={submitForm}
          isLoading={isLoading}
          isLastStep={isLastStep}
        />
      </div>
      
      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Need help? Call us at{' '}
          <a 
            href={getPhoneLink()}
            className="text-blue-900 font-medium hover:underline"
            onClick={() => {
              if (typeof window !== 'undefined' && window.trackPhoneCall) {
                window.trackPhoneCall('order_form_help');
              }
            }}
          >
            {COMPANY.phone.main}
          </a>
        </p>
      </div>
    </div>
  );
};

// ============================================
// Success Component
// ============================================

interface SuccessScreenProps {
  contactId: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ contactId }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-green-600" 
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
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for choosing National 1031 Center. We've received your information 
          and one of our specialists will contact you within 24 hours.
        </p>
        
        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-lg text-left mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What Happens Next:
          </h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Our team will review your information and prepare your exchange documents</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>A 1031 specialist will contact you within 24 hours to discuss your exchange</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>We'll guide you through every step of your 1031 exchange process</span>
            </li>
          </ol>
        </div>
        
        {/* Reference Number */}
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-600">
            Your reference number:
          </p>
          <p className="text-xl font-mono font-semibold text-gray-900">
            {contactId.slice(-8).toUpperCase()}
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/calculator"
            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200"
          >
            Calculate Tax Savings
          </a>
          <a
            href="/complete-guide-1031-exchanges"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Learn About 1031 Exchanges
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Order Form Component
// ============================================

interface OrderFormProps {
  onSuccess?: (contactId: string) => void;
  onError?: (error: Error) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  onSuccess,
  onError 
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [contactId, setContactId] = React.useState('');
  
  const handleSuccess = (id: string) => {
    setContactId(id);
    setIsSubmitted(true);
    
    // Track conversion
    if (typeof window !== 'undefined') {
      if (window.trackConversion) {
        window.trackConversion('order_form_complete', {
          value: 0, // No monetary value yet
          currency: 'USD'
        });
      }
      
      // Scroll to top of success screen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (onSuccess) {
      onSuccess(id);
    }
  };
  
  if (isSubmitted) {
    return <SuccessScreen contactId={contactId} />;
  }
  
  return (
    <OrderFormProvider onSuccess={handleSuccess} onError={onError}>
      <OrderFormContent />
    </OrderFormProvider>
  );
};