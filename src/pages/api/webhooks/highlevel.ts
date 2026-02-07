import type { APIRoute } from 'astro';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';

// ============================================
// Types
// ============================================

interface HighLevelWebhookPayload {
  id: string;
  type?: string;
  locationId?: string;
  contactId?: string;
  calendarId?: string;
  appointmentId?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  selectedTimezone?: string;
  selectedSlot?: string;
  status?: string;
  appointmentStatus?: string;
  meetingLocation?: string;
  meetingLocationType?: string;
  notes?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  contact?: {
    id?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
  assignedUser?: {
    id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Main Handler
// ============================================

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const rawBody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Validate webhook signature if configured (must use raw body before parsing)
    const webhookSecret = import.meta.env.HIGHLEVEL_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = headers['x-highlevel-signature'] || headers['x-webhook-signature'];
      if (!signature || !await verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('Invalid or missing webhook signature');
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const payload: HighLevelWebhookPayload = JSON.parse(rawBody);
    const webhookType = headers['x-ghl-event'] || payload.type || 'unknown';

    console.log('Received HighLevel webhook:', webhookType, payload);

    // Store webhook for processing
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .insert({
        webhook_type: webhookType,
        payload: payload,
        headers: headers,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Error storing webhook:', webhookError);
      throw webhookError;
    }

    // Process based on webhook type
    try {
      switch (webhookType) {
        case 'ContactCreate':
        case 'ContactUpdate':
        case 'contact.create':
        case 'contact.update':
          await processContactWebhook(supabase, webhook.id, payload);
          break;

        case 'AppointmentCreate':
        case 'AppointmentUpdate':
        case 'appointment.create':
        case 'appointment.update':
        case 'appointment.status_changed':
          await processAppointmentWebhook(supabase, webhook.id, payload);
          break;

        default:
          console.log(`Unhandled webhook type: ${webhookType}`);
      }

      // Mark webhook as processed
      await supabase
        .from('webhooks')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq('id', webhook.id);

    } catch (processingError: unknown) {
      const message = processingError instanceof Error ? processingError.message : String(processingError);
      await supabase
        .from('webhooks')
        .update({
          processing_error: message,
        })
        .eq('id', webhook.id);

      console.error('Webhook processing error:', processingError);
    }

    // Always return 200 to acknowledge receipt
    return new Response(JSON.stringify({ success: true, webhookId: webhook.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook handler error:', error);

    // Still return 200 to prevent retries
    return new Response(JSON.stringify({
      error: 'Internal error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// ============================================
// Contact Processing (from serverless function)
// ============================================

async function processContactWebhook(supabase: SupabaseClient, webhookId: string, payload: HighLevelWebhookPayload) {
  const contactId = payload.id || payload.contactId;
  const email = payload.email || payload.contact?.email;

  if (!email) {
    console.log('No email in contact webhook payload');
    return;
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .single();

  if (lead) {
    await supabase
      .from('leads')
      .update({
        highlevel_contact_id: contactId,
        phone: payload.phone || payload.contact?.phone || lead.phone,
        first_name: payload.firstName || payload.contact?.firstName || lead.first_name,
        last_name: payload.lastName || payload.contact?.lastName || lead.last_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    await supabase
      .from('webhooks')
      .update({ lead_id: lead.id })
      .eq('id', webhookId);

    console.log(`Updated lead ${lead.id} with HighLevel contact ${contactId}`);
  } else {
    console.log(`No lead found for email ${email}`);
  }
}

// ============================================
// Appointment Processing (from edge function)
// ============================================

async function processAppointmentWebhook(supabase: SupabaseClient, webhookId: string, payload: HighLevelWebhookPayload) {
  const appointmentId = payload.id || payload.appointmentId;

  if (!appointmentId) {
    console.log('No appointment ID in webhook payload');
    return;
  }

  // Find appointment by HighLevel ID
  const { data: appointment, error: findError } = await supabase
    .from('appointments')
    .select('id, status, lead_id')
    .eq('highlevel_appointment_id', appointmentId)
    .single();

  if (findError || !appointment) {
    console.log(`No appointment found for HighLevel ID ${appointmentId}`);

    // Also try the webhook_logs table if it exists
    await supabase
      .from('webhook_logs')
      .insert({
        appointment_id: null,
        webhook_type: payload.type,
        payload: payload,
        headers: {},
        processed: true,
        processing_error: 'Appointment not found',
        processed_at: new Date().toISOString(),
      })
      .select('id')
      .single()
      .catch(() => {});

    return;
  }

  // Update webhook with appointment's lead ID
  if (appointment.lead_id) {
    await supabase
      .from('webhooks')
      .update({ lead_id: appointment.lead_id })
      .eq('id', webhookId);
  }

  // Build update object
  const dbUpdate: Record<string, any> = {
    webhook_payload: payload,
    webhook_received_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Map status
  if (payload.appointmentStatus || payload.status) {
    const status = (payload.appointmentStatus || payload.status || '').toLowerCase();
    const statusMap: Record<string, string> = {
      'showed': 'completed',
      'noshow': 'no_show',
      'no show': 'no_show',
      'cancelled': 'cancelled',
      'canceled': 'cancelled',
      'confirmed': 'confirmed',
      'scheduled': 'scheduled',
      'failed': 'failed',
      'error': 'failed',
    };
    dbUpdate.status = statusMap[status] || status;
  }

  // Assignment details
  if (payload.assignedUserId || payload.assignedUser?.id) {
    dbUpdate.assigned_specialist_id = payload.assignedUserId || payload.assignedUser?.id;
    dbUpdate.assigned_specialist_name = payload.assignedUserName || payload.assignedUser?.name || 'Assigned Specialist';
  }

  // Meeting location
  if (payload.meetingLocation) {
    dbUpdate.meeting_location = payload.meetingLocation;
  }

  const { error: updateError } = await supabase
    .from('appointments')
    .update(dbUpdate)
    .eq('id', appointment.id);

  if (updateError) {
    console.error('Error updating appointment:', updateError);
    throw updateError;
  }

  console.log(`Updated appointment ${appointment.id} with HighLevel webhook data`);
}

// ============================================
// Signature Verification
// ============================================

async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const data = encoder.encode(rawBody);
    const expectedSignature = await crypto.subtle.sign('HMAC', key, data);

    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const receivedHex = signature.replace(/^sha256=/, '');

    if (expectedHex.length !== receivedHex.length) return false;
    return timingSafeEqual(Buffer.from(expectedHex), Buffer.from(receivedHex));
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
