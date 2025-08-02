/**
 * Database type definitions for National 1031 Exchange platform
 * Generated from the comprehensive schema implementation
 */

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Partial<Lead>;
        Update: Partial<Lead>;
      };
      calculator_submissions: {
        Row: CalculatorSubmission;
        Insert: Partial<CalculatorSubmission>;
        Update: Partial<CalculatorSubmission>;
      };
      order_form_submissions: {
        Row: OrderFormSubmission;
        Insert: Partial<OrderFormSubmission>;
        Update: Partial<OrderFormSubmission>;
      };
      appointments: {
        Row: Appointment;
        Insert: Partial<Appointment>;
        Update: Partial<Appointment>;
      };
      lead_activities: {
        Row: LeadActivity;
        Insert: Partial<LeadActivity>;
        Update: Partial<LeadActivity>;
      };
      highlevel_integrations: {
        Row: HighLevelIntegration;
        Insert: Partial<HighLevelIntegration>;
        Update: Partial<HighLevelIntegration>;
      };
      webhooks: {
        Row: Webhook;
        Insert: Partial<Webhook>;
        Update: Partial<Webhook>;
      };
      highlevel_config: {
        Row: HighLevelConfig;
        Insert: Partial<HighLevelConfig>;
        Update: Partial<HighLevelConfig>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Partial<AdminUser>;
        Update: Partial<AdminUser>;
      };
      admin_audit_logs: {
        Row: AdminAuditLog;
        Insert: Partial<AdminAuditLog>;
        Update: Partial<AdminAuditLog>;
      };
      customer_properties: {
        Row: CustomerProperty;
        Insert: Partial<CustomerProperty>;
        Update: Partial<CustomerProperty>;
      };
      documents: {
        Row: Document;
        Insert: Partial<Document>;
        Update: Partial<Document>;
      };
      market_intelligence: {
        Row: MarketIntelligence;
        Insert: Partial<MarketIntelligence>;
        Update: Partial<MarketIntelligence>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription>;
        Update: Partial<Subscription>;
      };
      availability_cache: {
        Row: AvailabilityCache;
        Insert: Partial<AvailabilityCache>;
        Update: Partial<AvailabilityCache>;
      };
    };
  };
}

// Core Tables
export interface Lead {
  id: string;
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  lead_source: string;
  lead_status: string;
  lead_score: number;
  highlevel_contact_id?: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface CalculatorSubmission {
  id: string;
  lead_id: string;
  property_sale_price?: number;
  current_basis?: number;
  depreciation_taken?: number;
  calculated_capital_gains?: number;
  calculated_tax_savings?: number;
  property_type?: string;
  property_state?: string;
  submission_data: Record<string, any>;
  created_at: string;
}

export interface OrderFormSubmission {
  id: string;
  lead_id: string;
  step_completed: number;
  completion_status: string;
  urgency_level?: string;
  exchange_type?: string;
  property_sale_price?: number;
  form_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Appointment {
  id: string;
  lead_id: string;
  highlevel_appointment_id?: string;
  highlevel_contact_id?: string;
  appointment_date: string;
  appointment_time: string;
  timezone: string;
  duration_minutes: number;
  status: string;
  assigned_specialist_id?: string;
  assigned_specialist_name?: string;
  meeting_location?: string;
  booking_source?: string;
  tax_savings_amount?: number;
  property_sale_price?: number;
  property_type?: string;
  exchange_timeline?: string;
  source_url?: string;
  form_data: Record<string, any>;
  webhook_payload?: Record<string, any>;
  webhook_received_at?: string;
  polling_attempts: number;
  last_polled_at?: string;
  created_at: string;
  updated_at: string;
}

// Activity & Analytics
export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  activity_data: Record<string, any>;
  session_id?: string;
  source_url?: string;
  referrer_url?: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  created_at: string;
}

// Integration Tables
export interface HighLevelIntegration {
  id: string;
  lead_id?: string;
  integration_type: string;
  payload_sent: Record<string, any>;
  response_received?: Record<string, any>;
  success: boolean;
  error_message?: string;
  highlevel_entity_id?: string;
  retry_count: number;
  created_at: string;
}

export interface Webhook {
  id: string;
  lead_id?: string;
  webhook_type: string;
  payload: Record<string, any>;
  headers?: Record<string, any>;
  processed: boolean;
  processing_error?: string;
  received_at: string;
  processed_at?: string;
}

export interface HighLevelConfig {
  id: string;
  api_key: string;
  location_id: string;
  calendar_id: string;
  webhook_secret?: string;
  webhook_url?: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Admin Tables
export interface AdminUser {
  id: string;
  email: string;
  password_hash?: string;
  role: string;
  permissions: Record<string, any>;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id?: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  action_details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Platform Feature Tables
export interface CustomerProperty {
  id: string;
  lead_id: string;
  property_address: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  property_type?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  annual_rental_income?: number;
  status: string;
  acquired_via_1031: boolean;
  previous_property_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  lead_id: string;
  document_type: string;
  document_category?: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  ocr_text?: string;
  ocr_confidence?: number;
  document_analysis?: Record<string, any>;
  encryption_key?: string;
  access_level: string;
  created_at: string;
  updated_at: string;
}

export interface MarketIntelligence {
  id: string;
  location_type: string;
  location_identifier: string;
  location_name: string;
  property_type?: string;
  property_subtype?: string;
  market_data: Record<string, any>;
  data_source: string;
  data_quality_score?: number;
  collected_at: string;
  expires_at?: string;
}

export interface Subscription {
  id: string;
  lead_id: string;
  service_type: string;
  service_tier?: string;
  billing_cycle: string;
  amount: number;
  currency: string;
  status: string;
  started_at: string;
  next_billing_date?: string;
  cancelled_at?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityCache {
  id: string;
  cache_key: string;
  calendar_id: string;
  date: string;
  timezone: string;
  slots: any[];
  expires_at: string;
  created_at: string;
}

// Enums for type safety
export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  CONTACTED = 'contacted',
  APPOINTMENT_SCHEDULED = 'appointment_scheduled',
  CONVERTED = 'converted',
  LOST = 'lost'
}

export enum LeadSource {
  TAX_CALCULATOR = 'tax_calculator',
  ORDER_FORM = 'order_form',
  DIRECT = 'direct',
  REFERRAL = 'referral',
  UNKNOWN = 'unknown'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum OrderFormStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}