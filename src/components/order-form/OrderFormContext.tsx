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
import { getHighLevelService } from '../../lib/services/HighLevelService';
import { generateSessionId } from '../../lib/utils/sessionId';
import { saveSecureData, loadSecureData, clearSecureData, isEncryptionSupported } from '../../lib/utils/encryption';

// ============================================
// Initial State
// ============================================

const initialFormState: FormState = {
  currentStep: 1,
  data: {},
  completedSteps: [],
  errors: {}
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
      const nextStepNum = Math.min(prev.currentStep + 1, 6) as FormStep;
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
      const prevStepNum = Math.max(prev.currentStep - 1, 1) as FormStep;
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
    // Validate all steps
    for (let step = 1; step <= 6; step++) {
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
          urgencyLevel: formState.data['1031x_urgency_level']
        });
      }
      
      // Submit to HighLevel
      const highlevelService = await getHighLevelService();
      const contactId = await highlevelService.createOrderFormLead(formState.data as OrderFormData);
      
      // Clear saved progress on successful submission
      if (isEncryptionSupported()) {
        clearSecureData(STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      sessionStorage.removeItem(SESSION_KEY);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(contactId);
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while submitting your information. Please try again.');
      
      if (onError) {
        onError(err as Error);
      }
      
      // Track error
      if (typeof window !== 'undefined' && window.trackOrderFormEvent) {
        window.trackOrderFormEvent('error_occurred', {
          step: formState.currentStep,
          error: (err as Error).message,
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
    if (formState.currentStep >= 6) return false;
    
    // Always validate current step fields - let the schema handle what's required
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
  // Context Value
  // ============================================
  
  const contextValue: OrderFormContextType = {
    formState,
    updateField,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    isLoading,
    error,
    canGoNext,
    canGoPrevious
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