/**
 * Example usage of Lead Scoring Service
 * This demonstrates how to use the lead scoring system in your application
 */

import { LeadScoringService } from '../lead-scoring.service';
import { formatScoreBreakdown } from '../../utils/scoring-calculator';

// Example 1: Calculate score for a specific lead
async function calculateLeadScore() {
  const scoringService = new LeadScoringService();
  
  try {
    // Calculate score for a lead
    const leadId = 'your-lead-id-here';
    const score = await scoringService.calculateLeadScore(leadId);
    
    console.log(`Lead score: ${score}`);
  } catch (error) {
    console.error('Error calculating lead score:', error);
  }
}

// Example 2: Update lead score in database
async function updateLeadScore() {
  const scoringService = new LeadScoringService();
  
  try {
    const leadId = 'your-lead-id-here';
    const { lead, score } = await scoringService.recalculateAndUpdateScore(leadId);
    
    console.log(`Updated lead ${lead.email} with score: ${score}`);
  } catch (error) {
    console.error('Error updating lead score:', error);
  }
}

// Example 3: Get high-value leads
async function getHighValueLeads() {
  const scoringService = new LeadScoringService();
  
  try {
    const highValueLeads = await scoringService.getHighValueLeads(10);
    
    console.log('High-value leads:');
    highValueLeads.forEach(lead => {
      console.log(`- ${lead.email}: Score ${lead.lead_score}`);
    });
  } catch (error) {
    console.error('Error fetching high-value leads:', error);
  }
}

// Example 4: Batch recalculate scores
async function batchUpdateScores() {
  const scoringService = new LeadScoringService();
  
  try {
    const leadIds = ['lead-id-1', 'lead-id-2', 'lead-id-3'];
    const results = await scoringService.batchRecalculateScores(leadIds);
    
    results.forEach(result => {
      if (result.success) {
        console.log(`Lead ${result.leadId}: Score ${result.score}`);
      } else {
        console.error(`Failed to update lead ${result.leadId}: ${result.error}`);
      }
    });
  } catch (error) {
    console.error('Error in batch update:', error);
  }
}

// Example 5: Using score breakdown in UI
async function displayScoreBreakdown() {
  const scoringService = new LeadScoringService();
  
  try {
    const leadId = 'your-lead-id-here';
    const score = await scoringService.calculateLeadScore(leadId);
    
    // In a real app, you'd get the breakdown from the lead_activities table
    // where activity_type = 'score_calculated'
    const mockBreakdown = {
      calculatorCompletion: 20,
      appointmentBooking: 30,
      phoneProvided: 5,
      websiteVisits: 8
    };
    
    const formattedBreakdown = formatScoreBreakdown(mockBreakdown, score);
    
    console.log('Score Breakdown:');
    console.log(`Total Score: ${formattedBreakdown.totalScore} (${formattedBreakdown.scoreGrade})`);
    console.log(`Recommendation: ${formattedBreakdown.recommendation}`);
    
    formattedBreakdown.components.forEach(component => {
      console.log(`- ${component.description}: +${component.points}`);
    });
  } catch (error) {
    console.error('Error displaying score breakdown:', error);
  }
}

// Example 6: React component usage
/*
import React, { useEffect, useState } from 'react';
import { LeadScoringService } from '@/lib/services/lead-scoring.service';
import { LeadScoreDisplay, LeadScoreBreakdown } from '@/components/admin';
import { formatScoreBreakdown } from '@/lib/utils/scoring-calculator';

function LeadDetailsPage({ leadId }: { leadId: string }) {
  const [score, setScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadScore() {
      const scoringService = new LeadScoringService();
      
      try {
        const calculatedScore = await scoringService.calculateLeadScore(leadId);
        setScore(calculatedScore);
        
        // In production, fetch the breakdown from lead_activities
        const mockBreakdown = formatScoreBreakdown({
          calculatorCompletion: 20,
          appointmentBooking: 30,
          phoneProvided: 5
        }, calculatedScore);
        
        setBreakdown(mockBreakdown);
      } catch (error) {
        console.error('Error loading score:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadScore();
  }, [leadId]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <LeadScoreDisplay 
        score={score} 
        lastActivityDate={new Date().toISOString()}
        size="large"
      />
      
      {breakdown && (
        <LeadScoreBreakdown 
          breakdown={breakdown}
          showRecommendation={true}
        />
      )}
    </div>
  );
}
*/

// Database trigger usage notes:
/*
The database triggers will automatically update lead scores when:
1. A new lead activity is created
2. A calculator submission is created or updated
3. An order form submission is created or updated
4. An appointment is created or updated
5. A document is uploaded
6. Lead contact information (phone, name) is updated

To manually trigger a score recalculation for all leads:
Run this SQL in your database:
SELECT * FROM recalculate_all_lead_scores();
*/