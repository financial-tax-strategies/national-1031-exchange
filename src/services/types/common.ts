export interface LeadInput {
  email: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  leadSource: string;
  metadata?: Record<string, any>;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  exchangeType: string;
  timeline: string;
  message: string;
}

// Add TypeScript global declaration for tracking functions
declare global {
  interface Window {
    trackFormSubmit?: (formName: string) => void;
    trackPhoneCall?: (source: string) => void;
    trackLeadCapture?: (source: string, data: any) => void;
  }
}