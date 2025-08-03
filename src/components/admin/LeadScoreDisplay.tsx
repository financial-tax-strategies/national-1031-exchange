import React from 'react';
import { getScoreGrade, getScoreColor, getScoreBackgroundColor, getEngagementLevel } from '../../lib/utils/scoring-calculator';

interface LeadScoreDisplayProps {
  score: number;
  lastActivityDate?: string;
  showGrade?: boolean;
  showEngagement?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * LeadScoreDisplay Component
 * Displays lead score with visual indicators and optional engagement level
 */
export const LeadScoreDisplay: React.FC<LeadScoreDisplayProps> = ({
  score,
  lastActivityDate,
  showGrade = true,
  showEngagement = true,
  size = 'medium',
  className = ''
}) => {
  const grade = getScoreGrade(score);
  const scoreColor = getScoreColor(score);
  const bgColor = getScoreBackgroundColor(score);
  const engagement = lastActivityDate ? getEngagementLevel(lastActivityDate) : null;
  
  // Size classes
  const sizeClasses = {
    small: {
      container: 'px-2 py-1',
      score: 'text-lg font-semibold',
      grade: 'text-xs',
      engagement: 'text-xs'
    },
    medium: {
      container: 'px-3 py-2',
      score: 'text-2xl font-bold',
      grade: 'text-sm',
      engagement: 'text-sm'
    },
    large: {
      container: 'px-4 py-3',
      score: 'text-3xl font-bold',
      grade: 'text-base',
      engagement: 'text-base'
    }
  };
  
  const engagementColors = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-orange-600',
    inactive: 'text-red-600'
  };
  
  const engagementIcons = {
    high: '🔥',
    medium: '✨',
    low: '💤',
    inactive: '❄️'
  };
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Score Badge */}
      <div className={`${bgColor} ${sizeClasses[size].container} rounded-lg flex items-center gap-2`}>
        <span className={`${scoreColor} ${sizeClasses[size].score}`}>
          {score}
        </span>
        {showGrade && (
          <span className={`${scoreColor} ${sizeClasses[size].grade} font-medium`}>
            ({grade})
          </span>
        )}
      </div>
      
      {/* Engagement Indicator */}
      {showEngagement && engagement && (
        <div className={`flex items-center gap-1 ${sizeClasses[size].engagement}`}>
          <span>{engagementIcons[engagement]}</span>
          <span className={`${engagementColors[engagement]} capitalize`}>
            {engagement}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * LeadScoreBadge Component
 * Compact version for use in tables or lists
 */
export const LeadScoreBadge: React.FC<{ score: number; className?: string }> = ({ 
  score, 
  className = '' 
}) => {
  const grade = getScoreGrade(score);
  const scoreColor = getScoreColor(score);
  const bgColor = getScoreBackgroundColor(score);
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${scoreColor} ${className}`}>
      {score} ({grade})
    </span>
  );
};

/**
 * LeadScoreProgress Component
 * Visual progress bar representation of lead score
 */
export const LeadScoreProgress: React.FC<{ 
  score: number; 
  showLabel?: boolean;
  className?: string 
}> = ({ 
  score, 
  showLabel = true,
  className = '' 
}) => {
  const scoreColor = getScoreColor(score);
  const progressColor = scoreColor.replace('text-', 'bg-');
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Lead Score</span>
          <span className={`text-sm font-bold ${scoreColor}`}>{score}/100</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
};