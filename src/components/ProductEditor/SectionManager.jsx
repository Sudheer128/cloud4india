import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ListBulletIcon,
  SparklesIcon,
  CubeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Section type configurations with icons and help text
const SECTION_TYPES = [
  { 
    value: 'hero', 
    emoji: '🎯', 
    label: 'Hero/Overview', 
    description: 'Main banner with title, description, features bullets & stats',
    required: true, 
    order: 0,
    helpText: 'Add items: 3 features, 3 stats, 1 CTA button',
    itemTypes: ['feature', 'stat', 'cta_primary']
  },
  { 
    value: 'media_banner', 
    emoji: '🎬', 
    label: 'Gallery/Video', 
    description: 'Video or photo gallery section',
    required: false, 
    order: 1,
    helpText: 'Upload video/image or add YouTube URL',
    needsMedia: true
  },
  { 
    value: 'features', 
    emoji: '⚡', 
    label: 'Key Features', 
    description: 'Feature cards with icons',
    required: false, 
    order: 2,
    helpText: 'Add items: 6-9 feature cards',
    itemTypes: ['feature']
  },
  { 
    value: 'pricing', 
    emoji: '💰', 
    label: 'Pricing Plans', 
    description: 'Pricing table with plans',
    required: false, 
    order: 3,
    helpText: 'Add items: Pricing plans (each row in table)',
    itemTypes: ['pricing_plan']
  },
  { 
    value: 'specifications', 
    emoji: '📋', 
    label: 'Technical Specs', 
    description: 'Technical specification cards',
    required: false, 
    order: 4,
    helpText: 'Add items: Specification categories with features',
    itemTypes: ['specification']
  },
  { 
    value: 'security', 
    emoji: '🔒', 
    label: 'Security', 
    description: 'Security features and compliance',
    required: false, 
    order: 5,
    helpText: 'Add items: Security features',
    itemTypes: ['security_feature']
  },
  { 
    value: 'support', 
    emoji: '💬', 
    label: 'Support & SLA', 
    description: 'Support channels and SLA',
    required: false, 
    order: 6,
    helpText: 'Add items: Support channels (4 recommended)',
    itemTypes: ['support_channel']
  },
  { 
    value: 'migration', 
    emoji: '🔄', 
    label: 'Migration Guide', 
    description: 'Migration and onboarding steps',
    required: false, 
    order: 7,
    helpText: 'Add items: 3 migration steps',
    itemTypes: ['step']
  },
  { 
    value: 'use_cases', 
    emoji: '🎯', 
    label: 'Use Cases', 
    description: 'Real-world use cases',
    required: false, 
    order: 8,
    helpText: 'Add items: Use case cards with benefits',
    itemTypes: ['use_case']
  },
  { 
    value: 'cta', 
    emoji: '🚀', 
    label: 'Get Started/CTA', 
    description: 'Final call-to-action',
    required: false, 
    order: 9,
    helpText: 'Add items: CTA buttons (1-2)',
    itemTypes: ['cta_primary', 'cta_secondary']
  }
];

