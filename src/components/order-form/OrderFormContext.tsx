// ============================================
// Order Form Context
// National 1031 Center - State Management
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  OrderFormContextType, 
  FormState, 
  FormStep, 
  OrderFormData 
} from '../../lib/types/orderForm';
import { validateStep } from '../../lib/schemas/orderFormSchemas';
// OrderFormService removed - using API endpoint instead
import { generateSessionId } from '../../lib/utils/sessionId';
import { saveSecureData, loadSecureData, clearSecureData, isEncryptionSupported } from '../../lib/utils/encryption';

// ============================================
// Initial State
// ============================================

const initialFormState: FormState = {
  currentStep: 1,
  data: {},
  completedSteps: [],
  errors: {},
  hasSecondProperty: false
};

// ============================================
// Context Creation
// ============================================

const OrderFormContext = createContext<OrderFormContextType | undefined>(undefined);

// ============================================
// Local Storage Key
// ============================================

const STORAGE_KEY = '1031_order_form_progress';
const SESSION_KEY = '1031_order_form_session';

// ============================================
// Provider Component
// ============================================

interface OrderFormProviderProps {
  children: React.ReactNode;
  onSuccess?: (contactId: string) => void;
  onError?: (error: Error) => void;
}

export const OrderFormProvider: React.FC<OrderFormProviderProps> = ({ 
  children, 
  onSuccess,
  onError 
}) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // ============================================
  // Initialize Session & Load Saved Progress
  // ============================================
  
  useEffect(() => {
    // Get or create session ID
    let savedSessionId = sessionStorage.getItem(SESSION_KEY);
    if (!savedSessionId) {
      savedSessionId = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, savedSessionId);
    }
    setSessionId(savedSessionId);

    // Database health check removed - handled by API endpoint
    // The API endpoint will handle all database connections server-side

    // Load saved progress with encryption support
    try {
      if (isEncryptionSupported()) {
        // Try to load encrypted data
        const decryptedData = loadSecureData(STORAGE_KEY);
        if (decryptedData && decryptedData.formState) {
          setFormState(decryptedData.formState);
          console.log('Loaded encrypted form progress');
        }
      } else {
        // Fallback to unencrypted storage for older browsers
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          // Validate that the saved data is still valid
          if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setFormState(parsed.formState);
            console.log('Loaded unencrypted form progress (fallback mode)');
          } else {
            // Clear expired data
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (err) {
      console.error('Error loading saved progress:', err);
      // Clear any corrupted data
      clearSecureData(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ============================================
  // Save Progress to Local Storage
  // ============================================
  
  const saveProgress = useCallback((state: FormState) => {
    try {
      const dataToSave = {
        formState: state,
        timestamp: Date.now(),
        sessionId
      };
      
      if (isEncryptionSupported()) {
        // Save encrypted data
        saveSecureData(STORAGE_KEY, dataToSave);
      } else {
        // Fallback to unencrypted storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      // Don't throw - gracefully degrade to no persistence
    }
  }, [sessionId]);

  // ============================================
  // Field Update Handler
  // ============================================
  
  const updateField = useCallback((field: keyof OrderFormData, value: any) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        data: {
          ...prev.data,
          [field]: value
        },
        errors: {
          ...prev.errors,
          [field]: undefined // Clear error when field is updated
        }
      };
      
      // Save progress after each field update
      saveProgress(newState);
      
      // Track field change analytically
      if (typeof window !== 'undefined' && window.trackOrderFormEvent) {
        window.trackOrderFormEvent('field_changed', {
          step: prev.currentStep,
          field,
          sessionId
        });
      }
      
      return newState;
    });
  }, [saveProgress, sessionId]);

  // ============================================
  // Update Multiple Fields
  // ============================================
  
  const updateMultipleFields = useCallback((fields: Partial<OrderFormData>) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        data: {
          ...prev.data,
          ...fields
        },
        errors: Object.keys(fields).reduce((acc, field) => ({
          ...acc,
          [field]: undefined
        }), prev.errors)
      };
      
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // ============================================
  // Step Validation
  // ============================================
  
  const validateCurrentStep = useCallback((): boolean => {
    const result = validateStep(formState.currentStep, formState.data);
    
    if (!result.success) {
      const errors: Partial<Record<keyof OrderFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof OrderFormData;
        errors[field] = err.message;
      });
      
      setFormState(prev => ({
        ...prev,
        errors
      }));
      
      return false;
    }
    
    // Clear errors if validation passes
    setFormState(prev => ({
      ...prev,
      errors: {}
    }));
    
    return true;
  }, [formState.currentStep, formState.data]);

  // ============================================
  // Navigation Handlers
  // ============================================
  
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      setError('Please correct the errors before continuing');
      return;
    }
    
    setError(null);
    
    setFormState(prev => {
      // Skip step 4 if no second property
      let nextStepNum = prev.currentStep + 1;
      if (nextStepNum === 4 && !prev.hasSecondProperty) {
        nextStepNum = 5;
      }
      nextStepNum = Math.min(nextStepNum, 9) as FormStep;
      const newCompletedSteps = prev.completedSteps.includes(prev.currentStep)
        ? prev.completedSteps
        : [...prev.completedSteps, prev.currentStep];
      
      const newState = {
        ...prev,
        currentStep: nextStepNum,
        completedSteps: newCompletedSteps
      };
      
      saveProgress(newState);
      
      // Track step completion
      if (typeof window !== 'undefined' && window.trackOrderFormEvent) {
        window.trackOrderFormEvent('step_completed', {
          step: prev.currentStep,
          sessionId
        });
      }
      
      return newState;
    });
  }, [validateCurrentStep, saveProgress, sessionId]);

  const previousStep = useCallback(() => {
    setError(null);
    
    setFormState(prev => {
      // Skip step 4 if no second property when going back
      let prevStepNum = prev.currentStep - 1;
      if (prevStepNum === 4 && !prev.hasSecondProperty) {
        prevStepNum = 3;
      }
      prevStepNum = Math.max(prevStepNum, 1) as FormStep;
      const newState = {
        ...prev,
        currentStep: prevStepNum
      };
      
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  const goToStep = useCallback((step: FormStep) => {
    // Only allow going to completed steps or the next uncompleted step
    const canGoToStep = formState.completedSteps.includes(step) || 
                       step === formState.completedSteps.length + 1;
    
    if (!canGoToStep) {
      setError('Please complete the previous steps first');
      return;
    }
    
    setError(null);
    setFormState(prev => ({
      ...prev,
      currentStep: step
    }));
  }, [formState.completedSteps]);

  // ============================================
  // Form Submission
  // ============================================
  
  const submitForm = useCallback(async () => {
    // Validate all steps (skip step 4 if no second property)
    for (let step = 1; step <= 9; step++) {
      if (step === 4 && !formState.hasSecondProperty) continue;
      const result = validateStep(step, formState.data);
      if (!result.success) {
        setError(`Please complete step ${step} before submitting`);
        goToStep(step as FormStep);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Track form submission
      if (typeof window !== 'undefined' && window.trackOrderFormEvent) {
        window.trackOrderFormEvent('form_submitted', {
          sessionId,
          urgencyLevel: formState.data['1031x_order_urgency_level']
        });
      }
      
      // Submit to API endpoint
      const response = await fetch('/api/order-form-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState.data,
          metadata: {
            sessionId,
            formCompletionTime: undefined // Could track this if needed
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }
      
      const result = await response.json();
      const submissionId = result.submissionId;
      
      // Clear saved progress on successful submission
      if (isEncryptionSupported()) {
        clearSecureData(STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      sessionStorage.removeItem(SESSION_KEY);
      
      // Call success callback with submission ID
      if (onSuccess) {
        onSuccess(submissionId);
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred while submitting your information. Please try again.';
      
      if (err instanceof Error) {
        console.error('Detailed error:', {
          message: err.message,
          stack: err.stack,
          formData: formState.data
        });
        
        // Check for specific error types
        if (err.message.includes('Failed to save form submission')) {
          errorMessage = 'Unable to save your information. Please check your internet connection and try again.';
        } else if (err.message.includes('Supabase')) {
          errorMessage = 'Database connection error. Please try again in a few moments.';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        }
        
        // In development, show the actual error
        if (import.meta.env.DEV) {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      
      if (onError) {
        onError(err as Error);
      }
      
      // Track error with more detail
      if (typeof window !== 'undefined' && window.trackOrderFormEvent) {
        window.trackOrderFormEvent('error_occurred', {
          step: formState.currentStep,
          error: (err as Error).message,
          errorType: err instanceof Error ? err.constructor.name : 'Unknown',
          sessionId
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formState.data, sessionId, goToStep, onSuccess, onError]);

  // ============================================
  // Computed Values
  // ============================================
  
  const canGoNext = useMemo(() => {
    // Can't proceed if we're on the last step
    if (formState.currentStep >= 9) return false;
    
    // Custom validation logic for better UX during form filling
    const data = formState.data;
    
    if (formState.currentStep === 3) {
      // Step 3: Property Details - Check if user has filled required fields
      const hasAddress = data['1031x_order_property_address'] && data['1031x_order_property_address'].length >= 5;
      const hasCity = data['1031x_order_property_city'] && data['1031x_order_property_city'].length >= 2;
      const hasState = data['1031x_order_property_state'] && data['1031x_order_property_state'].length === 2;
      const hasZip = data['1031x_order_property_zip'] && /^\d{5}(-\d{4})?$/.test(data['1031x_order_property_zip']);
      const hasType = data['1031x_order_property_type'] && data['1031x_order_property_type'] !== '';
      const hasPrice = data['1031x_order_sale_price'] && data['1031x_order_sale_price'] >= 10000;
      
      return hasAddress && hasCity && hasState && hasZip && hasType && hasPrice;
    }
    
    // For other steps, use the original validation
    try {
      const result = validateStep(formState.currentStep, formState.data);
      return result.success;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [formState.currentStep, formState.data]);
  
  const canGoPrevious = formState.currentStep > 1;

  // ============================================
  // Toggle Second Property
  // ============================================
  
  const toggleSecondProperty = useCallback((value: boolean) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        hasSecondProperty: value
      };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // ============================================
  // Save and Load Progress Functions
  // ============================================
  
  const saveProgressManually = useCallback(async () => {
    try {
      saveProgress(formState);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving progress:', error);
      return Promise.reject(error);
    }
  }, [formState, saveProgress]);
  
  const loadSavedProgress = useCallback(async () => {
    try {
      if (isEncryptionSupported()) {
        const decryptedData = loadSecureData(STORAGE_KEY);
        if (decryptedData && decryptedData.formState) {
          setFormState(decryptedData.formState);
        }
      } else {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setFormState(parsed.formState);
          }
        }
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading progress:', error);
      return Promise.reject(error);
    }
  }, []);

  // ============================================
  // Context Value
  // ============================================
  
  const contextValue: OrderFormContextType = {
    formState,
    updateField,
    updateMultipleFields,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    saveProgress: saveProgressManually,
    loadSavedProgress,
    isLoading,
    error,
    canGoNext,
    canGoPrevious,
    toggleSecondProperty
  };

  return (
    <OrderFormContext.Provider value={contextValue}>
      {children}
    </OrderFormContext.Provider>
  );
};

// ============================================
// Custom Hook
// ============================================

export const useOrderForm = (): OrderFormContextType => {
  const context = useContext(OrderFormContext);
  if (context === undefined) {
    throw new Error('useOrderForm must be used within an OrderFormProvider');
  }
  return context;
};