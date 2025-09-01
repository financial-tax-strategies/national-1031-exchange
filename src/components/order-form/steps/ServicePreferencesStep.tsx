// ============================================
// Service Preferences Step Component (Step 7)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { Select } from '../../ui/Select';
import { RadioGroup } from '../../ui/RadioGroup';
import { CheckboxInput } from '../../ui/CheckboxInput';
import { Input } from '../../ui/Input';

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
  
  // Track step start (Step 7)
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(7, sessionId);
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
      
      {/* Service Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Service Preferences</h3>
        
        <Select
          label="How would you prefer to sign your exchange agreements?"
          name="1031x_order_contract_preference"
          value={formState.data['1031x_order_contract_preference'] || ''}
          onChange={(value) => handleInputChange('1031x_order_contract_preference', value)}
          error={formState.errors['1031x_order_contract_preference']}
          options={contractPreferences}
          required
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
      
      {/* Consultation Preferences */}
      <div className="space-y-4">
        <Select
          label="How would you like to conduct your initial consultation?"
          name="1031x_order_consultation_preference"
          value={formState.data['1031x_order_consultation_preference'] || ''}
          onChange={(value) => handleInputChange('1031x_order_consultation_preference', value)}
          error={formState.errors['1031x_order_consultation_preference']}
          options={consultationPreferences}
          required
        />
        
        <RadioGroup
          label="Best time to contact you?"
          name="1031_order_best_contact_time"
          value={formState.data['1031_order_best_contact_time'] || ''}
          onChange={(value) => handleInputChange('1031_order_best_contact_time', value)}
          error={formState.errors['1031_order_best_contact_time']}
          options={[
            { value: 'morning', label: 'Morning (8am-12pm)' },
            { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
            { value: 'evening', label: 'Evening (5pm-8pm)' },
            { value: 'anytime', label: 'Anytime during business hours' }
          ]}
          orientation="horizontal"
        />
      </div>
      
      {/* Referral Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Referral Information</h3>
        
        <Select
          label="How did you hear about us?"
          name="1031x_order_how_heard"
          value={formState.data['1031x_order_how_heard'] || ''}
          onChange={(value) => handleInputChange('1031x_order_how_heard', value)}
          error={formState.errors['1031x_order_how_heard']}
          options={referralSources}
          required
        />
        
        {(formState.data['1031x_order_how_heard'] === 'cpa_referral' || 
          formState.data['1031x_order_how_heard'] === 'realtor_referral' || 
          formState.data['1031x_order_how_heard'] === 'previous_client') && (
          <Input
            label="Referral Name"
            name="1031_order_referral_name"
            value={formState.data['1031_order_referral_name'] || ''}
            onChange={(value) => handleInputChange('1031_order_referral_name', value)}
            error={formState.errors['1031_order_referral_name']}
            placeholder="Name of person who referred you"
          />
        )}
        
        {formState.data['1031x_order_how_heard'] === 'other' && (
          <Input
            label="Please specify"
            name="1031_order_referral_other"
            value={formState.data['1031_order_referral_other'] || ''}
            onChange={(value) => handleInputChange('1031_order_referral_other', value)}
            error={formState.errors['1031_order_referral_other']}
            placeholder="How did you hear about us?"
          />
        )}
      </div>
      
      {/* Exchange Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Exchange Goals</h3>
        
        <RadioGroup
          label="Primary goal for this exchange?"
          name="1031_order_primary_goal"
          value={formState.data['1031_order_primary_goal'] || ''}
          onChange={(value) => handleInputChange('1031_order_primary_goal', value)}
          error={formState.errors['1031_order_primary_goal']}
          options={[
            { value: 'defer_taxes', label: 'Defer capital gains taxes' },
            { value: 'upgrade_property', label: 'Upgrade to better property' },
            { value: 'diversify', label: 'Diversify portfolio' },
            { value: 'consolidate', label: 'Consolidate properties' },
            { value: 'relocate', label: 'Relocate investments' },
            { value: 'estate_planning', label: 'Estate planning' }
          ]}
        />
        
        <CheckboxInput
          label="I would like information about Delaware Statutory Trusts (DSTs)"
          name="1031_order_interested_dst"
          checked={formState.data['1031_order_interested_dst'] || false}
          onChange={(checked) => updateField('1031_order_interested_dst', checked)}
          description="DSTs offer passive investment options for 1031 exchanges"
        />
        
        <CheckboxInput
          label="I would like information about Qualified Opportunity Zones"
          name="1031_order_interested_qoz"
          checked={formState.data['1031_order_interested_qoz'] || false}
          onChange={(checked) => updateField('1031_order_interested_qoz', checked)}
          description="Alternative tax deferral strategy to consider"
        />
      </div>
      
      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
        
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
              analytics.trackFieldInteraction('1031x_order_additional_notes', 'focus', 7, sessionId);
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
        
        <Input
          label="Promo Code (if applicable)"
          name="1031_order_promo_code"
          value={formState.data['1031_order_promo_code'] || ''}
          onChange={(value) => handleInputChange('1031_order_promo_code', value)}
          error={formState.errors['1031_order_promo_code']}
          placeholder="Enter promo code"
        />
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