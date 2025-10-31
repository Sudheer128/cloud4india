import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  getMainSolutionsContent, 
  updateMainSolutionsHero, 
  updateMainSolutionsSection,
  duplicateMainSolutionsSection,
  deleteMainSolutionsSection,
  toggleMainSolutionsSectionVisibility,
  createMainSolutionsSection
} from '../services/cmsApi';

const SolutionsMainAdmin = () => {
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
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSectionForm, setNewSectionForm] = useState({
    title: '',
    description: '',
    popular_tag: '',
    category: '',
    features: [],
    price: '',
    price_period: '',
    free_trial_tag: '',
    button_text: ''
  });

  // Fetch main solutions content (include hidden sections for admin)
  const fetchMainSolutionsContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMainSolutionsContent(true); // Include hidden sections
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
      console.error('Error fetching main solutions content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainSolutionsContent();
  }, []);

  // Handle duplicate section
  const handleDuplicateSection = async (sectionId) => {
    try {
      await duplicateMainSolutionsSection(sectionId);
      await fetchMainSolutionsContent();
      alert('Section duplicated successfully!');
    } catch (err) {
      alert('Error duplicating section: ' + err.message);
    }
  };

  // Handle delete section
  const handleDeleteSection = async (sectionId, sectionTitle) => {
    if (window.confirm(`Are you sure you want to delete "${sectionTitle}"? This action cannot be undone.`)) {
      try {
        await deleteMainSolutionsSection(sectionId);
        await fetchMainSolutionsContent();
        alert('Section deleted successfully!');
      } catch (err) {
        alert('Error deleting section: ' + err.message);
      }
    }
  };

  // Handle toggle visibility
  const handleToggleVisibility = async (sectionId) => {
    try {
      await toggleMainSolutionsSectionVisibility(sectionId);
      await fetchMainSolutionsContent();
    } catch (err) {
      alert('Error toggling section visibility: ' + err.message);
    }
  };

  // Handle create new section
  const handleCreateNewSection = async () => {
    // Validation: Check required fields
    if (!newSectionForm.title || !newSectionForm.title.trim()) {
      alert('Title is required!');
      return;
    }
    if (!newSectionForm.description || !newSectionForm.description.trim()) {
      alert('Description is required!');
      return;
    }
    if (!newSectionForm.button_text || !newSectionForm.button_text.trim()) {
      alert('Button Text is required!');
      return;
    }

    try {
      // Filter out empty features
      const filteredFeatures = newSectionForm.features.filter(f => f && f.trim());
      
      const createData = {
        ...newSectionForm,
        is_visible: 1, // Always visible by default
        features: filteredFeatures,
        // Set optional fields to null if empty
        popular_tag: newSectionForm.popular_tag?.trim() || null,
        category: newSectionForm.category?.trim() || null,
        price: newSectionForm.price?.trim() || null,
        price_period: newSectionForm.price_period?.trim() || null,
        free_trial_tag: newSectionForm.free_trial_tag?.trim() || null
      };

      await createMainSolutionsSection(createData);
      await fetchMainSolutionsContent();
      setShowNewSectionModal(false);
      setNewSectionForm({
        title: '',
        description: '',
        popular_tag: '',
        category: '',
        features: [],
        price: '',
        price_period: '',
        free_trial_tag: '',
        button_text: ''
      });
      alert('New section created successfully!');
    } catch (err) {
      alert('Error creating section: ' + err.message);
    }
  };

  // Handle hero section update
  const handleHeroUpdate = async () => {
    try {
      await updateMainSolutionsHero(heroForm);
      await fetchMainSolutionsContent();
      setEditingHero(false);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    }
  };

  // Start editing section
  const startEditingSection = (section) => {
    // Parse features if it's a string
    let parsedFeatures = [];
    if (section.features) {
      if (Array.isArray(section.features)) {
        parsedFeatures = section.features.filter(f => f && f.trim());
      } else if (typeof section.features === 'string') {
        try {
          const parsed = JSON.parse(section.features);
          parsedFeatures = Array.isArray(parsed) ? parsed.filter(f => f && f.trim()) : [];
        } catch (e) {
          parsedFeatures = [];
        }
      }
    }
    
    // Provide default features if none exist
    if (parsedFeatures.length === 0) {
      parsedFeatures = ['High Performance', 'Scalable Architecture', '24/7 Support'];
    }

    setSectionForm({
      title: section.title || '',
      description: section.description || '',
      is_visible: section.is_visible || 1,
      popular_tag: section.popular_tag || '',
      category: section.category || '',
      features: parsedFeatures,
      price: section.price || '',
      price_period: section.price_period || '',
      free_trial_tag: section.free_trial_tag || '',
      button_text: section.button_text || ''
    });
    setEditingSection(section);
    setShowEditModal(true);
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
        // Set optional fields to null if empty
        popular_tag: sectionForm.popular_tag?.trim() || null,
        category: sectionForm.category?.trim() || null,
        price: sectionForm.price?.trim() || null,
        price_period: sectionForm.price_period?.trim() || null,
        free_trial_tag: sectionForm.free_trial_tag?.trim() || null
      };

      await updateMainSolutionsSection(editingSection.id, updateData);
      await fetchMainSolutionsContent();
      setShowEditModal(false);
      setEditingSection(null);
      alert('Section updated successfully!');
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
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

  // Handle new section feature change
  const handleNewSectionFeatureChange = (index, value) => {
    const newFeatures = [...newSectionForm.features];
    newFeatures[index] = value;
    setNewSectionForm({...newSectionForm, features: newFeatures});
  };

  // Add new feature to new section
  const addNewSectionFeature = () => {
    setNewSectionForm({...newSectionForm, features: [...newSectionForm.features, '']});
  };

  // Remove feature from new section
  const removeNewSectionFeature = (index) => {
    const newFeatures = newSectionForm.features.filter((_, i) => i !== index);
    setNewSectionForm({...newSectionForm, features: newFeatures});
  };

  if (loading) {
    return (
      <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchMainSolutionsContent}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
      <div className="space-y-6">
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            <button
              onClick={() => setEditingHero(!editingHero)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <PencilIcon className="w-4 h-4" />
              {editingHero ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingHero ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Label</label>
                  <input
                    type="text"
                    value={heroForm.stat1_label}
                    onChange={(e) => setHeroForm({...heroForm, stat1_label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Global Customers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Value</label>
                  <input
                    type="text"
                    value={heroForm.stat1_value}
                    onChange={(e) => setHeroForm({...heroForm, stat1_value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10K+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Label</label>
                  <input
                    type="text"
                    value={heroForm.stat2_label}
                    onChange={(e) => setHeroForm({...heroForm, stat2_label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Uptime SLA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Value</label>
                  <input
                    type="text"
                    value={heroForm.stat2_value}
                    onChange={(e) => setHeroForm({...heroForm, stat2_value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="99.9%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 3 Label</label>
                  <input
                    type="text"
                    value={heroForm.stat3_label}
                    onChange={(e) => setHeroForm({...heroForm, stat3_label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Data Centers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 3 Value</label>
                  <input
                    type="text"
                    value={heroForm.stat3_value}
                    onChange={(e) => setHeroForm({...heroForm, stat3_value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="15+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 4 Label</label>
                  <input
                    type="text"
                    value={heroForm.stat4_label}
                    onChange={(e) => setHeroForm({...heroForm, stat4_label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Support Rating"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stat 4 Value</label>
                  <input
                    type="text"
                    value={heroForm.stat4_value}
                    onChange={(e) => setHeroForm({...heroForm, stat4_value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4.9★"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleHeroUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingHero(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{mainPageData?.hero?.title || 'Our Solutions'}</h3>
                <p className="text-sm text-gray-600">{mainPageData?.hero?.subtitle || 'Enterprise Solutions - Made in India'}</p>
                <p className="text-sm text-gray-500 mt-2">{mainPageData?.hero?.description || 'Explore our enterprise-grade solutions designed to transform your business operations.'}</p>
              </div>
              
              {/* Stats Preview */}
              <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{mainPageData?.hero?.stat1_value || '10K+'}</div>
                  <div className="text-xs text-gray-600">{mainPageData?.hero?.stat1_label || 'Global Customers'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{mainPageData?.hero?.stat2_value || '99.9%'}</div>
                  <div className="text-xs text-gray-600">{mainPageData?.hero?.stat2_label || 'Uptime SLA'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{mainPageData?.hero?.stat3_value || '15+'}</div>
                  <div className="text-xs text-gray-600">{mainPageData?.hero?.stat3_label || 'Data Centers'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{mainPageData?.hero?.stat4_value || '4.9★'}</div>
                  <div className="text-xs text-gray-600">{mainPageData?.hero?.stat4_label || 'Support Rating'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Solution Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Solution Sections</h2>
            <button
              onClick={() => setShowNewSectionModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Solution
            </button>
          </div>
          
          {mainPageData?.sections?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No solution sections found.</p>
          ) : (
            <div className="space-y-4">
              {mainPageData?.sections?.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        {section.popular_tag && (
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                            {section.popular_tag}
                          </span>
                        )}
                        {section.category && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {section.category}
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          section.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {section.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{section.description}</p>
                      
                      {/* Features Display */}
                      {section.features && section.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {section.features.map((feature, idx) => (
                              <span key={idx} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                                ✓ {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Price Display */}
                      {section.price && (
                        <div className="mb-3">
                          <span className="text-lg font-bold text-gray-900">{section.price}</span>
                          {section.price_period && (
                            <span className="text-gray-600">{section.price_period}</span>
                          )}
                          {section.free_trial_tag && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              {section.free_trial_tag}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {section.button_text && (
                        <p className="text-sm text-gray-500">Button: "{section.button_text}"</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => startEditingSection(section)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateSection(section.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(section.id)}
                        className={`p-2 rounded-lg ${
                          section.is_visible 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={section.is_visible ? 'Hide' : 'Show'}
                      >
                        {section.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id, section.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Section Modal */}
      {showEditModal && editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Solution Section</h3>
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
                  placeholder="Enter solution title"
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
                  placeholder="Enter solution description"
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
                  placeholder="Enterprise Solutions"
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

      {/* New Section Modal */}
      {showNewSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Solution Section</h3>
              <button
                onClick={() => {
                  setShowNewSectionModal(false);
                  setNewSectionForm({
                    title: '',
                    description: '',
                    popular_tag: '',
                    category: '',
                    features: [],
                    price: '',
                    price_period: '',
                    free_trial_tag: '',
                    button_text: ''
                  });
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
                  value={newSectionForm.title}
                  onChange={(e) => setNewSectionForm({...newSectionForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter solution title"
                />
              </div>

              {/* Description - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={newSectionForm.description}
                  onChange={(e) => setNewSectionForm({...newSectionForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter solution description"
                />
              </div>

              {/* Popular Tag - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popular Badge Text <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newSectionForm.popular_tag || ''}
                  onChange={(e) => setNewSectionForm({...newSectionForm, popular_tag: e.target.value})}
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
                  value={newSectionForm.category || ''}
                  onChange={(e) => setNewSectionForm({...newSectionForm, category: e.target.value})}
                  placeholder="Enterprise Solutions"
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
                  {newSectionForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature || ''}
                        onChange={(e) => handleNewSectionFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeNewSectionFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        title="Remove feature"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addNewSectionFeature}
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
                    value={newSectionForm.price || ''}
                    onChange={(e) => setNewSectionForm({...newSectionForm, price: e.target.value})}
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
                    value={newSectionForm.price_period || ''}
                    onChange={(e) => setNewSectionForm({...newSectionForm, price_period: e.target.value})}
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
                  value={newSectionForm.free_trial_tag || ''}
                  onChange={(e) => setNewSectionForm({...newSectionForm, free_trial_tag: e.target.value})}
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
                  value={newSectionForm.button_text}
                  onChange={(e) => setNewSectionForm({...newSectionForm, button_text: e.target.value})}
                  placeholder="Explore Solution"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Text on the main CTA button</p>
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateNewSection}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4" />
                Create Solution
              </button>
              <button
                onClick={() => {
                  setShowNewSectionModal(false);
                  setNewSectionForm({
                    title: '',
                    description: '',
                    popular_tag: '',
                    category: '',
                    features: [],
                    price: '',
                    price_period: '',
                    free_trial_tag: '',
                    button_text: ''
                  });
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
    </AdminLayout>
  );
};

export default SolutionsMainAdmin;