// ============================================
// HighLevel Integration Types
// National 1031 Center - Simplified Architecture
// ============================================

// ============================================
// Database Models
// ============================================

export interface HighLevelConfig {
  id: string;
  apiKey: string; // Encrypted in database
  locationId: string;
  calendarId: string;
  webhookSecret?: string;
  webhookUrl?: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 
  | 'pending_assignment'  // Waiting for HighLevel round-robin assignment
  | 'confirmed'          // Assignment complete with specialist
  | 'failed'            // Booking failed  
  | 'cancelled'         // User or system cancelled
  | 'completed'         // Appointment took place
  | 'no_show';          // User didn't show up

export interface Appointment {
  id: string;
  
  // HighLevel Correlation
  highlevelAppointmentId: string;
  highlevelContactId: string;
  
  // Status
  status: AppointmentStatus;
  
  // Assignment Details (from webhook)
  assignedSpecialistId?: string;
  assignedSpecialistName?: string;
  meetingLocation?: string;
  
  // Appointment Details
  appointmentDate: Date;
  appointmentTime: string;
  timezone: string;
  durationMinutes: number;
  
  // Contact Information
  contactEmail: string;
  contactPhone?: string;
  contactFirstName: string;
  contactLastName: string;
  
  // 1031 Exchange Context
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  propertyType?: string;
  exchangeTimeline?: string;
  
  // Technical Tracking
  sourceUrl?: string;
  formData?: Record<string, any>;
  webhookPayload?: Record<string, any>;
  webhookReceivedAt?: Date;
  
