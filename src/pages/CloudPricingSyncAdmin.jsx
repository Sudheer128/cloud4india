import React, { useState, useEffect, useCallback } from 'react';
import { getSyncStatus, triggerSync, clearCache } from '../services/cloud4indiaApi';

/**
 * Admin page for monitoring and managing Cloud4India API sync status
 */
export default function CloudPricingSyncAdmin() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch sync status
  const fetchStatus = useCallback(async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to fetch sync status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Handle manual sync
  const handleSync = async () => {
    if (syncing) return;

    setSyncing(true);
    setError(null);

    try {
      const result = await triggerSync();
      if (result.success) {
        // Refresh status after sync
        await fetchStatus();
      } else {
        setError(result.error || 'Sync failed');
      }
    } catch (err) {
      setError(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  // Handle clear cache
  const handleClearCache = () => {
    clearCache();
    alert('Local browser cache cleared. Next page load will fetch fresh data.');
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Calculate time ago
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cloud Pricing Sync Status</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manages cached data from Cloud4India API
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClearCache}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Browser Cache
          </button>
          <button
            onClick={handleSync}
            disabled={syncing || (syncStatus?.isRunning)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              syncing || syncStatus?.isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {syncing || syncStatus?.isRunning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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

      {/* Sync Overview Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sync Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Sync */}
            <div>
              <p className="text-sm font-medium text-gray-500">Last Sync</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(syncStatus?.lastSyncAt)}
              </p>
              {syncStatus?.lastSyncAt && (
                <p className="text-sm text-gray-500">{timeAgo(syncStatus?.lastSyncAt)}</p>
              )}
            </div>

            {/* Next Sync */}
            <div>
              <p className="text-sm font-medium text-gray-500">Next Scheduled Sync</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(syncStatus?.nextSyncAt)}
              </p>
              <p className="text-sm text-gray-500">
                Interval: {syncStatus?.syncInterval || '15 minutes'}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="flex items-center mt-1">
                {syncStatus?.isRunning ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing
                  </span>
                ) : syncStatus?.lastError ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Error
                  </span>
                ) : syncStatus?.lastSyncAt ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
              </div>
              {syncStatus?.progress && (
                <p className="text-sm text-gray-500 mt-1">{syncStatus.progress}</p>
              )}
              {syncStatus?.lastError && (
                <p className="text-sm text-red-600 mt-1">{syncStatus.lastError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cached Data Tables</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncStatus?.tables && Object.entries(syncStatus.tables).map(([tableName, tableData]) => (
                  <tr key={tableName} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {tableName.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="font-mono">{tableData.count?.toLocaleString() || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tableData.lastUpdated ? (
                        <span title={formatDate(tableData.lastUpdated)}>
                          {timeAgo(tableData.lastUpdated)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tableData.status)}`}>
                        {tableData.status || 'pending'}
                      </span>
                      {tableData.error && (
                        <p className="text-xs text-red-500 mt-1">{tableData.error}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-6 text-sm text-gray-500">
        <p>
          Last refreshed: {lastRefresh.toLocaleTimeString()}
          <button
            onClick={fetchStatus}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </p>
        <p className="mt-1">
          Data is automatically synced from the Cloud4India API every {syncStatus?.syncInterval || '15 minutes'}.
          The frontend fetches from this local cache for faster page loads.
        </p>
      </div>
    </div>
  );
}
