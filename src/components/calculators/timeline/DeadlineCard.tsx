import React from 'react';
import { getDaysRemaining, formatDateLong } from '../../../lib/calculators/timelineCalculations';

interface DeadlineCardProps {
  title: string;
  deadline: string;
  currentDate: Date;
  description: string;
  type: 'identification' | 'purchase';
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({
  title,
  deadline,
  currentDate,
  description,
  type
}) => {
  const { days, isOverdue, displayText } = getDaysRemaining(deadline, currentDate);
  
  const getCardStyle = () => {
    if (isOverdue) {
      return 'border-red-500 bg-red-50';
    }
    if (days === 0) {
      return 'border-red-500 bg-red-50 animate-pulse';
    }
    if (days <= 7) {
      return 'border-yellow-500 bg-yellow-50';
    }
    if (days <= 30) {
      return 'border-blue-500 bg-blue-50';
    }
    return 'border-green-500 bg-green-50';
  };

  const getTextColor = () => {
    if (isOverdue || days === 0) return 'text-red-700';
    if (days <= 7) return 'text-yellow-700';
    if (days <= 30) return 'text-blue-700';
    return 'text-green-700';
  };

  const getIcon = () => {
    if (type === 'identification') {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all duration-300 ${getCardStyle()}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${getTextColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{description}</p>
            
            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700">
                Deadline: {formatDateLong(deadline)}
              </p>
              
              <div className={`text-2xl font-bold mt-2 ${getTextColor()}`}>
                {displayText}
              </div>
              
              {!isOverdue && days > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        days === 0 ? 'bg-red-500' :
                        days <= 7 ? 'bg-yellow-500' :
                        days <= 30 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, 
                          type === 'identification' 
                            ? ((45 - days) / 45) * 100
                            : ((180 - days) / 180) * 100
                        ))}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Warning messages */}
          {days === 0 && !isOverdue && (
            <div className="mt-3 p-2 bg-red-100 rounded-md">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ TODAY IS YOUR DEADLINE! Act immediately!
              </p>
            </div>
          )}
          
          {days > 0 && days <= 7 && (
            <div className="mt-3 p-2 bg-yellow-100 rounded-md">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Less than one week remaining!
              </p>
            </div>
          )}
          
          {isOverdue && (
            <div className="mt-3 p-2 bg-red-100 rounded-md">
              <p className="text-sm font-semibold text-red-800">
                ❌ This deadline has passed. Your exchange may be disqualified.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Action items */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {type === 'identification' ? 'Identification Checklist:' : 'Purchase Checklist:'}
        </h4>
        <ul className="space-y-1 text-sm text-gray-600">
          {type === 'identification' ? (
            <>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Find potential replacement properties
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Choose identification rule (3-property, 200%, or 95%)
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Submit written identification to QI
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Complete due diligence on property
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Arrange financing if needed
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Schedule closing with QI involvement
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};