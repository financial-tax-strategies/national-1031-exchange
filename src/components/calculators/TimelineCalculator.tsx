import React, { useState, useEffect } from 'react';
import { TimelineVisualizer } from './timeline/TimelineVisualizer';
import { DeadlineCard } from './timeline/DeadlineCard';
import { PropertyTracker } from './timeline/PropertyTracker';
import { ReminderSetup } from './timeline/ReminderSetup';
import { formatDate, calculateDeadlines, getDaysRemaining, type ExchangeTimeline } from '../../lib/calculators/timelineCalculations';

interface TimelineCalculatorProps {
  initialSaleDate?: string;
  onTimelineChange?: (timeline: ExchangeTimeline) => void;
}

export const TimelineCalculator: React.FC<TimelineCalculatorProps> = ({ 
  initialSaleDate, 
  onTimelineChange 
}) => {
  const [saleDate, setSaleDate] = useState(initialSaleDate || '');
  const [timeline, setTimeline] = useState<ExchangeTimeline | null>(null);
  const [showPropertyTracker, setShowPropertyTracker] = useState(false);
  const [showReminderSetup, setShowReminderSetup] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate timeline when sale date changes
  useEffect(() => {
    if (saleDate) {
      const newTimeline = calculateDeadlines(saleDate);
      setTimeline(newTimeline);
      onTimelineChange?.(newTimeline);
    }
  }, [saleDate, onTimelineChange]);

  const handleSaleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaleDate(e.target.value);
  };

  const handleExportCalendar = () => {
    if (!timeline) return;

    // Create calendar events
    const events = [
      {
        title: '1031 Exchange - 45 Day ID Deadline',
        start: timeline.identificationDeadline,
        description: 'Last day to identify replacement properties for your 1031 exchange.'
      },
      {
        title: '1031 Exchange - 180 Day Purchase Deadline',
        start: timeline.purchaseDeadline,
        description: 'Last day to close on replacement property for your 1031 exchange.'
      }
    ];

    // Generate ICS file content
    const icsContent = generateICSContent(events);
    downloadICSFile(icsContent, '1031-exchange-deadlines.ics');
  };

  const generateICSContent = (events: any[]) => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//National 1031 Center//Timeline Calculator//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach((event, index) => {
      const eventDate = new Date(event.start);
      const dateString = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      lines.push(
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${index}@the1031center.com`,
        `DTSTART:${dateString}`,
        `DTEND:${dateString}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        'BEGIN:VALARM',
        'TRIGGER:-P7D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: 1031 Exchange deadline in 7 days',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:URGENT: 1031 Exchange deadline tomorrow!',
        'END:VALARM',
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  };

  const downloadICSFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTimelineStatus = () => {
    if (!timeline) return null;

    const now = new Date();
    const saleDateTime = new Date(timeline.saleDate);
    const idDateTime = new Date(timeline.identificationDeadline);
    const purchaseDateTime = new Date(timeline.purchaseDeadline);

    if (now < saleDateTime) {
      return { status: 'pending', message: 'Exchange not yet started' };
    } else if (now > purchaseDateTime) {
      return { status: 'expired', message: 'Exchange period has ended' };
    } else if (now > idDateTime) {
      return { status: 'identified', message: 'Identification period has passed' };
    } else {
      return { status: 'active', message: 'Exchange in progress' };
    }
  };

  const timelineStatus = getTimelineStatus();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Sale Details</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700 mb-2">
              Property Sale Date
            </label>
            <input
              type="date"
              id="saleDate"
              value={saleDate}
              onChange={handleSaleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="mt-2 text-sm text-gray-600">
              Enter the closing date of your relinquished property sale
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Results */}
      {timeline && (
        <>
          {/* Status Banner */}
          {timelineStatus && (
            <div className={`mb-8 p-4 rounded-lg ${
              timelineStatus.status === 'active' ? 'bg-green-50 border-l-4 border-green-500' :
              timelineStatus.status === 'identified' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              timelineStatus.status === 'expired' ? 'bg-red-50 border-l-4 border-red-500' :
              'bg-gray-50 border-l-4 border-gray-500'
            }`}>
              <p className={`font-semibold ${
                timelineStatus.status === 'active' ? 'text-green-800' :
                timelineStatus.status === 'identified' ? 'text-yellow-800' :
                timelineStatus.status === 'expired' ? 'text-red-800' :
                'text-gray-800'
              }`}>
                {timelineStatus.message}
              </p>
            </div>
          )}

          {/* Visual Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Exchange Timeline</h2>
            <TimelineVisualizer timeline={timeline} currentDate={currentDate} />
          </div>

          {/* Deadline Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <DeadlineCard
              title="45-Day Identification Deadline"
              deadline={timeline.identificationDeadline}
              currentDate={currentDate}
              description="Last day to identify replacement properties"
              type="identification"
            />
            <DeadlineCard
              title="180-Day Purchase Deadline"
              deadline={timeline.purchaseDeadline}
              currentDate={currentDate}
              description="Last day to close on replacement property"
              type="purchase"
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Timeline Tools</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowPropertyTracker(!showPropertyTracker)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showPropertyTracker ? 'Hide' : 'Show'} Property Tracker
              </button>
              <button
                onClick={() => setShowReminderSetup(!showReminderSetup)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Set Up Reminders
              </button>
              <button
                onClick={handleExportCalendar}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export to Calendar
              </button>
            </div>
          </div>

          {/* Property Tracker */}
          {showPropertyTracker && (
            <div className="mb-8">
              <PropertyTracker 
                identificationDeadline={timeline.identificationDeadline}
                currentDate={currentDate}
              />
            </div>
          )}

          {/* Reminder Setup */}
          {showReminderSetup && (
            <div className="mb-8">
              <ReminderSetup 
                timeline={timeline}
                onClose={() => setShowReminderSetup(false)}
              />
            </div>
          )}
        </>
      )}

      {/* Educational Tips */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Timeline Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Start looking for replacement properties immediately after your sale</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Identify backup properties in case your first choice falls through</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Submit your identification in writing to your QI before day 45</span>
          </li>
        </ul>
      </div>
    </div>
  );
};