// ============================================
// HighLevel Widget Component (Alternative Approach)
// National 1031 Center - Iframe Integration
// ============================================

import React, { useEffect, useState } from 'react';

interface HighLevelWidgetProps {
  widgetUrl?: string;
  height?: string;
  onLoad?: () => void;
  className?: string;
}

export const HighLevelWidget: React.FC<HighLevelWidgetProps> = ({
  // Default to your calendar widget URL
  widgetUrl = 'https://links.toptaxstrategies.com/widget/bookings/deferthegainstax/1031-exchange-consultation',
  height = '800px',
  onLoad,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for messages from the iframe (if HighLevel sends any)
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the expected origin
      if (event.origin !== 'https://links.toptaxstrategies.com') return;
      
      console.log('Message from HighLevel widget:', event.data);
      
      // Handle specific message types if needed
      if (event.data.type === 'booking-completed') {
        // Handle booking completion
        console.log('Booking completed:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className={`highlevel-widget-container ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Loading calendar...</span>
        </div>
      )}
      
      <iframe
        src={widgetUrl}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        onLoad={handleIframeLoad}
        className={`highlevel-booking-widget ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        title="Book Your 1031 Exchange Consultation"
        allow="payment"
      />
      
      <style jsx>{`
        .highlevel-widget-container {
          position: relative;
          width: 100%;
          min-height: ${height};
        }
        
        .highlevel-booking-widget {
          border: none;
          width: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default HighLevelWidget;