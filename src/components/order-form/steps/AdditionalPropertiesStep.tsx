// ============================================
// Additional Properties Step (Step 4 - Optional)
// National 1031 Center - Order Form
// ============================================

import React from 'react';
import { useOrderForm } from '../OrderFormContext';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { RadioGroup } from '../../ui/RadioGroup';
import { USStateSelect } from '../../ui/USStateSelect';
import { PropertyTypeSelect } from '../../ui/PropertyTypeSelect';

export const AdditionalPropertiesStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const { data, errors } = formState;

  // Format currency for display
  const formatCurrency = (value: number | undefined) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Parse currency input
  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue, 10) : undefined;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Second Property Details
        </h2>
        <p className="text-gray-600">
          Please provide information about your second property for the 1031 exchange.
        </p>
      </div>

      {/* Property Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Address
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Street Address"
            name="1031x_order_selling_property_street_address2"
            type="text"
            value={data['1031x_order_selling_property_street_address2'] || ''}
            onChange={(e) => updateField('1031x_order_selling_property_street_address2', e.target.value)}
            placeholder="123 Main Street"
            error={errors['1031x_order_selling_property_street_address2']}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                label="City"
                name="1031x_order_selling_property_city2"
                type="text"
                value={data['1031x_order_selling_property_city2'] || ''}
                onChange={(e) => updateField('1031x_order_selling_property_city2', e.target.value)}
                placeholder="City"
                error={errors['1031x_order_selling_property_city2']}
              />
            </div>
            
            <div className="md:col-span-1">
              <USStateSelect
                label="State"
                name="1031x_order_selling_property_state2"
                value={data['1031x_order_selling_property_state2'] || ''}
                onChange={(value) => updateField('1031x_order_selling_property_state2', value)}
                error={errors['1031x_order_selling_property_state2']}
              />
            </div>
            
            <div className="md:col-span-1">
              <Input
                label="ZIP Code"
                name="1031x_order_selling_property_zip2"
                type="text"
                value={data['1031x_order_selling_property_zip2'] || ''}
                onChange={(e) => updateField('1031x_order_selling_property_zip2', e.target.value)}
                placeholder="12345"
                maxLength={10}
                error={errors['1031x_order_selling_property_zip2']}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Financial Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sale Price"
            name="1031x_order_property_sales_price2"
            type="text"
            value={formatCurrency(data['1031x_order_property_sales_price2'])}
            onChange={(e) => updateField('1031x_order_property_sales_price2', parseCurrency(e.target.value))}
            placeholder="$500,000"
            error={errors['1031x_order_property_sales_price2']}
            helperText="Expected or contracted sale price"
          />
          
          <Input
            label="Mortgage Balance (if any)"
            name="1031x_order_property_mtg_balance2"
            type="text"
            value={formatCurrency(data['1031x_order_property_mtg_balance2'])}
            onChange={(e) => updateField('1031x_order_property_mtg_balance2', parseCurrency(e.target.value))}
            placeholder="$200,000"
            error={errors['1031x_order_property_mtg_balance2']}
            helperText="Current outstanding mortgage"
          />
          
          <Input
            label="Years Owned"
            name="1031x_order_property_years_owned2"
            type="number"
            value={data['1031x_order_property_years_owned2'] || ''}
            onChange={(e) => updateField('1031x_order_property_years_owned2', parseInt(e.target.value) || undefined)}
            placeholder="5"
            min={0}
            error={errors['1031x_order_property_years_owned2']}
          />
        </div>
      </div>

      {/* Seller Financing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seller Financing
        </h3>
        
        <RadioGroup
          label="Will you be providing seller financing?"
          name="1031x_order_seller_financing_exists2"
          value={data['1031x_order_seller_financing_exists2'] || 'no'}
          onChange={(value) => updateField('1031x_order_seller_financing_exists2', value)}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          error={errors['1031x_order_seller_financing_exists2']}
        />
        
        {data['1031x_order_seller_financing_exists2'] === 'yes' && (
          <div className="mt-4">
            <Input
              label="Seller Financing Amount"
              name="1031x_order_seller_financing_amount2"
              type="text"
              value={formatCurrency(data['1031x_order_seller_financing_amount2'])}
              onChange={(e) => updateField('1031x_order_seller_financing_amount2', parseCurrency(e.target.value))}
              placeholder="$100,000"
              error={errors['1031x_order_seller_financing_amount2']}
            />
          </div>
        )}
      </div>

      {/* Cash at Closing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cash at Closing
        </h3>
        
        <RadioGroup
          label="Do you need cash at closing?"
          name="1031x_order_cash_at_closing2"
          value={data['1031x_order_cash_at_closing2'] || 'no'}
          onChange={(value) => updateField('1031x_order_cash_at_closing2', value)}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          error={errors['1031x_order_cash_at_closing2']}
        />
        
        {data['1031x_order_cash_at_closing2'] === 'yes' && (
          <div className="mt-4">
            <Input
              label="Cash Amount Needed"
              name="1031x_order_cash_at_closing_amt2"
              type="text"
              value={formatCurrency(data['1031x_order_cash_at_closing_amt2'])}
              onChange={(e) => updateField('1031x_order_cash_at_closing_amt2', parseCurrency(e.target.value))}
              placeholder="$50,000"
              error={errors['1031x_order_cash_at_closing_amt2']}
              helperText="Amount of cash you need to receive at closing"
            />
          </div>
        )}
      </div>

      {/* Second Property Entity Information (if different) */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Entity Information (if different from first property)
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Entity Name"
            name="1031x_order_taxpayer_entity_name2"
            type="text"
            value={data['1031x_order_taxpayer_entity_name2'] || ''}
            onChange={(e) => updateField('1031x_order_taxpayer_entity_name2', e.target.value)}
            placeholder="Leave blank if same as first property"
            error={errors['1031x_order_taxpayer_entity_name2']}
          />
          
          {data['1031x_order_taxpayer_entity_name2'] && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Representative First Name"
                  name="1031x_order_taxpayer_entity_rep_first_name2"
                  type="text"
                  value={data['1031x_order_taxpayer_entity_rep_first_name2'] || ''}
                  onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_first_name2', e.target.value)}
                  error={errors['1031x_order_taxpayer_entity_rep_first_name2']}
                />
                
                <Input
                  label="Representative Last Name"
                  name="1031x_order_taxpayer_entity_rep_last_name2"
                  type="text"
                  value={data['1031x_order_taxpayer_entity_rep_last_name2'] || ''}
                  onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_last_name2', e.target.value)}
                  error={errors['1031x_order_taxpayer_entity_rep_last_name2']}
                />
              </div>
              
              <Input
                label="Representative Title"
                name="1031x_order_taxpayer_entity_rep_title2"
                type="text"
                value={data['1031x_order_taxpayer_entity_rep_title2'] || ''}
                onChange={(e) => updateField('1031x_order_taxpayer_entity_rep_title2', e.target.value)}
                placeholder="e.g., Managing Member"
                error={errors['1031x_order_taxpayer_entity_rep_title2']}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};