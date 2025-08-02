// ============================================
// Professional Team Step Component (Step 5)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';

// ============================================
// Options
// ============================================

const cpaOptions = [
  { value: 'yes', label: 'Yes, have a CPA' },
  { value: 'need_referral', label: 'No, need CPA referral' },
  { value: 'will_find', label: 'Will find one' }
];

// ============================================
// Component
// ============================================

export const ProfessionalTeamStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(5, sessionId);
  }, [analytics]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  // Show CPA fields only if user has a CPA
  const showCPAFields = formState.data['1031x_has_cpa'] === 'yes';
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Professional Team
        </h2>
        <p className="text-gray-600">
          Who's helping with your exchange?
        </p>
      </div>
      
      {/* CPA Status */}
      <div>
        <label 
          htmlFor="has-cpa"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Do you have a CPA or tax advisor? <span className="text-red-500">*</span>
        </label>
        <select
          id="has-cpa"
          value={formState.data['1031x_has_cpa'] || ''}
          onChange={(e) => handleInputChange('1031x_has_cpa', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_has_cpa', 'focus', 5, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_has_cpa'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_has_cpa'] ? 'has-cpa-error' : undefined}
          aria-invalid={!!formState.errors['1031x_has_cpa']}
        >
          <option value="">Select option...</option>
          {cpaOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_has_cpa']} 
          fieldId="has-cpa"
        />
      </div>
      
      {/* CPA Details - Conditional */}
      {showCPAFields && (
        <>
          <div>
            <label 
              htmlFor="cpa-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              CPA Name
            </label>
            <input
              id="cpa-name"
              type="text"
              value={formState.data['1031x_cpa_name'] || ''}
              onChange={(e) => handleInputChange('1031x_cpa_name', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_cpa_name', 'focus', 5, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_cpa_name'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="John Smith, CPA"
              aria-describedby={formState.errors['1031x_cpa_name'] ? 'cpa-name-error' : undefined}
              aria-invalid={!!formState.errors['1031x_cpa_name']}
            />
            <FieldError 
              error={formState.errors['1031x_cpa_name']} 
              fieldId="cpa-name"
            />
          </div>
          
          <div>
            <label 
              htmlFor="cpa-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              CPA Email (optional)
            </label>
            <input
              id="cpa-email"
              type="email"
              value={formState.data['1031x_cpa_email'] || ''}
              onChange={(e) => handleInputChange('1031x_cpa_email', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_cpa_email', 'focus', 5, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_cpa_email'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="john@smithcpa.com"
              aria-describedby={formState.errors['1031x_cpa_email'] ? 'cpa-email-error' : undefined}
              aria-invalid={!!formState.errors['1031x_cpa_email']}
            />
            <FieldError 
              error={formState.errors['1031x_cpa_email']} 
              fieldId="cpa-email"
            />
          </div>
          
          <div>
            <label 
              htmlFor="cpa-phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              CPA Phone (optional)
            </label>
            <input
              id="cpa-phone"
              type="tel"
              value={formState.data['1031x_cpa_phone'] || ''}
              onChange={(e) => handleInputChange('1031x_cpa_phone', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_cpa_phone', 'focus', 5, sessionId);
              }}
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_cpa_phone'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="(555) 123-4567"
              aria-describedby={formState.errors['1031x_cpa_phone'] ? 'cpa-phone-error' : undefined}
              aria-invalid={!!formState.errors['1031x_cpa_phone']}
            />
            <FieldError 
              error={formState.errors['1031x_cpa_phone']} 
              fieldId="cpa-phone"
            />
            <p className="mt-1 text-sm text-gray-500">
              We can coordinate with your CPA to ensure proper tax planning
            </p>
          </div>
        </>
      )}
      
      {/* CPA Referral Message */}
      {formState.data['1031x_has_cpa'] === 'need_referral' && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">CPA Referral Available</h4>
          <p className="text-sm text-blue-800">
            We work with experienced CPAs who specialize in 1031 exchanges. 
            We'll connect you with qualified tax professionals in your area.
          </p>
        </div>
      )}
      
      {/* Realtor Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Real Estate Professional (optional)
        </h3>
        
        <div>
          <label 
            htmlFor="realtor-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Realtor/Broker Name
          </label>
          <input
            id="realtor-name"
            type="text"
            value={formState.data['1031x_realtor_name'] || ''}
            onChange={(e) => handleInputChange('1031x_realtor_name', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_realtor_name', 'focus', 5, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_realtor_name'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Jane Doe, Realtor"
            aria-describedby={formState.errors['1031x_realtor_name'] ? 'realtor-name-error' : undefined}
            aria-invalid={!!formState.errors['1031x_realtor_name']}
          />
          <FieldError 
            error={formState.errors['1031x_realtor_name']} 
            fieldId="realtor-name"
          />
        </div>
        
        <div className="mt-4">
          <label 
            htmlFor="realtor-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Realtor/Broker Email
          </label>
          <input
            id="realtor-email"
            type="email"
            value={formState.data['1031x_realtor_email'] || ''}
            onChange={(e) => handleInputChange('1031x_realtor_email', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_realtor_email', 'focus', 5, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_realtor_email'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="jane@realty.com"
            aria-describedby={formState.errors['1031x_realtor_email'] ? 'realtor-email-error' : undefined}
            aria-invalid={!!formState.errors['1031x_realtor_email']}
          />
          <FieldError 
            error={formState.errors['1031x_realtor_email']} 
            fieldId="realtor-email"
          />
        </div>
      </div>
      
      {/* Professional Team Benefits */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Why a Professional Team Matters</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-start">
            <span className="text-blue-900 mr-2">•</span>
            <span>CPAs ensure proper tax planning and compliance</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-900 mr-2">•</span>
            <span>Realtors help find suitable replacement properties</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-900 mr-2">•</span>
            <span>We coordinate with your team for seamless exchanges</span>
          </li>
        </ul>
      </div>
    </div>
  );
};