import React, { useState } from 'react';
import { generateReminderSchedule, type ExchangeTimeline } from '../../../lib/calculators/timelineCalculations';

interface ReminderSetupProps {
  timeline: ExchangeTimeline;
  onClose: () => void;
}

export const ReminderSetup: React.FC<ReminderSetupProps> = ({ timeline, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reminderTypes, setReminderTypes] = useState({
    email: true,
    sms: false,
    calendar: true
  });
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reminderSchedule = generateReminderSchedule(timeline);

  const handleToggleReminder = (reminderId: string) => {
    setSelectedReminders(prev =>
      prev.includes(reminderId)
        ? prev.filter(id => id !== reminderId)
        : [...prev, reminderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReminders(reminderSchedule.map((_, index) => index.toString()));
  };

  const handleClearAll = () => {
    setSelectedReminders([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      alert('Please provide at least an email or phone number');
      return;
    }

    if (selectedReminders.length === 0) {
      alert('Please select at least one reminder');
      return;
    }

    setLoading(true);

    // In a real implementation, this would send to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically:
      // 1. Send reminder data to your backend
      // 2. Backend would schedule emails/SMS using a service like SendGrid/Twilio
      // 3. Calendar invites could be generated and sent
      
      console.log('Reminder setup:', {
        email,
        phone,
        reminderTypes,
        selectedReminders: selectedReminders.map(idx => reminderSchedule[parseInt(idx)]),
        timeline
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert('Failed to set up reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reminders Set Successfully!</h3>
        <p className="text-gray-600">You'll receive reminders at the selected times.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Set Up Deadline Reminders</h3>
          <p className="text-sm text-gray-600 mt-1">
            Never miss a critical deadline with automated reminders
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Contact Information</h4>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (for SMS)
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Reminder Types */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Reminder Methods</h4>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reminderTypes.email}
                onChange={(e) => setReminderTypes({ ...reminderTypes, email: e.target.checked })}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Email reminders</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reminderTypes.sms}
                onChange={(e) => setReminderTypes({ ...reminderTypes, sms: e.target.checked })}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">SMS text reminders</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reminderTypes.calendar}
                onChange={(e) => setReminderTypes({ ...reminderTypes, calendar: e.target.checked })}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Calendar invites (ICS)</span>
            </label>
          </div>
        </div>

        {/* Reminder Schedule */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Select Reminders</h4>
            <div className="space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Select All
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reminderSchedule.map((reminder, index) => {
              const isSelected = selectedReminders.includes(index.toString());
              const isPast = new Date(reminder.date) < new Date();
              
              return (
                <label
                  key={index}
                  className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                    isPast 
                      ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' 
                      : isSelected 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => !isPast && handleToggleReminder(index.toString())}
                    disabled={isPast}
                    className="mr-3 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        reminder.type === 'identification' ? 'text-blue-700' : 'text-green-700'
                      }`}>
                        {reminder.type === 'identification' ? 'ID' : 'Purchase'} Reminder
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        - {reminder.daysBeforeDeadline} days before
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{reminder.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Send on: {new Date(reminder.date).toLocaleDateString()}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600">
            <strong>Privacy Notice:</strong> Your contact information will only be used to send the 
            requested reminders and will not be shared with third parties. You can unsubscribe at any time.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || (!email && !phone) || selectedReminders.length === 0}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting Up...
              </>
            ) : (
              'Set Up Reminders'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};