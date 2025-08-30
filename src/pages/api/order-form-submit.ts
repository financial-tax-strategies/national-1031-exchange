import type { APIRoute } from 'astro';
import { OrderFormService } from '../../lib/services/orderForm.service';
import type { OrderFormData } from '../../lib/types/orderForm';

// API endpoint for order form submissions
export const POST: APIRoute = async ({ request }) => {
  console.log('[API] Order form submission received');
  
  try {
    // Parse the request body
    const body = await request.json();
    const { formData, metadata } = body;
    
    console.log('[API] Form data keys:', Object.keys(formData || {}));
    console.log('[API] Metadata:', metadata);
    
    if (!formData) {
      console.error('[API] No form data provided');
      return new Response(JSON.stringify({ 
        error: 'Form data is required' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Get client IP address (if behind proxy, check x-forwarded-for)
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      request.headers.get('cf-connecting-ip') || // Cloudflare
                      request.headers.get('x-real-ip') || // Nginx
                      'unknown';
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || undefined;
    
    // Initialize the order form service
    const orderFormService = new OrderFormService();
    
    // Submit the order form with enhanced metadata
    const submissionId = await orderFormService.submitOrderForm(
      formData as OrderFormData,
      {
        ...metadata,
        ipAddress,
        userAgent
      }
    );
    
    // Return success response
    return new Response(JSON.stringify({ 
      success: true,
      submissionId,
      message: 'Order form submitted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Order form submission error:', error);
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: 'Failed to submit order form',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Allow preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};