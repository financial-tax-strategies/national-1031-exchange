// ============================================
// Property Details Step Component (Step 3)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { USStateSelect } from '../../ui/USStateSelect';
import { PropertyTypeSelect } from '../../ui/PropertyTypeSelect';
import { RadioGroup } from '../../ui/RadioGroup';
import { CheckboxInput } from '../../ui/CheckboxInput';
import { Input } from '../../ui/Input';


// ============================================
// Component
// ============================================

export const PropertyDetailsStep: React.FC = () => {
  const { formState, updateField, toggleSecondProperty } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start (Step 3)
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(3, sessionId);
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
          Complete details about your relinquished property
        </p>
      </div>
      
      {/* Property Address */}
      <Input
        label="Property Street Address"
        name="1031x_order_property_address"
        value={formState.data['1031x_order_property_address'] || ''}
        onChange={(e) => handleInputChange('1031x_order_property_address', e.target.value)}
        error={formState.errors['1031x_order_property_address']}
        placeholder="123 Main Street"
        required
      />
      
      {/* City, State, ZIP, County */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Input
            label="City"
            name="1031x_order_property_city"
            value={formState.data['1031x_order_property_city'] || ''}
            onChange={(e) => handleInputChange('1031x_order_property_city', e.target.value)}
            error={formState.errors['1031x_order_property_city']}
            placeholder="San Francisco"
            required
          />
        </div>
        
        <div className="md:col-span-1">
          <USStateSelect
            label="State"
            name="1031x_order_property_state"
            value={formState.data['1031x_order_property_state'] || ''}
            onChange={(value) => handleInputChange('1031x_order_property_state', value)}
            error={formState.errors['1031x_order_property_state']}
            required
          />
        </div>
        
        <div className="md:col-span-1">
          <Input
            label="ZIP Code"
            name="1031x_order_property_zip"
            value={formState.data['1031x_order_property_zip'] || ''}
            onChange={(e) => handleInputChange('1031x_order_property_zip', e.target.value)}
            error={formState.errors['1031x_order_property_zip']}
            placeholder="94105"
            maxLength={10}
            required
          />
        </div>
        
        <div className="md:col-span-1">
          <Input
            label="County"
            name="1031_order_property_county"
            value={formState.data['1031_order_property_county'] || ''}
            onChange={(e) => handleInputChange('1031_order_property_county', e.target.value)}
            error={formState.errors['1031_order_property_county']}
            placeholder="San Francisco County"
          />
        </div>
      </div>
      
      {/* Property Type and Legal Description */}
      <div className="grid md:grid-cols-2 gap-4">
        <PropertyTypeSelect
          label="Property Type"
          name="1031x_order_property_type"
          value={formState.data['1031x_order_property_type'] || ''}
          onChange={(value) => handleInputChange('1031x_order_property_type', value)}
          error={formState.errors['1031x_order_property_type']}
          required
        />
        
        <Input
          label="Legal Description / APN"
          name="1031_order_property_legal_description"
          value={formState.data['1031_order_property_legal_description'] || ''}
          onChange={(e) => handleInputChange('1031_order_property_legal_description', e.target.value)}
          error={formState.errors['1031_order_property_legal_description']}
          placeholder="Assessor Parcel Number or Legal Description"
        />
      </div>
      
      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Expected Sale Price"
            name="1031x_order_sale_price"
            type="currency"
            value={formatCurrency(formState.data['1031x_order_sale_price'])}
            onChange={(e) => handleNumberChange('1031x_order_sale_price', e.target.value)}
            error={formState.errors['1031x_order_sale_price']}
            placeholder="1,000,000"
            required
          />
          
          <Input
            label="Current Mortgage Balance"
            name="1031x_order_mortgage_balance"
            type="currency"
            value={formatCurrency(formState.data['1031x_order_mortgage_balance'])}
            onChange={(e) => handleNumberChange('1031x_order_mortgage_balance', e.target.value)}
            error={formState.errors['1031x_order_mortgage_balance']}
            placeholder="400,000"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Original Purchase Price"
            name="1031_order_property_purchase_price"
            type="currency"
            value={formatCurrency(formState.data['1031_order_property_purchase_price'])}
            onChange={(e) => handleNumberChange('1031_order_property_purchase_price', e.target.value)}
            error={formState.errors['1031_order_property_purchase_price']}
            placeholder="750,000"
          />
          
          <Input
            label="Purchase Date"
            name="1031_order_property_purchase_date"
            type="date"
            value={formState.data['1031_order_property_purchase_date'] || ''}
            onChange={(e) => handleInputChange('1031_order_property_purchase_date', e.target.value)}
            error={formState.errors['1031_order_property_purchase_date']}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Capital Improvements Amount"
            name="1031_order_property_improvements"
            type="currency"
            value={formatCurrency(formState.data['1031_order_property_improvements'])}
            onChange={(e) => handleNumberChange('1031_order_property_improvements', e.target.value)}
            error={formState.errors['1031_order_property_improvements']}
            placeholder="50,000"
            helpText="Total amount spent on capital improvements"
          />
          
          <Input
            label="Annual Rental Income"
            name="1031_order_property_rental_income"
            type="currency"
            value={formatCurrency(formState.data['1031_order_property_rental_income'])}
            onChange={(e) => handleNumberChange('1031_order_property_rental_income', e.target.value)}
            error={formState.errors['1031_order_property_rental_income']}
            placeholder="60,000"
          />
        </div>
      </div>
      
      {/* Additional Properties */}
      <div className="space-y-4">
        <CheckboxInput
          label="I have a second property to include in this exchange"
          name="hasSecondProperty"
          checked={formState.data.hasSecondProperty || false}
          onChange={(checked) => {
            toggleSecondProperty(checked);
            analytics.trackFieldInteraction('hasSecondProperty', 'change', 3, sessionStorage.getItem('1031_order_form_session') || '');
          }}
          description="Check this if you're selling multiple properties in this 1031 exchange"
        />
      </div>
      
      {/* Additional Property Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
        
        <RadioGroup
          label="Property Use"
          name="1031_order_property_use"
          value={formState.data['1031_order_property_use'] || ''}
          onChange={(value) => handleInputChange('1031_order_property_use', value)}
          error={formState.errors['1031_order_property_use']}
          options={[
            { value: 'investment', label: 'Investment Property (100% rental)' },
            { value: 'business', label: 'Business Property' },
            { value: 'mixed_use', label: 'Mixed Use (partially owner-occupied)' },
            { value: 'vacation_rental', label: 'Vacation Rental' },
            { value: 'land', label: 'Land/Development' }
          ]}
        />
        
        <Input
          label="Property Manager/Agent Name"
          name="1031_order_property_manager"
          value={formState.data['1031_order_property_manager'] || ''}
          onChange={(value) => handleInputChange('1031_order_property_manager', value)}
          error={formState.errors['1031_order_property_manager']}
          placeholder="John Smith Realty"
        />
        
        <Input
          label="Property Manager/Agent Phone"
          name="1031_order_property_manager_phone"
          type="tel"
          value={formState.data['1031_order_property_manager_phone'] || ''}
          onChange={(value) => handleInputChange('1031_order_property_manager_phone', value)}
          error={formState.errors['1031_order_property_manager_phone']}
          placeholder="(555) 123-4567"
        />
      </div>
      
      {/* Information Box */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This information helps us calculate your potential tax savings, 
          determine the best exchange strategy, and ensure all properties qualify for 1031 exchange treatment.
        </p>
      </div>
    </div>
  );
};