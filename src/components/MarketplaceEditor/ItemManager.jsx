import { CMS_URL } from '../../utils/config';
import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  ArrowLeftIcon,
  CubeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ItemEditor from './ItemEditor';
import IconSelector from './IconSelector';

const ItemManager = ({ marketplace, section, onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  // Hero Configuration state
  const [sectionIcon, setSectionIcon] = useState('');
  const [heroButtons, setHeroButtons] = useState({
    primary: { id: null, text: '', url: '' },
    secondary: { id: null, text: '', url: '' }
  });
  const [savingIcon, setSavingIcon] = useState(false);
  const [savingButtons, setSavingButtons] = useState(false);

  useEffect(() => {
    loadItems();
    if (section.section_type === 'hero') {
      loadSectionIcon();
    }
  }, [section]);
  
  const loadSectionIcon = async () => {
    try {
      const response = await fetch(
        `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}`
      );
      if (response.ok) {
        const sectionData = await response.json();
        setSectionIcon(sectionData.icon || '');
      }
    } catch (err) {
      console.error('Error loading section icon:', err);
    }
  };
  
  const saveSectionIcon = async () => {
    setSavingIcon(true);
    try {
      const response = await fetch(
        `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_type: section.section_type,
            title: section.title,
            content: section.content,
            icon: sectionIcon,
            is_visible: section.is_visible,
            order_index: section.order_index
          })
        }
      );
      if (response.ok) {
        alert('Icon saved successfully!');
      } else {
        throw new Error('Failed to save icon');
      }
    } catch (err) {
      alert('Error saving icon: ' + err.message);
    } finally {
      setSavingIcon(false);
    }
  };
  
  const loadHeroButtons = () => {
    const primaryButton = items.find(item => item.item_type === 'cta_primary' && item.is_visible !== 0);
    const secondaryButton = items.find(item => item.item_type === 'cta_secondary' && item.is_visible !== 0);
    
    setHeroButtons({
      primary: {
        id: primaryButton?.id || null,
        text: primaryButton?.title || 'Get Started Today',
        url: primaryButton?.value || ''
      },
      secondary: {
        id: secondaryButton?.id || null,
        text: secondaryButton?.title || 'Watch Demo',
        url: secondaryButton?.value || ''
      }
    });
  };
  
  useEffect(() => {
    if (section.section_type === 'hero') {
      loadHeroButtons();
    }
  }, [items, section.section_type]);
  
  const saveHeroButton = async (buttonType) => {
    const button = heroButtons[buttonType];
    if (!button.text.trim()) {
      alert(`Please enter ${buttonType === 'primary' ? 'Primary' : 'Secondary'} button text`);
      return;
    }
    
    setSavingButtons(true);
    try {
      const itemType = buttonType === 'primary' ? 'cta_primary' : 'cta_secondary';
      const payload = {
        item_type: itemType,
        title: button.text,
        value: button.url || '#',
        is_visible: 1,
        order_index: buttonType === 'primary' ? 0 : 1
      };
      
      const url = button.id
        ? `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}/items/${button.id}`
        : `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}/items`;
      
      const method = button.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        setHeroButtons(prev => ({
          ...prev,
          [buttonType]: {
            ...prev[buttonType],
            id: result.id || button.id
          }
        }));
        alert(`${buttonType === 'primary' ? 'Primary' : 'Secondary'} button saved successfully!`);
        await loadItems();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to save button');
      }
    } catch (err) {
      console.error('Error saving button:', err);
      alert('Error saving button: ' + err.message);
    } finally {
      setSavingButtons(false);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}/items`
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const response = await fetch(
        `${CMS_URL}/api/marketplaces/${marketplace.id}/sections/${section.id}/items/${itemId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        await loadItems();
      }
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  // For hero sections, filter out CTA buttons from items list (they're shown in Hero Configuration)
  const filteredItems = section.section_type === 'hero' 
    ? items.filter(item => item.item_type !== 'cta_primary' && item.item_type !== 'cta_secondary')
    : items;
  
  const sortedItems = [...filteredItems].sort((a, b) => a.order_index - b.order_index);
  
  // Check if buttons exist for hero sections
  const hasButtons = section.section_type === 'hero' && (
    heroButtons.primary.id !== null || heroButtons.secondary.id !== null ||
    items.some(item => (item.item_type === 'cta_primary' || item.item_type === 'cta_secondary') && item.is_visible !== 0)
  );

  // Get section type config
  const sectionTypeHelp = {
    hero: { itemTypes: ['feature', 'stat', 'cta_primary'], help: 'Add 3 features, 3 stats, and 1 CTA button' },
    features: { itemTypes: ['feature'], help: 'Add 6-9 feature cards with icons' },
    pricing: { itemTypes: ['pricing_plan'], help: 'Add pricing plans (each plan is a table row)' },
    specifications: { itemTypes: ['specification'], help: 'Add specification categories' },
    security: { itemTypes: ['security_feature'], help: 'Add security features' },
    support: { itemTypes: ['support_channel'], help: 'Add support channels (4 recommended)' },
    migration: { itemTypes: ['step'], help: 'Add 3 migration steps' },
    use_cases: { itemTypes: ['use_case'], help: 'Add use case cards' },
    cta: { itemTypes: ['cta_primary', 'cta_secondary'], help: 'Add 1-2 CTA buttons' }
  };

  const config = sectionTypeHelp[section.section_type] || { itemTypes: [], help: 'Add items for this section' };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Sections
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Section: {section.section_type} • Order: {section.order_index}
                {section.section_type === 'media_banner' && (
                  <>
                    <span> • </span>
                    <span className={items.length >= 10 ? 'text-red-600 font-semibold' : 'text-blue-600'}>
                      {items.length} / 10 media items
                    </span>
                  </>
                )}
                {section.section_type === 'hero' && (
                  <>
                    <span> • </span>
                    <span className="text-blue-600">
                      {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
                      {hasButtons && (
                        <span className="text-green-600"> • Buttons configured</span>
                      )}
                    </span>
                  </>
                )}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {section.section_type === 'hero' && hasButtons 
                  ? 'Add features and stats below. Buttons are configured above.' 
                  : config.help}
              </p>
            </div>

            {/* Add Item Button - Only for Gallery/Video (media_banner) sections */}
            {section.section_type === 'media_banner' && (
              <button
                onClick={() => setEditingItem({ id: 'new' })}
                disabled={items.length >= 10}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${items.length >= 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
                  }`}
                title={
                  items.length >= 10
                    ? 'Maximum 10 media items allowed'
                    : 'Add new media item'
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {`Add Media ${items.length < 10 ? `(${10 - items.length} slots left)` : '(Limit reached)'}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Configuration Section (only for hero sections) */}
      {section.section_type === 'hero' && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Hero Section Configuration
            </h3>
            
            {/* Icon/Logo Configuration */}
            <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Icon/Logo <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Choose an icon or upload a custom logo to display at the top of the hero section
              </p>
              <IconSelector
                value={sectionIcon}
                onChange={(iconValue) => setSectionIcon(iconValue)}
                optional={true}
              />
              <button
                onClick={saveSectionIcon}
                disabled={savingIcon}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingIcon ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Save Icon
                  </>
                )}
              </button>
            </div>
            
            {/* Hero Buttons Configuration */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Hero Section Buttons
              </label>
              <p className="text-xs text-gray-600 mb-4">
                Configure the two call-to-action buttons displayed in the hero section
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Button */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900">Primary Button</label>
                      <p className="text-xs text-gray-600">Solid teal/amber (left)</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Button Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={heroButtons.primary.text}
                        onChange={(e) => setHeroButtons(prev => ({
                          ...prev,
                          primary: { ...prev.primary, text: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        placeholder="e.g., Get Started Today"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Redirect URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={heroButtons.primary.url}
                        onChange={(e) => setHeroButtons(prev => ({
                          ...prev,
                          primary: { ...prev.primary, url: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        placeholder="https://portal.cloud4india.com"
                      />
                    </div>
                    <button
                      onClick={() => saveHeroButton('primary')}
                      disabled={savingButtons}
                      className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingButtons ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Save Primary Button
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900">Secondary Button</label>
                      <p className="text-xs text-gray-600">White border (right)</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Button Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={heroButtons.secondary.text}
                        onChange={(e) => setHeroButtons(prev => ({
                          ...prev,
                          secondary: { ...prev.secondary, text: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="e.g., Watch Demo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Redirect URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={heroButtons.secondary.url}
                        onChange={(e) => setHeroButtons(prev => ({
                          ...prev,
                          secondary: { ...prev.secondary, url: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                    <button
                      onClick={() => saveHeroButton('secondary')}
                      disabled={savingButtons}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingButtons ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Save Secondary Button
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading items...</p>
          </div>
        ) : sortedItems.length > 0 ? (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                sectionType={section.section_type}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item.id)}
                showDelete={section.section_type === 'use_cases'}
              />
            ))}
          </div>
        ) : (
          // Only show empty state if no items AND (not hero section OR no buttons configured)
          (!(section.section_type === 'hero' && hasButtons)) && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
              <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-600">
                {section.section_type === 'hero' 
                  ? 'Add features and stats below. Buttons are configured above.' 
                  : config.help}
              </p>
              {section.section_type !== 'hero' && (
                <p className="text-sm text-gray-500 mt-2">Items will appear when you add them</p>
              )}
            </div>
          )
        )}
      </div>

      {/* Item Editor Modal */}
      {editingItem && (
        <ItemEditor
          item={editingItem.id === 'new' ? null : editingItem}
          sectionType={section.section_type}
          sectionId={section.id}
          marketplaceId={marketplace.id}
          marketplaceName={marketplace.name}
          onSave={async () => {
            await loadItems();
            setEditingItem(null);
          }}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// Item Card Component - shows preview based on type
const ItemCard = ({ item, sectionType, onEdit, onDelete, showDelete = false }) => {
  const renderPreview = () => {
    // Parse content if it's JSON
    let content = {};
    try {
      content = item.content ? JSON.parse(item.content) : {};
    } catch (e) {
      // Not JSON, that's okay
    }

    switch (sectionType) {
      case 'pricing':
        return (
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <div><strong>App Name:</strong> {item.title || 'N/A'}</div>
            {content.hourly_price && <div><strong>Hourly:</strong> {content.hourly_price}</div>}
            {content.monthly_price && <div><strong>Monthly:</strong> {content.monthly_price}</div>}
            {content.quarterly_price && <div><strong>Quarterly:</strong> {content.quarterly_price}</div>}
            {content.yearly_price && <div><strong>Yearly:</strong> {content.yearly_price}</div>}
            {/* Backward compatibility: show old price if new prices don't exist */}
            {!content.hourly_price && !content.monthly_price && content.price && <div><strong>Price:</strong> {content.price}</div>}
            {content.specifications && Array.isArray(content.specifications) && <div><strong>Specs:</strong> {content.specifications.length} items</div>}
            {content.features && Array.isArray(content.features) && <div><strong>Features:</strong> {content.features.length} items</div>}
            {content.buttonText && <div><strong>Button:</strong> {content.buttonText}</div>}
          </div>
        );

      case 'hero':
        if (item.item_type === 'stat') {
          return <div className="text-xs text-gray-600 mt-2">Value: <strong>{item.value}</strong> • Label: {item.label}</div>;
        }
        if (item.item_type === 'cta_primary') {
          return <div className="text-xs text-gray-600 mt-2">Button: <strong>{item.title}</strong></div>;
        }
        break;

      case 'specifications':
      case 'use_cases':
        if (content.features || content.benefits) {
          const list = content.features || content.benefits || [];
          return <div className="text-xs text-gray-600 mt-2">{list.length} items in content</div>;
        }
        break;
    }

    if (item.description) {
      return <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>;
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Order Badge */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-semibold text-xs">
          {item.order_index}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{item.title || 'Untitled'}</h4>
            {item.item_type && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {item.item_type}
              </span>
            )}
            {item.icon && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {item.icon}
              </span>
            )}
          </div>
          {renderPreview()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>

          {/* Delete button - Only for use_cases and media_banner sections */}
          {showDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemManager;

