import React, { useState, useEffect, useCallback } from 'react';
import { CMS_URL } from '../utils/config';

const API_BASE_URL = CMS_URL;

/**
 * Admin page for configuring Cloud4India API settings and Pricing Settings
 */
export default function ApiConfigAdmin() {
  const [config, setConfig] = useState({
    name: 'Cloud4India API',
    api_base_url: 'https://portal.cloud4india.com/backend/api',
    api_key: '',
    default_rate_card: 'default',
    sync_interval_minutes: 15,
    is_enabled: true,
  });

  const [originalConfig, setOriginalConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Pricing settings state
  const [pricingSettings, setPricingSettings] = useState({
    gst_rate: 18,
    currency_rates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 },
    billing_discounts: { yearly: 0.9, 'bi-annually': 0.85, 'tri-annually': 0.8 },
    default_unit_rates: { cpu: 200, memory: 100, storage: 8, ip: 150 },
  });
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState(null);
  const [pricingError, setPricingError] = useState(null);

  // Rate cards state
  const [rateCards, setRateCards] = useState([]);
  const [rateCardsLoading, setRateCardsLoading] = useState(true);

  // Fetch current config
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/api-config`);
      if (!response.ok) throw new Error('Failed to fetch configuration');

      const data = await response.json();
      setConfig({
        name: data.name || 'Cloud4India API',
        api_base_url: data.api_base_url || 'https://portal.cloud4india.com/backend/api',
        api_key: '', // Don't populate - user must enter new key to change
        default_rate_card: data.default_rate_card || 'default',
        sync_interval_minutes: data.sync_interval_minutes || 15,
        is_enabled: data.is_enabled === 1 || data.is_enabled === true,
      });
      setOriginalConfig(data);
      setHasApiKey(data.has_api_key);
      setApiKeyMasked(data.api_key_masked || '');
      setTestResult(data.test_status ? {
        success: data.test_status === 'success',
        tested_at: data.last_tested_at,
      } : null);
      setError(null);
    } catch (err) {
      setError('Failed to load configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch rate cards from CMS cache
  const fetchRateCards = useCallback(async () => {
    try {
      setRateCardsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cloud-pricing/data`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setRateCards(data.rateCards || []);
    } catch (err) {
      console.error('Failed to load rate cards:', err);
    } finally {
      setRateCardsLoading(false);
    }
  }, []);

  // Fetch pricing settings
  const fetchPricingSettings = useCallback(async () => {
    try {
      setPricingLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cloud-pricing/pricing-settings`);
      if (!response.ok) throw new Error('Failed to fetch pricing settings');
      const data = await response.json();
      setPricingSettings(data);
      setPricingError(null);
    } catch (err) {
      setPricingError('Failed to load pricing settings');
      console.error(err);
    } finally {
      setPricingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchPricingSettings();
    fetchRateCards();
  }, [fetchConfig, fetchPricingSettings, fetchRateCards]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSuccessMessage(null);
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: config.name,
        api_base_url: config.api_base_url,
        default_rate_card: config.default_rate_card,
        sync_interval_minutes: parseInt(config.sync_interval_minutes),
        is_enabled: config.is_enabled,
      };

      // Only include API key if user entered a new one
      if (config.api_key) {
        payload.api_key = config.api_key;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/api-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save configuration');

      setSuccessMessage('Configuration saved successfully');
      setConfig(prev => ({ ...prev, api_key: '' }));
      await fetchConfig(); // Refresh to get updated masked key
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle trigger sync
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cloud-pricing/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      setSyncResult(result);
      if (result.success) {
        // Refresh rate cards after sync
        await fetchRateCards();
      }
    } catch (err) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  // Handle test connection
  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const payload = {
        api_base_url: config.api_base_url,
      };

      // Include API key if user entered a new one
      if (config.api_key) {
        payload.api_key = config.api_key;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/api-config/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  // Handle pricing settings save
  const handleSavePricing = async (e) => {
    e.preventDefault();
    setPricingSaving(true);
    setPricingError(null);
    setPricingSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/pricing-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingSettings),
      });

      if (!response.ok) throw new Error('Failed to save pricing settings');

      setPricingSuccess('Pricing settings saved successfully');
      setTimeout(() => setPricingSuccess(null), 3000);
    } catch (err) {
      setPricingError(err.message);
    } finally {
      setPricingSaving(false);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Configuration</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure Cloud4India API settings for pricing data synchronization
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">API Sync Status</h3>
                <p className="text-sm text-gray-500">Enable or disable automatic API synchronization</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_enabled"
                  checked={config.is_enabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  {config.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* API Base URL */}
            <div>
              <label htmlFor="api_base_url" className="block text-sm font-medium text-gray-700 mb-1">
                API Base URL
              </label>
              <input
                type="url"
                id="api_base_url"
                name="api_base_url"
                value={config.api_base_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://portal.cloud4india.com/backend/api"
              />
              <p className="mt-1 text-sm text-gray-500">The base URL for the Cloud4India API</p>
            </div>

            {/* API Key */}
            <div>
              <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="api_key"
                  name="api_key"
                  value={config.api_key}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder={hasApiKey ? 'Enter new key to change' : 'Enter API key'}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {hasApiKey && (
                <p className="mt-1 text-sm text-gray-500">
                  Current key: {apiKeyMasked} (leave blank to keep existing key)
                </p>
              )}
            </div>

            {/* Default Rate Card */}
            <div>
              <label htmlFor="default_rate_card" className="block text-sm font-medium text-gray-700 mb-1">
                Default Rate Card
              </label>
              {rateCardsLoading ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-sm">
                  Loading rate cards...
                </div>
              ) : rateCards.length > 0 ? (
                <select
                  id="default_rate_card"
                  name="default_rate_card"
                  value={config.default_rate_card}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {rateCards.map(rc => (
                    <option key={rc.id || rc.slug} value={rc.slug}>
                      {rc.name} {rc.is_default ? '(Default)' : ''} {rc.description ? `- ${rc.description}` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="default_rate_card"
                  name="default_rate_card"
                  value={config.default_rate_card}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="default"
                />
              )}
              <p className="mt-1 text-sm text-gray-500">
                The rate card determines pricing tiers. Changing this will affect all pricing data on next sync.
                {rateCards.length > 0 && (
                  <span className="ml-1 text-blue-600">{rateCards.length} rate card(s) available.</span>
                )}
              </p>
            </div>

            {/* Sync Interval */}
            <div>
              <label htmlFor="sync_interval_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Sync Interval (minutes)
              </label>
              <input
                type="number"
                id="sync_interval_minutes"
                name="sync_interval_minutes"
                value={config.sync_interval_minutes}
                onChange={handleChange}
                min="1"
                max="1440"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">How often to automatically sync data from the API (1-1440 minutes)</p>
            </div>
          </div>

          {/* Test Connection Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Test Connection</h3>
                <p className="text-xs text-gray-500">Verify API credentials are working</p>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  testing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {testing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testing...
                  </span>
                ) : (
                  'Test Connection'
                )}
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`mt-3 p-3 rounded-lg ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center">
                  {testResult.success ? (
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                    {testResult.success ? testResult.message || 'Connection successful' : testResult.error || 'Connection failed'}
                  </span>
                </div>
                {testResult.tested_at && (
                  <p className="text-xs text-gray-600 mt-1 ml-7">
                    Tested: {formatDate(testResult.tested_at)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sync Now Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Sync Data</h3>
                <p className="text-xs text-gray-500">Trigger a manual data sync (required after changing rate card)</p>
              </div>
              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={syncing}
                className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  syncing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {syncing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </span>
                ) : (
                  'Sync Now'
                )}
              </button>
            </div>

            {/* Sync Result */}
            {syncResult && (
              <div className={`mt-3 p-3 rounded-lg ${syncResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center">
                  {syncResult.success ? (
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={syncResult.success ? 'text-green-800' : 'text-red-800'}>
                    {syncResult.success
                      ? `Sync completed: ${syncResult.counts?.services || 0} services, ${syncResult.counts?.plans || 0} plans, ${syncResult.counts?.unitPricings || 0} unit pricings`
                      : syncResult.error || 'Sync failed'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={fetchConfig}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ============================== */}
      {/* PRICING SETTINGS SECTION */}
      {/* ============================== */}
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure GST rate, currency conversion rates, billing discounts, and default unit rates
        </p>
      </div>

      {pricingError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{pricingError}</span>
          </div>
        </div>
      )}

      {pricingSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">{pricingSuccess}</span>
          </div>
        </div>
      )}

      {pricingLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <form onSubmit={handleSavePricing}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 space-y-6">

              {/* GST Rate */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Tax Settings</h3>
                <p className="text-sm text-gray-500 mb-4">Configure applicable tax rates</p>
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    value={pricingSettings.gst_rate}
                    onChange={(e) => setPricingSettings(prev => ({ ...prev, gst_rate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Applied to all estimates and invoices</p>
                </div>
              </div>

              {/* Currency Conversion Rates */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Currency Conversion Rates</h3>
                <p className="text-sm text-gray-500 mb-4">Rates relative to INR (1 INR = X foreign currency)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['USD', 'EUR', 'GBP'].map(curr => (
                    <div key={curr}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '\u20AC' : '\u00A3'})
                      </label>
                      <input
                        type="number"
                        value={pricingSettings.currency_rates[curr] || 0}
                        onChange={(e) => setPricingSettings(prev => ({
                          ...prev,
                          currency_rates: { ...prev.currency_rates, [curr]: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        step="0.0001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        1 INR = {pricingSettings.currency_rates[curr] || 0} {curr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Discounts */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Billing Cycle Discounts</h3>
                <p className="text-sm text-gray-500 mb-4">Discount multiplier for long-term billing (1.0 = no discount, 0.9 = 10% off)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'yearly', label: 'Yearly' },
                    { key: 'bi-annually', label: 'Bi-Annual (2yr)' },
                    { key: 'tri-annually', label: 'Tri-Annual (3yr)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="number"
                        value={pricingSettings.billing_discounts[key] || 1}
                        onChange={(e) => setPricingSettings(prev => ({
                          ...prev,
                          billing_discounts: { ...prev.billing_discounts, [key]: parseFloat(e.target.value) || 1 }
                        }))}
                        min="0"
                        max="1"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        {Math.round((1 - (pricingSettings.billing_discounts[key] || 1)) * 100)}% discount
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Default Unit Rates */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Default Unit Rates (Fallback)</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Used when API unit pricing is unavailable. Active rates come from the Cloud4India API.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'cpu', label: 'CPU (per vCPU/mo)', unit: '/vCPU' },
                    { key: 'memory', label: 'Memory (per GB/mo)', unit: '/GB' },
                    { key: 'storage', label: 'Storage (per GB/mo)', unit: '/GB' },
                    { key: 'ip', label: 'Public IP (per IP/mo)', unit: '/IP' },
                  ].map(({ key, label, unit }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">\u20B9</span>
                        <input
                          type="number"
                          value={pricingSettings.default_unit_rates[key] || 0}
                          onChange={(e) => setPricingSettings(prev => ({
                            ...prev,
                            default_unit_rates: { ...prev.default_unit_rates, [key]: parseFloat(e.target.value) || 0 }
                          }))}
                          min="0"
                          step="0.5"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{unit}/month</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pricing Form Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={fetchPricingSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={pricingSaving}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  pricingSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {pricingSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Pricing Settings'
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">About Configuration</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>API configuration changes take effect immediately for new sync operations.</li>
          <li>Pricing settings (GST, currency rates, discounts) take effect on next page load.</li>
          <li>Default unit rates are used as fallback when the Cloud4India API unit pricing is unavailable.</li>
          <li>Currency rates define the conversion factor from INR to the target currency.</li>
        </ul>
      </div>
    </div>
  );
}
