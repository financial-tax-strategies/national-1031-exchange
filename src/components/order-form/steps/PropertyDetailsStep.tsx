// ============================================
// Property Details Step Component (Step 2)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { stateNames } from '../../../lib/calculators/taxCalculations';

// ============================================
// Property Type Options
// ============================================

const propertyTypes = [
  { value: 'single_family_rental', label: 'Single Family Rental' },
  { value: 'multi_family_2_4', label: 'Multi-Family (2-4 units)' },
  { value: 'apartment_5_plus', label: 'Apartment Building (5+ units)' },
  { value: 'office', label: 'Office Building' },
  { value: 'retail', label: 'Retail Property' },
  { value: 'industrial', label: 'Industrial/Warehouse' },
  { value: 'land', label: 'Land/Vacant Lot' },
  { value: 'mixed_use', label: 'Mixed Use' },
  { value: 'other', label: 'Other Investment Property' }
];

// ============================================
// Component
// ============================================

export const PropertyDetailsStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(2, sessionId);
  }, [analytics]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  const handleNumberChange = (field: keyof typeof formState.data, value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Convert to number or undefined if empty
    const numValue = cleaned === '' ? undefined : parseFloat(cleaned);
    
    updateField(field, numValue);
  };
  
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return '';
    return value.toLocaleString('en-US');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Property You're Selling
        </h2>
        <p className="text-gray-600">
          Details about your relinquished property
        </p>
      </div>
      
      {/* Property Address */}
      <div>
        <label 
          htmlFor="property-address"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Street Address <span className="text-red-500">*</span>
        </label>
        <input
          id="property-address"
          type="text"
          value={formState.data['1031x_order_property_address'] || ''}
          onChange={(e) => handleInputChange('1031x_order_property_address', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_property_address', 'focus', 2, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_property_address'] ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="123 Main Street"
          aria-describedby={formState.errors['1031x_order_property_address'] ? 'property-address-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_property_address']}
        />
        <FieldError 
          error={formState.errors['1031x_order_property_address']} 
          fieldId="property-address"
        />
      </div>
      
      {/* City, State, ZIP */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* City */}
        <div className="md:col-span-1">
          <label 
            htmlFor="property-city"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="property-city"
            type="text"
            value={formState.data['1031x_order_property_city'] || ''}
            onChange={(e) => handleInputChange('1031x_order_property_city', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_order_property_city', 'focus', 2, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_order_property_city'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="San Francisco"
            aria-describedby={formState.errors['1031x_order_property_city'] ? 'property-city-error' : undefined}
            aria-invalid={!!formState.errors['1031x_order_property_city']}
          />
          <FieldError 
            error={formState.errors['1031x_order_property_city']} 
            fieldId="property-city"
          />
        </div>
        
        {/* State */}
        <div className="md:col-span-1">
          <label 
            htmlFor="property-state"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="property-state"
            value={formState.data['1031x_order_property_state'] || ''}
            onChange={(e) => handleInputChange('1031x_order_property_state', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_order_property_state', 'focus', 2, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_order_property_state'] ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={formState.errors['1031x_order_property_state'] ? 'property-state-error' : undefined}
            aria-invalid={!!formState.errors['1031x_order_property_state']}
          >
            <option value="">Select state...</option>
            {Object.entries(stateNames).map(([abbr, name]) => (
              <option key={abbr} value={abbr}>{name}</option>
            ))}
          </select>
          <FieldError 
            error={formState.errors['1031x_order_property_state']} 
            fieldId="property-state"
          />
        </div>
        
        {/* ZIP */}
        <div className="md:col-span-1">
          <label 
            htmlFor="property-zip"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            id="property-zip"
            type="text"
            value={formState.data['1031x_order_property_zip'] || ''}
            onChange={(e) => handleInputChange('1031x_order_property_zip', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_order_property_zip', 'focus', 2, sessionId);
            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_order_property_zip'] ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="94105"
            maxLength={10}
            aria-describedby={formState.errors['1031x_order_property_zip'] ? 'property-zip-error' : undefined}
            aria-invalid={!!formState.errors['1031x_order_property_zip']}
          />
          <FieldError 
            error={formState.errors['1031x_order_property_zip']} 
            fieldId="property-zip"
          />
        </div>
      </div>
      
      {/* Property Type */}
      <div>
        <label 
          htmlFor="property-type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          id="property-type"
          value={formState.data['1031x_order_property_type'] || ''}
          onChange={(e) => handleInputChange('1031x_order_property_type', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_order_property_type', 'focus', 2, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_order_property_type'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_order_property_type'] ? 'property-type-error' : undefined}
          aria-invalid={!!formState.errors['1031x_order_property_type']}
        >
          <option value="">Select property type...</option>
          {propertyTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_order_property_type']} 
          fieldId="property-type"
        />
      </div>
      
      {/* Financial Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sale Price */}
        <div>
          <label 
            htmlFor="sale-price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Expected Sale Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              id="sale-price"
              type="text"
              value={formatCurrency(formState.data['1031x_order_sale_price'])}
              onChange={(e) => handleNumberChange('1031x_order_sale_price', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_sale_price', 'focus', 2, sessionId);
              }}
              className={`
                w-full pl-8 pr-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_sale_price'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="1,000,000"
              aria-describedby={formState.errors['1031x_order_sale_price'] ? 'sale-price-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_sale_price']}
            />
          </div>
          <FieldError 
            error={formState.errors['1031x_order_sale_price']} 
            fieldId="sale-price"
          />
        </div>
        
        {/* Mortgage Balance */}
        <div>
          <label 
            htmlFor="mortgage-balance"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Mortgage Balance (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              id="mortgage-balance"
              type="text"
              value={formatCurrency(formState.data['1031x_order_mortgage_balance'])}
              onChange={(e) => handleNumberChange('1031x_order_mortgage_balance', e.target.value)}
              onFocus={() => {
                const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
                analytics.trackFieldInteraction('1031x_order_mortgage_balance', 'focus', 2, sessionId);
              }}
              className={`
                w-full pl-8 pr-4 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${formState.errors['1031x_order_mortgage_balance'] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="400,000"
              aria-describedby={formState.errors['1031x_order_mortgage_balance'] ? 'mortgage-balance-error' : undefined}
              aria-invalid={!!formState.errors['1031x_order_mortgage_balance']}
            />
          </div>
          <FieldError 
            error={formState.errors['1031x_order_mortgage_balance']} 
            fieldId="mortgage-balance"
          />
        </div>
      </div>
      
      {/* Information Box */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> The sale price and mortgage information help us calculate 
          your potential tax savings and determine the best exchange strategy for your situation.
        </p>
      </div>
    </div>
  );
};