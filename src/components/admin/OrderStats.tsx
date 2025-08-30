import React from 'react';

interface OrderStatsProps {
  stats: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    avgLeadScore: number;
    statusBreakdown: {
      new: number;
      processing: number;
      synced: number;
      error: number;
    };
    urgencyBreakdown: {
      urgent: number;
      timeSensitive: number;
      gettingReady: number;
      planning: number;
    };
  };
}

export const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'timeSensitive': return 'text-orange-600 bg-orange-100';
      case 'gettingReady': return 'text-yellow-600 bg-yellow-100';
      case 'planning': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'synced': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Submissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-600">Today: {stats.today}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-600">This Week: {stats.thisWeek}</span>
        </div>
      </div>

      {/* Average Lead Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgLeadScore}</p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{width: `${stats.avgLeadScore}%`}}
            />
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">Status Distribution</p>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          {Object.entries(stats.statusBreakdown).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Urgency Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">Urgency Levels</p>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor('urgent')}`}>
              🚨 Urgent (2 weeks)
            </span>
            <span className="text-sm font-medium text-gray-900">{stats.urgencyBreakdown.urgent}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor('timeSensitive')}`}>
              ⚡ Time Sensitive
            </span>
            <span className="text-sm font-medium text-gray-900">{stats.urgencyBreakdown.timeSensitive}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor('gettingReady')}`}>
              📅 Getting Ready
            </span>
            <span className="text-sm font-medium text-gray-900">{stats.urgencyBreakdown.gettingReady}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor('planning')}`}>
              📊 Planning
            </span>
            <span className="text-sm font-medium text-gray-900">{stats.urgencyBreakdown.planning}</span>
          </div>
        </div>
      </div>
    </div>
  );
};