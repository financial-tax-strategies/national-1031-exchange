/**
 * Email Service - Handles email sending via configured provider
 * Can be extended to use SendGrid, AWS SES, or other providers
 */
export class EmailService {
  private from: string;
  
  constructor() {
    this.from = process.env.EMAIL_FROM || 'noreply@the1031center.com';
  }
  
  /**
   * Send email via configured provider
   */
  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
  }): Promise<void> {
    try {
      // For now, we'll use a simple console log
      // In production, integrate with SendGrid, AWS SES, etc.
      console.log('Email Service - Sending email:', {
        to: params.to,
        subject: params.subject,
        from: this.from,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Implement actual email sending
      // Example SendGrid implementation:
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: params.to,
        from: this.from,
        subject: params.subject,
        html: params.html,
        text: params.text || this.htmlToText(params.html),
        replyTo: params.replyTo
      };
      
      await sgMail.send(msg);
      */
      
      // For development, you can use a service like Mailtrap
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - Email content:', params.html);
      }
      
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
  
  /**
   * Convert HTML to plain text (basic implementation)
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}