  // Polling Fallback
  pollingAttempts: number;
  lastPolledAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookLog {
  id: string;
  appointmentId?: string;
  webhookType: string;
  payload: Record<string, any>;
  headers?: Record<string, any>;
  processed: boolean;
  processingError?: string;
  receivedAt: Date;
  processedAt?: Date;
}

export interface AvailabilityCache {
  id: string;
  cacheKey: string;
  calendarId: string;
  date: Date;
  timezone: string;
  slots: AvailableSlot[];
  expiresAt: Date;
  createdAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateAppointmentRequest {
  // Contact Information
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  
  // Appointment Details
  appointmentDate: string; // ISO string
  timezone: string;
  
  // 1031 Context from Calculator
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  propertyType?: string;
  exchangeTimeline?: string;
  
  // Tracking
  sourceUrl?: string;
  formData?: Record<string, any>;
}

export interface AvailableSlot {
  time: string; // ISO timestamp
  available: boolean;
  duration: number; // minutes
  displayTime?: string; // Formatted for display
}

export interface AvailabilityRequest {
  calendarId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  timezone: string;
}

export interface AvailabilityResponse {
  calendarId: string;
  timezone: string;
  slots: AvailableSlot[];
  cached: boolean;
  cacheExpiresAt?: string;
}

// ============================================
// HighLevel API Types
// ============================================

export interface HighLevelContact {
  id?: string;
  locationId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface HighLevelAppointmentRequest {
  calendarId: string;
  contactId: string;
  startTime: string; // ISO timestamp
  endTime: string;   // ISO timestamp
  timezone: string;
  title?: string;
  appointmentStatus?: string;
}

export interface HighLevelAppointmentResponse {
  id: string;
  calendarId: string;
  contactId: string;
  locationId: string;
  title: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  assignedUserId?: string;
  assignedUserName?: string;
  meetingLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HighLevelWebhookPayload {
  id: string;
  type: 'AppointmentCreate' | 'AppointmentUpdate' | 'AppointmentDelete';
  locationId: string;
  contactId: string;
  calendarId: string;
  appointmentId: string;
  assignedUserId?: string;
  assignedUserName?: string;
  selectedTimezone: string;
  selectedSlot: string;
  status: string;
  appointmentStatus: string;
  meetingLocation?: string;
  meetingLocationType?: 'zoom' | 'meet' | 'phone' | 'custom';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Component Props Types
// ============================================

export interface BookingFlowProps {
  // Lead data from calculator
  leadData: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    taxSavingsAmount?: number;
    propertySalePrice?: number;
    propertyDetails?: Record<string, any>;
  };
  
  // Callbacks
  onSuccess: (appointment: Appointment) => void;
  onError: (error: BookingError) => void;
  onCancel?: () => void;
  
  // Options
  options?: BookingOptions;
}

export interface BookingOptions {
  timezone?: string; // Override default timezone
  prefetchDays?: number; // Days to load ahead (default: 14)
  minBookingHours?: number; // Minimum hours ahead (default: 2)
  maxBookingDays?: number; // Maximum days ahead (default: 60)
  debugMode?: boolean;
}

// ============================================
// Error Types
// ============================================

export interface BookingError {
  code: BookingErrorCode;
  message: string;
  details?: any;
  userMessage: string;
  retryable: boolean;
}

export const BookingErrorCode = {
  // API Errors
  API_TIMEOUT: 'API_TIMEOUT',
  API_RATE_LIMIT: 'API_RATE_LIMIT', 
  API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
  API_AUTHENTICATION_FAILED: 'API_AUTHENTICATION_FAILED',
  
  // Availability Errors
  NO_AVAILABILITY: 'NO_AVAILABILITY',
  SLOT_NO_LONGER_AVAILABLE: 'SLOT_NO_LONGER_AVAILABLE',
  CALENDAR_NOT_FOUND: 'CALENDAR_NOT_FOUND',
  
  // Contact Errors
  CONTACT_CREATION_FAILED: 'CONTACT_CREATION_FAILED',
  INVALID_CONTACT_DATA: 'INVALID_CONTACT_DATA',
  
  // Appointment Errors
  APPOINTMENT_CREATION_FAILED: 'APPOINTMENT_CREATION_FAILED',
  ASSIGNMENT_TIMEOUT: 'ASSIGNMENT_TIMEOUT',
  WEBHOOK_TIMEOUT: 'WEBHOOK_TIMEOUT',
  
  // Configuration Errors
  INVALID_CONFIG: 'INVALID_CONFIG',
  CALENDAR_MISCONFIGURED: 'CALENDAR_MISCONFIGURED',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export type BookingErrorCode = typeof BookingErrorCode[keyof typeof BookingErrorCode];

// ============================================
// UI State Types
// ============================================

export type BookingState = 
  | 'idle'                    // Initial state
  | 'loading-availability'    // Fetching available slots
  | 'selecting-date'          // User selecting date
  | 'selecting-time'          // User selecting time slot
  | 'confirming-details'      // Showing booking summary
  | 'creating-appointment'    // Creating appointment
  | 'pending-assignment'      // Waiting for specialist assignment
  | 'confirmed'              // Appointment confirmed
  | 'error';                 // Error state

export interface BookingUIState {
  currentStep: BookingState;
  selectedDate?: Date;
  selectedSlot?: AvailableSlot;
  availableSlots: AvailableSlot[];
  appointment?: Appointment;
  error?: BookingError;
  loading: boolean;
}

// ============================================
// Utility Types
// ============================================

export interface TimeZoneInfo {
  name: string;
  offset: string;
  abbreviation: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ============================================
// Environment Configuration
// ============================================

export interface HighLevelEnvironmentConfig {
  apiBaseUrl: string;
  webhookBaseUrl: string;
  defaultTimezone: string;
  cacheTimeout: number; // minutes
  pollingInterval: number; // milliseconds
  maxPollingAttempts: number;
  debugMode: boolean;
}

// ============================================
// Analytics Integration
// ============================================

export interface BookingAnalyticsEvent {
  eventType: 'booking_started' | 'date_selected' | 'time_selected' | 'appointment_created' | 'assignment_received';
  appointmentId?: string;
  calendarId?: string;
  taxSavingsAmount?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================
// Export All Types
// ============================================

export type {
  // Database models
  HighLevelConfig,
  Appointment,
  AppointmentStatus,
  WebhookLog,
  AvailabilityCache,
  
  // API types
  CreateAppointmentRequest,
  AvailableSlot,
  AvailabilityRequest,
  AvailabilityResponse,
  
  // HighLevel API
  HighLevelContact,
  HighLevelAppointmentRequest,
  HighLevelAppointmentResponse, 
  HighLevelWebhookPayload,
  
  // Component props
  BookingFlowProps,
  BookingOptions,
  
  // UI state
  BookingState,
  BookingUIState,
  
  // Error types
  BookingError,
  
  // Utilities
  TimeZoneInfo,
  DateRange,
  
  // Configuration
  HighLevelEnvironmentConfig,
  
  // Analytics
  BookingAnalyticsEvent
};

// Export runtime values (not just types)
export { BookingErrorCode };