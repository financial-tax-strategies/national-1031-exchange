import React from 'react';
import type { ScoreBreakdown, ScoreComponent } from '../../lib/utils/scoring-calculator';
import { getScoreColor, getScoreBackgroundColor } from '../../lib/utils/scoring-calculator';

interface LeadScoreBreakdownProps {
  breakdown: ScoreBreakdown;
  showRecommendation?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * LeadScoreBreakdown Component
 * Displays detailed breakdown of lead score components
 */
export const LeadScoreBreakdown: React.FC<LeadScoreBreakdownProps> = ({
  breakdown,
  showRecommendation = true,
  compact = false,
  className = ''
}) => {
  const scoreColor = getScoreColor(breakdown.totalScore);
  const bgColor = getScoreBackgroundColor(breakdown.totalScore);
  
  // Group components by category
  const groupedComponents = breakdown.components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ScoreComponent[]>);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
            Lead Score Breakdown
          </h3>
          <div className={`${bgColor} px-3 py-1.5 rounded-lg`}>
            <span className={`${scoreColor} text-2xl font-bold`}>
              {breakdown.totalScore}
            </span>
            <span className={`${scoreColor} text-sm font-medium ml-1`}>
              / 100
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`${scoreColor.replace('text-', 'bg-')} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${breakdown.scorePercentage}%` }}
          />
        </div>
      </div>
      
      {/* Score Components */}
      <div className={`space-y-${compact ? '3' : '4'}`}>
        {Object.entries(groupedComponents).map(([category, components]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
            <div className="space-y-2">
              {components.map((component, index) => (
                <ScoreComponentRow 
                  key={`${category}-${index}`} 
                  component={component} 
                  compact={compact}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Recommendation */}
      {showRecommendation && (
        <div className={`${compact ? 'mt-4 pt-4' : 'mt-6 pt-6'} border-t`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Recommendation</p>
              <p className="text-sm text-gray-600">{breakdown.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ScoreComponentRow
 * Individual score component display
 */
const ScoreComponentRow: React.FC<{ 
  component: ScoreComponent; 
  compact: boolean;
}> = ({ component, compact }) => {
  const percentage = component.maxPoints 
    ? Math.round((component.points / component.maxPoints) * 100)
    : 0;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {component.description}
        </p>
        {component.maxPoints && !compact && (
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
      <div className="ml-4 text-right">
        <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>
          +{component.points}
        </span>
        {component.maxPoints && (
          <span className="text-xs text-gray-500 ml-1">
            / {component.maxPoints}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * LeadScoreSummary Component
 * Compact summary view for dashboards
 */
export const LeadScoreSummary: React.FC<{
  breakdown: ScoreBreakdown;
  className?: string;
}> = ({ breakdown, className = '' }) => {
  const topComponents = breakdown.components
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
  
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Score Summary</span>
        <span className={`text-lg font-bold ${getScoreColor(breakdown.totalScore)}`}>
          {breakdown.totalScore}
        </span>
      </div>
      
      <div className="space-y-1">
        {topComponents.map((component, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{component.description}</span>
            <span className="text-xs font-medium text-gray-900">+{component.points}</span>
          </div>
        ))}
        {breakdown.components.length > 3 && (
          <div className="text-xs text-gray-500 italic">
            +{breakdown.components.length - 3} more factors
          </div>
        )}
      </div>
    </div>
  );
};