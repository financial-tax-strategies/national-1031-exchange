import React, { useState, useEffect } from 'react';
import { 
  IDENTIFICATION_RULES, 
  validateIdentification,
  type Property, 
  type IdentificationRule 
} from '../../../lib/calculators/timelineCalculations';

interface PropertyTrackerProps {
  identificationDeadline: string;
  currentDate: Date;
  salePrice?: number;
}

export const PropertyTracker: React.FC<PropertyTrackerProps> = ({
  identificationDeadline,
  currentDate,
  salePrice = 0
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedRule, setSelectedRule] = useState<IdentificationRule>(IDENTIFICATION_RULES['3-property']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [salePriceInput, setSalePriceInput] = useState(salePrice);
  
  // New property form state
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    address: '',
    value: 0,
    notes: ''
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedProperties = localStorage.getItem('1031_properties');
    const savedRule = localStorage.getItem('1031_rule');
    const savedSalePrice = localStorage.getItem('1031_sale_price');
    
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    }
    if (savedRule && IDENTIFICATION_RULES[savedRule]) {
      setSelectedRule(IDENTIFICATION_RULES[savedRule]);
    }
    if (savedSalePrice) {
      setSalePriceInput(parseFloat(savedSalePrice));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('1031_properties', JSON.stringify(properties));
    localStorage.setItem('1031_rule', selectedRule.type);
    localStorage.setItem('1031_sale_price', salePriceInput.toString());
  }, [properties, selectedRule, salePriceInput]);

  const validation = validateIdentification(properties, selectedRule, salePriceInput);
  const identifiedCount = properties.filter(p => p.status === 'identified').length;
  const isDeadlinePassed = new Date(identificationDeadline) < currentDate;

  const handleAddProperty = () => {
    if (!newProperty.address) return;
    
    const property: Property = {
      id: Date.now().toString(),
      address: newProperty.address,
      identifiedDate: new Date().toISOString().split('T')[0],
      value: newProperty.value || 0,
      status: 'identified',
      notes: newProperty.notes
    };
    
    setProperties([...properties, property]);
    setNewProperty({ address: '', value: 0, notes: '' });
    setShowAddForm(false);
  };

  const handleRemoveProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Property['status']) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, status } : p
    ));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all properties?')) {
      setProperties([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Property Identification Tracker</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track your identified replacement properties and ensure compliance with IRS rules
          </p>
        </div>
        {properties.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sale Price Input (for 200% rule) */}
      <div className="mb-6">
        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
          Sale Price (for rule validation)
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            id="salePrice"
            value={salePriceInput}
            onChange={(e) => setSalePriceInput(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter sale price"
          />
        </div>
      </div>

      {/* Rule Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Identification Rule
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(IDENTIFICATION_RULES).map((rule) => (
            <button
              key={rule.type}
              onClick={() => setSelectedRule(rule)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRule.type === rule.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{rule.description}</h4>
              <p className="text-sm text-gray-600 mt-1">{rule.requirements}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Status */}
      <div className={`mb-6 p-4 rounded-lg ${
        validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          {validation.isValid ? (
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className={`font-semibold ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
            {validation.message}
          </span>
        </div>
      </div>

      {/* Property List */}
      <div className="space-y-4 mb-6">
        {properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No properties identified yet. Click "Add Property" to get started.
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className={`p-4 rounded-lg border ${
                property.status === 'identified' ? 'border-blue-200 bg-blue-50' :
                property.status === 'purchased' ? 'border-green-200 bg-green-50' :
                property.status === 'rejected' ? 'border-red-200 bg-red-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">{property.address}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>Value: ${property.value?.toLocaleString() || 'Not specified'}</span>
                    <span>•</span>
                    <span>Identified: {new Date(property.identifiedDate).toLocaleDateString()}</span>
                  </div>
                  {property.notes && (
                    <p className="text-sm text-gray-600 mt-2">{property.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={property.status}
                    onChange={(e) => handleUpdateStatus(property.id, e.target.value as Property['status'])}
                    className="text-sm px-2 py-1 border border-gray-300 rounded"
                    disabled={isDeadlinePassed}
                  >
                    <option value="potential">Potential</option>
                    <option value="identified">Identified</option>
                    <option value="purchased">Purchased</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <button
                    onClick={() => handleRemoveProperty(property.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={isDeadlinePassed}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Property Button/Form */}
      {!isDeadlinePassed && (
        <>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Property
            </button>
          ) : (
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-gray-900 mb-4">Add New Property</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main St, City, State ZIP"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Value
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={newProperty.value}
                      onChange={(e) => setNewProperty({ ...newProperty, value: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newProperty.notes}
                    onChange={(e) => setNewProperty({ ...newProperty, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Additional details about this property"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddProperty}
                    disabled={!newProperty.address}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    Add Property
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewProperty({ address: '', value: 0, notes: '' });
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Deadline Warning */}
      {isDeadlinePassed && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Identification deadline has passed.</strong> You can no longer add or modify properties.
          </p>
        </div>
      )}

      {/* Export Button */}
      {properties.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              const data = {
                rule: selectedRule.description,
                salePrice: salePriceInput,
                properties: properties.filter(p => p.status === 'identified'),
                exportDate: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `1031-identification-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="text-blue-600 hover:text-blue-700 underline text-sm"
          >
            Export Identification List
          </button>
        </div>
      )}
    </div>
  );
};