import React, { useState } from 'react';
import { LeadService } from '../../lib/services/lead.service';
import { AppointmentService } from '../../lib/services/appointment.service';

/**
 * Example contact form that integrates with the lead capture system
 * This shows how to update existing forms to use the new services
 */
export default function ContactFormExample() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const leadService = new LeadService();
  const appointmentService = new AppointmentService();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    
    try {
      // Step 1: Create or find lead
      const lead = await leadService.findOrCreateLead({
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        leadSource: 'contact-form' // Track where the lead came from
      });
      
      // Step 2: Track form submission activity
      await leadService.trackActivity({
        leadId: lead.id,
        activityType: 'form_submission',
        activityData: {
          formType: 'contact',
          message: formData.message,
          submittedAt: new Date().toISOString()
        }
      });
      
      // Step 3: If appointment requested, create it
      if (formData.preferredDate && formData.preferredTime) {
        const appointmentDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
        
        await appointmentService.createAppointment({
          leadId: lead.id,
          appointmentDate: appointmentDate.toISOString(),
          appointmentTime: formData.preferredTime,
          bookingSource: 'contact-form',
          formData: {
            message: formData.message
          }
        });
      }
      
      setResult({
        success: true,
        message: 'Thank you! We\'ll be in touch soon.'
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        preferredDate: '',
        preferredTime: ''
      });
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      setResult({
        success: false,
        message: 'Sorry, there was an error submitting your form. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Would you like to schedule a consultation? (Optional)
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              id="preferredDate"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <select
              id="preferredTime"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
        </div>
      </div>
      
      {result && (
        <div className={`p-4 rounded-md ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            result.success 
              ? 'text-green-800' 
              : 'text-red-800'
          }`}>
            {result.message}
          </p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Send Message'}
      </button>
    </form>
  );
}