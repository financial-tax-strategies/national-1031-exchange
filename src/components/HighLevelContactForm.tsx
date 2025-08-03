import React, { useState } from 'react';
import type { ContactFormData } from '../services/types/common';
import { leadCaptureService } from '../services/leadCapture';

export default function HighLevelContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    exchangeType: '',
    timeline: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Track form submission
      if (window.trackFormSubmit) {
        window.trackFormSubmit('contact_form');
      }

      // Create or update lead in database and HighLevel
      await leadCaptureService.createLead({
        email: formData.email,
        phone: formData.phone || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        leadSource: 'contact_form',
        metadata: {
          exchangeType: formData.exchangeType,
          timeline: formData.timeline,
          message: formData.message
        }
      });

      // Submit to Netlify Forms for backup
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'contact');
      Object.entries(formData).forEach(([key, value]) => {
        netlifyFormData.append(key, value);
      });

      await fetch('/', {
        method: 'POST',
        body: netlifyFormData
      });

      // Redirect to thank you page
      window.location.href = '/thank-you';
    } catch (err) {
      console.error('Form submission error:', err);
      setError('There was an error submitting your form. Please try again or call us directly.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input 
            type="tel" 
            id="phone" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="exchangeType" className="block text-sm font-medium text-gray-700 mb-2">
          Exchange Type Interest
        </label>
        <select 
          id="exchangeType" 
          name="exchangeType"
          value={formData.exchangeType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option</option>
          <option value="delayed">Delayed Exchange</option>
          <option value="reverse">Reverse Exchange</option>
          <option value="improvement">Improvement Exchange</option>
          <option value="partial">Partial Exchange</option>
          <option value="not-sure">Not Sure Yet</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
          When are you planning to sell?
        </label>
        <select 
          id="timeline" 
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select timeline</option>
          <option value="immediate">Already under contract</option>
          <option value="30-days">Within 30 days</option>
          <option value="90-days">Within 90 days</option>
          <option value="6-months">Within 6 months</option>
          <option value="planning">Just planning ahead</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          How can we help you? *
        </label>
        <textarea 
          id="message" 
          name="message" 
          rows={4} 
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <button 
          type="submit"
          disabled={submitting}
          className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 ${
            submitting 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        By submitting this form, you agree to our privacy policy and consent to receive 
        communications about 1031 exchanges.
      </p>
    </form>
  );
}