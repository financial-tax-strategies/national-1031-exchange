// ============================================
// Service Preferences Step Component (Step 6)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';

// ============================================
// Options
// ============================================

const contractPreferences = [
  { value: 'electronic', label: 'Yes, use electronic contracts (recommended)' },
  { value: 'mail', label: 'Prefer traditional mail' },
  { value: 'in_person', label: 'Sign in person' }
];

const consultationPreferences = [
  { value: 'phone', label: 'Phone consultation' },
  { value: 'video', label: 'Video call (Zoom)' },
  { value: 'in_person', label: 'In-person meeting' },
  { value: 'email_only', label: 'Email only' }
];

const referralSources = [
  { value: 'google', label: 'Google Search' },
  { value: 'cpa_referral', label: 'CPA Referral' },
  { value: 'realtor_referral', label: 'Realtor Referral' },
  { value: 'previous_client', label: 'Previous Client' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' }
];

// ============================================
// Component
// ============================================

export const ServicePreferencesStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(6, sessionId);
  }, [analytics]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  const handleTextAreaChange = (field: keyof typeof formState.data, value: string) => {
    // Limit to 500 characters
    if (value.length <= 500) {
      updateField(field, value);
    }
  };
  
  const remainingChars = 500 - (formState.data['1031x_order_additional_notes']?.length || 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How We'll Work Together
        </h2>
        <p className="text-gray-600">
          Your preferences for the exchange process
        </p>
      </div>
      
      {/* Contract Preference */}
      <div>
        <label 
          htmlFor="contract-preference"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How would you prefer to sign your exchange agreements? <span className="text-red-500">*</span>
        </label>
        <select
          id="contract-preference"
          value={formState.data['1031x_order_contract_preference'] || ''}
          onChange={(e) => handleInputChange('1031x_order_contract_preference', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_contract_preference', 'focus', 6, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_contract_preference'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_order_contract_preference'] ? 'contract-preference-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_contract_preference']}
        >
          <option value="">Select preference...</option>
          {contractPreferences.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_order_contract_preference']} 
          fieldId="contract-preference"
        />
      </div>
      
      {/* Electronic Signature Benefits */}
      {formState.data['1031x_order_contract_preference'] === 'electronic' && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Benefits of Electronic Contracts</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Faster processing - sign from anywhere</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Secure and legally binding</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Automatic backups and audit trail</span>
            </li>
          </ul>
        </div>
      )}
      
      {/* Consultation Preference */}
      <div>
        <label 
          htmlFor="consultation-preference"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How would you like to conduct your initial consultation? <span className="text-red-500">*</span>
        </label>
        <select
          id="consultation-preference"
          value={formState.data['1031x_order_consultation_preference'] || ''}
          onChange={(e) => handleInputChange('1031x_order_consultation_preference', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_consultation_preference', 'focus', 6, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_consultation_preference'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_order_consultation_preference'] ? 'consultation-preference-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_consultation_preference']}
        >
          <option value="">Select preference...</option>
          {consultationPreferences.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_order_consultation_preference']} 
          fieldId="consultation-preference"
        />
      </div>
      
      {/* How They Heard About Us */}
      <div>
        <label 
          htmlFor="how-heard"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How did you hear about us? <span className="text-red-500">*</span>
        </label>
        <select
          id="how-heard"
          value={formState.data['1031x_order_how_heard'] || ''}
          onChange={(e) => handleInputChange('1031x_order_how_heard', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_how_heard', 'focus', 6, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_how_heard'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_order_how_heard'] ? 'how-heard-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_how_heard']}
        >
          <option value="">Select source...</option>
          {referralSources.map(source => (
            <option key={source.value} value={source.value}>{source.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_order_how_heard']} 
          fieldId="how-heard"
        />
      </div>
      
      {/* Additional Notes */}
      <div>
        <label 
          htmlFor="additional-notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Any special circumstances or questions? (optional)
        </label>
        <textarea
          id="additional-notes"
          value={formState.data['1031x_order_additional_notes'] || ''}
          onChange={(e) => handleTextAreaChange('1031x_order_additional_notes', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_additional_notes', 'focus', 6, sessionId);
          }}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_additional_notes'] ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Tell us about any unique aspects of your exchange or questions you have..."
          aria-describedby={formState.errors['1031x_order_additional_notes'] ? 'additional-notes-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_additional_notes']}
        />
        <div className="flex justify-between items-center mt-1">
          <FieldError 
            error={formState.errors['1031x_order_additional_notes']} 
            fieldId="additional-notes"
          />
          <span className={`text-sm ${remainingChars < 50 ? 'text-red-600' : 'text-gray-500'}`}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>
      
      {/* Summary Box */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Ready to Submit Your Application
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          By submitting this form, you're taking the first step toward a successful 1031 exchange. 
          Here's what happens next:
        </p>
        <ol className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>We'll review your information and prepare your exchange documents</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>A specialist will contact you within 24 hours (or immediately if urgent)</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>We'll guide you through every step of your 1031 exchange</span>
          </li>
        </ol>
      </div>
      
      {/* Terms Acknowledgment */}
      <div className="text-sm text-gray-600 text-center">
        By clicking "Submit Application" you agree to our{' '}
        <a href="/terms" className="text-blue-900 hover:underline" target="_blank">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-900 hover:underline" target="_blank">Privacy Policy</a>.
      </div>
    </div>
  );
};