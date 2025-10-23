import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudIcon,
  ServerIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';

// Icon mapping for categories
const iconMap = {
  'CpuChipIcon': CpuChipIcon,
  'CircleStackIcon': CircleStackIcon,
  'CloudIcon': CloudIcon,
  'ServerIcon': ServerIcon,
  'ShieldCheckIcon': ShieldCheckIcon,
  'CogIcon': CogIcon
};

const PricingAdmin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Hero Section State
  const [heroData, setHeroData] = useState({
    id: 1,
    title: '',
    description: ''
  });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [plans, setPlans] = useState([]);

  // Storage Options State
  const [storageOptions, setStorageOptions] = useState([]);

  // FAQs State
  const [faqs, setFaqs] = useState([]);

  // Editing States
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingStorage, setEditingStorage] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  // Load initial data
  useEffect(() => {
    loadHeroData();
    loadCategories();
    loadStorageOptions();
    loadFaqs();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory.id);
    }
  }, [selectedCategory]);

  // Load plans when subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      loadPlans(selectedSubcategory.id);
    }
  }, [selectedSubcategory]);

  // API Functions
  const loadHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/pricing/hero`);
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (err) {
      console.error('Error loading hero data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/categories/${categoryId}/subcategories`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
        if (data.length > 0) {
          setSelectedSubcategory(data[0]);
        } else {
          setSelectedSubcategory(null);
          setPlans([]);
        }
      }
    } catch (err) {
      console.error('Error loading subcategories:', err);
    }
  };

  const loadPlans = async (subcategoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/subcategories/${subcategoryId}/plans`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (err) {
      console.error('Error loading plans:', err);
    }
  };

  const loadStorageOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/storage`);
      if (response.ok) {
        const data = await response.json();
        setStorageOptions(data.map(option => ({
          ...option,
          features: option.features ? JSON.parse(option.features) : []
        })));
      }
    } catch (err) {
      console.error('Error loading storage options:', err);
    }
  };

  const loadFaqs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/faqs`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (err) {
      console.error('Error loading FAQs:', err);
    }
  };

  // Save Functions
  const saveHeroData = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/pricing/hero/${heroData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      
      if (response.ok) {
        alert('Hero section updated successfully!');
      } else {
        throw new Error('Failed to update hero section');
      }
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePlan = async (planData) => {
    try {
      setSaving(true);
      const url = planData.id 
        ? `${API_BASE_URL}/api/pricing/plans/${planData.id}`
        : `${API_BASE_URL}/api/pricing/subcategories/${selectedSubcategory.id}/plans`;
      
      const method = planData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      
      if (response.ok) {
        alert(`Plan ${planData.id ? 'updated' : 'created'} successfully!`);
        loadPlans(selectedSubcategory.id);
        setEditingPlan(null);
      } else {
        throw new Error(`Failed to ${planData.id ? 'update' : 'create'} plan`);
      }
    } catch (err) {
      alert(`Error ${planData.id ? 'updating' : 'creating'} plan: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/plans/${planId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Plan deleted successfully!');
        loadPlans(selectedSubcategory.id);
      } else {
        throw new Error('Failed to delete plan');
      }
    } catch (err) {
      alert('Error deleting plan: ' + err.message);
    }
  };

  const saveStorageOption = async (storageData) => {
    try {
      setSaving(true);
      const url = storageData.id 
        ? `${API_BASE_URL}/api/pricing/storage/${storageData.id}`
        : `${API_BASE_URL}/api/pricing/storage`;
      
      const method = storageData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storageData)
      });
      
      if (response.ok) {
        alert(`Storage option ${storageData.id ? 'updated' : 'created'} successfully!`);
        loadStorageOptions();
        setEditingStorage(null);
      } else {
        throw new Error(`Failed to ${storageData.id ? 'update' : 'create'} storage option`);
      }
    } catch (err) {
      alert(`Error ${storageData.id ? 'updating' : 'creating'} storage option: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveFaq = async (faqData) => {
    try {
      setSaving(true);
      const url = faqData.id 
        ? `${API_BASE_URL}/api/pricing/faqs/${faqData.id}`
        : `${API_BASE_URL}/api/pricing/faqs`;
      
      const method = faqData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData)
      });
      
      if (response.ok) {
        alert(`FAQ ${faqData.id ? 'updated' : 'created'} successfully!`);
        loadFaqs();
        setEditingFaq(null);
      } else {
        throw new Error(`Failed to ${faqData.id ? 'update' : 'create'} FAQ`);
      }
    } catch (err) {
      alert(`Error ${faqData.id ? 'updating' : 'creating'} FAQ: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/faqs/${faqId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('FAQ deleted successfully!');
        loadFaqs();
      } else {
        throw new Error('Failed to delete FAQ');
      }
    } catch (err) {
      alert('Error deleting FAQ: ' + err.message);
    }
  };

  // Component: Plan Editor
  const PlanEditor = ({ plan, onSave, onCancel }) => {
    const [formData, setFormData] = useState(plan || {
      ram: '',
      vcpu: '',
      storage: '',
      bandwidth: '',
      discount: '',
      hourly_price: '',
      monthly_price: '',
      yearly_price: '',
      instance_type: '',
      nodes: '',
      is_popular: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const isKubernetes = selectedSubcategory?.slug === 'kubernetes';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">{plan ? 'Edit Plan' : 'Create New Plan'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isKubernetes ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instance Type</label>
                  <input
                    type="text"
                    value={formData.instance_type || ''}
                    onChange={(e) => setFormData({...formData, instance_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Shared 80 GB"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nodes</label>
                  <input
                    type="text"
                    value={formData.nodes || ''}
                    onChange={(e) => setFormData({...formData, nodes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 1"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
                  <input
                    type="text"
                    value={formData.ram || ''}
                    onChange={(e) => setFormData({...formData, ram: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 4 GB"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
                  <input
                    type="text"
                    value={formData.storage || ''}
                    onChange={(e) => setFormData({...formData, storage: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 80 GB SSD"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth</label>
                  <input
                    type="text"
                    value={formData.bandwidth || ''}
                    onChange={(e) => setFormData({...formData, bandwidth: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 3 TB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <input
                    type="text"
                    value={formData.discount || ''}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 20%"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">vCPU</label>
              <input
                type="text"
                value={formData.vcpu || ''}
                onChange={(e) => setFormData({...formData, vcpu: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., 2 vCPU"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Price</label>
                <input
                  type="text"
                  value={formData.hourly_price || ''}
                  onChange={(e) => setFormData({...formData, hourly_price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., ₹4.80"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
                <input
                  type="text"
                  value={formData.monthly_price || ''}
                  onChange={(e) => setFormData({...formData, monthly_price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., ₹3,400"
                  required
                />
              </div>
            </div>
            
            {!isKubernetes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price</label>
                <input
                  type="text"
                  value={formData.yearly_price || ''}
                  onChange={(e) => setFormData({...formData, yearly_price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., ₹32,640"
                />
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_popular"
                checked={formData.is_popular || false}
                onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="is_popular" className="text-sm font-medium text-gray-700">
                Mark as Popular Plan
              </label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Component: Storage Editor
  const StorageEditor = ({ storage, onSave, onCancel }) => {
    const [formData, setFormData] = useState(storage || {
      name: '',
      description: '',
      price_per_gb: '',
      features: []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const addFeature = () => {
      setFormData({
        ...formData,
        features: [...formData.features, '']
      });
    };

    const updateFeature = (index, value) => {
      const newFeatures = [...formData.features];
      newFeatures[index] = value;
      setFormData({...formData, features: newFeatures});
    };

    const removeFeature = (index) => {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({...formData, features: newFeatures});
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">{storage ? 'Edit Storage Option' : 'Create New Storage Option'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., Block Storage"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                placeholder="High-performance SSD storage for your applications"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per GB</label>
              <input
                type="text"
                value={formData.price_per_gb}
                onChange={(e) => setFormData({...formData, price_per_gb: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., ₹2.50"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                <PlusIcon className="w-4 h-4 inline mr-1" />
                Add Feature
              </button>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : (storage ? 'Update Storage' : 'Create Storage')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Component: FAQ Editor
  const FaqEditor = ({ faq, onSave, onCancel }) => {
    const [formData, setFormData] = useState(faq || {
      question: '',
      answer: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">{faq ? 'Edit FAQ' : 'Create New FAQ'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="When will my card be charged?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                placeholder="Cloud4India billing cycles are monthly..."
                required
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : (faq ? 'Update FAQ' : 'Create FAQ')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Management</h1>
          <p className="text-gray-600">Manage pricing plans, categories, and content</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'hero', name: 'Hero Section' },
                { id: 'plans', name: 'Pricing Plans' },
                { id: 'storage', name: 'Storage Options' },
                { id: 'faqs', name: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  placeholder="Cloud Server Pricing for Startups, SMEs and Enterprises"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={heroData.description}
                  onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32"
                  placeholder="Experience the perfect balance of performance and affordability..."
                />
              </div>
              
              <button
                onClick={saveHeroData}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Hero Section'}
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon] || CpuChipIcon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCategory?.id === category.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">{category.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory Selection */}
            {selectedCategory && subcategories.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedCategory.name} - Select Subcategory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedSubcategory?.id === subcategory.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{subcategory.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{subcategory.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Plans Management */}
            {selectedSubcategory && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedSubcategory.name} Plans
                  </h2>
                  <button
                    onClick={() => setEditingPlan({})}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Plan
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        {selectedSubcategory.slug === 'kubernetes' ? (
                          <>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Instance Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nodes</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RAM</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">vCPU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hourly</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monthly</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RAM</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">vCPU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Storage</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bandwidth</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monthly</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Popular</th>
                          </>
                        )}
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((plan) => (
                        <tr key={plan.id} className="border-t border-gray-200">
                          {selectedSubcategory.slug === 'kubernetes' ? (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.instance_type}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.nodes}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.ram}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.vcpu}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.hourly_price}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.monthly_price}</td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.ram}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.vcpu}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.storage}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.bandwidth}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.discount}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{plan.monthly_price}</td>
                              <td className="px-4 py-3 text-sm">
                                {plan.is_popular ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Popular</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </>
                          )}
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingPlan(plan)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePlan(plan.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Storage Options Tab */}
        {activeTab === 'storage' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Storage Options</h2>
              <button
                onClick={() => setEditingStorage({})}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Storage Option
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storageOptions.map((storage) => (
                <div key={storage.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{storage.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStorage(storage)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{storage.description}</p>
                  
                  <div className="text-2xl font-bold text-green-600 mb-4">{storage.price_per_gb}</div>
                  
                  <ul className="space-y-2">
                    {storage.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pricing FAQs</h2>
              <button
                onClick={() => setEditingFaq({})}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        {editingPlan && (
          <PlanEditor
            plan={editingPlan.id ? editingPlan : null}
            onSave={savePlan}
            onCancel={() => setEditingPlan(null)}
          />
        )}

        {editingStorage && (
          <StorageEditor
            storage={editingStorage.id ? editingStorage : null}
            onSave={saveStorageOption}
            onCancel={() => setEditingStorage(null)}
          />
        )}

        {editingFaq && (
          <FaqEditor
            faq={editingFaq.id ? editingFaq : null}
            onSave={saveFaq}
            onCancel={() => setEditingFaq(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PricingAdmin;
