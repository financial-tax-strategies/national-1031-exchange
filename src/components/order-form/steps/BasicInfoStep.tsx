// ============================================
// Basic Info Step Component (Step 1)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';

// ============================================
// Component
// ============================================

export const BasicInfoStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(1, sessionId);
  }, [analytics]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  const handlePhoneChange = (value: string) => {
    // Format phone number as user types
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    
    updateField('1031x_phone', formatted);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's Get Started
        </h2>
        <p className="text-gray-600">
          Tell us about yourself
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
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
            value={formState.data['1031x_first_name'] || ''}
            onChange={(e) => handleInputChange('1031x_first_name', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_first_name', 'focus', 1, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_first_name'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="John"
            aria-describedby={formState.errors['1031x_first_name'] ? 'first-name-error' : undefined}
            aria-invalid={!!formState.errors['1031x_first_name']}
          />
          <FieldError 
            error={formState.errors['1031x_first_name']} 
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
            value={formState.data['1031x_last_name'] || ''}
            onChange={(e) => handleInputChange('1031x_last_name', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_last_name', 'focus', 1, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_last_name'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Smith"
            aria-describedby={formState.errors['1031x_last_name'] ? 'last-name-error' : undefined}
            aria-invalid={!!formState.errors['1031x_last_name']}
          />
          <FieldError 
            error={formState.errors['1031x_last_name']} 
            fieldId="last-name"
          />
        </div>
      </div>
      
      {/* Email */}
      <div>
        <label 
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formState.data['1031x_email'] || ''}
          onChange={(e) => handleInputChange('1031x_email', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_email', 'focus', 1, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_email'] ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="john@example.com"
          aria-describedby={formState.errors['1031x_email'] ? 'email-error' : undefined}
          aria-invalid={!!formState.errors['1031x_email']}
        />
        <FieldError 
          error={formState.errors['1031x_email']} 
          fieldId="email"
        />
      </div>
      
      {/* Phone */}
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
          value={formState.data['1031x_phone'] || ''}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_phone', 'focus', 1, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_phone'] ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="(555) 123-4567"
          maxLength={14}
          aria-describedby={formState.errors['1031x_phone'] ? 'phone-error' : undefined}
          aria-invalid={!!formState.errors['1031x_phone']}
        />
        <FieldError 
          error={formState.errors['1031x_phone']} 
          fieldId="phone"
        />
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
          value={formState.data['1031x_preferred_contact'] || ''}
          onChange={(e) => handleInputChange('1031x_preferred_contact', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_preferred_contact', 'focus', 1, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_preferred_contact'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_preferred_contact'] ? 'contact-preference-error' : undefined}
          aria-invalid={!!formState.errors['1031x_preferred_contact']}
        >
          <option value="">Select preference...</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="text">Text Message</option>
          <option value="no_preference">No Preference</option>
        </select>
        <FieldError 
          error={formState.errors['1031x_preferred_contact']} 
          fieldId="contact-preference"
        />
      </div>
      
      {/* Privacy Notice */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Privacy Notice:</strong> Your information is secure and will only be used 
          to process your 1031 exchange. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
};