import React, { useState, useMemo } from 'react';
import { OrderDetailModal } from './OrderDetailModal';

interface OrderSubmission {
  id: string;
  status: string;
  lead_score?: number;
  created_at: string;
  updated_at: string;
  // Form fields with 1031x_order_ prefix
  '1031x_order_first_name'?: string;
  '1031x_order_last_name'?: string;
  '1031x_order_email'?: string;
  '1031x_order_phone'?: string;
  '1031x_order_urgency_level'?: string;
  '1031x_order_property_address'?: string;
  '1031x_order_property_city'?: string;
  '1031x_order_property_state'?: string;
  '1031x_order_sale_price'?: number;
  '1031x_order_contract_status'?: string;
  '1031x_order_closing_date'?: string;
  highlevel_contact_id?: string;
  admin_notification_sent?: boolean;
  user_confirmation_sent?: boolean;
  webhook_sent?: boolean;
  error_message?: string;
  [key: string]: any;
}

interface OrderSubmissionsTableProps {
  orders: OrderSubmission[];
}

export const OrderSubmissionsTable: React.FC<OrderSubmissionsTableProps> = ({ orders: initialOrders }) => {
  const [orders] = useState<OrderSubmission[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'urgency'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order['1031x_order_first_name']?.toLowerCase().includes(searchLower) ||
          order['1031x_order_last_name']?.toLowerCase().includes(searchLower) ||
          order['1031x_order_email']?.toLowerCase().includes(searchLower) ||
          order['1031x_order_phone']?.includes(searchTerm) ||
          order['1031x_order_property_address']?.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(order => order['1031x_order_urgency_level'] === urgencyFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'score':
          comparison = (a.lead_score || 0) - (b.lead_score || 0);
          break;
        case 'urgency':
          const urgencyOrder = {
            'urgent_2_weeks': 0,
            'time_sensitive_1': 1,
            'getting_ready_1_3': 2,
            'planning_3_plus': 3
          };
          comparison = (urgencyOrder[a['1031x_order_urgency_level'] as keyof typeof urgencyOrder] || 4) - 
                      (urgencyOrder[b['1031x_order_urgency_level'] as keyof typeof urgencyOrder] || 4);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, urgencyFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      synced: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyMap = {
      'urgent_2_weeks': { label: '🚨 Urgent (2 weeks)', class: 'bg-red-100 text-red-800' },
      'time_sensitive_1': { label: '⚡ Time Sensitive', class: 'bg-orange-100 text-orange-800' },
      'getting_ready_1_3': { label: '📅 Getting Ready', class: 'bg-yellow-100 text-yellow-800' },
      'planning_3_plus': { label: '📊 Planning', class: 'bg-green-100 text-green-800' }
    };
    
    const config = urgencyMap[urgency as keyof typeof urgencyMap] || { label: urgency, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getLeadScoreBadge = (score: number) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    if (score >= 80) colorClass = 'bg-green-100 text-green-800';
    else if (score >= 60) colorClass = 'bg-yellow-100 text-yellow-800';
    else if (score >= 40) colorClass = 'bg-orange-100 text-orange-800';
    else colorClass = 'bg-red-100 text-red-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>
        {score}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Status', 'Lead Score', 'First Name', 'Last Name', 'Email', 'Phone',
      'Urgency', 'Property Address', 'City', 'State', 'Sale Price', 'Created At'
    ];
    
    // Helper function to escape CSV values
    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      // If contains comma, quote, or newline, wrap in quotes and escape quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...filteredOrders.map(order => [
        escapeCSV(order.id),
        escapeCSV(order.status),
        escapeCSV(order.lead_score || ''),
        escapeCSV(order['1031x_order_first_name'] || ''),
        escapeCSV(order['1031x_order_last_name'] || ''),
        escapeCSV(order['1031x_order_email'] || ''),
        escapeCSV(order['1031x_order_phone'] || ''),
        escapeCSV(order['1031x_order_urgency_level'] || ''),
        escapeCSV(order['1031x_order_property_address'] || ''),
        escapeCSV(order['1031x_order_property_city'] || ''),
        escapeCSV(order['1031x_order_property_state'] || ''),
        escapeCSV(order['1031x_order_sale_price'] || ''),
        escapeCSV(new Date(order.created_at).toLocaleString())
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="processing">Processing</option>
              <option value="synced">Synced</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          {/* Urgency Filter */}
          <div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Urgency</option>
              <option value="urgent_2_weeks">Urgent (2 weeks)</option>
              <option value="time_sensitive_1">Time Sensitive</option>
              <option value="getting_ready_1_3">Getting Ready</option>
              <option value="planning_3_plus">Planning</option>
            </select>
          </div>
          
          {/* Export Button */}
          <div>
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'urgency')}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="urgency">Sort by Urgency</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order['1031x_order_first_name']} {order['1031x_order_last_name']}
                      </div>
                      <div className="text-sm text-gray-500">{order['1031x_order_email']}</div>
                      <div className="text-sm text-gray-500">{order['1031x_order_phone']}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {order['1031x_order_property_address']}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order['1031x_order_property_city']}, {order['1031x_order_property_state']}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {order['1031x_order_sale_price'] && formatCurrency(order['1031x_order_sale_price'])}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order['1031x_order_urgency_level'] && getUrgencyBadge(order['1031x_order_urgency_level'])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.lead_score !== undefined && getLeadScoreBadge(order.lead_score)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(order.status)}
                      <div className="flex space-x-2 text-xs">
                        {order.admin_notification_sent && (
                          <span className="text-green-600" title="Admin notified">✉️</span>
                        )}
                        {order.user_confirmation_sent && (
                          <span className="text-green-600" title="User confirmed">📧</span>
                        )}
                        {order.highlevel_contact_id && (
                          <span className="text-green-600" title="Synced to HighLevel">🔄</span>
                        )}
                        {order.webhook_sent && (
                          <span className="text-green-600" title="Webhook sent">🔗</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(order.created_at).toLocaleDateString()}</div>
                    <div className="text-xs">{new Date(order.created_at).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};