import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse webhook payload
    const payload = JSON.parse(event.body || '{}');
    const webhookType = event.headers['x-ghl-event'] || payload.type || 'unknown';
    
    console.log('Received HighLevel webhook:', webhookType, payload);
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    // Store webhook for processing
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .insert({
        webhook_type: webhookType,
        payload: payload,
        headers: event.headers,
        processed: false
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
          processed_at: new Date().toISOString()
        })
        .eq('id', webhook.id);
        
    } catch (processingError: any) {
      // Log processing error
      await supabase
        .from('webhooks')
        .update({ 
          processing_error: processingError.message
        })
        .eq('id', webhook.id);
      
      console.error('Webhook processing error:', processingError);
    }
    
    // Always return 200 to acknowledge receipt
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, webhookId: webhook.id })
    };
    
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    // Still return 200 to prevent retries
    return {
      statusCode: 200,
      body: JSON.stringify({ error: 'Internal error', message: error.message })
    };
  }
};

async function processContactWebhook(supabase: any, webhookId: string, payload: any) {
  const contactId = payload.id || payload.contactId;
  const email = payload.email || payload.contact?.email;
  
  if (!email) {
    console.log('No email in contact webhook payload');
    return;
  }
  
  // Find lead by email
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .single();
  
  if (lead) {
    // Update lead with HighLevel contact ID
    await supabase
      .from('leads')
      .update({ 
        highlevel_contact_id: contactId,
        phone: payload.phone || payload.contact?.phone || lead.phone,
        first_name: payload.firstName || payload.contact?.firstName || lead.first_name,
        last_name: payload.lastName || payload.contact?.lastName || lead.last_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id);
    
    // Update webhook with lead ID
    await supabase
      .from('webhooks')
      .update({ lead_id: lead.id })
      .eq('id', webhookId);
      
    console.log(`Updated lead ${lead.id} with HighLevel contact ${contactId}`);
  } else {
    console.log(`No lead found for email ${email}`);
  }
}

async function processAppointmentWebhook(supabase: any, webhookId: string, payload: any) {
  const appointmentId = payload.id || payload.appointmentId;
  const contactId = payload.contactId || payload.contact?.id;
  
  if (!appointmentId) {
    console.log('No appointment ID in webhook payload');
    return;
  }
  
  // Find appointment by HighLevel ID
  const { data: appointment } = await supabase
    .from('appointments')
    .select('*')
    .eq('highlevel_appointment_id', appointmentId)
    .single();
  
  if (appointment) {
    // Update appointment with webhook data
    const updates: any = {
      webhook_payload: payload,
      webhook_received_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Map HighLevel status to our status
    if (payload.appointmentStatus || payload.status) {
      const status = payload.appointmentStatus || payload.status;
      const statusMap: Record<string, string> = {
        'showed': 'completed',
        'noshow': 'no_show',
        'no show': 'no_show',
        'cancelled': 'cancelled',
        'canceled': 'cancelled',
        'confirmed': 'confirmed',
        'scheduled': 'scheduled'
      };
      
      updates.status = statusMap[status.toLowerCase()] || status;
    }
    
    // Update assigned specialist
    if (payload.assignedUserId || payload.assignedUser?.id) {
      updates.assigned_specialist_id = payload.assignedUserId || payload.assignedUser.id;
      updates.assigned_specialist_name = payload.assignedUser?.name || payload.assignedUserName;
    }
    
    // Update meeting location
    if (payload.meetingLocation || payload.location) {
      updates.meeting_location = payload.meetingLocation || payload.location;
    }
    
    await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointment.id);
    
    // Update webhook with lead ID
    await supabase
      .from('webhooks')
      .update({ lead_id: appointment.lead_id })
      .eq('id', webhookId);
      
    console.log(`Updated appointment ${appointment.id} with HighLevel data`);
  } else {
    console.log(`No appointment found for HighLevel ID ${appointmentId}`);
  }
}