import React, { useState } from 'react';
import { LeadService } from '../../lib/services/lead.service';
import { AppointmentService } from '../../lib/services/appointment.service';
import { HighLevelService } from '../../lib/services/highlevel.service';
import type { Lead } from '../../lib/types/database.types';

export default function TestIntegrationComponent() {
  const leadService = new LeadService();
  const appointmentService = new AppointmentService();
  const highLevelService = new HighLevelService();
  
  const [testLead, setTestLead] = useState<Lead | null>(null);
  const [testResults, setTestResults] = useState<Array<{ step: string; success: boolean; message: string }>>([]);
  const [testing, setTesting] = useState(false);
  
  // Test form data
  const [email, setEmail] = useState('test@example.com');
  const [phone, setPhone] = useState('555-123-4567');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  
  async function runIntegrationTest() {
    setTesting(true);
    setTestResults([]);
    setTestLead(null);
    
    try {
      // Step 1: Create or find lead
      addTestResult('Creating/finding lead...', true, 'In progress');
      
      const lead = await leadService.findOrCreateLead({
        email,
        phone,
        firstName,
        lastName,
        leadSource: 'test'
      });
      
      setTestLead(lead);
      updateTestResult(0, true, `Lead created/found: ${lead.id}`);
      
      // Step 2: Track activity
      addTestResult('Tracking lead activity...', true, 'In progress');
      
      await leadService.trackActivity({
        leadId: lead.id,
        activityType: 'test_integration',
        activityData: { test: true }
      });
      
      updateTestResult(1, true, 'Activity tracked successfully');
      
      // Step 3: Sync with HighLevel
      addTestResult('Syncing contact with HighLevel...', true, 'In progress');
      
      try {
        const contactId = await highLevelService.syncContact({
          leadId: lead.id,
          email: lead.email,
          phone: lead.phone || undefined,
          firstName: lead.first_name || undefined,
          lastName: lead.last_name || undefined,
          tags: ['test-integration']
        });
        
        updateTestResult(2, true, `HighLevel contact synced: ${contactId}`);
      } catch (error: any) {
        updateTestResult(2, false, `HighLevel sync failed: ${error.message}`);
      }
      
      // Step 4: Create test appointment
      addTestResult('Creating test appointment...', true, 'In progress');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const appointment = await appointmentService.createAppointment({
        leadId: lead.id,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00 AM',
        bookingSource: 'test',
        formData: { test: true }
      });
      
      updateTestResult(3, true, `Appointment created: ${appointment.id}`);
      
      // Step 5: Sync appointment with HighLevel
      if (lead.highlevel_contact_id) {
        addTestResult('Syncing appointment with HighLevel...', true, 'In progress');
        
        try {
          const endTime = new Date(tomorrow);
          endTime.setMinutes(endTime.getMinutes() + 30);
          
          const hlAppointmentId = await highLevelService.createAppointment({
            appointmentId: appointment.id,
            contactId: lead.highlevel_contact_id,
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
            title: 'Test Integration Appointment'
          });
          
          updateTestResult(4, true, `HighLevel appointment created: ${hlAppointmentId}`);
        } catch (error: any) {
          updateTestResult(4, false, `HighLevel appointment sync failed: ${error.message}`);
        }
      }
      
      // Step 6: Test calendar availability
      addTestResult('Testing calendar availability...', true, 'In progress');
      
      try {
        const slots = await highLevelService.getAvailability({
          date: tomorrow.toISOString().split('T')[0]
        });
        
        updateTestResult(5, true, `Found ${slots.length} available slots`);
      } catch (error: any) {
        updateTestResult(5, false, `Availability check failed: ${error.message}`);
      }
      
    } catch (error: any) {
      console.error('Integration test error:', error);
      addTestResult('Unexpected error', false, error.message);
    } finally {
      setTesting(false);
    }
  }
  
  function addTestResult(step: string, success: boolean, message: string) {
    setTestResults(prev => [...prev, { step, success, message }]);
  }
  
  function updateTestResult(index: number, success: boolean, message: string) {
    setTestResults(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], success, message };
      return updated;
    });
  }
  
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Data</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={testing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={testing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={testing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={testing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
        
        <button
          onClick={runIntegrationTest}
          disabled={testing}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {testing ? 'Running Test...' : 'Run Integration Test'}
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {result.message === 'In progress' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : result.success ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{result.step}</p>
                  <p className="text-sm text-gray-500">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {testLead && (
        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Test Lead Details</h3>
          <pre className="text-xs bg-white p-4 rounded border border-gray-200 overflow-x-auto">
            {JSON.stringify(testLead, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}