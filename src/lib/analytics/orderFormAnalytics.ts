// ============================================
// Order Form Analytics
// National 1031 Center - Analytics Tracking
// ============================================

import type { FormStep, OrderFormData } from '../types/orderForm';

// ============================================
// Analytics Event Types
// ============================================

interface BaseEvent {
  timestamp: number;
  sessionId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  referrer?: string;
  source?: string;
}

interface StepEvent extends BaseEvent {
  step: FormStep;
  timeOnStep?: number;
}

interface FieldEvent extends BaseEvent {
  step: FormStep;
  field: keyof OrderFormData;
  fieldType: string;
  interactionType: 'focus' | 'blur' | 'change' | 'clear';
}

interface SubmissionEvent extends BaseEvent {
  completionTime: number;
  stepsVisited: FormStep[];
  urgencyLevel?: string;
  exchangeType?: string;
}

interface ErrorEvent extends BaseEvent {
  step?: FormStep;
  field?: keyof OrderFormData;
  errorType: string;
  errorMessage: string;
}

interface AbandonmentEvent extends BaseEvent {
  lastStep: FormStep;
  completedSteps: FormStep[];
  timeSpent: number;
  lastField?: keyof OrderFormData;
}

// ============================================
// Device Detection
// ============================================

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for mobile user agents
  if (/mobile|android|iphone|ipod/.test(userAgent) && width < 768) {
    return 'mobile';
  }
  
  // Check for tablet
  if (/ipad|tablet/.test(userAgent) || (width >= 768 && width < 1024)) {
    return 'tablet';
  }
  
  return 'desktop';
}

// ============================================
// Get UTM Parameters
// ============================================

function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  
  return utmParams;
}

// ============================================
// Analytics Tracking Class
// ============================================

class OrderFormAnalytics {
  private startTime: number;
  private stepStartTimes: Map<FormStep, number> = new Map();
  private fieldInteractions: Map<string, number> = new Map();
  
  constructor() {
    this.startTime = Date.now();
  }
  
  // ============================================
  // Step Tracking
  // ============================================
  
  trackStepStart(step: FormStep, sessionId: string): void {
    this.stepStartTimes.set(step, Date.now());
    
    const event: StepEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      referrer: document.referrer,
      source: getUTMParams().utm_source
    };
    
