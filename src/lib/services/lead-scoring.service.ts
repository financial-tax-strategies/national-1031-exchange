import { DatabaseService } from './database.service';
import type { Lead, LeadActivity, CalculatorSubmission, OrderFormSubmission, Appointment } from '../types/database.types';

/**
 * Lead Scoring Service - Automated lead scoring based on engagement and actions
 * Implements scoring rules for various lead activities and behaviors
 */
export class LeadScoringService {
  private db: DatabaseService;
  
  // Scoring rules as defined in coordination doc
  private readonly SCORING_RULES = {
    calculatorCompletion: 20,
    appointmentBooking: 30,
    documentUpload: 10,
    formSubmission: 15,
    emailOpen: 2,
    websiteVisit: 1,
    // Additional rules for more granular scoring
    orderFormStep: 5, // Per step completed
    highValueProperty: 10, // Properties over $1M
    urgentTimeline: 15, // Exchange needed within 30 days
    multipleProperties: 20, // Has multiple properties in system
    repeatVisit: 3, // Returning visitor bonus
    phoneProvided: 5, // Provided phone number
    fullNameProvided: 3, // Provided full name
  };
  
  constructor() {
    this.db = DatabaseService.getInstance();
  }
  
  /**
   * Calculate lead score based on all activities and data
   */
  async calculateLeadScore(leadId: string): Promise<number> {
    try {
      // Fetch all relevant data for scoring
      const [lead, activities, calculator, orderForm, appointments] = await Promise.all([
        this.getLeadData(leadId),
        this.getLeadActivities(leadId),
        this.getCalculatorSubmissions(leadId),
        this.getOrderFormSubmission(leadId),
        this.getAppointments(leadId)
      ]);
      
      if (!lead) {
        throw new Error(`Lead not found: ${leadId}`);
      }
      
      let score = 0;
      const scoreBreakdown: Record<string, number> = {};
      
      // Basic lead information scoring
      if (lead.phone) {
        score += this.SCORING_RULES.phoneProvided;
        scoreBreakdown.phoneProvided = this.SCORING_RULES.phoneProvided;
      }
      
      if (lead.first_name && lead.last_name) {
        score += this.SCORING_RULES.fullNameProvided;
        scoreBreakdown.fullNameProvided = this.SCORING_RULES.fullNameProvided;
      }
      
      // Calculator submissions
      if (calculator.length > 0) {
        score += this.SCORING_RULES.calculatorCompletion;
        scoreBreakdown.calculatorCompletion = this.SCORING_RULES.calculatorCompletion;
        
        // Check for high value properties
        const hasHighValue = calculator.some(calc => 
          calc.property_sale_price && calc.property_sale_price >= 1000000
        );
        if (hasHighValue) {
          score += this.SCORING_RULES.highValueProperty;
          scoreBreakdown.highValueProperty = this.SCORING_RULES.highValueProperty;
        }
      }
      
      // Order form submission
      if (orderForm) {
        const stepsCompleted = orderForm.step_completed || 0;
        const stepScore = stepsCompleted * this.SCORING_RULES.orderFormStep;
        score += stepScore;
        scoreBreakdown.orderFormSteps = stepScore;
        
        // Full form submission bonus
        if (orderForm.completion_status === 'completed') {
          score += this.SCORING_RULES.formSubmission;
          scoreBreakdown.formSubmission = this.SCORING_RULES.formSubmission;
        }
        
        // Urgent timeline bonus
        if (orderForm.urgency_level === 'urgent' || orderForm.urgency_level === 'very_urgent') {
          score += this.SCORING_RULES.urgentTimeline;
          scoreBreakdown.urgentTimeline = this.SCORING_RULES.urgentTimeline;
        }
      }
      
      // Appointments
      const scheduledAppointments = appointments.filter(apt => 
        ['scheduled', 'confirmed'].includes(apt.status)
      );
      if (scheduledAppointments.length > 0) {
        score += this.SCORING_RULES.appointmentBooking;
        scoreBreakdown.appointmentBooking = this.SCORING_RULES.appointmentBooking;
      }
      
      // Activity-based scoring
      const activityScores = this.calculateActivityScores(activities);
      score += activityScores.total;
      Object.assign(scoreBreakdown, activityScores.breakdown);
      
      // Cap the score at 100
      const finalScore = Math.min(score, 100);
      
      // Store the breakdown in the activity log for transparency
      await this.logScoreCalculation(leadId, finalScore, scoreBreakdown);
      
      return finalScore;
    } catch (error) {
      throw this.db.handleError(error, 'Lead score calculation failed');
    }
  }
  
