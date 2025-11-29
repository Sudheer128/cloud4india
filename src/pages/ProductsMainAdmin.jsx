import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  getMainProductsContent, 
  updateMainProductsHero, 
  updateMainProductsSection
} from '../services/cmsApi';

const ProductsMainAdmin = () => {
  const [mainPageData, setMainPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    stat1_label: '',
    stat1_value: '',
    stat2_label: '',
    stat2_value: '',
    stat3_label: '',
    stat3_value: '',
    stat4_label: '',
    stat4_value: ''
  });
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    is_visible: 1,
    popular_tag: '',
    category: '',
    features: [],
    price: '',
    price_period: '',
    free_trial_tag: '',
    button_text: ''
  });

  // Fetch main products content (include hidden sections for admin)
  const fetchMainProductsContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMainProductsContent(true); // Include hidden sections
      setMainPageData(data);
      
      // Initialize hero form
      if (data.hero) {
        setHeroForm({
          title: data.hero.title || '',
          subtitle: data.hero.subtitle || '',
          description: data.hero.description || '',
          stat1_label: data.hero.stat1_label || 'Global Customers',
          stat1_value: data.hero.stat1_value || '10K+',
          stat2_label: data.hero.stat2_label || 'Uptime SLA',
          stat2_value: data.hero.stat2_value || '99.9%',
          stat3_label: data.hero.stat3_label || 'Data Centers',
          stat3_value: data.hero.stat3_value || '15+',
          stat4_label: data.hero.stat4_label || 'Support Rating',
          stat4_value: data.hero.stat4_value || '4.9★'
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching main products content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainProductsContent();
  }, []);



  // Handle hero section update
  const handleHeroUpdate = async () => {
    try {
      await updateMainProductsHero(heroForm);
      await fetchMainProductsContent();
      setEditingHero(false);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    }
  };

  // Handle section update
  const handleSectionUpdate = async () => {
    // Validation: Check required fields
    if (!sectionForm.title || !sectionForm.title.trim()) {
      alert('Title is required!');
      return;
    }
    if (!sectionForm.description || !sectionForm.description.trim()) {
      alert('Description is required!');
      return;
    }
    if (!sectionForm.button_text || !sectionForm.button_text.trim()) {
      alert('Button Text is required!');
      return;
    }

    try {
      // Filter out empty features
      const filteredFeatures = sectionForm.features.filter(f => f && f.trim());
      
      const updateData = {
        ...sectionForm,
        features: filteredFeatures,
        // Set optional fields to null if empty (so they don't show on frontend)
        popular_tag: sectionForm.popular_tag?.trim() || null,
        category: sectionForm.category?.trim() || null,
        price: sectionForm.price?.trim() || null,
        price_period: sectionForm.price_period?.trim() || null,
        free_trial_tag: sectionForm.free_trial_tag?.trim() || null
      };

      await updateMainProductsSection(editingSection, updateData);
      await fetchMainProductsContent();
      setEditingSection(null);
      setShowEditModal(false);
      alert('Section updated successfully!');
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  // Start editing a section (opens modal)
  const startEditingSection = (section) => {
    setEditingSection(section.id);
    
    // Parse features properly - handle string, array, or null
    let parsedFeatures = [];
    if (section.features) {
      if (Array.isArray(section.features)) {
        parsedFeatures = section.features.filter(f => f && f.trim());
      } else if (typeof section.features === 'string') {
        try {
          const parsed = JSON.parse(section.features);
          if (Array.isArray(parsed)) {
            parsedFeatures = parsed.filter(f => f && f.trim());
          }
        } catch (e) {
          console.warn('Failed to parse features JSON:', e);
        }
      }
    }
    
    // Use section.title or fallback to product_name, and section.description or product_description
    setSectionForm({
      title: section.title || section.product_name || '',
      description: section.description || section.product_description || '',
      is_visible: section.is_visible !== undefined ? section.is_visible : 1,
      popular_tag: section.popular_tag || 'Most Popular',
      category: section.category || '',
      features: parsedFeatures.length > 0 ? parsedFeatures : [''],
      price: section.price || '₹2,999',
      price_period: section.price_period || '/month',
      free_trial_tag: section.free_trial_tag || 'Free Trial',
      button_text: section.button_text || 'Explore Solution'
    });
    setShowEditModal(true);
  };

  // Handle feature change
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...sectionForm.features];
    newFeatures[index] = value;
    setSectionForm({...sectionForm, features: newFeatures});
  };

  // Add new feature
  const addFeature = () => {
    setSectionForm({...sectionForm, features: [...sectionForm.features, '']});
  };

  // Remove feature
  const removeFeature = (index) => {
    const newFeatures = sectionForm.features.filter((_, i) => i !== index);
    setSectionForm({...sectionForm, features: newFeatures});
  };


  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Content</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={fetchMainProductsContent}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-8">
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            {!editingHero ? (
              <button
                onClick={() => setEditingHero(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleHeroUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingHero(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingHero ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Stats Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Statistics Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stat 1 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stat 1 Label</label>
                    <input
                      type="text"
                      value={heroForm.stat1_label}
                      onChange={(e) => setHeroForm({...heroForm, stat1_label: e.target.value})}
                      placeholder="Global Customers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-sm font-medium text-gray-700">Stat 1 Value</label>
                    <input
                      type="text"
                      value={heroForm.stat1_value}
                      onChange={(e) => setHeroForm({...heroForm, stat1_value: e.target.value})}
                      placeholder="10K+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Stat 2 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stat 2 Label</label>
                    <input
                      type="text"
                      value={heroForm.stat2_label}
                      onChange={(e) => setHeroForm({...heroForm, stat2_label: e.target.value})}
                      placeholder="Uptime SLA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-sm font-medium text-gray-700">Stat 2 Value</label>
                    <input
                      type="text"
                      value={heroForm.stat2_value}
                      onChange={(e) => setHeroForm({...heroForm, stat2_value: e.target.value})}
                      placeholder="99.9%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Stat 3 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stat 3 Label</label>
                    <input
                      type="text"
                      value={heroForm.stat3_label}
                      onChange={(e) => setHeroForm({...heroForm, stat3_label: e.target.value})}
                      placeholder="Data Centers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-sm font-medium text-gray-700">Stat 3 Value</label>
                    <input
                      type="text"
                      value={heroForm.stat3_value}
                      onChange={(e) => setHeroForm({...heroForm, stat3_value: e.target.value})}
                      placeholder="15+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Stat 4 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stat 4 Label</label>
                    <input
                      type="text"
                      value={heroForm.stat4_label}
                      onChange={(e) => setHeroForm({...heroForm, stat4_label: e.target.value})}
                      placeholder="Support Rating"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block text-sm font-medium text-gray-700">Stat 4 Value</label>
                    <input
                      type="text"
                      value={heroForm.stat4_value}
                      onChange={(e) => setHeroForm({...heroForm, stat4_value: e.target.value})}
                      placeholder="4.9★"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{mainPageData?.hero?.title}</h3>
                <p className="text-sm text-gray-600">{mainPageData?.hero?.subtitle}</p>
              </div>
              <p className="text-gray-700">{mainPageData?.hero?.description}</p>
              
              {/* Stats Preview */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{mainPageData?.hero?.stat1_value || '10K+'}</div>
                    <div className="text-sm text-gray-600">{mainPageData?.hero?.stat1_label || 'Global Customers'}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{mainPageData?.hero?.stat2_value || '99.9%'}</div>
                    <div className="text-sm text-gray-600">{mainPageData?.hero?.stat2_label || 'Uptime SLA'}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{mainPageData?.hero?.stat3_value || '15+'}</div>
                    <div className="text-sm text-gray-600">{mainPageData?.hero?.stat3_label || 'Data Centers'}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{mainPageData?.hero?.stat4_value || '4.9★'}</div>
                    <div className="text-sm text-gray-600">{mainPageData?.hero?.stat4_label || 'Support Rating'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Product Sections</h2>
          </div>
          
          {mainPageData?.sections?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No product sections found.</p>
          ) : (
            <div className="space-y-4">
              {mainPageData?.sections?.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{section.product_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        section.is_visible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {section.is_visible ? (
                          <>
                            <EyeIcon className="w-3 h-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-500">Order: {section.order_index}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditingSection(section)}
                        className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{section.title || section.product_name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{section.description || section.product_description}</p>
                    
                    {/* Features List */}
                    {Array.isArray(section.features) && section.features.length > 0 && (
                      <div className="mt-3 mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                        <ul className="space-y-1">
                          {section.features.map((feature, idx) => (
                            feature && feature.trim() && (
                              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                      {section.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{section.category}</span>
                      )}
                      {section.price && (
                        <span className="bg-gray-100 px-2 py-1 rounded">Price: {section.price}{section.price_period || '/month'}</span>
                      )}
                      {section.free_trial_tag && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{section.free_trial_tag}</span>
                      )}
                      {section.popular_tag && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">{section.popular_tag}</span>
                      )}
                      {section.button_text && (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Button: {section.button_text}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">ℹ️ Information</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use <strong>Edit</strong> to modify section title, description, and other details</li>
          </ul>
        </div>
      </div>

      {/* Edit Section Modal */}
      {showEditModal && editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Product Section</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSection(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Title - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({...sectionForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product title"
                />
              </div>

              {/* Description - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({...sectionForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>

              {/* Popular Tag - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popular Badge Text <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sectionForm.popular_tag || ''}
                  onChange={(e) => setSectionForm({...sectionForm, popular_tag: e.target.value})}
                  placeholder="Most Popular"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to hide this badge on frontend</p>
              </div>

              {/* Category - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sectionForm.category || ''}
                  onChange={(e) => setSectionForm({...sectionForm, category: e.target.value})}
                  placeholder="Cloud Servers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to hide category badge on frontend</p>
              </div>

              {/* Features - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="space-y-2">
                  {sectionForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature || ''}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        title="Remove feature"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
                  >
                    <PlusIcon className="w-4 h-4 inline mr-1" />
                    Add Feature
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Empty features will be filtered out. Leave empty to hide features section on frontend.</p>
              </div>

              {/* Price Section - Optional */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={sectionForm.price || ''}
                    onChange={(e) => setSectionForm({...sectionForm, price: e.target.value})}
                    placeholder="₹2,999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Period <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={sectionForm.price_period || ''}
                    onChange={(e) => setSectionForm({...sectionForm, price_period: e.target.value})}
                    placeholder="/month"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-2">Leave empty to hide pricing section on frontend</p>

              {/* Free Trial Tag - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Free Trial Tag <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sectionForm.free_trial_tag || ''}
                  onChange={(e) => setSectionForm({...sectionForm, free_trial_tag: e.target.value})}
                  placeholder="Free Trial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to hide this badge on frontend</p>
              </div>

              {/* Button Text - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sectionForm.button_text}
                  onChange={(e) => setSectionForm({...sectionForm, button_text: e.target.value})}
                  placeholder="Explore Solution"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Text on the main CTA button</p>
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSectionUpdate}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSection(null);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsMainAdmin;
