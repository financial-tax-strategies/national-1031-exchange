// ============================================
// Exchange Goals Step Component (Step 4)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';

// ============================================
// Options
// ============================================

const replacementOptions = [
  { value: 'yes_specific', label: 'Yes, specific property identified' },
  { value: 'yes_multiple', label: 'Yes, multiple properties identified' },
  { value: 'no_searching', label: 'No, still searching' },
  { value: 'need_help', label: 'Need help finding properties' }
];

const exchangeTypes = [
  { value: 'standard_delayed', label: 'Standard Delayed Exchange' },
  { value: 'reverse', label: 'Reverse Exchange (buy first)' },
  { value: 'improvement', label: 'Improvement/Construction Exchange' },
  { value: 'not_sure', label: 'Not sure - need guidance' }
];

const cashOutOptions = [
  { value: 'no_cash', label: 'No cash out - full reinvestment' },
  { value: 'minimal_50k', label: 'Minimal cash out (< $50k)' },
  { value: 'moderate_50_200k', label: 'Moderate cash out ($50k-$200k)' },
  { value: 'significant_200k_plus', label: 'Significant cash out (> $200k)' },
  { value: 'not_sure', label: 'Not sure yet' }
];

const dstOptions = [
  { value: 'interested', label: 'Interested in DST options' },
  { value: 'traditional_only', label: 'Traditional property only' },
  { value: 'learn_both', label: 'Want to learn about both' },
  { value: 'not_familiar', label: 'Not familiar with DSTs' }
];

// ============================================
// Component
// ============================================

export const ExchangeGoalsStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(4, sessionId);
  }, [analytics]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Exchange Strategy
        </h2>
        <p className="text-gray-600">
          What are you looking to accomplish?
        </p>
      </div>
      
      {/* Replacement Property Status */}
      <div>
        <label 
          htmlFor="replacement-identified"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Have you identified replacement property? <span className="text-red-500">*</span>
        </label>
        <select
          id="replacement-identified"
          value={formState.data['1031x_replacement_identified'] || ''}
          onChange={(e) => handleInputChange('1031x_replacement_identified', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_replacement_identified', 'focus', 4, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_replacement_identified'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_replacement_identified'] ? 'replacement-identified-error' : undefined}
          aria-invalid={!!formState.errors['1031x_replacement_identified']}
        >
          <option value="">Select status...</option>
          {replacementOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_replacement_identified']} 
          fieldId="replacement-identified"
        />
      </div>
      
      {/* Exchange Type */}
      <div>
        <label 
          htmlFor="exchange-type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What type of exchange are you considering? <span className="text-red-500">*</span>
        </label>
        <select
          id="exchange-type"
          value={formState.data['1031x_exchange_type'] || ''}
          onChange={(e) => handleInputChange('1031x_exchange_type', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_exchange_type', 'focus', 4, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_exchange_type'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_exchange_type'] ? 'exchange-type-error' : undefined}
          aria-invalid={!!formState.errors['1031x_exchange_type']}
        >
          <option value="">Select exchange type...</option>
          {exchangeTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_exchange_type']} 
          fieldId="exchange-type"
        />
        <p className="mt-1 text-sm text-gray-500">
          Not sure? Most exchanges are standard delayed exchanges.
        </p>
      </div>
      
      {/* Cash Out */}
      <div>
        <label 
          htmlFor="cash-out"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Do you need to take any cash out? <span className="text-red-500">*</span>
        </label>
        <select
          id="cash-out"
          value={formState.data['1031x_cash_out_needed'] || ''}
          onChange={(e) => handleInputChange('1031x_cash_out_needed', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_cash_out_needed', 'focus', 4, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_cash_out_needed'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_cash_out_needed'] ? 'cash-out-error' : undefined}
          aria-invalid={!!formState.errors['1031x_cash_out_needed']}
        >
          <option value="">Select option...</option>
          {cashOutOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_cash_out_needed']} 
          fieldId="cash-out"
        />
        <p className="mt-1 text-sm text-gray-500">
          Taking cash out will trigger taxes on that portion.
        </p>
      </div>
      
      {/* DST Interest */}
      <div>
        <label 
          htmlFor="dst-interest"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Are you interested in Delaware Statutory Trust (DST) properties? <span className="text-red-500">*</span>
        </label>
        <select
          id="dst-interest"
          value={formState.data['1031x_dst_interest'] || ''}
          onChange={(e) => handleInputChange('1031x_dst_interest', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_dst_interest', 'focus', 4, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_dst_interest'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_dst_interest'] ? 'dst-interest-error' : undefined}
          aria-invalid={!!formState.errors['1031x_dst_interest']}
        >
          <option value="">Select option...</option>
          {dstOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_dst_interest']} 
          fieldId="dst-interest"
        />
      </div>
      
      {/* DST Information Box */}
      {formState.data['1031x_dst_interest'] === 'not_familiar' && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">What is a DST?</h4>
          <p className="text-sm text-blue-800">
            Delaware Statutory Trusts (DSTs) are professionally managed investment properties that 
            qualify for 1031 exchanges. They offer passive income without management responsibilities 
            and can be ideal for investors looking to simplify their real estate holdings.
          </p>
        </div>
      )}
      
      {/* Exchange Type Information */}
      {formState.data['1031x_exchange_type'] && formState.data['1031x_exchange_type'] !== 'not_sure' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            {exchangeTypes.find(t => t.value === formState.data['1031x_exchange_type'])?.label}
          </h4>
          <div className="text-sm text-gray-700">
            {formState.data['1031x_exchange_type'] === 'standard_delayed' && (
              <p>The most common type. You sell first, then have 45 days to identify and 180 days to purchase replacement property.</p>
            )}
            {formState.data['1031x_exchange_type'] === 'reverse' && (
              <p>Purchase your replacement property before selling. Requires special financing and parking arrangements.</p>
            )}
            {formState.data['1031x_exchange_type'] === 'improvement' && (
              <p>Use exchange funds to improve replacement property. Complex but allows property upgrades within the exchange.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};