const SectionManager = ({ productId, onManageItems }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    if (productId && productId !== 'new') {
      loadSections();
    }
  }, [productId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections`);
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        
        // Load item counts
        const counts = {};
        await Promise.all(data.map(async (section) => {
          try {
            const itemsRes = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${section.id}/items`);
            if (itemsRes.ok) {
              const items = await itemsRes.json();
              counts[section.id] = items.length;
            }
          } catch (err) {
            counts[section.id] = 0;
          }
        }));
        setItemCounts(counts);
      }
    } catch (err) {
      console.error('Error loading sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    if (!window.confirm('This will create all standard sections for your product page. Continue?')) {
      return;
    }

    try {
      const standardSections = SECTION_TYPES.filter(t => t.value !== 'media_banner'); // Exclude media as it needs manual setup
      
      for (const type of standardSections) {
        await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_type: type.value,
            title: type.label.replace(/🎯|⚡|💰|📋|🔒|💬|🔄|🚀/g, '').trim(),
            description: type.description,
            order_index: type.order,
            is_visible: 1
          })
        });
      }

      alert('Quick setup complete! All standard sections created. You can now add content to each section.');
      await loadSections();
    } catch (err) {
      alert('Error during quick setup: ' + err.message);
    }
  };

  // Delete functionality removed - users can only hide/unhide sections

  const handleMoveUp = async (section) => {
    const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sortedSections.findIndex(s => s.id === section.id);
    
    if (currentIndex === 0) {
      console.log('Already at top, cannot move up');
      return; // Already at top
    }
    
    const sectionAbove = sortedSections[currentIndex - 1];
    
    console.log('Moving up:', section.title, 'from', section.order_index, 'to', sectionAbove.order_index);
    console.log('Swapping with:', sectionAbove.title, 'from', sectionAbove.order_index, 'to', section.order_index);
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      // Swap orders
      const response1 = await fetch(`${baseUrl}/api/products/${productId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: section.section_type,
          title: section.title,
          description: section.description,
          is_visible: section.is_visible,
          order_index: sectionAbove.order_index,
          media_type: section.media_type,
          media_source: section.media_source,
          media_url: section.media_url,
          content: section.content
        })
      });
      
      console.log('Response 1:', response1.status);
      
      const response2 = await fetch(`${baseUrl}/api/products/${productId}/sections/${sectionAbove.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: sectionAbove.section_type,
          title: sectionAbove.title,
          description: sectionAbove.description,
          is_visible: sectionAbove.is_visible,
          order_index: section.order_index,
          media_type: sectionAbove.media_type,
          media_source: sectionAbove.media_source,
          media_url: sectionAbove.media_url,
          content: sectionAbove.content
        })
      });
      
      console.log('Response 2:', response2.status);
      
      if (response1.ok && response2.ok) {
        console.log('Swap successful, updating UI...');
        
        // Immediately update local state for smooth UI
        const updatedSections = sections.map(s => {
          if (s.id === section.id) {
            return { ...s, order_index: sectionAbove.order_index };
          }
          if (s.id === sectionAbove.id) {
            return { ...s, order_index: section.order_index };
          }
          return s;
        });
        setSections(updatedSections);
      } else {
        throw new Error('Failed to update sections');
      }
    } catch (err) {
      console.error('Error moving section:', err);
      alert('Error moving section: ' + err.message);
    }
  };

  const handleMoveDown = async (section) => {
    const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sortedSections.findIndex(s => s.id === section.id);
    
    if (currentIndex === sortedSections.length - 1) {
      console.log('Already at bottom, cannot move down');
      return; // Already at bottom
    }
    
    const sectionBelow = sortedSections[currentIndex + 1];
    
    console.log('Moving down:', section.title, 'from', section.order_index, 'to', sectionBelow.order_index);
    console.log('Swapping with:', sectionBelow.title, 'from', sectionBelow.order_index, 'to', section.order_index);
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      // Swap orders
      const response1 = await fetch(`${baseUrl}/api/products/${productId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: section.section_type,
          title: section.title,
          description: section.description,
          is_visible: section.is_visible,
          order_index: sectionBelow.order_index,
          media_type: section.media_type,
          media_source: section.media_source,
          media_url: section.media_url,
          content: section.content
        })
      });
      
      console.log('Response 1:', response1.status);
      
      const response2 = await fetch(`${baseUrl}/api/products/${productId}/sections/${sectionBelow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: sectionBelow.section_type,
          title: sectionBelow.title,
          description: sectionBelow.description,
          is_visible: sectionBelow.is_visible,
          order_index: section.order_index,
          media_type: sectionBelow.media_type,
          media_source: sectionBelow.media_source,
          media_url: sectionBelow.media_url,
          content: sectionBelow.content
        })
      });
      
      console.log('Response 2:', response2.status);
      
      if (response1.ok && response2.ok) {
        console.log('Swap successful, updating UI...');
        
        // Immediately update local state for smooth UI
        const updatedSections = sections.map(s => {
          if (s.id === section.id) {
            return { ...s, order_index: sectionBelow.order_index };
          }
          if (s.id === sectionBelow.id) {
            return { ...s, order_index: section.order_index };
          }
          return s;
        });
        setSections(updatedSections);
      } else {
        throw new Error('Failed to update sections');
      }
    } catch (err) {
      console.error('Error moving section:', err);
      alert('Error moving section: ' + err.message);
    }
  };

  const handleToggleVisibility = async (section) => {
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      // Build request body with all required fields
      const requestBody = {
        section_type: section.section_type,
        title: section.title,
        description: section.description,
        is_visible: section.is_visible ? 0 : 1,
        order_index: section.order_index,
        content: section.content
      };
      
      // Add media fields for media_banner sections
      if (section.section_type === 'media_banner') {
        requestBody.media_type = section.media_type || 'video';
        requestBody.media_source = section.media_source || 'youtube';
        requestBody.media_url = section.media_url || '';
      }
      
      const response = await fetch(`${baseUrl}/api/products/${productId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        // Immediately update local state for smooth UI
        const updatedSections = sections.map(s => 
          s.id === section.id 
            ? { ...s, is_visible: section.is_visible ? 0 : 1 }
            : s
        );
        setSections(updatedSections);
      } else {
        const errorData = await response.json();
        console.error('Toggle visibility error:', errorData);
        alert('Error: ' + (errorData.error || 'Failed to toggle visibility'));
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Error toggling visibility: ' + err.message);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const sectionTypeConfig = (type) => SECTION_TYPES.find(t => t.value === type) || {};

  if (productId === 'new') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Save Product First</h3>
        <p className="text-gray-600">Create the basic product information first, then you can add sections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ListBulletIcon className="w-6 h-6 text-blue-600" />
              Page Sections
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage the content sections of your product page
            </p>
          </div>
          <div className="flex gap-2">
            {sections.length === 0 && (
              <button
                onClick={handleQuickSetup}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                Quick Setup (Create All Sections)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Start Guide (show if no sections) */}
      {sections.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            Quick Start: Building Your Product Page
          </h4>
          <p className="text-sm text-gray-700 mb-4">
            Click <strong>"Quick Setup"</strong> to create all standard sections automatically. These are the only sections you'll need:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SECTION_TYPES.map((type, idx) => (
              <div 
                key={type.value} 
                className={`bg-white rounded-lg p-3 border ${type.required ? 'border-blue-300' : 'border-gray-200'}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${type.required ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{type.emoji} {type.label}</span>
                      {type.required && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>}
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sections...</p>
        </div>
      ) : sections.length > 0 ? (
        <div className="space-y-3">
          {sortedSections.map((section) => {
            const config = sectionTypeConfig(section.section_type);
            return (
              <div 
                key={section.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 ease-in-out"
                style={{ 
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Order Badge */}
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {section.order_index}
                  </div>

                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{config.emoji}</span>
                      <h4 className="text-base font-semibold text-gray-900">{section.title}</h4>
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        {config.label || section.section_type}
                      </span>
                      {!section.is_visible && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Hidden</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{section.description || 'No description'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {itemCounts[section.id] || 0} items
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-blue-600">{config.helpText}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Move Up/Down Arrows */}
                    <div className="flex flex-col gap-0.5 border-r border-gray-300 pr-3 mr-1">
                      <button
                        onClick={() => handleMoveUp(section)}
                        disabled={sortedSections.indexOf(section) === 0}
                        className={`p-1 rounded transition-colors ${
                          sortedSections.indexOf(section) === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        title="Move section up"
                      >
                        <ChevronUpIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(section)}
                        disabled={sortedSections.indexOf(section) === sortedSections.length - 1}
                        className={`p-1 rounded transition-colors ${
                          sortedSections.indexOf(section) === sortedSections.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        title="Move section down"
                      >
                        <ChevronDownIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => onManageItems(section)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Items ({itemCounts[section.id] || 0})
                    </button>
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit section"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(section)}
                      className={`p-2 rounded-lg transition-colors ${
                        section.is_visible 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={section.is_visible ? 'Hide section (will not show on frontend)' : 'Show section (will show on frontend)'}
                    >
                      {section.is_visible ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Section Editor */}
                {editingSection?.id === section.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <SectionEditorInline
                      section={section}
                      sections={sections}
                      productId={productId}
                      onSave={async (updatedData) => {
                        try {
                          // Check if order changed
                          const oldOrder = section.order_index;
                          const newOrder = updatedData.order_index;
                          
                          if (oldOrder !== newOrder) {
                            // Find section currently at new order position
                            const conflictingSection = sections.find(s => s.order_index === newOrder && s.id !== section.id);
                            
                            if (conflictingSection) {
                              // Swap orders: Move conflicting section to old order
                              await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${conflictingSection.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  ...conflictingSection,
                                  order_index: oldOrder
                                })
                              });
                            }
                          }
                          
                          // Update current section
                          const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${section.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedData)
                          });
                          
                          if (response.ok) {
                            await loadSections();
                            setEditingSection(null);
                            if (oldOrder !== newOrder) {
                              alert(`Order updated! Section moved from position ${oldOrder} to ${newOrder}`);
                            }
                          }
                        } catch (err) {
                          alert('Error updating section: ' + err.message);
                        }
                      }}
                      onCancel={() => setEditingSection(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

    </div>
  );
};

// Inline Section Editor Component
const SectionEditorInline = ({ section, sections = [], productId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    section_type: section?.section_type || 'hero',
    title: section?.title || '',
    description: section?.description || '',
    order_index: section?.order_index !== undefined ? section.order_index : 0,
    is_visible: section?.is_visible !== undefined ? section.is_visible : 1,
    media_type: section?.media_type || 'video',
    media_source: section?.media_source || 'youtube',
    media_url: section?.media_url || '',
    content: section?.content || ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // For security section - parse content JSON
  const [securityContent, setSecurityContent] = useState({ title: '', features: [] });
  
  useEffect(() => {
    if (section?.section_type === 'security' && section?.content) {
      try {
        const parsed = JSON.parse(section.content);
        setSecurityContent({
          title: parsed.title || 'Security Features',
          features: parsed.features || []
        });
      } catch (e) {
        setSecurityContent({ title: 'Security Features', features: [] });
      }
    }
  }, [section]);

  const selectedTypeConfig = SECTION_TYPES.find(t => t.value === formData.section_type) || {};
  const isMediaBanner = formData.section_type === 'media_banner';
  const isSecurity = formData.section_type === 'security';

  const handleFileUpload = async (file, type) => {
    setUploading(true);
    setUploadError('');
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      const formDataObj = new FormData();
      formDataObj.append(type === 'image' ? 'image' : 'video', file);
      
      const endpoint = type === 'image' ? '/api/upload/image' : '/api/upload/video';
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      // Update form data with uploaded file path
      setFormData(prev => ({
        ...prev,
        media_url: data.filePath,
        media_source: 'upload'
      }));
      
      setUploadError('');
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate media fields for media_banner
    if (isMediaBanner) {
      if (!formData.media_type) {
        setUploadError('Please select media type');
        return;
      }
      if (!formData.media_source) {
        setUploadError('Please select media source');
        return;
      }
      if (!formData.media_url) {
        setUploadError('Please provide media URL or upload a file');
        return;
      }
    }
    
    // For security section, include content JSON
    let finalData = { ...formData };
    if (isSecurity) {
      finalData.content = JSON.stringify(securityContent);
    }
    
    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section Type (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
          {selectedTypeConfig.emoji} {selectedTypeConfig.label}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {selectedTypeConfig.description} • Type cannot be changed
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`e.g., ${selectedTypeConfig.label}`}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description for this section"
        />
      </div>

      {/* Security Section - Features Box (Right Side) */}
      {isSecurity && (
        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg space-y-4">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 text-xl">📋</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Right Side Features Box</p>
              <p className="text-xs text-gray-600 mb-3">
                This creates a box on the right side of the security section with a checklist of features.
                The left side cards are managed via "Items" button.
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Box Title</label>
            <input
              type="text"
              value={securityContent.title}
              onChange={(e) => setSecurityContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Security Features"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features List (one per line)</label>
            <textarea
              value={(securityContent.features || []).join('\n')}
              onChange={(e) => setSecurityContent(prev => ({ 
                ...prev, 
                features: e.target.value.split('\n').filter(Boolean) 
              }))}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Isolated GPU resources&#10;Encrypted storage and network&#10;VPC and firewall protection&#10;SOC 2 & ISO 27001 certified&#10;Regular security updates&#10;Data residency compliance"
            />
            <p className="text-xs text-gray-500 mt-1">
              These appear as checkmark items in the right-side box
            </p>
          </div>
        </div>
      )}

      {/* Media Fields (only for media_banner) */}
      {isMediaBanner && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Media Type *</label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="media_type"
                  value="video"
                  checked={formData.media_type === 'video'}
                  onChange={(e) => setFormData(prev => ({ ...prev, media_type: e.target.value, media_source: '', media_url: '' }))}
                  className="w-4 h-4 text-blue-600"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">Video</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="media_type"
                  value="image"
                  checked={formData.media_type === 'image'}
                  onChange={(e) => setFormData(prev => ({ ...prev, media_type: e.target.value, media_source: 'upload', media_url: '' }))}
                  className="w-4 h-4 text-blue-600"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">Photo</span>
              </label>
            </div>
          </div>

          {/* Video Source (only if Video selected) */}
          {formData.media_type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Video Source *</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="media_source"
                    value="youtube"
                    checked={formData.media_source === 'youtube'}
                    onChange={(e) => setFormData(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                    className="w-4 h-4 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">YouTube Link</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="media_source"
                    value="upload"
                    checked={formData.media_source === 'upload'}
                    onChange={(e) => setFormData(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                    className="w-4 h-4 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">Upload File</span>
                </label>
              </div>
            </div>
          )}

          {/* YouTube URL Input */}
          {formData.media_type === 'video' && formData.media_source === 'youtube' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData(prev => ({ ...prev, media_url: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste any YouTube video URL (watch, embed, or short link)
              </p>
            </div>
          )}

          {/* Video File Upload */}
          {formData.media_type === 'video' && formData.media_source === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video *</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Validate file size
                    if (file.size > 100 * 1024 * 1024) {
                      setUploadError('File too large. Maximum size is 100MB');
                      return;
                    }
                    // Validate file type
                    if (file.type !== 'video/mp4') {
                      setUploadError('Invalid file type. Only MP4 videos are allowed');
                      return;
                    }
                    handleFileUpload(file, 'video');
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
              <p className="mt-1 text-xs text-gray-500">
                MP4 format. Maximum size: 100MB
              </p>
              {formData.media_url && formData.media_source === 'upload' && (
                <p className="mt-2 text-xs text-green-600">✓ Video uploaded: {formData.media_url}</p>
              )}
            </div>
          )}

          {/* Photo Upload */}
          {formData.media_type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo *</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Validate file size
                    if (file.size > 10 * 1024 * 1024) {
                      setUploadError('File too large. Maximum size is 10MB');
                      return;
                    }
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    if (!validTypes.includes(file.type)) {
                      setUploadError('Invalid file type. Only JPEG, JPG, and PNG are allowed');
                      return;
                    }
                    handleFileUpload(file, 'image');
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
                required={!formData.media_url}
              />
              <p className="mt-1 text-xs text-gray-500">
                JPEG, JPG, or PNG format. Maximum size: 10MB
              </p>
              {formData.media_url && formData.media_source === 'upload' && (
                <p className="mt-2 text-xs text-green-600">✓ Photo uploaded: {formData.media_url}</p>
              )}
            </div>
          )}

          {/* Upload Status */}
          {uploading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-800">Uploading file...</p>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{uploadError}</p>
            </div>
          )}
        </div>
      )}

      {/* Order (Read-only - use arrows to change) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
        <input
          type="number"
          value={formData.order_index}
          readOnly
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Current position: <strong>{formData.order_index}</strong>
        </p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
          💡 <strong>To reorder:</strong> Use the Up/Down arrow buttons (↑↓) in the section list to move sections
        </div>
      </div>

      {/* Helper */}
      {selectedTypeConfig.helpText && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-900">
            <strong>Next step:</strong> {selectedTypeConfig.helpText}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {section ? 'Update Section' : 'Create Section'}
        </button>
      </div>
    </form>
  );
};

export default SectionManager;
export { SECTION_TYPES };

