import { CMS_URL } from '../../utils/config';
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const MarketplaceBasicInfo = ({ marketplace, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    route: '',
    enable_single_page: 1,
    redirect_url: ''
  });

  const [errors, setErrors] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (marketplace && marketplace.id !== 'new') {
      // Clean route - remove /marketplace/ prefix if present
      let cleanRoute = marketplace.route || '';
      if (cleanRoute.startsWith('/marketplace/')) {
        cleanRoute = cleanRoute.replace('/marketplace/', '');
      } else if (cleanRoute.startsWith('marketplace/')) {
        cleanRoute = cleanRoute.replace('marketplace/', '');
      }

      setFormData({
        name: marketplace.name || '',
        description: marketplace.description || '',
        category: marketplace.category || '',
        route: cleanRoute,
        enable_single_page: marketplace.enable_single_page !== undefined ? marketplace.enable_single_page : 1,
        redirect_url: marketplace.redirect_url || ''
      });
    }

    // Load categories
    loadCategories();
  }, [marketplace]);

  const loadCategories = async () => {
    try {
      // Load categories from database
      const response = await fetch(`${CMS_URL}/api/marketplaces/categories`);
      if (response.ok) {
        const categories = await response.json();
        const cats = categories.map(c => c.name).sort();
        setAvailableCategories(cats);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Auto-generate slug from name
    if (field === 'name' && !formData.route) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, route: slug }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'App name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    // Auto-generate route if not set
    if (!formData.route || !formData.route.trim()) {
      const autoRoute = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, route: autoRoute }));
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          Basic App Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">Essential details about your marketplace app</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* App Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., WordPress, Node.js, MySQL"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          <p className="mt-1 text-xs text-gray-500">This will be the main heading on your marketplace app page</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Brief description of your app and its main benefits"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">This appears on the marketplace listing page and in search results</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select category...</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Select from categories defined in Category Management. Add new categories there first.
          </p>
        </div>


        {/* Navigation Settings */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            Navigation Settings
          </h4>

          {/* Enable Single Page Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Single Page</label>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, clicking this app opens its dedicated detail page
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, enable_single_page: prev.enable_single_page ? 0 : 1 }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.enable_single_page ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                formData.enable_single_page ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Redirect URL - shown when single page is disabled */}
          {!formData.enable_single_page && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.redirect_url}
                onChange={(e) => handleChange('redirect_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://example.com/your-app-page"
              />
              <p className="mt-1 text-xs text-gray-500">
                When users click this app, they will be redirected to this URL instead of the detail page
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                {marketplace && marketplace.id !== 'new' ? 'Update App' : 'Create App'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Import missing icons
const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default MarketplaceBasicInfo;

