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

// Global visibility flag - set to true to show, false to hide
const SHOW_QUARTERLY_COLUMN = false;

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

const SectionManager = ({ solutionId, onManageItems }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    if (solutionId && solutionId !== 'new') {
      loadSections();
    }
  }, [solutionId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      // Add cache-busting timestamp
      const timestamp = new Date().getTime();
      const response = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded sections:', data);
        setSections(data);
        
        // Load item counts
        const counts = {};
        await Promise.all(data.map(async (section) => {
          try {
            const itemsRes = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${section.id}/items`);
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
    if (!window.confirm('This will create all standard sections for your solution page. Continue?')) {
      return;
    }

    try {
      const standardSections = SECTION_TYPES.filter(t => t.value !== 'media_banner'); // Exclude media as it needs manual setup
      
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      for (const type of standardSections) {
        await fetch(`${baseUrl}/api/solutions/${solutionId}/sections`, {
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

  const handleMoveUp = async (section) => {
    const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sortedSections.findIndex(s => s.id === section.id);
    
    if (currentIndex === 0) {
      return; // Already at top
    }
    
    const sectionAbove = sortedSections[currentIndex - 1];
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      
      // Swap orders - include all fields to preserve section data
      const response1 = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${section.id}`, {
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
      
      if (!response1.ok) {
        const errorData = await response1.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update section');
      }
      
      const response2 = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${sectionAbove.id}`, {
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
      
      if (!response2.ok) {
        const errorData = await response2.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update section');
      }
      
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
    } catch (err) {
      console.error('Error moving section:', err);
      alert('Error moving section: ' + err.message);
    }
  };

  const handleMoveDown = async (section) => {
    const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
    const currentIndex = sortedSections.findIndex(s => s.id === section.id);
    
    if (currentIndex === sortedSections.length - 1) {
      return; // Already at bottom
    }
    
    const sectionBelow = sortedSections[currentIndex + 1];
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      
      // Swap orders - include all fields to preserve section data
      const response1 = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${section.id}`, {
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
      
      if (!response1.ok) {
        const errorData = await response1.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update section');
      }
      
      const response2 = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${sectionBelow.id}`, {
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
      
      if (!response2.ok) {
        const errorData = await response2.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update section');
      }
      
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
    } catch (err) {
      console.error('Error moving section:', err);
      alert('Error moving section: ' + err.message);
    }
  };

  const handleToggleVisibility = async (section) => {
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      
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
      
      const response = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${section.id}`, {
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

  if (solutionId === 'new') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Save Solution First</h3>
        <p className="text-gray-600">Create the basic solution information first, then you can add sections.</p>
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
              Manage the content sections of your solution page
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
            Quick Start: Building Your Solution Page
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
                      solutionId={solutionId}
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
                              const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
                              const swapResponse = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${conflictingSection.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  ...conflictingSection,
                                  order_index: oldOrder
                                })
                              });
                              
                              if (!swapResponse.ok) {
                                const errorData = await swapResponse.json().catch(() => ({ error: 'Failed to swap section order' }));
                                throw new Error(errorData.error || 'Failed to swap section order');
                              }
                            }
                          }
                          
                          // Update current section
                          const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
                          
                          // Ensure all required fields are included
                          // Always include description - even if empty string (user might want to clear it)
                          const updatePayload = {
                            section_type: updatedData.section_type !== undefined ? updatedData.section_type : section.section_type,
                            title: updatedData.title !== undefined ? updatedData.title : section.title,
                            description: updatedData.description !== undefined ? updatedData.description : (section.description || ''),
                            order_index: updatedData.order_index !== undefined ? updatedData.order_index : section.order_index,
                            is_visible: updatedData.is_visible !== undefined ? updatedData.is_visible : section.is_visible,
                            content: updatedData.content !== undefined ? updatedData.content : (section.content || null)
                          };
                          
                          // Add media fields if section is media_banner
                          if (section.section_type === 'media_banner' || updatedData.section_type === 'media_banner') {
                            updatePayload.media_type = updatedData.media_type || section.media_type || 'video';
                            updatePayload.media_source = updatedData.media_source || section.media_source || 'youtube';
                            updatePayload.media_url = updatedData.media_url || section.media_url || '';
                          }
                          
                          // Add pricing table header fields if section is pricing
                          if (section.section_type === 'pricing' || updatedData.section_type === 'pricing') {
                            updatePayload.pricing_table_header_plan = updatedData.pricing_table_header_plan !== undefined ? updatedData.pricing_table_header_plan : (section.pricing_table_header_plan || 'Plan');
                            updatePayload.pricing_table_header_specs = updatedData.pricing_table_header_specs !== undefined ? updatedData.pricing_table_header_specs : (section.pricing_table_header_specs || 'Specifications');
                            updatePayload.pricing_table_header_features = updatedData.pricing_table_header_features !== undefined ? updatedData.pricing_table_header_features : (section.pricing_table_header_features || 'Features');
                            updatePayload.pricing_table_header_hourly = updatedData.pricing_table_header_hourly !== undefined ? updatedData.pricing_table_header_hourly : (section.pricing_table_header_hourly || 'Price Hourly');
                            updatePayload.pricing_table_header_monthly = updatedData.pricing_table_header_monthly !== undefined ? updatedData.pricing_table_header_monthly : (section.pricing_table_header_monthly || 'Price Monthly');
                            updatePayload.pricing_table_header_quarterly = updatedData.pricing_table_header_quarterly !== undefined ? updatedData.pricing_table_header_quarterly : (section.pricing_table_header_quarterly || 'Price Quarterly');
                            updatePayload.pricing_table_header_yearly = updatedData.pricing_table_header_yearly !== undefined ? updatedData.pricing_table_header_yearly : (section.pricing_table_header_yearly || 'Price Yearly');
                            updatePayload.pricing_table_header_action = updatedData.pricing_table_header_action !== undefined ? updatedData.pricing_table_header_action : (section.pricing_table_header_action || 'Action');
                            // Column visibility
                            updatePayload.show_hourly_column = updatedData.show_hourly_column !== undefined ? updatedData.show_hourly_column : (section.show_hourly_column !== undefined ? section.show_hourly_column : 1);
                            updatePayload.show_monthly_column = updatedData.show_monthly_column !== undefined ? updatedData.show_monthly_column : (section.show_monthly_column !== undefined ? section.show_monthly_column : 1);
                            updatePayload.show_quarterly_column = updatedData.show_quarterly_column !== undefined ? updatedData.show_quarterly_column : (section.show_quarterly_column !== undefined ? section.show_quarterly_column : 1);
                            updatePayload.show_yearly_column = updatedData.show_yearly_column !== undefined ? updatedData.show_yearly_column : (section.show_yearly_column !== undefined ? section.show_yearly_column : 1);
                          }
                          
                          console.log('Updating section with payload:', updatePayload);
                          
                          const response = await fetch(`${baseUrl}/api/solutions/${solutionId}/sections/${section.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatePayload)
                          });
                          
                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                            console.error('Update failed:', errorData);
                            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
                          }
                          
                          const result = await response.json();
                          console.log('Update successful:', result);
                          
                          // Force reload sections to get fresh data
                          await loadSections();
                          setEditingSection(null);
                          
                          if (oldOrder !== newOrder) {
                            alert(`✅ Order updated! Section moved from position ${oldOrder} to ${newOrder}`);
                          } else {
                            alert('✅ Section updated successfully!');
                          }
                        } catch (err) {
                          console.error('Error updating section:', err);
                          alert('❌ Error updating section: ' + err.message);
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

// Inline Section Editor Component (simplified version - media editing via items)
const SectionEditorInline = ({ section, sections = [], solutionId, onSave, onCancel }) => {
  // Initialize formData from section prop, and update when section changes
  const [formData, setFormData] = useState({
    section_type: section?.section_type || 'hero',
    title: section?.title || '',
    description: section?.description || '',
    order_index: section?.order_index !== undefined ? section.order_index : 0,
    is_visible: section?.is_visible !== undefined ? section.is_visible : 1,
    media_type: section?.media_type || 'video',
    media_source: section?.media_source || 'youtube',
    media_url: section?.media_url || '',
    content: section?.content || '',
    // Pricing table headers
    pricing_table_header_plan: section?.pricing_table_header_plan || 'Plan',
    pricing_table_header_specs: section?.pricing_table_header_specs || 'Specifications',
    pricing_table_header_features: section?.pricing_table_header_features || 'Features',
    pricing_table_header_hourly: section?.pricing_table_header_hourly || 'Price Hourly',
    pricing_table_header_monthly: section?.pricing_table_header_monthly || 'Price Monthly',
    pricing_table_header_quarterly: section?.pricing_table_header_quarterly || 'Price Quarterly',
    pricing_table_header_yearly: section?.pricing_table_header_yearly || 'Price Yearly',
    pricing_table_header_action: section?.pricing_table_header_action || 'Action',
    // Column visibility (default to true for backward compatibility)
    show_hourly_column: section?.show_hourly_column !== undefined ? section.show_hourly_column : 1,
    show_monthly_column: section?.show_monthly_column !== undefined ? section.show_monthly_column : 1,
    show_quarterly_column: section?.show_quarterly_column !== undefined ? section.show_quarterly_column : 1,
    show_yearly_column: section?.show_yearly_column !== undefined ? section.show_yearly_column : 1
  });
  
  // Update formData when section prop changes (e.g., after reload)
  useEffect(() => {
    if (section) {
      setFormData({
        section_type: section.section_type || 'hero',
        title: section.title || '',
        description: section.description || '',
        order_index: section.order_index !== undefined ? section.order_index : 0,
        is_visible: section.is_visible !== undefined ? section.is_visible : 1,
        media_type: section.media_type || 'video',
        media_source: section.media_source || 'youtube',
        media_url: section.media_url || '',
        content: section.content || '',
        // Pricing table headers
        pricing_table_header_plan: section.pricing_table_header_plan || 'Plan',
        pricing_table_header_specs: section.pricing_table_header_specs || 'Specifications',
        pricing_table_header_features: section.pricing_table_header_features || 'Features',
        pricing_table_header_hourly: section.pricing_table_header_hourly || 'Price Hourly',
        pricing_table_header_monthly: section.pricing_table_header_monthly || 'Price Monthly',
        pricing_table_header_quarterly: section.pricing_table_header_quarterly || 'Price Quarterly',
        pricing_table_header_yearly: section.pricing_table_header_yearly || 'Price Yearly',
        pricing_table_header_action: section.pricing_table_header_action || 'Action',
        // Column visibility (default to true for backward compatibility)
        show_hourly_column: section.show_hourly_column !== undefined ? section.show_hourly_column : 1,
        show_monthly_column: section.show_monthly_column !== undefined ? section.show_monthly_column : 1,
        show_quarterly_column: section.show_quarterly_column !== undefined ? section.show_quarterly_column : 1,
        show_yearly_column: section.show_yearly_column !== undefined ? section.show_yearly_column : 1
      });
    }
  }, [section]);

  const selectedTypeConfig = SECTION_TYPES.find(t => t.value === formData.section_type) || {};
  const isPricing = formData.section_type === 'pricing';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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

      {/* Pricing Table Headers Configuration (only for pricing sections) */}
      {isPricing && (
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 text-xl">💰</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Pricing Table Headers</p>
              <p className="text-xs text-gray-600 mb-3">
                Customize the column headers displayed in the pricing table. These headers appear at the top of each column.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Plan</label>
              <input
                type="text"
                value={formData.pricing_table_header_plan}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_plan: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Plan"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Specifications</label>
              <input
                type="text"
                value={formData.pricing_table_header_specs}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_specs: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Specifications"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Features</label>
              <input
                type="text"
                value={formData.pricing_table_header_features}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_features: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Features"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Hourly</label>
              <input
                type="text"
                value={formData.pricing_table_header_hourly}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_hourly: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Price Hourly"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Monthly</label>
              <input
                type="text"
                value={formData.pricing_table_header_monthly}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_monthly: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Price Monthly"
              />
            </div>
            {SHOW_QUARTERLY_COLUMN && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Header: Quarterly</label>
                <input
                  type="text"
                  value={formData.pricing_table_header_quarterly}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_quarterly: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Price Quarterly"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Yearly</label>
              <input
                type="text"
                value={formData.pricing_table_header_yearly}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_yearly: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Price Yearly"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Header: Action</label>
              <input
                type="text"
                value={formData.pricing_table_header_action}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing_table_header_action: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Action"
              />
            </div>
          </div>
          
          {/* Column Visibility Toggles */}
          <div className="mt-4 pt-4 border-t border-blue-300">
            <p className="text-sm font-semibold text-gray-900 mb-3">Column Visibility</p>
            <p className="text-xs text-gray-600 mb-3">
              Show or hide pricing columns. Hide columns that you don't use (e.g., if you only have hourly and monthly pricing).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_hourly_column === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, show_hourly_column: e.target.checked ? 1 : 0 }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Hourly Column</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_monthly_column === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, show_monthly_column: e.target.checked ? 1 : 0 }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Monthly Column</span>
              </label>
              {SHOW_QUARTERLY_COLUMN && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_quarterly_column === 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, show_quarterly_column: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Quarterly Column</span>
                </label>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_yearly_column === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, show_yearly_column: e.target.checked ? 1 : 0 }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Yearly Column</span>
              </label>
            </div>
          </div>
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

