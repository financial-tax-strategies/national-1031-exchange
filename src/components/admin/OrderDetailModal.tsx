import React from 'react';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const formatFieldName = (field: string) => {
    return field
      .replace('1031x_order_', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Format booleans
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    // Format dates
    if (key.includes('date') || key.includes('_at')) {
      return new Date(value).toLocaleString();
    }
    
    // Format currency
    if (key.includes('price') || key.includes('balance') || key.includes('amount')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // Format urgency level
    if (key === '1031x_order_urgency_level') {
      const urgencyMap: Record<string, string> = {
        'urgent_2_weeks': '🚨 Urgent - Closing in 2 weeks',
        'time_sensitive_1': '⚡ Time Sensitive - 1 month',
        'getting_ready_1_3': '📅 Getting Ready - 1-3 months',
        'planning_3_plus': '📊 Planning - 3+ months'
      };
      return urgencyMap[value] || value;
    }
    
    // Format property type
    if (key === '1031x_order_property_type') {
      const typeMap: Record<string, string> = {
        'single_family_rental': 'Single Family Rental',
        'multi_family_2_4': 'Multi-Family (2-4 units)',
        'apartment_5_plus': 'Apartment Building (5+ units)',
        'office': 'Office Building',
        'retail': 'Retail Property',
        'industrial': 'Industrial Property',
        'land': 'Land',
        'mixed_use': 'Mixed Use',
        'other': 'Other'
      };
      return typeMap[value] || value;
    }
    
    // Format contract status
    if (key === '1031x_order_contract_status') {
      const statusMap: Record<string, string> = {
        'not_listed': 'Not Listed Yet',
        'listed_no_offers': 'Listed - No Offers',
        'accepted_offer': 'Accepted Offer',
        'in_escrow': 'In Escrow',
        'closing_scheduled': 'Closing Scheduled'
      };
      return statusMap[value] || value;
    }
    
    return String(value);
  };

  // Group fields by category
  const fieldCategories = {
    'Contact Information': [
      '1031x_order_first_name',
      '1031x_order_last_name',
      '1031x_order_email',
      '1031x_order_phone',
      '1031x_order_preferred_contact'
    ],
    'Property Details': [
      '1031x_order_property_address',
      '1031x_order_property_city',
      '1031x_order_property_state',
      '1031x_order_property_zip',
      '1031x_order_property_type',
      '1031x_order_sale_price',
      '1031x_order_mortgage_balance'
    ],
    'Timeline & Status': [
      '1031x_order_urgency_level',
      '1031x_order_contract_status',
      '1031x_order_closing_date',
      '1031x_order_expected_listing_date'
    ],
    'Exchange Goals': [
      '1031x_order_replacement_identified',
      '1031x_order_exchange_type',
      '1031x_order_cash_out_needed',
      '1031x_order_dst_interest'
    ],
    'Professional Team': [
      '1031x_order_has_cpa',
      '1031x_order_cpa_name',
      '1031x_order_cpa_email',
      '1031x_order_realtor_name',
      '1031x_order_realtor_email'
    ],
    'Service Preferences': [
      '1031x_order_qi_services',
      '1031x_order_replacement_help',
      '1031x_order_financing_assistance',
      '1031x_order_dst_investment',
      '1031x_order_additional_notes'
    ],
    'System Information': [
      'id',
      'status',
      'lead_score',
      'created_at',
      'updated_at',
      'highlevel_contact_id',
      'admin_notification_sent',
      'user_confirmation_sent',
      'webhook_sent',
      'error_message'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Order Form Submission Details</h2>
            <p className="text-blue-100 mt-1">
              ID: {order.id.slice(-8).toUpperCase()} | 
              Submitted: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              order.status === 'synced' ? 'bg-green-100 text-green-800' :
              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.status}
            </span>
            {order.lead_score !== undefined && (
              <>
                <span className="text-sm text-gray-600">Lead Score:</span>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  order.lead_score >= 80 ? 'bg-green-100 text-green-800' :
                  order.lead_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  order.lead_score >= 40 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.lead_score}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm">
            {order.admin_notification_sent && (
              <span className="text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Admin Notified
              </span>
            )}
            {order.highlevel_contact_id && (
              <span className="text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                HighLevel Synced
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {Object.entries(fieldCategories).map(([category, fields]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => {
                  // Check both top-level and form_data for the field
                  const value = order[field] || (order.form_data && order.form_data[field]);
                  if (value === undefined || value === null || value === '') return null;
                  
                  return (
                    <div key={field} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        {formatFieldName(field)}
                      </span>
                      <span className="text-sm text-gray-900 mt-1">
                        {formatValue(field, value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Error Message if present */}
          {order.error_message && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error Details</h3>
              <p className="text-sm text-red-700">{order.error_message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="flex space-x-3">
            {order.highlevel_contact_id && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                View in HighLevel
              </button>
            )}
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
              Resend Notifications
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};