  /**
   * Update lead score in database
   */
  async updateLeadScore(leadId: string, score: number): Promise<Lead> {
    try {
      const { data, error } = await this.db.getTable('leads')
        .update({ 
          lead_score: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw this.db.handleError(error, 'Lead score update failed');
    }
  }
  
  /**
   * Recalculate and update lead score
   */
  async recalculateAndUpdateScore(leadId: string): Promise<{ lead: Lead; score: number }> {
    const score = await this.calculateLeadScore(leadId);
    const lead = await this.updateLeadScore(leadId, score);
    return { lead, score };
  }
  
  /**
   * Batch recalculate scores for multiple leads
   */
  async batchRecalculateScores(leadIds: string[]): Promise<Array<{ leadId: string; score: number; success: boolean; error?: string }>> {
    const results = await Promise.allSettled(
      leadIds.map(async (leadId) => {
        try {
          const { score } = await this.recalculateAndUpdateScore(leadId);
          return { leadId, score, success: true };
        } catch (error) {
          return { 
            leadId, 
            score: 0, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      })
    );
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : { 
        leadId: '', 
        score: 0, 
        success: false, 
        error: result.reason 
      }
    );
  }
  
  /**
   * Get leads by score range
   */
  async getLeadsByScoreRange(minScore: number, maxScore: number, limit = 100): Promise<Lead[]> {
    try {
      const { data, error } = await this.db.getTable('leads')
        .select('*')
        .gte('lead_score', minScore)
        .lte('lead_score', maxScore)
        .order('lead_score', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw this.db.handleError(error, 'Lead fetch by score range failed');
    }
  }
  
  /**
   * Get high-value leads (score >= 70)
   */
  async getHighValueLeads(limit = 50): Promise<Lead[]> {
    return this.getLeadsByScoreRange(70, 100, limit);
  }
  
  /**
   * Calculate scores from activities
   */
  private calculateActivityScores(activities: LeadActivity[]): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;
    
    // Count different activity types
    const activityCounts: Record<string, number> = {};
    activities.forEach(activity => {
      activityCounts[activity.activity_type] = (activityCounts[activity.activity_type] || 0) + 1;
    });
    
    // Website visits
    if (activityCounts.page_view) {
      const visitScore = Math.min(activityCounts.page_view * this.SCORING_RULES.websiteVisit, 10);
      total += visitScore;
      breakdown.websiteVisits = visitScore;
    }
    
    // Repeat visits (if more than 3 page views)
    if (activityCounts.page_view > 3) {
      total += this.SCORING_RULES.repeatVisit;
      breakdown.repeatVisit = this.SCORING_RULES.repeatVisit;
    }
    
    // Document uploads
    if (activityCounts.document_upload) {
      const docScore = activityCounts.document_upload * this.SCORING_RULES.documentUpload;
      total += docScore;
      breakdown.documentUploads = docScore;
    }
    
    // Email opens (if tracked)
    if (activityCounts.email_open) {
      const emailScore = Math.min(activityCounts.email_open * this.SCORING_RULES.emailOpen, 10);
      total += emailScore;
      breakdown.emailOpens = emailScore;
    }
    
    return { total, breakdown };
  }
  
  /**
   * Log score calculation for transparency
   */
  private async logScoreCalculation(leadId: string, score: number, breakdown: Record<string, number>): Promise<void> {
    try {
      await this.db.getTable('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: 'score_calculated',
          activity_data: {
            score,
            breakdown,
            calculated_at: new Date().toISOString()
          }
        });
    } catch (error) {
      // Log error but don't fail the scoring process
      console.error('Failed to log score calculation:', error);
    }
  }
  
  // Helper methods to fetch data
  private async getLeadData(leadId: string): Promise<Lead | null> {
    const { data } = await this.db.getTable('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    return data;
  }
  
  private async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    const { data } = await this.db.getTable('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  
  private async getCalculatorSubmissions(leadId: string): Promise<CalculatorSubmission[]> {
    const { data } = await this.db.getTable('calculator_submissions')
      .select('*')
      .eq('lead_id', leadId);
    return data || [];
  }
  
  private async getOrderFormSubmission(leadId: string): Promise<OrderFormSubmission | null> {
    const { data } = await this.db.getTable('order_form_submissions')
      .select('*')
      .eq('lead_id', leadId)
      .single();
    return data;
  }
  
  private async getAppointments(leadId: string): Promise<Appointment[]> {
    const { data } = await this.db.getTable('appointments')
      .select('*')
      .eq('lead_id', leadId);
    return data || [];
  }
}