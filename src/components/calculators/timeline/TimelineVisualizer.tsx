import React from 'react';
import { calculateProgress, formatDateLong, type ExchangeTimeline } from '../../../lib/calculators/timelineCalculations';

interface TimelineVisualizerProps {
  timeline: ExchangeTimeline;
  currentDate: Date;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ timeline, currentDate }) => {
  const progress = calculateProgress(timeline.saleDate, currentDate);
  
  const getProgressColor = (days: number) => {
    if (days < 0) return 'bg-red-500';
    if (days <= 7) return 'bg-yellow-500';
    if (days <= 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getMilestoneStatus = (date: string) => {
    const milestoneDate = new Date(date);
    if (currentDate > milestoneDate) return 'completed';
    if (currentDate.toDateString() === milestoneDate.toDateString()) return 'today';
    return 'upcoming';
  };

  const saleStatus = getMilestoneStatus(timeline.saleDate);
  const idStatus = getMilestoneStatus(timeline.identificationDeadline);
  const purchaseStatus = getMilestoneStatus(timeline.purchaseDeadline);

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Day {timeline.daysElapsed}</span>
          <span>180 Days Total</span>
        </div>
        
        {/* Background track */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          {/* Overall progress */}
          <div 
            className={`h-full transition-all duration-500 ${
              timeline.status === 'expired' ? 'bg-red-500' :
              timeline.status === 'identified' ? 'bg-yellow-500' :
              timeline.status === 'active' ? 'bg-blue-500' :
              'bg-gray-400'
            }`}
            style={{ width: `${Math.min(100, progress.overall)}%` }}
          />
        </div>
        
        {/* Milestone markers */}
        <div className="relative -mt-2">
          {/* 45-day marker */}
          <div 
            className="absolute w-0.5 h-8 bg-gray-400 -top-4"
            style={{ left: '25%' }}
          />
          <div 
            className="absolute text-xs text-gray-600 -bottom-6 transform -translate-x-1/2"
            style={{ left: '25%' }}
          >
            45 days
          </div>
        </div>
      </div>

      {/* Timeline with milestones */}
      <div className="relative mt-12">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" />
        
        {/* Milestones */}
        <div className="relative flex justify-between">
          {/* Sale Date */}
          <div className="text-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${saleStatus === 'completed' ? 'bg-green-500' : 
                saleStatus === 'today' ? 'bg-blue-500 animate-pulse' : 
                'bg-gray-400'}
            `}>
              0
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">Sale Closes</p>
            <p className="text-xs text-gray-600">{formatDateLong(timeline.saleDate)}</p>
          </div>

          {/* Identification Deadline */}
          <div className="text-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${idStatus === 'completed' ? 'bg-green-500' : 
                idStatus === 'today' ? 'bg-red-500 animate-pulse' : 
                getProgressColor(timeline.daysUntilIdentification)}
            `}>
              45
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">ID Deadline</p>
            <p className="text-xs text-gray-600">{formatDateLong(timeline.identificationDeadline)}</p>
            {idStatus === 'upcoming' && (
              <p className={`text-xs font-semibold mt-1 ${
                timeline.daysUntilIdentification <= 7 ? 'text-red-600' :
                timeline.daysUntilIdentification <= 30 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {timeline.daysUntilIdentification} days left
              </p>
            )}
          </div>

          {/* Purchase Deadline */}
          <div className="text-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${purchaseStatus === 'completed' ? 'bg-green-500' : 
                purchaseStatus === 'today' ? 'bg-red-500 animate-pulse' : 
                getProgressColor(timeline.daysUntilPurchase)}
            `}>
              180
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">Purchase Deadline</p>
            <p className="text-xs text-gray-600">{formatDateLong(timeline.purchaseDeadline)}</p>
            {purchaseStatus === 'upcoming' && (
              <p className={`text-xs font-semibold mt-1 ${
                timeline.daysUntilPurchase <= 7 ? 'text-red-600' :
                timeline.daysUntilPurchase <= 30 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {timeline.daysUntilPurchase} days left
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Phase indicators */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {/* Identification Phase */}
        <div className={`p-4 rounded-lg border-2 ${
          timeline.status === 'active' ? 'border-blue-500 bg-blue-50' :
          timeline.status === 'pending' ? 'border-gray-300 bg-gray-50' :
          'border-gray-300 bg-gray-50'
        }`}>
          <h4 className="font-semibold text-gray-900 mb-2">Identification Phase</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">Days 0-45</p>
            {timeline.status === 'active' && (
              <p className="text-blue-700 font-semibold">
                Currently Active - {timeline.daysUntilIdentification} days remaining
              </p>
            )}
            {(timeline.status === 'identified' || timeline.status === 'expired') && (
              <p className="text-gray-500">Phase completed</p>
            )}
          </div>
        </div>

        {/* Purchase Phase */}
        <div className={`p-4 rounded-lg border-2 ${
          timeline.status === 'identified' ? 'border-blue-500 bg-blue-50' :
          timeline.status === 'pending' || timeline.status === 'active' ? 'border-gray-300 bg-gray-50' :
          'border-gray-300 bg-gray-50'
        }`}>
          <h4 className="font-semibold text-gray-900 mb-2">Purchase Phase</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">Days 45-180</p>
            {timeline.status === 'identified' && (
              <p className="text-blue-700 font-semibold">
                Currently Active - {timeline.daysUntilPurchase} days remaining
              </p>
            )}
            {timeline.status === 'expired' && (
              <p className="text-red-600 font-semibold">Exchange period expired</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};