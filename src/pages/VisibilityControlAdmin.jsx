import React, { useState, useEffect, useCallback } from 'react';
import { CMS_URL } from '../utils/config';
import { 
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = CMS_URL;

/**
 * Admin page for managing global feature visibility
 * Controls showing/hiding main features across the entire website:
 * - Navbar menu items
 * - Homepage sections
 * - Footer links
 */
export default function VisibilityControlAdmin() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch features
  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/admin/global-features?t=${timestamp}`);
      
      if (!response.ok) throw new Error('Failed to fetch features');

      const data = await response.json();
      // Filter out 'home' - homepage should never be hidden
      const filteredData = data.filter(f => f.feature_name !== 'home');
      setFeatures(filteredData.sort((a, b) => a.display_order - b.display_order));
      setError(null);
    } catch (err) {
      setError('Failed to load features');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Toggle visibility
  const toggleVisibility = async (featureName, currentVisibility) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/global-features/${featureName}/toggle-visibility`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to toggle visibility');

      // Update local state
      setFeatures(features.map(f => 
        f.feature_name === featureName 
          ? { ...f, is_visible: currentVisibility ? 0 : 1 }
          : f
      ));

      const newState = currentVisibility ? 'hidden' : 'visible';
      setSuccessMessage(`${featureName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} is now ${newState}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Get affected areas for a feature
  const getAffectedAreas = (featureName) => {
    const areas = {
      home: ['Navbar'],
      about_us: ['Navbar', 'Footer'],
      marketplace: ['Navbar', 'Homepage Section', 'Footer'],
      products: ['Navbar', 'Homepage Section', 'Footer'],
      solutions: ['Navbar', 'Homepage Section', 'Footer'],
      pricing: ['Navbar', 'Footer'],
      price_estimator: ['Navbar'],
      contact_us: ['Navbar', 'Footer'],
    };
    return areas[featureName] || [];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Cog6ToothIcon className="w-8 h-8 text-saree-teal" />
          <h1 className="text-3xl font-bold text-gray-900">Global Feature Visibility</h1>
        </div>
        <p className="text-gray-600">
          Control which features appear across your entire website (Navbar, Homepage, Footer).
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Features List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Website Features</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use the toggle switches to show or hide features across your entire website
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {features.map((feature) => (
            <div
              key={feature.feature_name}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Left side: Feature info */}
                <div className="flex-1 min-w-0 mr-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.display_name}
                  </h3>
                  {feature.description && (
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  )}
                  
                  {/* Affected areas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Visible in:</span>
                    {getAffectedAreas(feature.feature_name).map((area, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side: Toggle switch */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-medium ${feature.is_visible ? 'text-gray-400' : 'text-gray-900'}`}>
                    Hidden
                  </span>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleVisibility(feature.feature_name, feature.is_visible)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-saree-teal focus:ring-offset-2 ${
                      feature.is_visible === 1
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={feature.is_visible === 1}
                    aria-label={`Toggle ${feature.display_name} visibility`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        feature.is_visible === 1 ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  <span className={`text-sm font-medium ${feature.is_visible ? 'text-green-600' : 'text-gray-400'}`}>
                    Visible
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">💡 How it works</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• <strong>Toggle ON (Green)</strong> - Feature is visible everywhere (Navbar, Homepage, Footer)</li>
          <li>• <strong>Toggle OFF (Gray)</strong> - Feature is completely hidden from the entire website</li>
          <li>• <strong>Example:</strong> Turn OFF "Products" → Removes from navigation menu, homepage section, and footer links</li>
          <li>• <strong>Note:</strong> Homepage is always visible (cannot be hidden) as it's the landing page</li>
          <li>• Changes take effect immediately across your website</li>
          <li>• This affects all visitors to your site</li>
        </ul>
      </div>
    </div>
  );
}
