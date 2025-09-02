// ============================================
// Order Form Types
// National 1031 Center - Comprehensive Multi-Step Form
// Updated to include all fields from original WordPress form
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

// How to sign options
export type SigningPreference = 
  | 'electronic'
  | 'mail'
  | 'in_person'
  | 'notary';

// ============================================
// Step 1: Contact Information (Expanded)
// ============================================
export interface ContactInfoData {
  // Primary Contact
  '1031x_order_contact_first_name': string;
  '1031x_order_contact_last_name': string;
  '1031x_order_contact_email': string;
  '1031x_order_contact_phone': string;
  '1031x_order_contact_mobile_phone'?: string;
  '1031x_order_contact_country'?: string;
  '1031x_order_preferred_contact': 'phone' | 'email' | 'text' | 'no_preference';
  
  // Spouse Information (Optional)
  '1031x_order_spouse_first_name'?: string;
  '1031x_order_spouse_last_name'?: string;
  '1031x_order_spouse_email'?: string;
  '1031x_order_spouse_phone'?: string;
  '1031x_order_spouse_mobile_phone'?: string;
  
  // Mailing Address
  '1031x_order_seller_mailing_street_address'?: string;
  '1031x_order_seller_mailing_city'?: string;
  '1031x_order_seller_mailing_state'?: string;
  '1031x_order_seller_mailing_zip'?: string;
}

// Backward compatibility aliases for existing fields
export interface BasicInfoData extends Pick<ContactInfoData, 
  | '1031x_order_contact_first_name' 
  | '1031x_order_contact_last_name'
  | '1031x_order_contact_email'
  | '1031x_order_contact_phone'
  | '1031x_order_preferred_contact'> {
  // Map old field names to new ones for backward compatibility
  '1031x_order_first_name': string;
  '1031x_order_last_name': string;
  '1031x_order_email': string;
  '1031x_order_phone': string;
}

// ============================================
// Step 2: Entity/Taxpayer Information (New)
// ============================================
export interface EntityInfoData {
  '1031x_order_taxpayer_entity_name'?: string;
  '1031x_order_taxpayer_entity_rep_first_name'?: string;
  '1031x_order_taxpayer_entity_rep_last_name'?: string;
  '1031x_order_taxpayer_entity_rep_title'?: string;
  '1031x_order_taxpayer_ein2'?: string;
  '1031x_order_taxpayer_ssn2'?: string;
  '1031x_order_title_held_as_entity'?: string;
}

// ============================================
// Step 3: Selling Property Details (Expanded)
// ============================================
export interface SellingPropertyData {
  // Property Address
  '1031x_order_selling_property_street_address': string;
  '1031x_order_selling_property_city': string;
  '1031x_order_selling_property_state': string;
  '1031x_order_selling_property_zip': string;
  
  // Property Details
  '1031x_order_property_type': PropertyType;
  '1031x_order_property_sales_price': number;
  '1031x_order_property_mtg_balance'?: number;
  '1031x_order_property_years_owned'?: number;
  
  // Seller Financing
  '1031x_order_seller_financing_exists'?: 'yes' | 'no';
  '1031x_order_seller_financing_amount'?: number;
  '1031x_order_seller_financing_term'?: string;
  
  // Cash at Closing
  '1031x_order_cash_at_closing'?: 'yes' | 'no';
  '1031x_order_cash_at_closing_amt'?: number;
}

// Backward compatibility for existing PropertyDetailsData
export interface PropertyDetailsData {
  '1031x_order_property_address': string;
  '1031x_order_property_city': string;
  '1031x_order_property_state': string;
  '1031x_order_property_zip': string;
  '1031x_order_property_type': PropertyType;
  '1031x_order_sale_price': number;
  '1031x_order_mortgage_balance'?: number;
}

// ============================================
// Step 4: Additional Properties (Optional)
// ============================================
export interface AdditionalPropertyData {
  // Second Property Address
  '1031x_order_selling_property_street_address2'?: string;
  '1031x_order_selling_property_city2'?: string;
  '1031x_order_selling_property_state2'?: string;
  '1031x_order_selling_property_zip2'?: string;
  
