import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface LeadData {
  email: string;
  phone?: string;
  name?: string;
  calculationResult: {
    taxSavings: number;
    capitalGain: number;
    federalTax: number;
    stateTax: number;
  };
  propertyDetails: {
    salePrice: number;
    purchasePrice: number;
    state: string;
  };
}

// This is a placeholder for HighLevel API integration
// Replace with your actual HighLevel API credentials and endpoint
const HIGHLEVEL_API_KEY = process.env.HIGHLEVEL_API_KEY;
const HIGHLEVEL_LOCATION_ID = process.env.HIGHLEVEL_LOCATION_ID;
const HIGHLEVEL_API_URL = 'https://api.gohighlevel.com/v1';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const leadData: LeadData = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!leadData.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Format the lead data for HighLevel
    const highLevelContact = {
      email: leadData.email,
      phone: leadData.phone || '',
      name: leadData.name || leadData.email.split('@')[0],
      source: '1031 Tax Calculator',
      tags: ['calculator-lead', '1031-interested'],
      customFields: {
        calculatedTaxSavings: leadData.calculationResult.taxSavings,
        propertyState: leadData.propertyDetails.state,
        salePrice: leadData.propertyDetails.salePrice,
        purchasePrice: leadData.propertyDetails.purchasePrice,
        capitalGain: leadData.calculationResult.capitalGain,
      },
      notes: `Lead from 1031 Tax Calculator
      
Calculated Tax Savings: $${leadData.calculationResult.taxSavings.toLocaleString()}
Capital Gain: $${leadData.calculationResult.capitalGain.toLocaleString()}
Federal Tax: $${leadData.calculationResult.federalTax.toLocaleString()}
State Tax: $${leadData.calculationResult.stateTax.toLocaleString()}

Property Details:
- Sale Price: $${leadData.propertyDetails.salePrice.toLocaleString()}
- Purchase Price: $${leadData.propertyDetails.purchasePrice.toLocaleString()}
- State: ${leadData.propertyDetails.state}
      `,
    };

    // TODO: Replace this with your actual HighLevel API integration
    // For now, we'll just log the data and return success
    console.log('Lead captured:', highLevelContact);
    
    // Example HighLevel API call (uncomment when ready):
    /*
    const response = await fetch(`${HIGHLEVEL_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: HIGHLEVEL_LOCATION_ID,
        ...highLevelContact,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create contact in HighLevel');
    }

    const result = await response.json();
    */

    // For now, return a mock success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Lead captured successfully',
        // contactId: result.contact.id, // From HighLevel response
      }),
    };
  } catch (error) {
    console.error('Error capturing lead:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to capture lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };