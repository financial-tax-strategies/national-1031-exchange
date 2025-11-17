/**
 * FIXED VERSION - Step 6: Exchange Goals
 *
 * Critical Fix: Updated validation logic to properly check dropdown selections
 * Issue: Continue button was staying disabled even when all fields were filled
 *
 * Replace your existing Step 6 component with this fixed version
 */

import { useState, useEffect } from 'react';

interface ExchangeGoalsStepProps {
  formData: {
    replacementPropertyStatus?: string;
    exchangeType?: string;
    cashOut?: string;
    dstInterest?: string;
  };
  onUpdate: (data: Partial<typeof formData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ExchangeGoalsStep({
  formData,
  onUpdate,
  onContinue,
  onBack
}: ExchangeGoalsStepProps) {
  // FIXED: Proper validation logic that excludes default "Select..." values
  const isValid = Boolean(
    formData.replacementPropertyStatus &&
    !formData.replacementPropertyStatus.toLowerCase().includes('select') &&
    formData.exchangeType &&
    !formData.exchangeType.toLowerCase().includes('select') &&
    formData.cashOut &&
    !formData.cashOut.toLowerCase().includes('select') &&
    formData.dstInterest &&
    !formData.dstInterest.toLowerCase().includes('select')
  );

  // Debug logging (remove after fix is verified)
  useEffect(() => {
    console.log('Step 6 Validation:', {
      replacementPropertyStatus: formData.replacementPropertyStatus,
      exchangeType: formData.exchangeType,
      cashOut: formData.cashOut,
      dstInterest: formData.dstInterest,
      isValid
    });
  }, [formData, isValid]);

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Exchange Strategy</h2>
        <p className="mt-2 text-gray-600">What are you looking to accomplish?</p>
      </div>

      {/* Replacement Property Status */}
      <div>
        <label htmlFor="replacementPropertyStatus" className="block text-sm font-medium text-gray-700 mb-2">
          Have you identified replacement property? *
        </label>
        <select
          id="replacementPropertyStatus"
          name="replacementPropertyStatus"
          value={formData.replacementPropertyStatus || ''}
          onChange={(e) => handleFieldChange('replacementPropertyStatus', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select status...</option>
          <option value="Yes, specific property identified">Yes, specific property identified</option>
          <option value="Yes, multiple properties identified">Yes, multiple properties identified</option>
          <option value="No, still searching">No, still searching</option>
          <option value="Need help finding properties">Need help finding properties</option>
        </select>
      </div>

      {/* Exchange Type */}
      <div>
        <label htmlFor="exchangeType" className="block text-sm font-medium text-gray-700 mb-2">
          What type of exchange are you considering? *
        </label>
        <select
          id="exchangeType"
          name="exchangeType"
          value={formData.exchangeType || ''}
          onChange={(e) => handleFieldChange('exchangeType', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select exchange type...</option>
          <option value="Standard Delayed Exchange">Standard Delayed Exchange</option>
          <option value="Reverse Exchange (buy first)">Reverse Exchange (buy first)</option>
          <option value="Improvement/Construction Exchange">Improvement/Construction Exchange</option>
          <option value="Not sure - need guidance">Not sure - need guidance</option>
        </select>
        <p className="mt-1 text-sm text-gray-600">
          Not sure? Most exchanges are standard delayed exchanges.
        </p>

        {/* Show info for selected exchange type */}
        {formData.exchangeType === 'Standard Delayed Exchange' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Standard Delayed Exchange</h4>
            <p className="text-sm text-blue-800">
              The most common type. You sell first, then have 45 days to identify and 180 days to purchase replacement property.
            </p>
          </div>
        )}
      </div>

      {/* Cash Out */}
      <div>
        <label htmlFor="cashOut" className="block text-sm font-medium text-gray-700 mb-2">
          Do you need to take any cash out? *
        </label>
        <select
          id="cashOut"
          name="cashOut"
          value={formData.cashOut || ''}
          onChange={(e) => handleFieldChange('cashOut', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select option...</option>
          <option value="No cash out - full reinvestment">No cash out - full reinvestment</option>
          <option value="Minimal cash out (< $50k)">Minimal cash out (&lt; $50k)</option>
          <option value="Moderate cash out ($50k-$200k)">Moderate cash out ($50k-$200k)</option>
          <option value="Significant cash out (> $200k)">Significant cash out (&gt; $200k)</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
        <p className="mt-1 text-sm text-gray-600">
          Taking cash out will trigger taxes on that portion.
        </p>
      </div>

      {/* DST Interest */}
      <div>
        <label htmlFor="dstInterest" className="block text-sm font-medium text-gray-700 mb-2">
          Are you interested in Delaware Statutory Trust (DST) properties? *
        </label>
        <select
          id="dstInterest"
          name="dstInterest"
          value={formData.dstInterest || ''}
          onChange={(e) => handleFieldChange('dstInterest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select option...</option>
          <option value="Yes, interested in DST properties">Yes, interested in DST properties</option>
          <option value="No, traditional properties only">No, traditional properties only</option>
          <option value="Want to learn about both options">Want to learn about both options</option>
          <option value="Not familiar with DST properties">Not familiar with DST properties</option>
        </select>
        <p className="mt-1 text-sm text-gray-600">
          DST properties offer passive investment with no management responsibilities.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isValid
              ? 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>

      {/* Debug info - remove after fix is verified */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify({ formData, isValid }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
