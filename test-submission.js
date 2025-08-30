#!/usr/bin/env node

// Test script to verify order form submissions are working
const testFormSubmission = async () => {
  console.log('Testing order form submission...');
  
  const testData = {
    formData: {
      '1031x_order_first_name': 'Test',
      '1031x_order_last_name': 'User',
      '1031x_order_email': 'test@example.com',
      '1031x_order_phone': '555-123-4567',
      '1031x_order_preferred_contact': 'phone',
      '1031x_order_property_address': '123 Test Street',
      '1031x_order_property_city': 'Test City',
      '1031x_order_property_state': 'CA',
      '1031x_order_property_zip': '90210',
      '1031x_order_property_type': 'single_family_rental',
      '1031x_order_sale_price': 500000,
      '1031x_order_mortgage_balance': 300000,
      '1031x_order_contract_status': 'not_listed',
      '1031x_order_closing_date': '2025-12-31',
      '1031x_order_expected_listing_date': '2025-10-15',
      '1031x_order_replacement_identified': 'no_searching',
      '1031x_order_exchange_type': 'standard_delayed',
      '1031x_order_cash_out_needed': 'no_cash',
      '1031x_order_dst_interest': 'learn_both',
      '1031x_order_has_cpa': 'yes',
      '1031x_order_cpa_name': 'Test CPA',
      '1031x_order_cpa_email': 'cpa@test.com',
      '1031x_order_urgency_level': 'getting_ready_1_3',
      // Service Preferences (Step 6) - Required fields that were missing
      '1031x_order_contract_preference': 'electronic',
      '1031x_order_consultation_preference': 'phone',
      '1031x_order_how_heard': 'google',
      '1031x_order_additional_notes': 'This is a test submission'
    },
    metadata: {
      sessionId: 'test-session-' + Date.now(),
      ipAddress: '127.0.0.1',
      userAgent: 'Test Script 1.0'
    }
  };
  
  try {
    const response = await fetch('https://the1031center.com/api/order-form-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Form submission successful!');
      console.log('Submission ID:', result.submissionId);
      console.log('Response:', result);
    } else {
      console.log('❌ Form submission failed!');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Run the test
testFormSubmission();