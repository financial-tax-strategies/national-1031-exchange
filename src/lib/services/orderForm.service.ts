import { DatabaseService } from './database.service';
import { HighLevelService } from './highlevel.service';
import { EmailService } from './email.service';
import type { OrderFormData } from '../types/orderForm';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order Form Service - Comprehensive submission handler
 * Flow: Supabase → Email Notifications → HighLevel Sync → Webhooks
 */
export class OrderFormService {
  private db: DatabaseService;
  private highlevel: HighLevelService;
  private email: EmailService;
  
  constructor() {
    this.db = DatabaseService.getInstance();
    this.highlevel = new HighLevelService();
    this.email = new EmailService();
  }
  
  /**
   * Generate a unique ID for submissions
   */
  private generateUniqueId(): string {
    return uuidv4();
  }
  
  /**
   * Submit order form with complete processing flow
   */
  async submitOrderForm(data: OrderFormData, metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    formCompletionTime?: number;
  }): Promise<string> {
    console.log('[OrderFormService] Starting form submission');
    console.log('[OrderFormService] Database client status:', this.db ? 'initialized' : 'not initialized');
    
    try {
      // Step 1: Convert field names to use 1031x_order_ prefix
      const mappedData = this.mapFieldNames(data);
      console.log('[OrderFormService] Mapped data keys:', Object.keys(mappedData));
      
      // Step 2: Try to save to Supabase
      let submissionId: string;
      let useFallback = false;
      
      try {
        // Generate a unique ID for this submission
        const leadId = this.generateUniqueId();
        console.log('[OrderFormService] Generated lead ID:', leadId);
        
        // First, create a lead record (required due to foreign key constraint)
        const leadRecord = {
          id: leadId,
          first_name: mappedData['1031x_order_first_name'],
          last_name: mappedData['1031x_order_last_name'],
          email: mappedData['1031x_order_email'],
          phone: mappedData['1031x_order_phone'],
          lead_source: 'order_form',
          lead_status: 'new',
          lead_score: 0, // Calculate this properly in production
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        };
        
        const { data: lead, error: leadError } = await this.db.getTable('leads')
          .insert(leadRecord)
          .select()
          .single();
        
        if (leadError) {
          console.error('Failed to create lead:', leadError);
          throw new Error(`Failed to create lead: ${leadError.message}`);
        }
        
        // Now create the order form submission record
        const submissionRecord = {
          id: leadId,
          lead_id: leadId,
          step_completed: 6, // Assuming all steps completed if they're submitting
          completion_status: 'completed',
          urgency_level: mappedData['1031x_order_urgency_level'],
          exchange_type: mappedData['1031x_order_exchange_type'],
          property_sale_price: mappedData['1031x_order_sale_price'],
          form_data: {
            ...mappedData,
            ip_address: metadata?.ipAddress,
            user_agent: metadata?.userAgent,
            session_id: metadata?.sessionId,
            form_completion_time_seconds: metadata?.formCompletionTime
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        };
        
        const { data: submission, error: dbError } = await this.db.getTable('order_form_submissions')
          .insert(submissionRecord)
          .select()
          .single();
        
        if (dbError || !submission) {
          console.error('Database error details:', {
            error: dbError,
            code: dbError?.code,
            message: dbError?.message,
            details: dbError?.details,
            hint: dbError?.hint,
            formData: mappedData
          });
          
          // Check for specific database errors
          if (dbError?.code === '42P01') {
            console.error('Table not found - using fallback submission method');
            useFallback = true;
          } else if (dbError?.code === '23505') {
            throw new Error('This submission appears to be a duplicate. Please refresh and try again.');
          } else if (dbError?.message?.includes('violates check constraint')) {
            throw new Error('Invalid form data. Please check all fields and try again.');
          } else if (dbError?.message?.includes('permission denied')) {
            console.error('Permission denied - using fallback submission method');
            useFallback = true;
          } else {
            throw new Error(`Failed to save form submission: ${dbError?.message || 'Unknown database error'}`);
          }
        } else {
          submissionId = submission.id;
        }
      } catch (dbError) {
        // If database is completely unavailable, use fallback
        console.error('Database unavailable, using fallback:', dbError);
        useFallback = true;
      }
      
      // Fallback: Generate ID and send directly to email/webhook
      if (useFallback) {
        submissionId = uuidv4(); // Use UUID for fallback as well
        console.warn('Using fallback submission method with ID:', submissionId);
        
        // Send admin notification immediately
        try {
          await this.sendAdminNotification(submissionId, mappedData);
          await this.sendUserConfirmation(submissionId, mappedData);
          
          // Try to sync to HighLevel
          if (this.highlevel) {
            try {
              await this.syncToHighLevel(submissionId, mappedData, data);
            } catch (hlError) {
              console.error('HighLevel sync failed:', hlError);
            }
          }
        } catch (emailError) {
          console.error('Failed to send fallback notifications:', emailError);
          // Still return success to user since we have their data
        }
        
        return submissionId;
      }
      
      // Step 3: Process asynchronously (don't block user)
      this.processSubmissionAsync(submissionId!, mappedData, data)
        .catch(err => console.error('Async processing error:', err));
      
      return submissionId!;
    } catch (error) {
      console.error('Order form submission error:', error);
      throw error;
    }
  }
  
  /**
   * Map field names - no need to change since they already have 1031x_order_ prefix
   */
  private mapFieldNames(data: OrderFormData): Record<string, any> {
    // Since we've updated the types to already use 1031x_order_ prefix,
    // we can just return the data as-is
    return data as Record<string, any>;
  }
  
  /**
   * Process submission asynchronously
   */
  private async processSubmissionAsync(
    submissionId: string, 
    mappedData: Record<string, any>,
    originalData: OrderFormData
  ): Promise<void> {
    try {
      // Update status to processing
      await this.db.getTable('order_form_submissions')
        .update({ status: 'processing' })
        .eq('id', submissionId);
      
      // Step 1: Send admin notification email
      await this.sendAdminNotification(submissionId, mappedData);
      
      // Step 2: Send user confirmation email
      await this.sendUserConfirmation(submissionId, mappedData);
      
      // Step 3: Sync to HighLevel with all custom fields
      const highlevelContactId = await this.syncToHighLevel(submissionId, mappedData, originalData);
      
      // Step 4: Trigger webhooks
      await this.triggerWebhooks(submissionId, mappedData);
      
      // Update status to synced
      await this.db.getTable('order_form_submissions')
        .update({ 
          status: 'synced',
          highlevel_contact_id: highlevelContactId
        })
        .eq('id', submissionId);
      
    } catch (error: any) {
      console.error('Async processing error:', error);
      
      // Update status to error
      await this.db.getTable('order_form_submissions')
        .update({ 
          status: 'error',
          error_message: error.message
        })
        .eq('id', submissionId);
    }
  }
  
  /**
   * Send admin notification email
   */
  private async sendAdminNotification(submissionId: string, data: Record<string, any>): Promise<void> {
    try {
      const leadScore = data.lead_score || 0;
      const urgencyEmoji = this.getUrgencyEmoji(data['1031x_order_urgency_level']);
      
      const subject = `🏢 New 1031 Exchange Order ${urgencyEmoji} - ${data['1031x_order_first_name']} ${data['1031x_order_last_name']} (Score: ${leadScore})`;
      
      const body = `
        <h2>New 1031 Exchange Order Form Submission</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Lead Score: ${leadScore}/100 ${this.getScoreEmoji(leadScore)}</h3>
          <p><strong>Urgency:</strong> ${this.formatUrgencyLevel(data['1031x_order_urgency_level'])} ${urgencyEmoji}</p>
        </div>
        
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Name:</strong> ${data['1031x_order_first_name']} ${data['1031x_order_last_name']}</li>
          <li><strong>Email:</strong> <a href="mailto:${data['1031x_order_email']}">${data['1031x_order_email']}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${data['1031x_order_phone']}">${data['1031x_order_phone']}</a></li>
          <li><strong>Preferred Contact:</strong> ${data['1031x_order_preferred_contact']}</li>
        </ul>
        
        <h3>Property Details</h3>
        <ul>
          <li><strong>Address:</strong> ${data['1031x_order_property_address']}, ${data['1031x_order_property_city']}, ${data['1031x_order_property_state']} ${data['1031x_order_property_zip']}</li>
          <li><strong>Type:</strong> ${this.formatPropertyType(data['1031x_order_property_type'])}</li>
          <li><strong>Sale Price:</strong> $${this.formatCurrency(data['1031x_order_sale_price'])}</li>
          <li><strong>Mortgage Balance:</strong> ${data['1031x_order_mortgage_balance'] ? '$' + this.formatCurrency(data['1031x_order_mortgage_balance']) : 'None'}</li>
        </ul>
        
        <h3>Timeline</h3>
        <ul>
          <li><strong>Contract Status:</strong> ${this.formatContractStatus(data['1031x_order_contract_status'])}</li>
          <li><strong>Closing Date:</strong> ${data['1031x_order_closing_date'] || 'Not set'}</li>
          <li><strong>Expected Listing Date:</strong> ${data['1031x_order_expected_listing_date'] || 'Not set'}</li>
        </ul>
        
        <h3>Exchange Goals</h3>
        <ul>
          <li><strong>Replacement Property:</strong> ${this.formatReplacementStatus(data['1031x_order_replacement_identified'])}</li>
          <li><strong>Exchange Type:</strong> ${this.formatExchangeType(data['1031x_order_exchange_type'])}</li>
          <li><strong>Cash Out Needs:</strong> ${this.formatCashOutNeeds(data['1031x_order_cash_out_needed'])}</li>
          <li><strong>DST Interest:</strong> ${this.formatDSTInterest(data['1031x_order_dst_interest'])}</li>
        </ul>
        
        <h3>Professional Team</h3>
        <ul>
          <li><strong>Has CPA:</strong> ${data['1031x_order_has_cpa']}</li>
          ${data['1031x_order_cpa_name'] ? `<li><strong>CPA:</strong> ${data['1031x_order_cpa_name']} (${data['1031x_order_cpa_email']})</li>` : ''}
          ${data['1031x_order_realtor_name'] ? `<li><strong>Realtor:</strong> ${data['1031x_order_realtor_name']} (${data['1031x_order_realtor_email']})</li>` : ''}
        </ul>
        
        ${data['1031x_order_additional_notes'] ? `
        <h3>Additional Notes</h3>
        <p>${data['1031x_order_additional_notes']}</p>
        ` : ''}
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Submission ID: ${submissionId}<br>
          Submitted: ${new Date().toLocaleString()}
        </p>
      `;
      
      await this.email.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@the1031center.com',
        subject,
        html: body
      });
      
      // Update tracking
      await this.db.getTable('order_form_submissions')
        .update({ 
          admin_notification_sent: true,
          admin_notification_sent_at: new Date().toISOString()
        })
        .eq('id', submissionId);
      
      // Log email
      await this.db.getTable('order_form_emails')
        .insert({
          order_form_id: submissionId,
          email_type: 'admin_notification',
          recipient: process.env.ADMIN_EMAIL || 'admin@the1031center.com',
          subject,
          body,
          sent: true,
          sent_at: new Date().toISOString()
        });
      
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw error;
    }
  }
  
  /**
   * Send user confirmation email
   */
  private async sendUserConfirmation(submissionId: string, data: Record<string, any>): Promise<void> {
    try {
      const subject = 'Thank You - Your 1031 Exchange Application Has Been Received';
      
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Thank You for Choosing National 1031 Center</h2>
          
          <p>Dear ${data['1031x_order_first_name']},</p>
          
          <p>We've successfully received your 1031 exchange application and are excited to help you defer capital gains taxes on your investment property.</p>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What Happens Next?</h3>
            <ol>
              <li>Our team will review your information within 24 hours</li>
              <li>A 1031 exchange specialist will contact you to discuss your specific situation</li>
              <li>We'll prepare all necessary documentation for your exchange</li>
              <li>You'll have 24/7 access to our client portal to track your exchange progress</li>
            </ol>
          </div>
          
          <h3>Your Property Details</h3>
          <p>
            <strong>Property:</strong> ${data['1031x_order_property_address']}, ${data['1031x_order_property_city']}, ${data['1031x_order_property_state']}<br>
            <strong>Sale Price:</strong> $${this.formatCurrency(data['1031x_order_sale_price'])}<br>
            <strong>Timeline:</strong> ${this.formatUrgencyLevel(data['1031x_order_urgency_level'])}
          </p>
          
          <h3>Important Reminders</h3>
          <ul>
            <li>Never receive exchange funds directly - they must go through your QI</li>
            <li>You have 45 days to identify replacement properties</li>
            <li>You have 180 days to complete your purchase</li>
            <li>These deadlines are strict with no extensions</li>
          </ul>
          
          <p>If you have any immediate questions, please don't hesitate to call us at <strong>${process.env.COMPANY_PHONE || '800-595-1031'}</strong>.</p>
          
          <p>
            Best regards,<br>
            <strong>The National 1031 Center Team</strong>
          </p>
          
          <hr style="margin-top: 40px;">
          <p style="color: #666; font-size: 12px;">
            This email confirms your form submission. Please save it for your records.<br>
            Reference Number: ${submissionId.slice(-8).toUpperCase()}
          </p>
        </div>
      `;
      
      await this.email.sendEmail({
        to: data['1031x_order_email'],
        subject,
        html: body
      });
      
      // Update tracking
      await this.db.getTable('order_form_submissions')
        .update({ 
          user_confirmation_sent: true,
          user_confirmation_sent_at: new Date().toISOString()
        })
        .eq('id', submissionId);
      
      // Log email
      await this.db.getTable('order_form_emails')
        .insert({
          order_form_id: submissionId,
          email_type: 'user_confirmation',
          recipient: data['1031x_order_email'],
          subject,
          body,
          sent: true,
          sent_at: new Date().toISOString()
        });
      
    } catch (error) {
      console.error('Failed to send user confirmation:', error);
      // Don't throw - this shouldn't block the submission
    }
  }
  
  /**
   * Sync to HighLevel with all custom fields
   */
  private async syncToHighLevel(
    submissionId: string, 
    mappedData: Record<string, any>,
    originalData: OrderFormData
  ): Promise<string> {
    try {
      // Create custom fields object with all 28 fields
      const customFields: Record<string, any> = {};
      
      // Map all fields to HighLevel custom fields
      for (const [key, value] of Object.entries(mappedData)) {
        if (key.startsWith('1031x_order_')) {
          customFields[key] = String(value || '');
        }
      }
      
      // Add calculated fields
      customFields['1031x_order_lead_score'] = String(mappedData.lead_score || 0);
      customFields['1031x_order_submission_id'] = submissionId;
      customFields['1031x_order_submission_date'] = new Date().toISOString();
      
      // Sync contact to HighLevel
      const contactId = await this.highlevel.syncContact({
        leadId: submissionId,
        email: originalData['1031x_order_email'],
        phone: originalData['1031x_order_phone'],
        firstName: originalData['1031x_order_first_name'],
        lastName: originalData['1031x_order_last_name'],
        tags: [
          '1031-exchange-order-form',
          `urgency-${originalData['1031x_order_urgency_level']}`,
          `score-${mappedData.lead_score}`,
          `property-${originalData['1031x_order_property_type']}`
        ],
        customFields
      });
      
      return contactId;
    } catch (error) {
      console.error('Failed to sync to HighLevel:', error);
      throw error;
    }
  }
  
  /**
   * Trigger webhooks for external integrations
   */
  private async triggerWebhooks(submissionId: string, data: Record<string, any>): Promise<void> {
    try {
      const webhookUrls = process.env.ORDER_FORM_WEBHOOK_URLS?.split(',') || [];
      
      if (webhookUrls.length === 0) {
        return; // No webhooks configured
      }
      
      const payload = {
        event: 'order_form_submitted',
        submission_id: submissionId,
        lead_score: data.lead_score,
        data: data,
        timestamp: new Date().toISOString()
      };
      
      // Send webhooks in parallel
      const webhookPromises = webhookUrls.map(async (url) => {
        try {
          const response = await fetch(url.trim(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': process.env.WEBHOOK_SECRET || ''
            },
            body: JSON.stringify(payload)
          });
          
          // Log webhook
          await this.db.getTable('order_form_webhooks')
            .insert({
              order_form_id: submissionId,
              webhook_type: 'order_form_submitted',
              url: url.trim(),
              payload,
              response_status: response.status,
              response_body: await response.text(),
              success: response.ok
            });
          
        } catch (error: any) {
          // Log failed webhook
          await this.db.getTable('order_form_webhooks')
            .insert({
              order_form_id: submissionId,
              webhook_type: 'order_form_submitted',
              url: url.trim(),
              payload,
              success: false,
              error_message: error.message
            });
        }
      });
      
      await Promise.all(webhookPromises);
      
      // Update tracking
      await this.db.getTable('order_form_submissions')
        .update({ 
          webhook_sent: true,
          webhook_sent_at: new Date().toISOString()
        })
        .eq('id', submissionId);
      
    } catch (error) {
      console.error('Failed to trigger webhooks:', error);
      // Don't throw - webhooks shouldn't block the submission
    }
  }
  
  // Formatting helper methods
  private formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US');
  }
  
  private formatUrgencyLevel(level: string): string {
    const map: Record<string, string> = {
      'urgent_2_weeks': '🚨 URGENT - Closing in 2 weeks',
      'time_sensitive_1': '⚡ Time Sensitive - 1 month',
      'getting_ready_1_3': '📅 Getting Ready - 1-3 months',
      'planning_3_plus': '📊 Planning - 3+ months'
    };
    return map[level] || level;
  }
  
  private formatPropertyType(type: string): string {
    const map: Record<string, string> = {
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
    return map[type] || type;
  }
  
  private formatContractStatus(status: string): string {
    const map: Record<string, string> = {
      'not_listed': 'Not Listed Yet',
      'listed_no_offers': 'Listed - No Offers',
      'accepted_offer': 'Accepted Offer',
      'in_escrow': 'In Escrow',
      'closing_scheduled': 'Closing Scheduled'
    };
    return map[status] || status;
  }
  
  private formatReplacementStatus(status: string): string {
    const map: Record<string, string> = {
      'yes_specific': 'Yes - Specific Property Identified',
      'yes_multiple': 'Yes - Multiple Options',
      'no_searching': 'No - Still Searching',
      'need_help': 'Need Help Finding Properties'
    };
    return map[status] || status;
  }
  
  private formatExchangeType(type: string): string {
    const map: Record<string, string> = {
      'standard_delayed': 'Standard Delayed Exchange',
      'reverse': 'Reverse Exchange',
      'improvement': 'Improvement Exchange',
      'not_sure': 'Not Sure - Need Guidance'
    };
    return map[type] || type;
  }
  
  private formatCashOutNeeds(needs: string): string {
    const map: Record<string, string> = {
      'no_cash': 'No Cash Out',
      'minimal_50k': 'Minimal (< $50k)',
      'moderate_50_200k': 'Moderate ($50k - $200k)',
      'significant_200k_plus': 'Significant ($200k+)',
      'not_sure': 'Not Sure'
    };
    return map[needs] || needs;
  }
  
  private formatDSTInterest(interest: string): string {
    const map: Record<string, string> = {
      'interested': 'Interested in DST',
      'traditional_only': 'Traditional Properties Only',
      'learn_both': 'Want to Learn About Both',
      'not_familiar': 'Not Familiar with DST'
    };
    return map[interest] || interest;
  }
  
  private getUrgencyEmoji(level: string): string {
    const map: Record<string, string> = {
      'urgent_2_weeks': '🚨',
      'time_sensitive_1': '⚡',
      'getting_ready_1_3': '📅',
      'planning_3_plus': '📊'
    };
    return map[level] || '📋';
  }
  
  private getScoreEmoji(score: number): string {
    if (score >= 80) return '🔥';
    if (score >= 60) return '⭐';
    if (score >= 40) return '👍';
    return '📊';
  }
}