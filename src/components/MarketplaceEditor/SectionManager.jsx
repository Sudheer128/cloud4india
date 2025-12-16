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

const SectionManager = ({ marketplaceId, onManageItems }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    if (marketplaceId && marketplaceId !== 'new') {
      loadSections();
    }
  }, [marketplaceId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections`);
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        
        // Load item counts
        const counts = {};
        await Promise.all(data.map(async (section) => {
          try {
            const itemsRes = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items`);
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
    if (!window.confirm('This will create all standard sections for your marketplace app page. Continue?')) {
      return;
    }

    try {
      const standardSections = SECTION_TYPES.filter(t => t.value !== 'media_banner'); // Exclude media as it needs manual setup
      
      for (const type of standardSections) {
        await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections`, {
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
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      // Swap orders
      await fetch(`${baseUrl}/api/marketplaces/${marketplaceId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          is_visible: section.is_visible,
          order_index: sectionAbove.order_index
        })
      });
      
      await fetch(`${baseUrl}/api/marketplaces/${marketplaceId}/sections/${sectionAbove.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: sectionAbove.section_type,
          title: sectionAbove.title,
          content: sectionAbove.content,
          is_visible: sectionAbove.is_visible,
          order_index: section.order_index
        })
      });
      
      await loadSections();
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
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      // Swap orders
      await fetch(`${baseUrl}/api/marketplaces/${marketplaceId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          is_visible: section.is_visible,
          order_index: sectionBelow.order_index
        })
      });
      
      await fetch(`${baseUrl}/api/marketplaces/${marketplaceId}/sections/${sectionBelow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section_type: sectionBelow.section_type,
          title: sectionBelow.title,
          content: sectionBelow.content,
          is_visible: sectionBelow.is_visible,
          order_index: section.order_index
        })
      });
      
      await loadSections();
    } catch (err) {
      console.error('Error moving section:', err);
      alert('Error moving section: ' + err.message);
    }
  };

  const handleToggleVisibility = async (section) => {
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
      
      const requestBody = {
        section_type: section.section_type,
        title: section.title,
        content: section.content,
        is_visible: section.is_visible ? 0 : 1,
        order_index: section.order_index
      };
      
      const response = await fetch(`${baseUrl}/api/marketplaces/${marketplaceId}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        await loadSections();
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Error toggling visibility: ' + err.message);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const sectionTypeConfig = (type) => SECTION_TYPES.find(t => t.value === type) || {};

  if (marketplaceId === 'new') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Save App First</h3>
        <p className="text-gray-600">Create the basic app information first, then you can add sections.</p>
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
              Manage the content sections of your marketplace app page
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
            Quick Start: Building Your App Page
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300"
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
                    <p className="text-sm text-gray-600 line-clamp-1">{section.content || 'No description'}</p>
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
                      title={section.is_visible ? 'Hide section' : 'Show section'}
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
                      marketplaceId={marketplaceId}
                      onSave={async (updatedData) => {
                        try {
                          const payload = {
                            section_type: updatedData.section_type,
                            title: updatedData.title,
                            content: updatedData.content,
                            is_visible: updatedData.is_visible,
                            order_index: updatedData.order_index
                          };
                          
                          const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                          });
                          
                          if (response.ok) {
                            await loadSections();
                            setEditingSection(null);
                            alert('Section updated successfully!');
                          } else {
                            const errorData = await response.json();
                            alert('Error updating section: ' + (errorData.error || 'Update failed'));
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

// Inline Section Editor Component (simplified version - full edit/content in section.content field)
const SectionEditorInline = ({ section, marketplaceId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    section_type: section?.section_type || 'hero',
    title: section?.title || '',
    content: section?.content || '',
    order_index: section?.order_index !== undefined ? section.order_index : 0,
    is_visible: section?.is_visible !== undefined ? section.is_visible : 1
  });

  const selectedTypeConfig = SECTION_TYPES.find(t => t.value === formData.section_type) || {};
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Error in form submit:', err);
      setValidationError(err.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section Type (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
          {selectedTypeConfig.emoji} {selectedTypeConfig.label}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Section content... (HTML supported)"
        />
      </div>


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
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            'Update Section'
          )}
        </button>
      </div>
    </form>
  );
};

export default SectionManager;
export { SECTION_TYPES };

