/**
 * Scoring Calculator Utility
 * Provides helper functions and utilities for lead scoring calculations
 */

export interface ScoreComponent {
  category: string;
  description: string;
  points: number;
  maxPoints?: number;
}

export interface ScoreBreakdown {
  totalScore: number;
  components: ScoreComponent[];
  scorePercentage: number;
  scoreGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendation: string;
}

/**
 * Get score grade based on numeric score
 */
export function getScoreGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

/**
 * Get recommendation based on score
 */
export function getScoreRecommendation(score: number): string {
  if (score >= 80) {
    return 'Hot lead - Immediate follow-up recommended. High conversion potential.';
  }
  if (score >= 70) {
    return 'Warm lead - Priority follow-up within 24 hours. Strong interest shown.';
  }
  if (score >= 50) {
    return 'Qualified lead - Follow up within 2-3 days. Showing good engagement.';
  }
  if (score >= 30) {
    return 'Developing lead - Nurture with educational content. Building interest.';
  }
  return 'Cold lead - Add to nurture campaign. Early stage of interest.';
}

/**
 * Format score components into a breakdown
 */
export function formatScoreBreakdown(
  components: Record<string, number>,
  totalScore: number
): ScoreBreakdown {
  const formattedComponents: ScoreComponent[] = [];
  
  // Map internal component names to user-friendly descriptions
  const componentDescriptions: Record<string, { category: string; description: string; maxPoints?: number }> = {
    phoneProvided: {
      category: 'Contact Information',
      description: 'Phone number provided',
      maxPoints: 5
    },
    fullNameProvided: {
      category: 'Contact Information',
      description: 'Full name provided',
      maxPoints: 3
    },
    calculatorCompletion: {
      category: 'Engagement',
      description: 'Completed tax savings calculator',
      maxPoints: 20
    },
    highValueProperty: {
      category: 'Property Value',
      description: 'High-value property ($1M+)',
      maxPoints: 10
    },
    orderFormSteps: {
      category: 'Form Progress',
      description: 'Order form steps completed',
      maxPoints: 25
    },
    formSubmission: {
      category: 'Form Progress',
      description: 'Completed order form',
      maxPoints: 15
    },
    urgentTimeline: {
      category: 'Urgency',
      description: 'Urgent exchange timeline',
      maxPoints: 15
    },
    appointmentBooking: {
      category: 'Engagement',
      description: 'Scheduled appointment',
      maxPoints: 30
    },
    websiteVisits: {
      category: 'Activity',
      description: 'Website page views',
      maxPoints: 10
    },
    repeatVisit: {
      category: 'Activity',
      description: 'Returning visitor',
      maxPoints: 3
    },
    documentUploads: {
      category: 'Engagement',
      description: 'Documents uploaded',
      maxPoints: 30
    },
    emailOpens: {
      category: 'Activity',
      description: 'Email engagement',
      maxPoints: 10
    }
  };
  
  // Convert components to formatted array
  Object.entries(components).forEach(([key, points]) => {
    const description = componentDescriptions[key];
    if (description) {
      formattedComponents.push({
        category: description.category,
        description: description.description,
        points,
        maxPoints: description.maxPoints
      });
    }
  });
  
  // Sort by category then by points (highest first)
  formattedComponents.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return b.points - a.points;
  });
  
  const scoreGrade = getScoreGrade(totalScore);
  const recommendation = getScoreRecommendation(totalScore);
  
  return {
    totalScore,
    components: formattedComponents,
    scorePercentage: Math.min(totalScore, 100),
    scoreGrade,
    recommendation
  };
}

/**
 * Calculate days since last activity
 */
export function daysSinceLastActivity(lastActivityDate: string | Date): number {
  const last = new Date(lastActivityDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get engagement level based on activity recency
 */
export function getEngagementLevel(lastActivityDate: string | Date): 'high' | 'medium' | 'low' | 'inactive' {
  const days = daysSinceLastActivity(lastActivityDate);
  
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  if (days <= 30) return 'low';
  return 'inactive';
}

/**
 * Calculate score trend (if historical scores available)
 */
export function calculateScoreTrend(scores: Array<{ score: number; date: string }>): {
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
} {
  if (scores.length < 2) {
    return { trend: 'stable', changePercent: 0 };
  }
  
  // Sort by date
  const sorted = [...scores].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const oldScore = sorted[0].score;
  const newScore = sorted[sorted.length - 1].score;
  const changePercent = ((newScore - oldScore) / oldScore) * 100;
  
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (changePercent > 5) {
    trend = 'increasing';
  } else if (changePercent < -5) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }
  
  return { trend, changePercent: Math.round(changePercent) };
}

/**
 * Get score color for UI display
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-emerald-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get score background color for UI display
 */
export function getScoreBackgroundColor(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 70) return 'bg-emerald-100';
  if (score >= 50) return 'bg-yellow-100';
  if (score >= 30) return 'bg-orange-100';
  return 'bg-red-100';
}