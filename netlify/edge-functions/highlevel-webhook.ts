// ============================================
// HighLevel Webhook Handler - Netlify Edge Function
// National 1031 Center - Appointment Assignment Handler
// ============================================

import type { Config, Context } from '@netlify/edge-functions';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================
// Types
// ============================================

interface HighLevelWebhookPayload {
  id: string;
  type: 'AppointmentCreate' | 'AppointmentUpdate' | 'AppointmentDelete';
  locationId: string;
  contactId: string;
  calendarId: string;
  appointmentId: string;
  assignedUserId?: string;
  assignedUserName?: string;
  selectedTimezone: string;
  selectedSlot: string;
  status: string;
  appointmentStatus: string;
  meetingLocation?: string;
  meetingLocationType?: 'zoom' | 'meet' | 'phone' | 'custom';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentUpdate {
  status: 'confirmed' | 'failed' | 'cancelled';
  assignedSpecialistId?: string;
  assignedSpecialistName?: string;
  meetingLocation?: string;
  webhookPayload: Record<string, any>;
  webhookReceivedAt: Date;
}

// ============================================
// Webhook Handler
// ============================================

export default async function handler(request: Request, context: Context) {
  console.log('HighLevel webhook received:', request.method, request.url);

  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Allow': 'POST',
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response('Server configuration error', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook payload
    const payload: HighLevelWebhookPayload = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    // Validate webhook signature (if configured)
    const webhookSecret = Deno.env.get('HIGHLEVEL_WEBHOOK_SECRET');
    if (webhookSecret) {
      const signature = headers['x-highlevel-signature'] || headers['x-webhook-signature'];
      if (!signature || !await verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error('Invalid webhook signature');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // Log webhook receipt
    const { data: webhookLog, error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        appointment_id: null, // Will be updated after finding appointment
        webhook_type: payload.type,
        payload: payload as any,
        headers: headers as any,
        processed: false
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    // Process appointment webhooks
    if (payload.type === 'AppointmentUpdate' || payload.type === 'AppointmentCreate') {
      await processAppointmentWebhook(supabase, payload, webhookLog?.id);
    }

    return new Response('Webhook processed successfully', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook processing failed', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

// ============================================
// Processing Functions
// ============================================

async function processAppointmentWebhook(
  supabase: any,
  payload: HighLevelWebhookPayload,
  webhookLogId?: string
) {
  try {
    console.log('Processing appointment webhook:', payload.appointmentId);

    // Find our appointment record by HighLevel appointment ID
    const { data: appointment, error: findError } = await supabase
      .from('appointments')
      .select('id, status')
      .eq('highlevel_appointment_id', payload.appointmentId)
      .single();

    if (findError || !appointment) {
      console.error('Appointment not found:', payload.appointmentId, findError);
      
      // Mark webhook as processed with error
      if (webhookLogId) {
        await supabase
          .from('webhook_logs')
          .update({
            processed: true,
            processing_error: 'Appointment not found',
            processed_at: new Date().toISOString()
          })
          .eq('id', webhookLogId);
      }
      return;
    }

    // Update webhook log with appointment ID
    if (webhookLogId) {
      await supabase
        .from('webhook_logs')
        .update({ appointment_id: appointment.id })
        .eq('id', webhookLogId);
    }

    // Determine new status and update data
    const update: AppointmentUpdate = {
      status: determineAppointmentStatus(payload),
      webhookPayload: payload as any,
      webhookReceivedAt: new Date()
    };

    // Add assignment details if available
    if (payload.assignedUserId) {
      update.assignedSpecialistId = payload.assignedUserId;
      update.assignedSpecialistName = payload.assignedUserName || 'Assigned Specialist';
    }

    // Add meeting location if available
    if (payload.meetingLocation) {
      update.meetingLocation = payload.meetingLocation;
    }

    // Convert to database field names
    const dbUpdate: any = {
      status: update.status,
      webhook_payload: update.webhookPayload,
      webhook_received_at: update.webhookReceivedAt.toISOString(),
      updated_at: new Date().toISOString()
    };

    if (update.assignedSpecialistId) {
      dbUpdate.assigned_specialist_id = update.assignedSpecialistId;
    }
    if (update.assignedSpecialistName) {
      dbUpdate.assigned_specialist_name = update.assignedSpecialistName;
    }
    if (update.meetingLocation) {
      dbUpdate.meeting_location = update.meetingLocation;
    }

    // Update appointment
    const { error: updateError } = await supabase
      .from('appointments')
      .update(dbUpdate)
      .eq('id', appointment.id);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
      throw updateError;
    }

    console.log('Appointment updated successfully:', appointment.id, update.status);

    // Mark webhook as processed
    if (webhookLogId) {
      await supabase
        .from('webhook_logs')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhookLogId);
    }

  } catch (error) {
    console.error('Error processing appointment webhook:', error);
    
    // Mark webhook as processed with error
    if (webhookLogId) {
      await supabase
        .from('webhook_logs')
        .update({
          processed: true,
          processing_error: error.message,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhookLogId);
    }
    
    throw error;
  }
}

// ============================================
// Utility Functions
// ============================================

function determineAppointmentStatus(payload: HighLevelWebhookPayload): 'confirmed' | 'failed' | 'cancelled' {
  // HighLevel appointment statuses can vary, map them to our statuses
  const status = payload.appointmentStatus?.toLowerCase() || payload.status?.toLowerCase();
  
  if (status === 'confirmed' && payload.assignedUserId) {
    return 'confirmed';
  } else if (status === 'cancelled' || status === 'canceled') {
    return 'cancelled';
  } else if (status === 'failed' || status === 'error') {
    return 'failed';
  } else if (payload.assignedUserId) {
    // If we have an assigned user, consider it confirmed
    return 'confirmed';
  } else {
    // Default to failed if we can't determine status
    return 'failed';
  }
}

async function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // HighLevel uses HMAC-SHA256 signatures
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const data = encoder.encode(JSON.stringify(payload));
    const expectedSignature = await crypto.subtle.sign('HMAC', key, data);
    
    // Convert to hex string
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Compare signatures (remove any prefix like 'sha256=')
    const receivedHex = signature.replace(/^sha256=/, '');
    
    return expectedHex === receivedHex;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// ============================================
// Configuration
// ============================================

export const config: Config = {
  path: '/api/webhooks/highlevel'
};