// ============================================
// Order Form Types
// National 1031 Center - Multi-Step Form
// ============================================

// Contract status options
export type ContractStatus = 
  | 'not_listed'
  | 'listed_no_offers'
  | 'accepted_offer'
  | 'in_escrow'
  | 'closing_scheduled';

// Exchange type options
export type ExchangeType = 
  | 'standard_delayed'
  | 'reverse'
  | 'improvement'
  | 'not_sure';

// Property type options
export type PropertyType = 
  | 'single_family_rental'
  | 'multi_family_2_4'
  | 'apartment_5_plus'
  | 'office'
  | 'retail'
  | 'industrial'
  | 'land'
  | 'mixed_use'
  | 'other';

// Urgency level options
export type UrgencyLevel = 
  | 'planning_3_plus'
  | 'getting_ready_1_3'
  | 'time_sensitive_1'
  | 'urgent_2_weeks';

// ============================================
// Step 1: Basic Information
// ============================================
export interface BasicInfoData {
  '1031x_first_name': string;
  '1031x_last_name': string;
  '1031x_email': string;
  '1031x_phone': string;
  '1031x_preferred_contact': 'phone' | 'email' | 'text' | 'no_preference';
}

// ============================================
// Step 2: Property Details
// ============================================
export interface PropertyDetailsData {
  '1031x_property_address': string;
  '1031x_property_city': string;
  '1031x_property_state': string;
  '1031x_property_zip': string;
  '1031x_property_type': PropertyType;
  '1031x_sale_price': number;
  '1031x_mortgage_balance'?: number;
}

// ============================================
// Step 3: Timeline Information
// ============================================
export interface TimelineData {
  '1031x_contract_status': ContractStatus;
  '1031x_closing_date'?: string; // ISO date string
  '1031x_expected_listing_date'?: string; // ISO date string
  '1031x_urgency_level': UrgencyLevel;
}

// ============================================
// Step 4: Exchange Goals
// ============================================
export interface ExchangeGoalsData {
  '1031x_replacement_identified': 'yes_specific' | 'yes_multiple' | 'no_searching' | 'need_help';
  '1031x_exchange_type': ExchangeType;
  '1031x_cash_out_needed': 'no_cash' | 'minimal_50k' | 'moderate_50_200k' | 'significant_200k_plus' | 'not_sure';
  '1031x_dst_interest': 'interested' | 'traditional_only' | 'learn_both' | 'not_familiar';
}

// ============================================
// Step 5: Professional Team
// ============================================
export interface ProfessionalTeamData {
  '1031x_has_cpa': 'yes' | 'need_referral' | 'will_find';
  '1031x_cpa_name'?: string;
  '1031x_cpa_email'?: string;
  '1031x_realtor_name'?: string;
  '1031x_realtor_email'?: string;
}

// ============================================
// Step 6: Service Preferences
// ============================================
export interface ServicePreferencesData {
  '1031x_contract_preference': 'electronic' | 'mail' | 'in_person';
  '1031x_consultation_preference': 'phone' | 'video' | 'in_person' | 'email_only';
  '1031x_how_heard': 'google' | 'cpa_referral' | 'realtor_referral' | 'previous_client' | 'social_media' | 'other';
  '1031x_additional_notes'?: string;
}

// ============================================
// Complete Form Data
// ============================================
export interface OrderFormData extends 
  BasicInfoData,
  PropertyDetailsData,
  TimelineData,
  ExchangeGoalsData,
  ProfessionalTeamData,
  ServicePreferencesData {}

// ============================================
// Form State & Navigation
// ============================================
export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface FormState {
  currentStep: FormStep;
  data: Partial<OrderFormData>;
  completedSteps: FormStep[];
  errors: Partial<Record<keyof OrderFormData, string>>;
}

// ============================================
// Form Context
// ============================================
export interface OrderFormContextType {
  formState: FormState;
  updateField: (field: keyof OrderFormData, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: FormStep) => void;
  submitForm: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

// ============================================
// Analytics Event Types
// ============================================
export interface OrderFormAnalyticsEvent {
  eventType: 'step_started' | 'step_completed' | 'field_changed' | 'form_abandoned' | 'form_submitted' | 'error_occurred';
  step?: FormStep;
  field?: keyof OrderFormData;
  value?: any;
  timestamp: Date;
  sessionId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

// ============================================
// Submission Response
// ============================================
export interface OrderFormSubmissionResponse {
  success: boolean;
  contactId?: string;
  message?: string;
  nextSteps?: string[];
  errors?: Record<string, string>;
}