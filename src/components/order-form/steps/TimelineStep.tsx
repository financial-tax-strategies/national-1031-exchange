// ============================================
// Timeline Step Component (Step 5)
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
// Contract Status Options
// ============================================

const contractStatuses = [
  { value: 'not_listed', label: 'Not listed yet' },
  { value: 'listed_no_offers', label: 'Listed, no offers' },
  { value: 'accepted_offer', label: 'Have accepted offer' },
  { value: 'in_escrow', label: 'In escrow' },
  { value: 'closing_scheduled', label: 'Closing scheduled' }
];

const urgencyLevels = [
  { value: 'planning_3_plus', label: 'Planning ahead (3+ months)' },
  { value: 'getting_ready_1_3', label: 'Getting ready (1-3 months)' },
  { value: 'time_sensitive_1', label: 'Time sensitive (< 1 month)' },
  { value: 'urgent_2_weeks', label: 'Urgent (< 2 weeks)' }
];

// ============================================
// Component
// ============================================

export const TimelineStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start (Step 5)
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(5, sessionId);
  }, [analytics]);
  
  // Determine if date fields should be shown
  const showClosingDate = formState.data['1031x_order_contract_status'] === 'in_escrow' || 
                         formState.data['1031x_order_contract_status'] === 'closing_scheduled';
  const showListingDate = formState.data['1031x_order_contract_status'] === 'not_listed';
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  // Get minimum date for date inputs (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate urgency message
  const getUrgencyMessage = () => {
    const urgencyLevel = formState.data['1031x_order_urgency_level'];
    switch (urgencyLevel) {
      case 'urgent_2_weeks':
        return {
          type: 'urgent',
          message: 'Time is critical! We\'ll prioritize your exchange and contact you within 24 hours.'
        };
      case 'time_sensitive_1':
        return {
          type: 'warning',
          message: 'You\'re approaching important deadlines. Let\'s start your exchange process soon.'
        };
      case 'getting_ready_1_3':
        return {
          type: 'info',
          message: 'Good timing! You have time to plan your exchange strategy properly.'
        };
      case 'planning_3_plus':
        return {
          type: 'success',
          message: 'Excellent planning! Starting early gives you the most flexibility.'
        };
      default:
        return null;
    }
  };
  
  const urgencyMessage = getUrgencyMessage();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Important Dates
        </h2>
        <p className="text-gray-600">
          Critical deadlines for your exchange
        </p>
      </div>
      
      {/* Sale Status Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sale Status</h3>
        
        <Select
          label="What's the current status of your property?"
          name="1031x_order_contract_status"
          value={formState.data['1031x_order_contract_status'] || ''}
          onChange={(value) => handleInputChange('1031x_order_contract_status', value)}
          error={formState.errors['1031x_order_contract_status']}
          options={contractStatuses}
          required
        />
        
        {/* Listing Agent Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Listing Agent Name"
            name="1031_order_listing_agent_name"
            value={formState.data['1031_order_listing_agent_name'] || ''}
            onChange={(value) => handleInputChange('1031_order_listing_agent_name', value)}
            error={formState.errors['1031_order_listing_agent_name']}
            placeholder="Jane Doe"
          />
          
          <Input
            label="Listing Agent Phone"
            name="1031_order_listing_agent_phone"
            type="tel"
            value={formState.data['1031_order_listing_agent_phone'] || ''}
            onChange={(value) => handleInputChange('1031_order_listing_agent_phone', value)}
            error={formState.errors['1031_order_listing_agent_phone']}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Listing Agent Email"
            name="1031_order_listing_agent_email"
            type="email"
            value={formState.data['1031_order_listing_agent_email'] || ''}
            onChange={(value) => handleInputChange('1031_order_listing_agent_email', value)}
            error={formState.errors['1031_order_listing_agent_email']}
            placeholder="jane@realty.com"
          />
          
          <Input
            label="Listing Agent Company"
            name="1031_order_listing_agent_company"
            value={formState.data['1031_order_listing_agent_company'] || ''}
            onChange={(value) => handleInputChange('1031_order_listing_agent_company', value)}
            error={formState.errors['1031_order_listing_agent_company']}
            placeholder="ABC Realty"
          />
        </div>
      </div>
      
      {/* Important Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Important Dates</h3>
        
        {/* Conditional Date Fields */}
        {showClosingDate && (
          <Input
            label="Closing Date"
            name="1031x_order_closing_date"
            type="date"
            value={formState.data['1031x_order_closing_date'] || ''}
            onChange={(value) => handleInputChange('1031x_order_closing_date', value)}
            error={formState.errors['1031x_order_closing_date']}
            min={today}
            required
            helpText="Your 45-day identification period will start on this date"
          />
        )}
        
        {showListingDate && (
          <Input
            label="Expected Listing Date"
            name="1031x_order_expected_listing_date"
            type="date"
            value={formState.data['1031x_order_expected_listing_date'] || ''}
            onChange={(value) => handleInputChange('1031x_order_expected_listing_date', value)}
            error={formState.errors['1031x_order_expected_listing_date']}
            min={today}
            required
          />
        )}
        
        {/* Escrow Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Escrow Number"
            name="1031_order_escrow_number"
            value={formState.data['1031_order_escrow_number'] || ''}
            onChange={(value) => handleInputChange('1031_order_escrow_number', value)}
            error={formState.errors['1031_order_escrow_number']}
            placeholder="ESC-123456"
          />
          
          <Input
            label="Escrow Company"
            name="1031_order_escrow_company"
            value={formState.data['1031_order_escrow_company'] || ''}
            onChange={(value) => handleInputChange('1031_order_escrow_company', value)}
            error={formState.errors['1031_order_escrow_company']}
            placeholder="ABC Title & Escrow"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Escrow Officer Name"
            name="1031_order_escrow_officer_name"
            value={formState.data['1031_order_escrow_officer_name'] || ''}
            onChange={(value) => handleInputChange('1031_order_escrow_officer_name', value)}
            error={formState.errors['1031_order_escrow_officer_name']}
            placeholder="John Smith"
          />
          
          <Input
            label="Escrow Officer Phone"
            name="1031_order_escrow_officer_phone"
            type="tel"
            value={formState.data['1031_order_escrow_officer_phone'] || ''}
            onChange={(value) => handleInputChange('1031_order_escrow_officer_phone', value)}
            error={formState.errors['1031_order_escrow_officer_phone']}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <Input
          label="Escrow Officer Email"
          name="1031_order_escrow_officer_email"
          type="email"
          value={formState.data['1031_order_escrow_officer_email'] || ''}
          onChange={(value) => handleInputChange('1031_order_escrow_officer_email', value)}
          error={formState.errors['1031_order_escrow_officer_email']}
          placeholder="john@escrow.com"
        />
      </div>
      
      {/* Urgency and Replacement Property */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Exchange Timing</h3>
        
        <Select
          label="How soon do you need to complete your exchange?"
          name="1031x_order_urgency_level"
          value={formState.data['1031x_order_urgency_level'] || ''}
          onChange={(value) => handleInputChange('1031x_order_urgency_level', value)}
          error={formState.errors['1031x_order_urgency_level']}
          options={urgencyLevels}
          required
        />
        
        <RadioGroup
          label="Have you identified replacement property?"
          name="1031_order_replacement_identified"
          value={formState.data['1031_order_replacement_identified'] || ''}
          onChange={(value) => handleInputChange('1031_order_replacement_identified', value)}
          error={formState.errors['1031_order_replacement_identified']}
          options={[
            { value: 'yes', label: 'Yes, I have specific properties in mind' },
            { value: 'partial', label: 'I have some ideas but need help' },
            { value: 'no', label: 'No, I need assistance finding properties' }
          ]}
        />
        
        {formState.data['1031_order_replacement_identified'] === 'yes' && (
          <div className="space-y-4">
            <Input
              label="Replacement Property Address"
              name="1031_order_replacement_address"
              value={formState.data['1031_order_replacement_address'] || ''}
              onChange={(value) => handleInputChange('1031_order_replacement_address', value)}
              error={formState.errors['1031_order_replacement_address']}
              placeholder="123 New Property St"
            />
            
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="1031_order_replacement_city"
                value={formState.data['1031_order_replacement_city'] || ''}
                onChange={(value) => handleInputChange('1031_order_replacement_city', value)}
                error={formState.errors['1031_order_replacement_city']}
                placeholder="Los Angeles"
              />
              
              <Input
                label="State"
                name="1031_order_replacement_state"
                value={formState.data['1031_order_replacement_state'] || ''}
                onChange={(value) => handleInputChange('1031_order_replacement_state', value)}
                error={formState.errors['1031_order_replacement_state']}
                placeholder="CA"
              />
              
              <Input
                label="ZIP Code"
                name="1031_order_replacement_zip"
                value={formState.data['1031_order_replacement_zip'] || ''}
                onChange={(value) => handleInputChange('1031_order_replacement_zip', value)}
                error={formState.errors['1031_order_replacement_zip']}
                placeholder="90001"
              />
            </div>
            
            <Input
              label="Expected Purchase Price"
              name="1031_order_replacement_price"
              type="currency"
              value={formState.data['1031_order_replacement_price'] ? formState.data['1031_order_replacement_price'].toLocaleString('en-US') : ''}
              onChange={(value) => {
                const cleaned = value.replace(/[^0-9.]/g, '');
                const numValue = cleaned === '' ? undefined : parseFloat(cleaned);
                updateField('1031_order_replacement_price', numValue);
              }}
              error={formState.errors['1031_order_replacement_price']}
              placeholder="1,200,000"
            />
          </div>
        )}
      </div>
      
      {/* Urgency Alert */}
      {urgencyMessage && (
        <div className={`
          p-4 rounded-lg border
          ${urgencyMessage.type === 'urgent' ? 'bg-red-50 border-red-200' : ''}
          ${urgencyMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
          ${urgencyMessage.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
          ${urgencyMessage.type === 'success' ? 'bg-green-50 border-green-200' : ''}
        `}>
          <div className="flex items-start">
            {urgencyMessage.type === 'urgent' && (
              <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {urgencyMessage.type === 'warning' && (
              <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            {urgencyMessage.type === 'info' && (
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {urgencyMessage.type === 'success' && (
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`
              text-sm
              ${urgencyMessage.type === 'urgent' ? 'text-red-800' : ''}
              ${urgencyMessage.type === 'warning' ? 'text-yellow-800' : ''}
              ${urgencyMessage.type === 'info' ? 'text-blue-800' : ''}
              ${urgencyMessage.type === 'success' ? 'text-green-800' : ''}
            `}>
              {urgencyMessage.message}
            </p>
          </div>
        </div>
      )}
      
      {/* Timeline Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          1031 Exchange Timeline
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="font-semibold mr-2">Day 0:</span>
            <span>Close on your relinquished property</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">Day 45:</span>
            <span>Deadline to identify replacement properties</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">Day 180:</span>
            <span>Deadline to close on replacement property</span>
          </div>
        </div>
      </div>
    </div>
  );
};