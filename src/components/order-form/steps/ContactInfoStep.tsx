// ============================================
// Contact Information Step Component (Step 1 - Expanded)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect, useState } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { PrivacyNotice } from '../components/PrivacyNotice';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { USStateSelect } from '../../ui/USStateSelect';
import { CountrySelect } from '../../ui/CountrySelect';
import { CheckboxInput } from '../../ui/CheckboxInput';

// ============================================
// Component
// ============================================

export const ContactInfoStep: React.FC = () => {
  const { formState, updateField, updateMultipleFields } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  const [hasSpouse, setHasSpouse] = useState(false);
  const [showMailingAddress, setShowMailingAddress] = useState(false);
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(1, sessionId);
  }, [analytics]);
  
  // Check if spouse fields have data
  useEffect(() => {
    if (formState.data['1031x_order_spouse_first_name'] || 
        formState.data['1031x_order_spouse_last_name']) {
      setHasSpouse(true);
    }
  }, [formState.data]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
    
    // Map new field names to old ones for backward compatibility
    const fieldMappings: Record<string, string> = {
      '1031x_order_contact_first_name': '1031x_order_first_name',
      '1031x_order_contact_last_name': '1031x_order_last_name',
      '1031x_order_contact_email': '1031x_order_email',
      '1031x_order_contact_phone': '1031x_order_phone'
    };
    
    if (fieldMappings[field]) {
      updateField(fieldMappings[field] as keyof typeof formState.data, value);
    }
  };
  
  const handlePhoneChange = (field: string, value: string) => {
    // Format phone number as user types
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    
    updateField(field as keyof typeof formState.data, formatted);
    
    // Backward compatibility for main phone
    if (field === '1031x_order_contact_phone') {
      updateField('1031x_order_phone', formatted);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600">
          Please provide your contact details for the 1031 exchange
        </p>
      </div>
      
      {/* Primary Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Primary Contact
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* First Name */}
          <div>
            <label 
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first-name"
              type="text"
              value={formState.data['1031x_order_contact_first_name'] || formState.data['1031x_order_first_name'] || ''}
              onChange={(e) => handleInputChange('1031x_order_contact_first_name', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_contact_first_name', 'focus', 1, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_contact_first_name'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="John"
              aria-describedby={formState.errors['1031x_order_contact_first_name'] ? 'first-name-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_contact_first_name']}
            />
            <FieldError 
              error={formState.errors['1031x_order_contact_first_name']} 
              fieldId="first-name"
            />
          </div>
          
          {/* Last Name */}
          <div>
            <label 
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last-name"
              type="text"
              value={formState.data['1031x_order_contact_last_name'] || formState.data['1031x_order_last_name'] || ''}
              onChange={(e) => handleInputChange('1031x_order_contact_last_name', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_contact_last_name', 'focus', 1, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_contact_last_name'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Smith"
              aria-describedby={formState.errors['1031x_order_contact_last_name'] ? 'last-name-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_contact_last_name']}
            />
            <FieldError 
              error={formState.errors['1031x_order_contact_last_name']} 
              fieldId="last-name"
            />
          </div>
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formState.data['1031x_order_contact_email'] || formState.data['1031x_order_email'] || ''}
            onChange={(e) => handleInputChange('1031x_order_contact_email', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_order_contact_email', 'focus', 1, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_order_contact_email'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="john@example.com"
            aria-describedby={formState.errors['1031x_order_contact_email'] ? 'email-error' : undefined}
            aria-invalid={!!formState.errors['1031x_order_contact_email']}
          />
          <FieldError 
            error={formState.errors['1031x_order_contact_email']} 
            fieldId="email"
          />
        </div>
        
        {/* Phone Numbers */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Primary Phone */}
          <div>
            <label 
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formState.data['1031x_order_contact_phone'] || formState.data['1031x_order_phone'] || ''}
              onChange={(e) => handlePhoneChange('1031x_order_contact_phone', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_contact_phone', 'focus', 1, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_contact_phone'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="(555) 123-4567"
              maxLength={14}
              aria-describedby={formState.errors['1031x_order_contact_phone'] ? 'phone-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_contact_phone']}
            />
            <FieldError 
              error={formState.errors['1031x_order_contact_phone']} 
              fieldId="phone"
            />
          </div>
          
          {/* Mobile Phone */}
          <div>
            <label 
              htmlFor="mobile-phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Phone
            </label>
            <input
              id="mobile-phone"
              type="tel"
              value={formState.data['1031x_order_contact_mobile_phone'] || ''}
              onChange={(e) => handlePhoneChange('1031x_order_contact_mobile_phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200"
              placeholder="(555) 987-6543"
              maxLength={14}
            />
          </div>
        </div>
        
        {/* Country and Preferred Contact */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Country */}
          <div>
            <label 
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <select
              id="country"
              value={formState.data['1031x_order_contact_country'] || 'US'}
              onChange={(e) => updateField('1031x_order_contact_country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Preferred Contact Method */}
          <div>
            <label 
              htmlFor="contact-preference"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Contact Method <span className="text-red-500">*</span>
            </label>
            <select
              id="contact-preference"
              value={formState.data['1031x_order_preferred_contact'] || ''}
              onChange={(e) => updateField('1031x_order_preferred_contact', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_preferred_contact', 'focus', 1, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_preferred_contact'] ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-describedby={formState.errors['1031x_order_preferred_contact'] ? 'contact-preference-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_preferred_contact']}
            >
              <option value="">Select preference...</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="text">Text Message</option>
              <option value="no_preference">No Preference</option>
            </select>
            <FieldError 
              error={formState.errors['1031x_order_preferred_contact']} 
              fieldId="contact-preference"
            />
          </div>
        </div>
      </div>
      
      {/* Spouse Information (Optional) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Spouse Information
          </h3>
          <button
            type="button"
            onClick={() => setHasSpouse(!hasSpouse)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {hasSpouse ? 'Remove' : 'Add'} Spouse
          </button>
        </div>
        
        {hasSpouse && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Spouse First Name"
                name="1031x_order_spouse_first_name"
                type="text"
                value={formState.data['1031x_order_spouse_first_name'] || ''}
                onChange={(e) => updateField('1031x_order_spouse_first_name', e.target.value)}
                placeholder="Jane"
              />
              
              <Input
                label="Spouse Last Name"
                name="1031x_order_spouse_last_name"
                type="text"
                value={formState.data['1031x_order_spouse_last_name'] || ''}
                onChange={(e) => updateField('1031x_order_spouse_last_name', e.target.value)}
                placeholder="Smith"
              />
            </div>
            
            <Input
              label="Spouse Email"
              name="1031x_order_spouse_email"
              type="email"
              value={formState.data['1031x_order_spouse_email'] || ''}
              onChange={(e) => updateField('1031x_order_spouse_email', e.target.value)}
              placeholder="jane@example.com"
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="spouse-phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Spouse Phone
                </label>
                <input
                  id="spouse-phone"
                  type="tel"
                  value={formState.data['1031x_order_spouse_phone'] || ''}
                  onChange={(e) => handlePhoneChange('1031x_order_spouse_phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200"
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="spouse-mobile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Spouse Mobile
                </label>
                <input
                  id="spouse-mobile"
                  type="tel"
                  value={formState.data['1031x_order_spouse_mobile_phone'] || ''}
                  onChange={(e) => handlePhoneChange('1031x_order_spouse_mobile_phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200"
                  placeholder="(555) 987-6543"
                  maxLength={14}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mailing Address (Optional) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Mailing Address
          </h3>
          <button
            type="button"
            onClick={() => setShowMailingAddress(!showMailingAddress)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showMailingAddress ? 'Hide' : 'Add'} Mailing Address
          </button>
        </div>
        
        {showMailingAddress && (
          <div className="space-y-4">
            <Input
              label="Street Address"
              name="1031x_order_seller_mailing_street_address"
              type="text"
              value={formState.data['1031x_order_seller_mailing_street_address'] || ''}
              onChange={(e) => updateField('1031x_order_seller_mailing_street_address', e.target.value)}
              placeholder="123 Main Street"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="1031x_order_seller_mailing_city"
                type="text"
                value={formState.data['1031x_order_seller_mailing_city'] || ''}
                onChange={(e) => updateField('1031x_order_seller_mailing_city', e.target.value)}
                placeholder="City"
              />
              
              <USStateSelect
                label="State"
                name="1031x_order_seller_mailing_state"
                value={formState.data['1031x_order_seller_mailing_state'] || ''}
                onChange={(value) => updateField('1031x_order_seller_mailing_state', value)}
              />
              
              <Input
                label="ZIP Code"
                name="1031x_order_seller_mailing_zip"
                type="text"
                value={formState.data['1031x_order_seller_mailing_zip'] || ''}
                onChange={(e) => updateField('1031x_order_seller_mailing_zip', e.target.value)}
                placeholder="12345"
                maxLength={10}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
};