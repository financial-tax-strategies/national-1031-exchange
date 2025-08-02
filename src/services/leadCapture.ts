import { DatabaseService } from '../lib/services/database.service';
import { HighLevelService } from '../lib/services/highlevel.service';
import type { LeadInput } from './types/common';

class LeadCaptureService {
  private db: DatabaseService;
  private highLevel: HighLevelService;

  constructor() {
    this.db = DatabaseService.getInstance();
    this.highLevel = new HighLevelService();
  }

  async createLead(input: LeadInput) {
    try {
      // First, create or update lead in database
      const { data: leadId, error: dbError } = await this.db.executeFunction(
        'find_or_create_lead',
        {
          p_email: input.email,
          p_first_name: input.firstName || null,
          p_last_name: input.lastName || null,
          p_lead_source: input.leadSource,
          p_phone: input.phone || null
        }
      );

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Then sync to HighLevel
      try {
        await this.highLevel.syncContact({
          leadId: leadId,
          email: input.email,
          firstName: input.firstName || undefined,
          lastName: input.lastName || undefined,
          phone: input.phone || undefined,
          customFields: {
            lead_source: input.leadSource,
            ...input.metadata
          }
        });
      } catch (hlError) {
        console.error('HighLevel sync error:', hlError);
        // Don't throw - we still captured the lead in our database
      }

      // Track the lead capture
      if (typeof window !== 'undefined' && window.trackLeadCapture) {
        window.trackLeadCapture(input.leadSource, {
          email: input.email,
          lead_id: leadId
        });
      }

      return { id: leadId, success: true };
    } catch (error) {
      console.error('Lead capture error:', error);
      throw error;
    }
  }
}

export const leadCaptureService = new LeadCaptureService();