// ============================================
// Timeline Step Component (Step 3)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect, useState } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { FieldError } from '../components/FieldError';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';

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
  
  // Track step start
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(3, sessionId);
  }, [analytics]);
  
  // Determine if date fields should be shown
  const showClosingDate = formState.data['1031x_contract_status'] === 'in_escrow' || 
                         formState.data['1031x_contract_status'] === 'closing_scheduled';
  const showListingDate = formState.data['1031x_contract_status'] === 'not_listed';
  
  const handleInputChange = (field: keyof typeof formState.data, value: string) => {
    updateField(field, value);
  };
  
  // Get minimum date for date inputs (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate urgency message
  const getUrgencyMessage = () => {
    const urgencyLevel = formState.data['1031x_urgency_level'];
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
      
      {/* Contract Status */}
      <div>
        <label 
          htmlFor="contract-status"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What's the current status of your property? <span className="text-red-500">*</span>
        </label>
        <select
          id="contract-status"
          value={formState.data['1031x_contract_status'] || ''}
          onChange={(e) => handleInputChange('1031x_contract_status', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_contract_status', 'focus', 3, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_contract_status'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_contract_status'] ? 'contract-status-error' : undefined}
          aria-invalid={!!formState.errors['1031x_contract_status']}
        >
          <option value="">Select status...</option>
          {contractStatuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_contract_status']} 
          fieldId="contract-status"
        />
      </div>
      
      {/* Conditional Date Fields */}
      {showClosingDate && (
        <div>
          <label 
            htmlFor="closing-date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Closing Date <span className="text-red-500">*</span>
          </label>
          <input
            id="closing-date"
            type="date"
            value={formState.data['1031x_closing_date'] || ''}
            onChange={(e) => handleInputChange('1031x_closing_date', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_closing_date', 'focus', 3, sessionId);
            }}
            min={today}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_closing_date'] ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={formState.errors['1031x_closing_date'] ? 'closing-date-error' : undefined}
            aria-invalid={!!formState.errors['1031x_closing_date']}
          />
          <FieldError 
            error={formState.errors['1031x_closing_date']} 
            fieldId="closing-date"
          />
          <p className="mt-1 text-sm text-gray-500">
            Your 45-day identification period will start on this date
          </p>
        </div>
      )}
      
      {showListingDate && (
        <div>
          <label 
            htmlFor="listing-date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Expected Listing Date <span className="text-red-500">*</span>
          </label>
          <input
            id="listing-date"
            type="date"
            value={formState.data['1031x_expected_listing_date'] || ''}
            onChange={(e) => handleInputChange('1031x_expected_listing_date', e.target.value)}
            onFocus={() => {
              const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
              analytics.trackFieldInteraction('1031x_expected_listing_date', 'focus', 3, sessionId);
            }}
            min={today}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
              ${formState.errors['1031x_expected_listing_date'] ? 'border-red-500' : 'border-gray-300'}
            `}
            aria-describedby={formState.errors['1031x_expected_listing_date'] ? 'listing-date-error' : undefined}
            aria-invalid={!!formState.errors['1031x_expected_listing_date']}
          />
          <FieldError 
            error={formState.errors['1031x_expected_listing_date']} 
            fieldId="listing-date"
          />
        </div>
      )}
      
      {/* Urgency Level */}
      <div>
        <label 
          htmlFor="urgency-level"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How soon do you need to complete your exchange? <span className="text-red-500">*</span>
        </label>
        <select
          id="urgency-level"
          value={formState.data['1031x_urgency_level'] || ''}
          onChange={(e) => handleInputChange('1031x_urgency_level', e.target.value)}
          onFocus={() => {
            const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
            analytics.trackFieldInteraction('1031x_urgency_level', 'focus', 3, sessionId);
          }}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${formState.errors['1031x_urgency_level'] ? 'border-red-500' : 'border-gray-300'}
          `}
          aria-describedby={formState.errors['1031x_urgency_level'] ? 'urgency-level-error' : undefined}
          aria-invalid={!!formState.errors['1031x_urgency_level']}
        >
          <option value="">Select timeframe...</option>
          {urgencyLevels.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
        <FieldError 
          error={formState.errors['1031x_urgency_level']} 
          fieldId="urgency-level"
        />
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