  // Second Property Details
  '1031x_order_property_sales_price2'?: number;
  '1031x_order_property_mtg_balance2'?: number;
  '1031x_order_property_years_owned2'?: number;
  
  // Second Property Seller Financing
  '1031x_order_seller_financing_exists2'?: 'yes' | 'no';
  '1031x_order_seller_financing_amount2'?: number;
  
  // Second Property Cash at Closing
  '1031x_order_cash_at_closing2'?: 'yes' | 'no';
  '1031x_order_cash_at_closing_amt2'?: number;
  
  // Second Property Spouse Info
  '1031x_order_spouse_first_name2'?: string;
  '1031x_order_spouse_last_name2'?: string;
  '1031x_order_spouse_email2'?: string;
  '1031x_order_spouse_phone2'?: string;
  '1031x_order_spouse_mobile_phone2'?: string;
  
  // Second Property Entity Info
  '1031x_order_taxpayer_entity_name2'?: string;
  '1031x_order_taxpayer_entity_rep_first_name2'?: string;
  '1031x_order_taxpayer_entity_rep_last_name2'?: string;
  '1031x_order_taxpayer_entity_rep_title2'?: string;
  
  // Second Property Mailing Address
  '1031x_order_mailing_address2'?: string;
  '1031x_order_mailing_city2'?: string;
  '1031x_order_mailing_state2'?: string;
  '1031x_order_mailing_zip2'?: string;
}

// ============================================
// Step 5: Timeline & Contract Information
// ============================================
export interface TimelineData {
  '1031x_order_contract_status': ContractStatus;
  '1031x_order_contract_date'?: string;
  '1031x_order_closing_date'?: string;
  '1031x_order_closing_date2'?: string;
  '1031x_order_expected_listing_date'?: string;
  '1031x_order_urgency_level': UrgencyLevel;
}

// ============================================
// Step 6: Professional Team (Expanded)
// ============================================
export interface ProfessionalTeamData {
  // CPA Information
  '1031x_order_has_cpa': 'yes' | 'need_referral' | 'will_find';
  '1031x_order_cpa_name'?: string;
  '1031x_order_cpa_email'?: string;
  
  // Tax Preparer Information
  '1031x_order_tax_preparer_company_name'?: string;
  '1031x_order_tax_preparer_first_name'?: string;
  '1031x_order_tax_preparer_last_name'?: string;
  '1031x_order_tax_preparer_email'?: string;
  '1031x_order_tax_preparer_phone'?: string;
  '1031x_order_tax_preparer_company_name2'?: string;
  '1031x_order_tax_preparer_first_name2'?: string;
  '1031x_order_tax_preparer_last_name2'?: string;
  '1031x_order_tax_preparer_email2'?: string;
  '1031x_order_tax_preparer_phone2'?: string;
  
  // Realtor Information
  '1031x_order_realtor_name'?: string;
  '1031x_order_realtor_email'?: string;
  
  // Closing Company Information
  '1031x_order_closing_company_name'?: string;
  '1031x_order_closing_company_street_address'?: string;
  '1031x_order_closing_company_city'?: string;
  '1031x_order_closing_company_state'?: string;
  '1031x_order_closing_company_zip'?: string;
  '1031x_order_closing_company_contact_first_name'?: string;
  '1031x_order_closing_company_contact_last_name'?: string;
  '1031x_order_closing_company_contact_email'?: string;
  '1031x_order_closing_company_contact_phone'?: string;
  
  // Second Closing Company (if applicable)
  '1031x_order_closing_company_name2'?: string;
  '1031x_order_closing_company_street_address2'?: string;
  '1031x_order_closing_company_city2'?: string;
  '1031x_order_closing_company_state2'?: string;
  '1031x_order_closing_company_zip2'?: string;
  '1031x_order_closing_company_contact_first_name2'?: string;
  '1031x_order_closing_company_contact_last_name2'?: string;
  '1031x_order_closing_company_contact_email2'?: string;
  '1031x_order_closing_company_contact_phone2'?: string;
  
