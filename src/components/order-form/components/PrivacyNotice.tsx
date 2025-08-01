// ============================================
// Privacy Notice Component
// National 1031 Center - Order Form UI
// ============================================

import React, { useState } from 'react';
import { isEncryptionSupported } from '../../../lib/utils/encryption';

// ============================================
// Component
// ============================================

export const PrivacyNotice: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const encryptionEnabled = isEncryptionSupported();
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg text-sm">
      <div className="flex items-start">
        <svg 
          className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-blue-900 font-medium mb-1">
            Your Information is Secure
          </p>
          <p className="text-blue-800">
            {encryptionEnabled ? (
              <>Your data is encrypted and saved locally in your browser. We never store sensitive information on our servers.</>
            ) : (
              <>Your progress is saved locally in your browser. We never store sensitive information on our servers.</>
            )}
          </p>
          
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-700 hover:text-blue-900 underline mt-2 text-sm"
          >
            {showDetails ? 'Hide' : 'Learn more about'} our security measures
          </button>
          
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Security Features:</h4>
              <ul className="space-y-1 text-blue-800">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>
                    {encryptionEnabled 
                      ? 'AES-256 encryption for all sensitive data'
                      : 'Secure browser storage for form progress'
                    }
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Data automatically expires after 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>No sensitive data transmitted until final submission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>HTTPS encryption for all data transmission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Compliant with data protection regulations</span>
                </li>
              </ul>
              
              {!encryptionEnabled && (
                <p className="mt-3 text-xs text-blue-700 italic">
                  Note: Your browser doesn't support advanced encryption features. 
                  Your data is still protected by browser security measures.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};