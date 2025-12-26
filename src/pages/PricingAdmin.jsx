import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';

// Global flag to hide/show quarterly column in pricing tables
const SHOW_QUARTERLY_COLUMN = false;

// Helper function to extract numeric value from price string (removes currency symbols, commas, etc.)
const extractNumericValue = (priceString) => {
  if (!priceString || priceString === '') return 0;
  // Remove currency symbols, commas, and spaces, then parse
  const cleaned = priceString.toString().replace(/[₹,₹\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Helper function to format price with currency symbol and commas
const formatPrice = (value) => {
  if (!value || value === 0) return '';
  // Round to 2 decimal places and format with commas
  const rounded = Math.round(value * 100) / 100;
  return `₹${rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};


const PricingAdmin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Hero Section State
  const [heroData, setHeroData] = useState({
    id: 1,
    title: '',
    description: '',
    redirect_url: 'https://portal.cloud4india.com/register'
  });

  // Compute Plans State
  const [computePlans, setComputePlans] = useState([]);
  const [activeComputePlanTab, setActiveComputePlanTab] = useState('basic');

  // Disk Offerings State
  const [diskOfferings, setDiskOfferings] = useState([]);

  // FAQs State
  const [faqs, setFaqs] = useState([]);

  // Page Configuration State
  const [pageConfig, setPageConfig] = useState({
    main_heading: '',
    compute_section_heading: '',
    compute_section_description: '',
    compute_tab_basic_label: '',
    compute_tab_cpu_intensive_label: '',
    compute_tab_memory_intensive_label: '',
    compute_table_header_name: '',
    compute_table_header_vcpu: '',
    compute_table_header_memory: '',
    compute_table_header_hourly: '',
    compute_table_header_monthly: '',
    compute_table_header_quarterly: '',
    compute_table_header_yearly: '',
    disk_section_heading: '',
    disk_section_description: '',
    disk_table_header_name: '',
    disk_table_header_type: '',
    disk_table_header_size: '',
    storage_section_heading: '',
    storage_section_description: '',
    storage_table_header_type: '',
    storage_table_header_description: '',
    storage_table_header_price: '',
    storage_table_header_action: '',
    service_table_header_service: '',
    service_table_header_type: '',
    service_table_header_features: '',
    service_table_header_bandwidth: '',
    service_table_header_discount: '',
    service_table_header_price: '',
    service_table_header_action: '',
    faq_section_heading: '',
    faq_section_subheading: '',
    button_get_started: '',
    button_contact_sales: ''
  });

  // Editing States
  const [editingComputePlan, setEditingComputePlan] = useState(null);
  const [editingDiskOffering, setEditingDiskOffering] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  // Load initial data
  useEffect(() => {
    loadHeroData();
    loadComputePlans();
    loadDiskOfferings();
    loadFaqs();
    loadPageConfig();
  }, []);

  const loadPageConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/page-config`);
      if (response.ok) {
        const data = await response.json();
        setPageConfig(data);
      }
    } catch (err) {
      console.error('Error loading page config:', err);
    }
  };

  const savePageConfig = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/pricing/page-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageConfig)
      });
      
      if (response.ok) {
        alert('Page configuration updated successfully!');
      } else {
        throw new Error('Failed to update page configuration');
      }
    } catch (err) {
      alert('Error updating page configuration: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

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

  const loadComputePlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/compute-plans`);
      if (response.ok) {
        const data = await response.json();
        setComputePlans(data);
      }
    } catch (err) {
      console.error('Error loading compute plans:', err);
    }
  };

  const loadDiskOfferings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/disk-offerings`);
      if (response.ok) {
        const data = await response.json();
        setDiskOfferings(data);
      }
    } catch (err) {
      console.error('Error loading disk offerings:', err);
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

  const saveComputePlan = async (planData) => {
    try {
      setSaving(true);
      const url = planData.id 
        ? `${API_BASE_URL}/api/pricing/compute-plans/${planData.id}`
        : `${API_BASE_URL}/api/pricing/compute-plans`;
      
      const method = planData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      
      if (response.ok) {
        alert(`Compute plan ${planData.id ? 'updated' : 'created'} successfully!`);
        loadComputePlans();
        setEditingComputePlan(null);
      } else {
        throw new Error(`Failed to ${planData.id ? 'update' : 'create'} compute plan`);
      }
    } catch (err) {
      alert(`Error ${planData.id ? 'updating' : 'creating'} compute plan: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteComputePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this compute plan?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/compute-plans/${planId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Compute plan deleted successfully!');
        loadComputePlans();
      } else {
        throw new Error('Failed to delete compute plan');
      }
    } catch (err) {
      alert('Error deleting compute plan: ' + err.message);
    }
  };

  const saveDiskOffering = async (offeringData) => {
    try {
      setSaving(true);
      const url = offeringData.id 
        ? `${API_BASE_URL}/api/pricing/disk-offerings/${offeringData.id}`
        : `${API_BASE_URL}/api/pricing/disk-offerings`;
      
      const method = offeringData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offeringData)
      });
      
      if (response.ok) {
        alert(`Disk offering ${offeringData.id ? 'updated' : 'created'} successfully!`);
        loadDiskOfferings();
        setEditingDiskOffering(null);
      } else {
        throw new Error(`Failed to ${offeringData.id ? 'update' : 'create'} disk offering`);
      }
    } catch (err) {
      alert(`Error ${offeringData.id ? 'updating' : 'creating'} disk offering: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteDiskOffering = async (offeringId) => {
    if (!window.confirm('Are you sure you want to delete this disk offering?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/disk-offerings/${offeringId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Disk offering deleted successfully!');
        loadDiskOfferings();
      } else {
        throw new Error('Failed to delete disk offering');
      }
    } catch (err) {
      alert('Error deleting disk offering: ' + err.message);
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


  // Component: Compute Plan Editor
  const ComputePlanEditor = ({ plan, onSave, onCancel }) => {
    const [formData, setFormData] = useState(plan ? { ...plan } : {
      plan_type: 'basic',
      name: '',
      vcpu: '',
      memory: '',
      monthly_price: '',
      hourly_price: '',
      quarterly_price: '',
      yearly_price: ''
    });

    // Handle hourly price change and auto-calculate monthly and yearly
    const handleHourlyPriceChange = (hourlyPrice) => {
      const hourlyNumeric = extractNumericValue(hourlyPrice);
      
      // Calculate monthly: Hourly × 730
      const monthlyNumeric = hourlyNumeric * 730;
      
      // Calculate yearly: Monthly × 12
      const yearlyNumeric = monthlyNumeric * 12;
      
      // Format prices
      const formattedMonthly = formatPrice(monthlyNumeric);
      const formattedYearly = formatPrice(yearlyNumeric);
      
      setFormData({
        ...formData,
        hourly_price: hourlyPrice,
        monthly_price: formattedMonthly,
        yearly_price: formattedYearly
      });
    };

    // Auto-calculate monthly and yearly on initial load if hourly price exists
    useEffect(() => {
      if (formData.hourly_price && formData.hourly_price.trim() !== '') {
        const hourlyNumeric = extractNumericValue(formData.hourly_price);
        if (hourlyNumeric > 0) {
          const monthlyNumeric = hourlyNumeric * 730;
          const yearlyNumeric = monthlyNumeric * 12;
          const formattedMonthly = formatPrice(monthlyNumeric);
          const formattedYearly = formatPrice(yearlyNumeric);
          
          setFormData(prev => ({
            ...prev,
            monthly_price: formattedMonthly,
            yearly_price: formattedYearly
          }));
        }
      }
    }, []); // Run only on mount

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">{plan ? 'Edit Compute Plan' : 'Create New Compute Plan'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
              <select
                value={formData.plan_type}
                onChange={(e) => setFormData({...formData, plan_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="basic">Basic Compute Plans</option>
                <option value="cpuIntensive">CPU Intensive</option>
                <option value="memoryIntensive">Memory Intensive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., BP_1vC-1GB"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">vCPU</label>
                <input
                  type="text"
                  value={formData.vcpu}
                  onChange={(e) => setFormData({...formData, vcpu: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., 1 vCPU"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memory</label>
                <input
                  type="text"
                  value={formData.memory}
                  onChange={(e) => setFormData({...formData, memory: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., 1.0 GB"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Price</label>
                <input
                  type="text"
                  value={formData.hourly_price}
                  onChange={(e) => handleHourlyPriceChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., ₹0.7"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (Auto-calculated)</label>
                <input
                  type="text"
                  value={formData.monthly_price}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-calculated from hourly price"
                />
              </div>
            </div>
            
            {SHOW_QUARTERLY_COLUMN ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quarterly Price</label>
                  <input
                    type="text"
                    value={formData.quarterly_price}
                    onChange={(e) => setFormData({...formData, quarterly_price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., ₹1,459.20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price</label>
                  <input
                    type="text"
                    value={formData.yearly_price}
                    onChange={(e) => setFormData({...formData, yearly_price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., ₹5,529.60"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (Auto-calculated)</label>
                <input
                  type="text"
                  value={formData.yearly_price}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-calculated from hourly price"
                />
              </div>
            )}
            
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

  // Component: Disk Offering Editor
  const DiskOfferingEditor = ({ offering, onSave, onCancel }) => {
    const [formData, setFormData] = useState(offering ? { ...offering } : {
      name: '',
      storage_type: 'NVMe',
      size: '',
      monthly_price: '',
      hourly_price: '',
      quarterly_price: '',
      yearly_price: ''
    });

    // Handle hourly price change and auto-calculate monthly and yearly
    const handleHourlyPriceChange = (hourlyPrice) => {
      const hourlyNumeric = extractNumericValue(hourlyPrice);
      
      // Calculate monthly: Hourly × 730
      const monthlyNumeric = hourlyNumeric * 730;
      
      // Calculate yearly: Monthly × 12
      const yearlyNumeric = monthlyNumeric * 12;
      
      // Format prices
      const formattedMonthly = formatPrice(monthlyNumeric);
      const formattedYearly = formatPrice(yearlyNumeric);
      
      setFormData({
        ...formData,
        hourly_price: hourlyPrice,
        monthly_price: formattedMonthly,
        yearly_price: formattedYearly
      });
    };

    // Auto-calculate monthly and yearly on initial load if hourly price exists
    useEffect(() => {
      if (formData.hourly_price && formData.hourly_price.trim() !== '') {
        const hourlyNumeric = extractNumericValue(formData.hourly_price);
        if (hourlyNumeric > 0) {
          const monthlyNumeric = hourlyNumeric * 730;
          const yearlyNumeric = monthlyNumeric * 12;
          const formattedMonthly = formatPrice(monthlyNumeric);
          const formattedYearly = formatPrice(yearlyNumeric);
          
          setFormData(prev => ({
            ...prev,
            monthly_price: formattedMonthly,
            yearly_price: formattedYearly
          }));
        }
      }
    }, []); // Run only on mount

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">{offering ? 'Edit Disk Offering' : 'Create New Disk Offering'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., 20 GB"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type</label>
              <input
                type="text"
                value={formData.storage_type}
                onChange={(e) => setFormData({...formData, storage_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., NVMe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., 20.0 GB"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Price</label>
                <input
                  type="text"
                  value={formData.hourly_price}
                  onChange={(e) => handleHourlyPriceChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., ₹0.25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (Auto-calculated)</label>
                <input
                  type="text"
                  value={formData.monthly_price}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-calculated from hourly price"
                />
              </div>
            </div>
            
            {SHOW_QUARTERLY_COLUMN ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quarterly Price</label>
                  <input
                    type="text"
                    value={formData.quarterly_price}
                    onChange={(e) => setFormData({...formData, quarterly_price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., ₹456.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (Auto-calculated)</label>
                  <input
                    type="text"
                    value={formData.yearly_price}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                    placeholder="Auto-calculated from hourly price"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (Auto-calculated)</label>
                <input
                  type="text"
                  value={formData.yearly_price}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-calculated from hourly price"
                />
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : (offering ? 'Update Offering' : 'Create Offering')}
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
                { id: 'page-config', name: 'Page Configuration' },
                { id: 'compute-plans', name: 'Compute Plans' },
                { id: 'disk-offerings', name: 'Disk Offerings' },
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

        {/* Page Configuration Tab */}
        {activeTab === 'page-config' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Configuration</h2>
            <p className="text-gray-600 mb-6">Configure all text labels, headings, and descriptions displayed on the pricing page.</p>
            
            <div className="space-y-8">
              {/* Main Heading */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Section Heading</h3>
                <input
                  type="text"
                  value={pageConfig.main_heading || ''}
                  onChange={(e) => setPageConfig({...pageConfig, main_heading: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Affordable Cloud Server Pricing and Plans in India"
                />
              </div>

              {/* Compute Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compute Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Heading</label>
                    <input
                      type="text"
                      value={pageConfig.compute_section_heading || ''}
                      onChange={(e) => setPageConfig({...pageConfig, compute_section_heading: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Compute Offering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                    <textarea
                      value={pageConfig.compute_section_description || ''}
                      onChange={(e) => setPageConfig({...pageConfig, compute_section_description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                      placeholder="Choose a plan based on the amount of CPU, memory, and storage required..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Basic Tab Label</label>
                      <input
                        type="text"
                        value={pageConfig.compute_tab_basic_label || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_tab_basic_label: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Basic Compute Plans"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPU Intensive Tab Label</label>
                      <input
                        type="text"
                        value={pageConfig.compute_tab_cpu_intensive_label || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_tab_cpu_intensive_label: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="CPU Intensive"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Memory Intensive Tab Label</label>
                      <input
                        type="text"
                        value={pageConfig.compute_tab_memory_intensive_label || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_tab_memory_intensive_label: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Memory Intensive"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: Name</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_name || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_name: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: vCPU</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_vcpu || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_vcpu: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="vCPU"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: Memory</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_memory || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_memory: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Memory RAM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: Hourly</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_hourly || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_hourly: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Price Hourly"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: Monthly</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_monthly || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_monthly: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Price Monthly"
                      />
                    </div>
                    {SHOW_QUARTERLY_COLUMN && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Header: Quarterly</label>
                        <input
                          type="text"
                          value={pageConfig.compute_table_header_quarterly || ''}
                          onChange={(e) => setPageConfig({...pageConfig, compute_table_header_quarterly: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Price Quarterly"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Header: Yearly</label>
                      <input
                        type="text"
                        value={pageConfig.compute_table_header_yearly || ''}
                        onChange={(e) => setPageConfig({...pageConfig, compute_table_header_yearly: e.target.value})}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Price Yearly"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQ Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Heading</label>
                    <input
                      type="text"
                      value={pageConfig.faq_section_heading || ''}
                      onChange={(e) => setPageConfig({...pageConfig, faq_section_heading: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Have Any Questions?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Subheading</label>
                    <input
                      type="text"
                      value={pageConfig.faq_section_subheading || ''}
                      onChange={(e) => setPageConfig({...pageConfig, faq_section_subheading: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Don't Worry, We've Got Answers!"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Labels</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Get Started Button</label>
                    <input
                      type="text"
                      value={pageConfig.button_get_started || ''}
                      onChange={(e) => setPageConfig({...pageConfig, button_get_started: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Get Started"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Sales Button</label>
                    <input
                      type="text"
                      value={pageConfig.button_contact_sales || ''}
                      onChange={(e) => setPageConfig({...pageConfig, button_contact_sales: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Contact Sales"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <button
                  onClick={savePageConfig}
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Page Configuration'}
                </button>
              </div>
            </div>
          </div>
        )}

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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URL (when clicking on pricing rows)</label>
                <input
                  type="text"
                  value={heroData.redirect_url}
                  onChange={(e) => setHeroData({...heroData, redirect_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="https://portal.cloud4india.com/register"
                />
                <p className="text-sm text-gray-500 mt-1">Users will be redirected to this URL when they click on any pricing row</p>
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

        {/* Compute Plans Tab */}
        {activeTab === 'compute-plans' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Compute Plans</h2>
                <button
                  onClick={() => setEditingComputePlan({})}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Compute Plan
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'basic', label: 'Basic Compute Plans' },
                    { id: 'cpuIntensive', label: 'CPU Intensive' },
                    { id: 'memoryIntensive', label: 'Memory Intensive' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveComputePlanTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeComputePlanTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Plans Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">vCPU</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Memory RAM</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Hourly</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Monthly</th>
                      {SHOW_QUARTERLY_COLUMN && <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Quarterly</th>}
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Yearly</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computePlans
                      .filter(plan => plan.plan_type === activeComputePlanTab)
                      .map((plan) => (
                        <tr key={plan.id} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.vcpu}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.memory}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.hourly_price}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.monthly_price}</td>
                          {SHOW_QUARTERLY_COLUMN && <td className="px-4 py-3 text-sm text-gray-900">{plan.quarterly_price || '-'}</td>}
                          <td className="px-4 py-3 text-sm text-gray-900">{plan.yearly_price || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingComputePlan(plan)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteComputePlan(plan.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {computePlans.filter(plan => plan.plan_type === activeComputePlanTab).length === 0 && (
                      <tr>
                        <td colSpan={SHOW_QUARTERLY_COLUMN ? "8" : "7"} className="px-4 py-8 text-center text-gray-500">
                          No plans found for this category. Click "Add Compute Plan" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Disk Offerings Tab */}
        {activeTab === 'disk-offerings' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Disk Offerings</h2>
              <button
                onClick={() => setEditingDiskOffering({})}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Disk Offering
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Storage Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Hourly</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Monthly</th>
                    {SHOW_QUARTERLY_COLUMN && <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Quarterly</th>}
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price Yearly</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diskOfferings.map((offering) => (
                    <tr key={offering.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.storage_type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.size}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.hourly_price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.monthly_price}</td>
                      {SHOW_QUARTERLY_COLUMN && <td className="px-4 py-3 text-sm text-gray-900">{offering.quarterly_price || '-'}</td>}
                      <td className="px-4 py-3 text-sm text-gray-900">{offering.yearly_price || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingDiskOffering(offering)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDiskOffering(offering.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {diskOfferings.length === 0 && (
                    <tr>
                      <td colSpan={SHOW_QUARTERLY_COLUMN ? "8" : "7"} className="px-4 py-8 text-center text-gray-500">
                        No disk offerings found. Click "Add Disk Offering" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        {editingComputePlan && (
          <ComputePlanEditor
            plan={editingComputePlan.id ? editingComputePlan : null}
            onSave={saveComputePlan}
            onCancel={() => setEditingComputePlan(null)}
          />
        )}

        {editingDiskOffering && (
          <DiskOfferingEditor
            offering={editingDiskOffering.id ? editingDiskOffering : null}
            onSave={saveDiskOffering}
            onCancel={() => setEditingDiskOffering(null)}
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