  // Buyer Information (if applicable)
  '1031x_order_buyer_first_name'?: string;
  '1031x_order_buyer_last_name'?: string;
  '1031x_order_buyer_email'?: string;
  '1031x_order_buyer_spouse_first_name'?: string;
  '1031x_order_buyer_spouse_last_name'?: string;
  '1031x_order_buyer_spouse_email'?: string;
  
  // Second Buyer Information
  '1031x_order_buyer_first_name2'?: string;
  '1031x_order_buyer_last_name2'?: string;
}

// ============================================
// Step 7: Exchange Goals
// ============================================
export interface ExchangeGoalsData {
  '1031x_order_replacement_identified': 'yes_specific' | 'yes_multiple' | 'no_searching' | 'need_help';
  '1031x_order_exchange_type': ExchangeType;
  '1031x_order_cash_out_needed': 'no_cash' | 'minimal_50k' | 'moderate_50_200k' | 'significant_200k_plus' | 'not_sure';
  '1031x_order_dst_interest': 'interested' | 'traditional_only' | 'learn_both' | 'not_familiar';
}

// ============================================
// Step 8: Service Preferences & Documents
// ============================================
export interface ServicePreferencesData {
  '1031x_order_contract_preference': 'electronic' | 'mail' | 'in_person';
  '1031x_order_consultation_preference': 'phone' | 'video' | 'in_person' | 'email_only';
  '1031x_order_how_to_sign'?: SigningPreference;
  '1031x_order_how_to_sign2'?: SigningPreference;
  '1031x_order_send_closing_package'?: 'yes' | 'no';
  '1031x_order_how_heard': 'google' | 'cpa_referral' | 'realtor_referral' | 'previous_client' | 'social_media' | 'other';
  '1031x_order_source'?: string;
  '1031x_order_source2'?: string;
  '1031x_order_comments'?: string;
  '1031x_order_comments2'?: string;
  '1031x_order_additional_notes'?: string;
  '1031x_order_upload'?: string; // File upload URL or base64
  '1031x_order_upload2'?: string; // Second file upload
}

// ============================================
// Complete Form Data
// ============================================
export interface OrderFormData extends 
  ContactInfoData,
  EntityInfoData,
  SellingPropertyData,
  AdditionalPropertyData,
  TimelineData,
  ExchangeGoalsData,
  ProfessionalTeamData,
  ServicePreferencesData {
  // Include backward compatibility fields
  '1031x_order_first_name'?: string;
  '1031x_order_last_name'?: string;
  '1031x_order_email'?: string;
  '1031x_order_phone'?: string;
  '1031x_order_property_address'?: string;
  '1031x_order_property_city'?: string;
  '1031x_order_property_state'?: string;
  '1031x_order_property_zip'?: string;
  '1031x_order_sale_price'?: number;
  '1031x_order_mortgage_balance'?: number;
}

// ============================================
// Form State & Navigation
// ============================================
export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface FormState {
  currentStep: FormStep;
  data: Partial<OrderFormData>;
  completedSteps: FormStep[];
  errors: Partial<Record<keyof OrderFormData, string>>;
  hasSecondProperty: boolean; // Flag to show/hide Step 4
}

// ============================================
// Form Context
// ============================================
export interface OrderFormContextType {
  formState: FormState;
  updateField: (field: keyof OrderFormData, value: any) => void;
  updateMultipleFields: (fields: Partial<OrderFormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: FormStep) => void;
  submitForm: () => Promise<void>;
  saveProgress: () => Promise<void>; // New: Save progress feature
  loadSavedProgress: () => Promise<void>; // New: Load saved progress
  isLoading: boolean;
  error: string | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  toggleSecondProperty: () => void; // New: Toggle Step 4 visibility
}

// ============================================
// Analytics Event Types
// ============================================
export interface OrderFormAnalyticsEvent {
  eventType: 'step_started' | 'step_completed' | 'field_changed' | 'form_abandoned' | 'form_submitted' | 'error_occurred' | 'progress_saved' | 'progress_loaded';
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

// ============================================
// File Upload Types
// ============================================
export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
  base64?: string;
}