    this.sendEvent('order_form_step_started', event);
  }
  
  trackStepComplete(step: FormStep, sessionId: string): void {
    const startTime = this.stepStartTimes.get(step);
    const timeOnStep = startTime ? Date.now() - startTime : undefined;
    
    const event: StepEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      timeOnStep
    };
    
    this.sendEvent('order_form_step_completed', event);
  }
  
  // ============================================
  // Field Tracking
  // ============================================
  
  trackFieldInteraction(
    field: keyof OrderFormData,
    interactionType: 'focus' | 'blur' | 'change' | 'clear',
    step: FormStep,
    sessionId: string
  ): void {
    // Count interactions per field
    const key = `${field}_${interactionType}`;
    this.fieldInteractions.set(key, (this.fieldInteractions.get(key) || 0) + 1);
    
    const event: FieldEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      field,
      fieldType: this.getFieldType(field),
      interactionType
    };
    
    this.sendEvent('order_form_field_interaction', event);
  }
  
  // ============================================
  // Form Submission
  // ============================================
  
  trackFormSubmission(
    sessionId: string,
    formData: Partial<OrderFormData>,
    completedSteps: FormStep[]
  ): void {
    const completionTime = Date.now() - this.startTime;
    
    const event: SubmissionEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      completionTime,
      stepsVisited: completedSteps,
      urgencyLevel: formData['1031x_urgency_level'],
      exchangeType: formData['1031x_exchange_type'],
      ...getUTMParams()
    };
    
    this.sendEvent('order_form_submitted', event);
    
    // Track conversion
    if (typeof window !== 'undefined' && window.trackConversion) {
      window.trackConversion('order_form', {
        urgencyLevel: formData['1031x_urgency_level'],
        exchangeType: formData['1031x_exchange_type']
      });
    }
  }
  
  // ============================================
  // Error Tracking
  // ============================================
  
  trackError(
    errorType: string,
    errorMessage: string,
    sessionId: string,
    step?: FormStep,
    field?: keyof OrderFormData
  ): void {
    const event: ErrorEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      step,
      field,
      errorType,
      errorMessage
    };
    
    this.sendEvent('order_form_error', event);
  }
  
  // ============================================
  // Abandonment Tracking
  // ============================================
  
  trackAbandonment(
    lastStep: FormStep,
    completedSteps: FormStep[],
    sessionId: string,
    lastField?: keyof OrderFormData
  ): void {
    const timeSpent = Date.now() - this.startTime;
    
    const event: AbandonmentEvent = {
      timestamp: Date.now(),
      sessionId,
      deviceType: getDeviceType(),
      lastStep,
      completedSteps,
      timeSpent,
      lastField
    };
    
    this.sendEvent('order_form_abandoned', event);
  }
  
  // ============================================
  // Utility Methods
  // ============================================
  
  private getFieldType(field: keyof OrderFormData): string {
    // Map field names to their types for analytics
    const fieldTypeMap: Partial<Record<keyof OrderFormData, string>> = {
      '1031x_email': 'email',
      '1031x_phone': 'phone',
      '1031x_sale_price': 'number',
      '1031x_mortgage_balance': 'number',
      '1031x_closing_date': 'date',
      '1031x_expected_listing_date': 'date',
      '1031x_additional_notes': 'textarea'
    };
    
    // Default to text for unmapped fields
    return fieldTypeMap[field] || 'text';
  }
  
  private sendEvent(eventName: string, eventData: any): void {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    // Send to HighLevel if available
    if (typeof window !== 'undefined' && window.trackHighLevelEvent) {
      window.trackHighLevelEvent(eventName, eventData);
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OrderForm Analytics] ${eventName}:`, eventData);
    }
  }
  
  // ============================================
  // Performance Metrics
  // ============================================
  
  getFormMetrics(): {
    totalTime: number;
    stepTimes: Record<FormStep, number>;
    fieldInteractionCounts: Record<string, number>;
  } {
    const totalTime = Date.now() - this.startTime;
    
    const stepTimes: Record<FormStep, number> = {} as Record<FormStep, number>;
    this.stepStartTimes.forEach((startTime, step) => {
      stepTimes[step] = Date.now() - startTime;
    });
    
    const fieldInteractionCounts: Record<string, number> = {};
    this.fieldInteractions.forEach((count, field) => {
      fieldInteractionCounts[field] = count;
    });
    
    return {
      totalTime,
      stepTimes,
      fieldInteractionCounts
    };
  }
}

// ============================================
// Singleton Instance
// ============================================

let analyticsInstance: OrderFormAnalytics | null = null;

export function getOrderFormAnalytics(): OrderFormAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new OrderFormAnalytics();
  }
  return analyticsInstance;
}

// ============================================
// React Hook
// ============================================

export function useOrderFormAnalytics() {
  return getOrderFormAnalytics();
}

// ============================================
// Window Extension
// ============================================

declare global {
  interface Window {
    trackOrderFormEvent: (eventType: string, data: any) => void;
  }
}

// Initialize tracking on window
if (typeof window !== 'undefined') {
  window.trackOrderFormEvent = (eventType: string, data: any) => {
    const analytics = getOrderFormAnalytics();
    
    switch (eventType) {
      case 'step_started':
        analytics.trackStepStart(data.step, data.sessionId);
        break;
      case 'step_completed':
        analytics.trackStepComplete(data.step, data.sessionId);
        break;
      case 'field_changed':
        analytics.trackFieldInteraction(data.field, 'change', data.step, data.sessionId);
        break;
      case 'form_submitted':
        analytics.trackFormSubmission(data.sessionId, data.formData || {}, data.completedSteps || []);
        break;
      case 'error_occurred':
        analytics.trackError(data.errorType || 'unknown', data.error, data.sessionId, data.step, data.field);
        break;
      case 'form_abandoned':
        analytics.trackAbandonment(data.lastStep, data.completedSteps || [], data.sessionId, data.lastField);
        break;
    }
  };
}