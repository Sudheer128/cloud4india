import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  ArrowLeftIcon,
  CubeIcon 
} from '@heroicons/react/24/outline';
import ItemEditor from './ItemEditor';

const ItemManager = ({ marketplace, section, onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadItems();
  }, [section]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections/${section.id}/items`
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
        `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections/${section.id}/items/${itemId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        await loadItems();
      }
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  const sortedItems = [...items].sort((a, b) => a.order_index - b.order_index);

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
              </p>
              <p className="text-xs text-blue-600 mt-2">{config.help}</p>
            </div>
            
            {/* Add Item Button - Works for all section types */}
            <button
              onClick={() => setEditingItem({ id: 'new' })}
              disabled={section.section_type === 'media_banner' && items.length >= 10}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                section.section_type === 'media_banner' && items.length >= 10
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
              }`}
              title={
                section.section_type === 'media_banner' && items.length >= 10
                  ? 'Maximum 10 media items allowed'
                  : `Add new ${section.section_type} item`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {section.section_type === 'media_banner' 
                ? `Add Media ${items.length < 10 ? `(${10 - items.length} slots left)` : '(Limit reached)'}`
                : 'Add Item'
              }
            </button>
          </div>
        </div>
      </div>

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
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
            <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600">{config.help}</p>
            <p className="text-sm text-gray-500 mt-2">Items will appear when you add them</p>
          </div>
        )}
      </div>

      {/* Item Editor Modal */}
      {editingItem && (
        <ItemEditor
          item={editingItem.id === 'new' ? null : editingItem}
          sectionType={section.section_type}
          sectionId={section.id}
          marketplaceId={marketplace.id}
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
            {content.price && <div><strong>Price:</strong> {content.price}</div>}
            {content.specifications && <div><strong>Specs:</strong> {content.specifications.length} items</div>}
            {content.features && <div><strong>Features:</strong> {content.features.length} items</div>}
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

