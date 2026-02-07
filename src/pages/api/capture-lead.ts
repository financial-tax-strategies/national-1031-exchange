import type { APIRoute } from 'astro';
import { z } from 'zod';

const LeadDataSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string().optional(),
  calculationResult: z.object({
    taxSavings: z.number(),
    capitalGain: z.number(),
    federalTax: z.number(),
    stateTax: z.number(),
  }),
  propertyDetails: z.object({
    salePrice: z.number(),
    purchasePrice: z.number(),
    state: z.string(),
  }),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const parsed = LeadDataSchema.safeParse(await request.json());

    if (!parsed.success) {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        details: parsed.error.flatten(),
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const leadData = parsed.data;

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

    // TODO: Integrate with HighLevel V2 API to create contact
    console.log('Lead captured:', highLevelContact);

    return new Response(JSON.stringify({
      success: true,
      message: 'Lead captured successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error capturing lead:', error);

    return new Response(JSON.stringify({
      error: 'Failed to capture lead',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
