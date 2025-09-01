// ============================================
// Review Step Component (Step 8)
// National 1031 Center - Order Form
// ============================================

import React, { useEffect } from 'react';
import { useOrderForm } from '../OrderFormContext';
import { useOrderFormAnalytics } from '../../../lib/analytics/orderFormAnalytics';
import { CheckboxInput } from '../../ui/CheckboxInput';

// ============================================
// Component
// ============================================

export const ReviewStep: React.FC = () => {
  const { formState, updateField } = useOrderForm();
  const analytics = useOrderFormAnalytics();
  
  // Track step start (Step 8)
  useEffect(() => {
    const sessionId = sessionStorage.getItem('1031_order_form_session') || '';
    analytics.trackStepStart(8, sessionId);
  }, [analytics]);
  
  // Format currency values
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return 'Not provided';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format phone numbers
  const formatPhone = (phone: string | undefined): string => {
    if (!phone) return 'Not provided';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };
  
  // Check if second property exists
  const hasSecondProperty = formState.data.hasSecondProperty;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600">
          Please review your information before submitting
        </p>
      </div>
      
      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <p className="font-medium">{formState.data['1031x_order_name'] || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <p className="font-medium">{formState.data['1031x_order_email'] || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <p className="font-medium">{formatPhone(formState.data['1031x_order_phone'])}</p>
          </div>
          <div>
            <span className="text-gray-600">Best Time to Contact:</span>
            <p className="font-medium">
              {formState.data['1031_order_best_contact_time'] === 'morning' && 'Morning (8am-12pm)'}
              {formState.data['1031_order_best_contact_time'] === 'afternoon' && 'Afternoon (12pm-5pm)'}
              {formState.data['1031_order_best_contact_time'] === 'evening' && 'Evening (5pm-8pm)'}
              {formState.data['1031_order_best_contact_time'] === 'anytime' && 'Anytime during business hours'}
              {!formState.data['1031_order_best_contact_time'] && 'Not specified'}
            </p>
          </div>
          {formState.data['1031_order_spouse_name'] && (
            <>
              <div>
                <span className="text-gray-600">Spouse Name:</span>
                <p className="font-medium">{formState.data['1031_order_spouse_name']}</p>
              </div>
              <div>
                <span className="text-gray-600">Spouse Email:</span>
                <p className="font-medium">{formState.data['1031_order_spouse_email'] || 'Not provided'}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Entity Information */}
      {formState.data['1031_order_entity_type'] && formState.data['1031_order_entity_type'] !== 'individual' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Entity Type:</span>
              <p className="font-medium">{formState.data['1031_order_entity_type']}</p>
            </div>
            <div>
              <span className="text-gray-600">Entity Name:</span>
              <p className="font-medium">{formState.data['1031_order_entity_name'] || 'Not provided'}</p>
            </div>
            {formState.data['1031_order_entity_ein'] && (
              <div>
                <span className="text-gray-600">EIN:</span>
                <p className="font-medium">{formState.data['1031_order_entity_ein']}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Property Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Being Sold</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Address:</span>
            <p className="font-medium">
              {formState.data['1031x_order_property_address'] || 'Not provided'}<br />
              {formState.data['1031x_order_property_city']}, {formState.data['1031x_order_property_state']} {formState.data['1031x_order_property_zip']}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Property Type:</span>
            <p className="font-medium">
              {formState.data['1031x_order_property_type']?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Not provided'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Expected Sale Price:</span>
            <p className="font-medium">{formatCurrency(formState.data['1031x_order_sale_price'])}</p>
          </div>
          <div>
            <span className="text-gray-600">Mortgage Balance:</span>
            <p className="font-medium">{formatCurrency(formState.data['1031x_order_mortgage_balance'])}</p>
          </div>
        </div>
      </div>
      
      {/* Second Property Information */}
      {hasSecondProperty && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Second Property Being Sold</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Address:</span>
              <p className="font-medium">
                {formState.data['1031_order_property_address_2'] || 'Not provided'}<br />
                {formState.data['1031_order_property_city_2']}, {formState.data['1031_order_property_state_2']} {formState.data['1031_order_property_zip_2']}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Property Type:</span>
              <p className="font-medium">
                {formState.data['1031_order_property_type_2']?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Expected Sale Price:</span>
              <p className="font-medium">{formatCurrency(formState.data['1031_order_sale_price_2'])}</p>
            </div>
            <div>
              <span className="text-gray-600">Mortgage Balance:</span>
              <p className="font-medium">{formatCurrency(formState.data['1031_order_mortgage_balance_2'])}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Contract Status:</span>
            <p className="font-medium">
              {formState.data['1031x_order_contract_status']?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Not provided'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Urgency Level:</span>
            <p className="font-medium">
              {formState.data['1031x_order_urgency_level'] === 'planning_3_plus' && 'Planning ahead (3+ months)'}
              {formState.data['1031x_order_urgency_level'] === 'getting_ready_1_3' && 'Getting ready (1-3 months)'}
              {formState.data['1031x_order_urgency_level'] === 'time_sensitive_1' && 'Time sensitive (< 1 month)'}
              {formState.data['1031x_order_urgency_level'] === 'urgent_2_weeks' && 'Urgent (< 2 weeks)'}
              {!formState.data['1031x_order_urgency_level'] && 'Not specified'}
            </p>
          </div>
          {formState.data['1031x_order_closing_date'] && (
            <div>
              <span className="text-gray-600">Closing Date:</span>
              <p className="font-medium">{formState.data['1031x_order_closing_date']}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Professional Team */}
      {(formState.data['1031x_order_has_cpa'] || formState.data['1031x_order_realtor_name']) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Team</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {formState.data['1031x_order_has_cpa'] === 'yes' && (
              <>
                <div>
                  <span className="text-gray-600">CPA Name:</span>
                  <p className="font-medium">{formState.data['1031x_order_cpa_name'] || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">CPA Email:</span>
                  <p className="font-medium">{formState.data['1031x_order_cpa_email'] || 'Not provided'}</p>
                </div>
              </>
            )}
            {formState.data['1031x_order_realtor_name'] && (
              <>
                <div>
                  <span className="text-gray-600">Realtor Name:</span>
                  <p className="font-medium">{formState.data['1031x_order_realtor_name']}</p>
                </div>
                <div>
                  <span className="text-gray-600">Realtor Email:</span>
                  <p className="font-medium">{formState.data['1031x_order_realtor_email'] || 'Not provided'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Service Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Preferences</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Contract Preference:</span>
            <p className="font-medium">
              {formState.data['1031x_order_contract_preference'] === 'electronic' && 'Electronic contracts (recommended)'}
              {formState.data['1031x_order_contract_preference'] === 'mail' && 'Traditional mail'}
              {formState.data['1031x_order_contract_preference'] === 'in_person' && 'Sign in person'}
              {!formState.data['1031x_order_contract_preference'] && 'Not specified'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Consultation Preference:</span>
            <p className="font-medium">
              {formState.data['1031x_order_consultation_preference'] === 'phone' && 'Phone consultation'}
              {formState.data['1031x_order_consultation_preference'] === 'video' && 'Video call (Zoom)'}
              {formState.data['1031x_order_consultation_preference'] === 'in_person' && 'In-person meeting'}
              {formState.data['1031x_order_consultation_preference'] === 'email_only' && 'Email only'}
              {!formState.data['1031x_order_consultation_preference'] && 'Not specified'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Consent and Agreement */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Consent and Agreement</h3>
        
        <div className="space-y-4">
          <CheckboxInput
            label="I certify that all information provided is accurate and complete"
            name="consent_accuracy"
            checked={formState.data['consent_accuracy'] || false}
            onChange={(checked) => updateField('consent_accuracy', checked)}
            error={formState.errors['consent_accuracy']}
          />
          
          <CheckboxInput
            label="I authorize National 1031 Center to contact me regarding my exchange"
            name="consent_contact"
            checked={formState.data['consent_contact'] || false}
            onChange={(checked) => updateField('consent_contact', checked)}
            error={formState.errors['consent_contact']}
          />
          
          <CheckboxInput
            label="I agree to the Terms of Service and Privacy Policy"
            name="consent_terms"
            checked={formState.data['consent_terms'] || false}
            onChange={(checked) => updateField('consent_terms', checked)}
            error={formState.errors['consent_terms']}
          />
        </div>
      </div>
      
      {/* Summary Box */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          Ready to Submit
        </h3>
        <p className="text-sm text-green-800 mb-4">
          Once you submit this application:
        </p>
        <ol className="text-sm text-green-800 space-y-2">
          <li className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>You'll receive an immediate confirmation email</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>A 1031 specialist will review your information</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>We'll contact you within 24 hours (or immediately if urgent)</span>
          </li>
        </ol>
      </div>
      
      {/* Terms Links */}
      <div className="text-sm text-gray-600 text-center">
        View our{' '}
        <a href="/terms" className="text-blue-900 hover:underline" target="_blank">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-900 hover:underline" target="_blank">Privacy Policy</a>
      </div>
    </div>
  );
};