import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SolutionBasicInfo = ({ solution, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    route: ''
  });

  const [errors, setErrors] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (solution && solution.id !== 'new') {
      // Clean route - remove /solutions/ prefix if present
      let cleanRoute = solution.route || '';
      if (cleanRoute.startsWith('/solutions/')) {
        cleanRoute = cleanRoute.replace('/solutions/', '');
      } else if (cleanRoute.startsWith('solutions/')) {
        cleanRoute = cleanRoute.replace('solutions/', '');
      }

      setFormData({
        name: solution.name || '',
        description: solution.description || '',
        category: solution.category || '',
        route: cleanRoute
      });
    }

    // Load categories
    loadCategories();
  }, [solution]);

  const loadCategories = async () => {
    try {
      // Load categories from database
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002'}/api/solutions/categories`);
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
    if (!formData.name.trim()) newErrors.name = 'Solution name is required';
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
          Basic Solution Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">Essential details about your solution</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solution Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solution Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., AI/ML Solutions, Data Analytics Platform, DevOps Tools"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          <p className="mt-1 text-xs text-gray-500">This will be the main heading on your solution page</p>
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
            placeholder="Brief description of your solution and its main benefits"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">This appears on the solutions listing page and in search results</p>
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
                {solution && solution.id !== 'new' ? 'Update Solution' : 'Create Solution'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Import missing icon
const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default SolutionBasicInfo;

