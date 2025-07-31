import React, { useState, useEffect } from 'react';
import { 
  calculateTaxSavings, 
  formatCurrency, 
  stateNames,
  type TaxCalculationInput,
  type TaxCalculationResult 
} from '../../lib/calculators/taxCalculations';
import AppointmentBooking from '../booking/AppointmentBooking';
import type { Appointment, BookingError } from '../../lib/types/highlevel';
import { trackBookingEvent } from '../../lib/analytics/bookingAnalytics';

interface CalculatorProps {
  onLeadCapture?: (data: LeadData) => void;
}

interface LeadData {
  email: string;
  phone?: string;
  name?: string;
  calculationResult: TaxCalculationResult;
  propertyDetails: TaxCalculationInput;
}

export const TaxSavingsCalculator: React.FC<CalculatorProps> = ({ onLeadCapture }) => {
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<TaxCalculationInput>({
    salePrice: 0,
    purchasePrice: 0,
    improvements: 0,
    closingCosts: 0,
    state: 'CA',
    filingStatus: 'married_joint',
    income: 250000
  });
  
  // Lead capture state
  const [leadData, setLeadData] = useState({
    email: '',
    phone: '',
    name: ''
  });

  // Calculate results whenever form data changes
  useEffect(() => {
    if (formData.salePrice > 0 && formData.purchasePrice > 0) {
      const calculationResult = calculateTaxSavings(formData);
      setResult(calculationResult);
    }
  }, [formData]);

  const handleInputChange = (field: keyof TaxCalculationInput, value: string | number) => {
    // Track calculator start on first interaction
    if (formData.salePrice === 0 && formData.purchasePrice === 0) {
      if (typeof window !== 'undefined' && window.trackCalculatorStart) {
        window.trackCalculatorStart();
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: field === 'state' || field === 'filingStatus' ? value : Number(value)
    }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (result && result.taxSavings > 0) {
      setShowEmailCapture(true);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Track calculator completion and lead capture
      if (result && typeof window !== 'undefined') {
        if (window.trackCalculatorComplete) {
          window.trackCalculatorComplete(result.taxSavings);
        }
        if (window.trackLeadCapture) {
          window.trackLeadCapture('1031 Tax Calculator', result.taxSavings);
        }
        if (window.trackHighLevelEvent) {
          window.trackHighLevelEvent('lead_captured', {
            source: '1031 Tax Calculator',
            value: result.taxSavings,
            type: 'calculator',
            formName: 'Tax Savings Calculator',
            calculatorSavings: result.taxSavings
          });
        }
      }
      
      // Call the parent's lead capture handler
      if (onLeadCapture && result) {
        await onLeadCapture({
          ...leadData,
          calculationResult: result,
          propertyDetails: formData
        });
      }
      
      setShowEmailCapture(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error capturing lead:', error);
      // Still show results even if lead capture fails
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setShowEmailCapture(false);
    setShowBooking(false);
    setFormData({
      salePrice: 0,
      purchasePrice: 0,
      improvements: 0,
      closingCosts: 0,
      state: 'CA',
      filingStatus: 'married_joint',
      income: 250000
    });
    setLeadData({
      email: '',
      phone: '',
      name: ''
    });
    setResult(null);
  };

  const handleStartBooking = () => {
    // Track booking flow start
    if (typeof window !== 'undefined' && window.trackContentEngagement) {
      window.trackContentEngagement('booking_flow_started', 'tax_calculator_booking');
    }
    
    setShowBooking(true);
  };

  const handleBookingSuccess = (appointment: Appointment) => {
    // Track successful booking
    if (typeof window !== 'undefined') {
      if (window.trackContentEngagement) {
        window.trackContentEngagement('appointment_booked', 'tax_calculator_success');
      }
      if (window.trackHighLevelEvent) {
        window.trackHighLevelEvent('appointment_booked', {
          source: '1031 Tax Calculator',
          appointmentId: appointment.highlevelAppointmentId,
          value: appointment.taxSavingsAmount || 0,
          type: 'appointment_from_calculator'
        });
      }
    }
    
    // Keep booking visible to show confirmation
    console.log('Appointment booked successfully:', appointment);
  };

  const handleBookingError = (error: BookingError) => {
    // Track booking error
    if (typeof window !== 'undefined' && window.trackContentEngagement) {
      window.trackContentEngagement('booking_error', 'tax_calculator_booking');
    }
    
    console.error('Booking error:', error);
    // Keep booking visible to show error state
  };

  const handleBookingCancel = () => {
    // Track booking abandonment
    trackBookingEvent.bookingAbandoned('user_cancelled', 'user_clicked_cancel');
    setShowBooking(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        1031 Tax Savings Calculator
      </h2>
      <p className="text-gray-600 mb-8">
        See how much you can save in capital gains taxes with a 1031 exchange
      </p>

      {!showResults && !showEmailCapture && (
        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Property Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1,000,000"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="600,000"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Improvements Made
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.improvements || ''}
                    onChange={(e) => handleInputChange('improvements', e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.closingCosts || ''}
                    onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(stateNames).map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filing Status
                </label>
                <select
                  value={formData.filingStatus}
                  onChange={(e) => handleInputChange('filingStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="married_joint">Married Filing Jointly</option>
                  <option value="married_separate">Married Filing Separately</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.income || ''}
                    onChange={(e) => handleInputChange('income', e.target.value)}
                    className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="250,000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Results */}
          {result && result.capitalGain > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Estimated Tax Savings:</span>{' '}
                {formatCurrency(result.taxSavings)}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
          >
            Calculate My Savings
          </button>
        </form>
      )}

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <div className="bg-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Your Potential Tax Savings: {result && formatCurrency(result.taxSavings)}
          </h3>
          <p className="text-gray-600 mb-6">
            Get your detailed tax savings report and learn how to start your 1031 exchange.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={leadData.name}
                onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={leadData.phone}
                onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Get My Full Report'}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your information will never be shared.
            </p>
          </form>
        </div>
      )}

      {/* Booking Flow */}
      {showBooking && result && leadData.email && (
        <AppointmentBooking
          leadData={{
            email: leadData.email,
            phone: leadData.phone,
            firstName: leadData.name.split(' ')[0] || 'Valued',
            lastName: leadData.name.split(' ').slice(1).join(' ') || 'Customer',
            taxSavingsAmount: result.taxSavings,
            propertySalePrice: formData.salePrice,
            propertyDetails: formData
          }}
          onSuccess={handleBookingSuccess}
          onError={handleBookingError}
          onCancel={handleBookingCancel}
          options={{
            timezone: 'America/New_York',
            prefetchDays: 14,
            minBookingHours: 2,
            maxBookingDays: 60
          }}
        />
      )}

      {/* Results Display */}
      {showResults && result && !showBooking && (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              Your 1031 Exchange Tax Savings
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(result.taxSavings)}
            </p>
            <p className="text-sm text-green-700 mt-2">
              That's {result.percentageSaved.toFixed(1)}% of your tax liability deferred!
            </p>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Capital Gain</span>
                <span className="font-medium">{formatCurrency(result.capitalGain)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Federal Capital Gains Tax</span>
                <span className="font-medium">{formatCurrency(result.federalTax)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">State Tax ({stateNames[formData.state]})</span>
                <span className="font-medium">{formatCurrency(result.stateTax)}</span>
              </div>
              {result.netInvestmentIncomeTax > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Net Investment Income Tax (3.8%)</span>
                  <span className="font-medium">{formatCurrency(result.netInvestmentIncomeTax)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total Tax Without 1031</span>
                <span className="text-red-600">{formatCurrency(result.totalTaxWithout1031)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total Tax With 1031</span>
                <span className="text-green-600">{formatCurrency(result.totalTaxWith1031)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Schedule a free consultation with our 1031 experts</li>
              <li>Identify your replacement property within 45 days</li>
              <li>Complete your exchange within 180 days</li>
              <li>Defer {formatCurrency(result.taxSavings)} in taxes!</li>
            </ol>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartBooking}
              className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Calculate Again
            </button>
          </div>

          {/* Alternative Contact Option */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              Prefer to speak with us directly?
            </p>
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => {
                if (typeof window !== 'undefined' && window.trackContentEngagement) {
                  window.trackContentEngagement('cta_click', 'calculator_contact_page');
                }
              }}
            >
              Visit our contact page →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};