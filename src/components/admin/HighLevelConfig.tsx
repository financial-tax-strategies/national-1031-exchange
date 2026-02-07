import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../../lib/services/database.service';
import { HighLevelService } from '../../lib/services/highlevel.service';
import type { HighLevelConfig } from '../../lib/types/database.types';

export default function HighLevelConfigComponent() {
  const [config, setConfig] = useState<HighLevelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Form fields
  const [apiKey, setApiKey] = useState('');
  const [locationId, setLocationId] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const db = DatabaseService.getInstance();
  const highLevel = new HighLevelService();
  
  useEffect(() => {
    loadConfig();
  }, [db]);
  
  async function loadConfig() {
    try {
      const { data } = await db.getTable('highlevel_config')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (data) {
        setConfig(data);
        setApiKey(data.api_key);
        setLocationId(data.location_id);
        setCalendarId(data.calendar_id);
        setWebhookSecret(data.webhook_secret || '');
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function saveConfig(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);
    
    try {
      const configData = {
        api_key: apiKey,
        location_id: locationId,
        calendar_id: calendarId,
        webhook_secret: webhookSecret,
        webhook_url: `${window.location.origin}/api/webhooks/highlevel`,
        timezone: 'America/New_York',
        is_active: isActive
      };
      
      if (config) {
        // Update existing config
        const { error } = await db.getTable('highlevel_config')
          .update(configData)
          .eq('id', config.id);
        
        if (error) throw error;
      } else {
        // Create new config
        const { data, error } = await db.getTable('highlevel_config')
          .insert(configData)
          .select()
          .single();
        
        if (error) throw error;
        setConfig(data);
      }
      
      setTestResult({ success: true, message: 'Configuration saved successfully!' });
    } catch (error) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setSaving(false);
    }
  }
  
  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Save config first
      await saveConfig(new Event('submit') as React.FormEvent);
      
      if (!testResult?.success) return;
      
      // Test API connection by fetching calendar slots
      const testDate = new Date().toISOString().split('T')[0];
      const slots = await highLevel.getAvailability({ date: testDate });
      
      setTestResult({ 
        success: true, 
        message: `Connection successful! Found ${slots.length} available slots for today.` 
      });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setTesting(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <form onSubmit={saveConfig} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your HighLevel API Key"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get this from HighLevel Settings → Business Profile → API Key
          </p>
        </div>
        
        <div>
          <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-1">
            Location ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your HighLevel Location ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            Found in HighLevel Settings → Business Profile
          </p>
        </div>
        
        <div>
          <label htmlFor="calendarId" className="block text-sm font-medium text-gray-700 mb-1">
            Calendar ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="calendarId"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your HighLevel Calendar ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            Found in HighLevel Calendars → Select Calendar → Settings
          </p>
        </div>
        
        <div>
          <label htmlFor="webhookSecret" className="block text-sm font-medium text-gray-700 mb-1">
            Webhook Secret (Optional)
          </label>
          <input
            type="password"
            id="webhookSecret"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Webhook verification secret"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used to verify webhook requests are from HighLevel
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Configuration is active
          </label>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Webhook URL</h3>
        <p className="text-sm text-yellow-700 mb-2">
          Add this URL to your HighLevel webhooks:
        </p>
        <code className="block bg-white px-3 py-2 rounded border border-yellow-300 text-xs break-all">
          {window.location.origin}/api/webhooks/highlevel
        </code>
      </div>
      
      {testResult && (
        <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {testResult.message}
          </p>
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || testing}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        
        <button
          type="button"
          onClick={testConnection}
          disabled={saving || testing || !apiKey || !locationId || !calendarId}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </form>
  );
}