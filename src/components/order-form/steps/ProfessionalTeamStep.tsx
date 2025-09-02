// ============================================
// Professional Team Step Component (Step 6)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { RadioGroup } from '../../ui/RadioGroup';

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
  
  // Track step start (Step 6) and initialize required fields
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(6, sessionId);
    
    // Initialize required field if not set
    if (!formState.data['1031x_order_has_cpa']) {
      updateField('1031x_order_has_cpa', 'yes');
    }
  }, [analytics, formState.data, updateField]);
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  // Show CPA fields only if user has a CPA
  const showCPAFields = formState.data['1031x_order_has_cpa'] === 'yes';
  
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
      
      {/* CPA/Tax Advisor Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tax Professional</h3>
        
        <Select
          label="Do you have a CPA or tax advisor?"
          name="1031x_order_has_cpa"
          value={formState.data['1031x_order_has_cpa'] || ''}
          onChange={(value) => handleInputChange('1031x_order_has_cpa', value)}
          error={formState.errors['1031x_order_has_cpa']}
          options={cpaOptions}
          required
        />
      </div>
      
      {/* CPA Details - Conditional */}
      {showCPAFields && (
        <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="CPA Name"
              name="1031x_order_cpa_name"
              value={formState.data['1031x_order_cpa_name'] || ''}
              onChange={(e) => handleInputChange('1031x_order_cpa_name', e.target.value)}
              error={formState.errors['1031x_order_cpa_name']}
              placeholder="John Smith, CPA"
            />
            
            <Input
              label="CPA Firm"
              name="1031_order_cpa_firm"
              value={formState.data['1031_order_cpa_firm'] || ''}
              onChange={(e) => handleInputChange('1031_order_cpa_firm', e.target.value)}
              error={formState.errors['1031_order_cpa_firm']}
              placeholder="Smith & Associates CPAs"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="CPA Phone"
              name="1031_order_cpa_phone"
              type="tel"
              value={formState.data['1031_order_cpa_phone'] || ''}
              onChange={(e) => handleInputChange('1031_order_cpa_phone', e.target.value)}
              error={formState.errors['1031_order_cpa_phone']}
              placeholder="(555) 123-4567"
            />
            
            <Input
              label="CPA Email"
              name="1031x_order_cpa_email"
              type="email"
              value={formState.data['1031x_order_cpa_email'] || ''}
              onChange={(e) => handleInputChange('1031x_order_cpa_email', e.target.value)}
              error={formState.errors['1031x_order_cpa_email']}
              placeholder="john@smithcpa.com"
            />
          </div>
          
          <p className="text-sm text-gray-500">
            We can coordinate with your CPA to ensure proper tax planning
          </p>
        </div>
      )}
      
      {/* CPA Referral Message */}
      {formState.data['1031x_order_has_cpa'] === 'need_referral' && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">CPA Referral Available</h4>
          <p className="text-sm text-blue-800">
            We work with experienced CPAs who specialize in 1031 exchanges. 
            We'll connect you with qualified tax professionals in your area.
          </p>
        </div>
      )}
      
      {/* Realtor Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Real Estate Professional</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Realtor/Broker Name"
            name="1031x_order_realtor_name"
            value={formState.data['1031x_order_realtor_name'] || ''}
            onChange={(e) => handleInputChange('1031x_order_realtor_name', e.target.value)}
            error={formState.errors['1031x_order_realtor_name']}
            placeholder="Jane Doe, Realtor"
          />
          
          <Input
            label="Realtor/Broker Company"
            name="1031_order_realtor_company"
            value={formState.data['1031_order_realtor_company'] || ''}
            onChange={(e) => handleInputChange('1031_order_realtor_company', e.target.value)}
            error={formState.errors['1031_order_realtor_company']}
            placeholder="ABC Realty Group"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Realtor/Broker Phone"
            name="1031_order_realtor_phone"
            type="tel"
            value={formState.data['1031_order_realtor_phone'] || ''}
            onChange={(e) => handleInputChange('1031_order_realtor_phone', e.target.value)}
            error={formState.errors['1031_order_realtor_phone']}
            placeholder="(555) 123-4567"
          />
          
          <Input
            label="Realtor/Broker Email"
            name="1031x_order_realtor_email"
            type="email"
            value={formState.data['1031x_order_realtor_email'] || ''}
            onChange={(e) => handleInputChange('1031x_order_realtor_email', e.target.value)}
            error={formState.errors['1031x_order_realtor_email']}
            placeholder="jane@realty.com"
          />
        </div>
      </div>
      
      {/* Attorney Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Legal Professional</h3>
        
        <RadioGroup
          label="Do you have an attorney for this transaction?"
          name="1031_order_has_attorney"
          value={formState.data['1031_order_has_attorney'] || ''}
          onChange={(value) => handleInputChange('1031_order_has_attorney', value)}
          error={formState.errors['1031_order_has_attorney']}
          options={[
            { value: 'yes', label: 'Yes, I have an attorney' },
            { value: 'no', label: 'No attorney involved' },
            { value: 'need_referral', label: 'I need an attorney referral' }
          ]}
        />
        
        {formState.data['1031_order_has_attorney'] === 'yes' && (
          <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Attorney Name"
                name="1031_order_attorney_name"
                value={formState.data['1031_order_attorney_name'] || ''}
                onChange={(e) => handleInputChange('1031_order_attorney_name', e.target.value)}
                error={formState.errors['1031_order_attorney_name']}
                placeholder="John Doe, Esq."
              />
              
              <Input
                label="Law Firm"
                name="1031_order_attorney_firm"
                value={formState.data['1031_order_attorney_firm'] || ''}
                onChange={(e) => handleInputChange('1031_order_attorney_firm', e.target.value)}
                error={formState.errors['1031_order_attorney_firm']}
                placeholder="Doe & Associates"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Attorney Phone"
                name="1031_order_attorney_phone"
                type="tel"
                value={formState.data['1031_order_attorney_phone'] || ''}
                onChange={(e) => handleInputChange('1031_order_attorney_phone', e.target.value)}
                error={formState.errors['1031_order_attorney_phone']}
                placeholder="(555) 123-4567"
              />
              
              <Input
                label="Attorney Email"
                name="1031_order_attorney_email"
                type="email"
                value={formState.data['1031_order_attorney_email'] || ''}
                onChange={(e) => handleInputChange('1031_order_attorney_email', e.target.value)}
                error={formState.errors['1031_order_attorney_email']}
                placeholder="john@lawfirm.com"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Financial Advisor Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Financial Advisor (Optional)</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Financial Advisor Name"
            name="1031_order_financial_advisor_name"
            value={formState.data['1031_order_financial_advisor_name'] || ''}
            onChange={(e) => handleInputChange('1031_order_financial_advisor_name', e.target.value)}
            error={formState.errors['1031_order_financial_advisor_name']}
            placeholder="Sarah Johnson, CFP"
          />
          
          <Input
            label="Financial Advisor Firm"
            name="1031_order_financial_advisor_firm"
            value={formState.data['1031_order_financial_advisor_firm'] || ''}
            onChange={(e) => handleInputChange('1031_order_financial_advisor_firm', e.target.value)}
            error={formState.errors['1031_order_financial_advisor_firm']}
            placeholder="Wealth Management Inc."
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Financial Advisor Phone"
            name="1031_order_financial_advisor_phone"
            type="tel"
            value={formState.data['1031_order_financial_advisor_phone'] || ''}
            onChange={(e) => handleInputChange('1031_order_financial_advisor_phone', e.target.value)}
            error={formState.errors['1031_order_financial_advisor_phone']}
            placeholder="(555) 123-4567"
          />
          
          <Input
            label="Financial Advisor Email"
            name="1031_order_financial_advisor_email"
            type="email"
            value={formState.data['1031_order_financial_advisor_email'] || ''}
            onChange={(e) => handleInputChange('1031_order_financial_advisor_email', e.target.value)}
            error={formState.errors['1031_order_financial_advisor_email']}
            placeholder="sarah@wealthmgmt.com"
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