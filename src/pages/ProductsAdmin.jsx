import React, { useState, useEffect } from 'react';
import { 
  getAdminProducts,
  toggleProductVisibility,
  duplicateProduct,
  deleteProduct,
  updateProduct
} from '../services/cmsApi';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  XMarkIcon, 
  DocumentDuplicateIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  CheckIcon, 
  ListBulletIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = ({ products, onEditProduct, onDuplicateProduct, onDeleteProduct, onToggleVisibility }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Products</h3>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Product</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.category === 'Cloud Servers'
                      ? 'bg-sky-100 text-sky-700'
                      : product.category === 'Backup Services'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {product.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{product.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{product.route}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Page Content"
                    aria-label="Edit Page Content"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateProduct(product)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                    title="Duplicate"
                    aria-label="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(product)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg ${
                      product.is_visible !== 0 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    title={product.is_visible !== 0 ? 'Hide Product' : 'Show Product'}
                    aria-label={product.is_visible !== 0 ? 'Hide Product' : 'Show Product'}
                  >
                    {product.is_visible !== 0 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Product Page Management</h3>
            <p className="mt-1 text-sm text-blue-700">
              Click the <strong>Edit</strong> button (blue) to manage the complete content of each product page including hero sections, benefits, use cases, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Editor Component
const ProductEditor = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cardData, setCardData] = useState({
    name: '',
    description: '',
    category: '',
    color: '',
    border_color: '',
    route: '',
    gradient_start: '',
    gradient_end: ''
  });
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [managingItems, setManagingItems] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setCardData({
        name: product.name,
        description: product.description,
        category: product.category,
        color: product.color,
        border_color: product.border_color,
        route: product.route,
        gradient_start: product.gradient_start || 'green',
        gradient_end: product.gradient_end || 'orange'
      });
      loadSections();
    }
  }, [product]);

  const loadSections = async () => {
    try {
      setLoading(true);
      console.log(`Loading sections for product ID: ${product.id}`);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/products/${product.id}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sectionsData = await response.json();
      console.log(`Loaded ${sectionsData.length} sections:`, sectionsData);
      setSections(sectionsData);
    } catch (err) {
      console.error('Error loading sections:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (sectionData) => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadSections(); // Reload sections
      setEditingSection(null);
      alert('Section created successfully!');
    } catch (err) {
      console.error('Error creating section:', err);
      alert('Failed to create section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = async (sectionId, sectionData) => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadSections(); // Reload sections
      setEditingSection(null);
      alert('Section updated successfully!');
    } catch (err) {
      console.error('Error updating section:', err);
      alert('Failed to update section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadSections(); // Reload sections
      alert('Section deleted successfully!');
    } catch (err) {
      console.error('Error deleting section:', err);
      alert('Failed to delete section. Please try again.');
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}/toggle-visibility`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadSections(); // Reload sections
      alert(`Section ${currentVisibility ? 'hidden' : 'shown'} successfully!`);
    } catch (err) {
      console.error('Error toggling section visibility:', err);
      alert('Failed to toggle section visibility. Please try again.');
    }
  };

  const handleSaveCard = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      
      if (response.ok) {
        alert('Product card updated successfully!');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      alert('Error updating product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section', description: 'Main banner with title, subtitle, and call-to-action buttons' },
    { value: 'media_banner', label: 'Video/Photo Banner', description: 'Video or photo banner intro section (appears after hero section)' },
    { value: 'features', label: 'Key Features', description: 'Product features and capabilities' },
    { value: 'pricing', label: 'Pricing Plans', description: 'Pricing tiers and cost information' },
    { value: 'specifications', label: 'Technical Specifications', description: 'Detailed technical specifications and requirements' },
    { value: 'security', label: 'Security Features', description: 'Security capabilities and compliance information' },
    { value: 'support', label: 'Support & Documentation', description: 'Support options and documentation resources' },
    { value: 'migration', label: 'Migration Guide', description: 'Migration process and guidelines' },
    { value: 'use_cases', label: 'Use Cases', description: 'Real-world use cases and applications' },
    { value: 'cta', label: 'Call to Action', description: 'Final engagement section with contact forms' }
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Product Overview', description: 'Basic product information' },
            { id: 'sections', label: 'Page Sections', description: 'Manage page content sections' },
            { id: 'preview', label: 'Preview', description: 'Preview the product page' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              title={tab.description}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Product Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-6 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            Product Overview & Card Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Basic Cloud Servers"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={cardData.category}
                onChange={(e) => setCardData({...cardData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Cloud Servers">Cloud Servers</option>
                <option value="Backup Services">Backup Services</option>
                <option value="Storage">Storage</option>
                <option value="Database">Database</option>
                <option value="Networking">Networking</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={cardData.description}
              onChange={(e) => setCardData({...cardData, description: e.target.value})}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the product..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route (URL Path)</label>
              <input
                type="text"
                value={cardData.route}
                onChange={(e) => setCardData({...cardData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., /products/basic-cloud-servers"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <input
                type="text"
                value={cardData.color}
                onChange={(e) => setCardData({...cardData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., from-green-100 to-orange-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveCard}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save Product Details
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Page Sections Tab */}
      {activeTab === 'sections' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Page Content Sections</h4>
              <p className="text-sm text-gray-600 mt-1">Manage all sections of the product page</p>
            </div>
            <button
              onClick={() => setEditingSection('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Section
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sections...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 mb-4">
                    <DocumentTextIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first product section.</p>
                  <button
                    onClick={() => setEditingSection('new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create First Section
                  </button>
                </div>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            sectionTypes.find(t => t.value === section.section_type)?.value === 'hero' 
                              ? 'bg-purple-100 text-purple-700'
                              : sectionTypes.find(t => t.value === section.section_type)?.value === 'media_banner'
                              ? 'bg-pink-100 text-pink-700'
                              : sectionTypes.find(t => t.value === section.section_type)?.value === 'features'
                              ? 'bg-green-100 text-green-700'
                              : sectionTypes.find(t => t.value === section.section_type)?.value === 'pricing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                          </span>
                          <span className="text-xs text-gray-500">Order: {section.order_index}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(section.created_at).toLocaleDateString()} • 
                          Updated: {new Date(section.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Section"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setManagingItems(section)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Manage Items"
                        >
                          <ListBulletIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                          className={`p-2 rounded-lg ${
                            section.is_visible 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={section.is_visible ? 'Hide Section' : 'Show Section'}
                        >
                          {section.is_visible ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Section"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-4">Product Page Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">Preview functionality will be available soon.</p>
            <p className="text-sm text-gray-500 mt-2">
              Visit <code className="bg-gray-200 px-2 py-1 rounded">localhost:3001{cardData.route}</code> to see the live page.
            </p>
          </div>
        </div>
      )}

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditor
          section={editingSection === 'new' ? null : editingSection}
          sectionTypes={sectionTypes}
          onSave={editingSection === 'new' ? handleCreateSection : (data) => handleUpdateSection(editingSection.id, data)}
          onCancel={() => setEditingSection(null)}
          isProduct={true}
        />
      )}

      {/* Items Manager Modal */}
      {managingItems && (
        <ProductSectionItemsManager
          section={managingItems}
          productId={product.id}
          onClose={() => setManagingItems(null)}
        />
      )}
    </div>
  );
};

// Product Section Items Manager Component
const ProductSectionItemsManager = ({ section, productId, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      loadItems();
    }
  }, [section]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/products/${productId}/sections/${section.id}/items`;
      
      console.log(`Loading product items from: ${apiPath}`);
      console.log(`Product ID: ${productId}, Section ID: ${section.id}`);
      
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const itemsData = await response.json();
      console.log(`Loaded ${itemsData.length} product items:`, itemsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error loading product section items:', err);
      console.error('API Path:', `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/products/${productId}/sections/${section.id}/items`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${section.id}/items`;
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems(); // Reload items
      setEditingItem(null);
      alert('Product item created successfully!');
    } catch (err) {
      console.error('Error creating product item:', err);
      alert('Failed to create product item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${section.id}/items/${itemId}`;
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems(); // Reload items
      setEditingItem(null);
      alert('Product item updated successfully!');
    } catch (err) {
      console.error('Error updating product item:', err);
      alert('Failed to update product item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this product item?')) {
      return;
    }

    try {
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${section.id}/items/${itemId}`;
      const response = await fetch(apiPath, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems(); // Reload items
      alert('Product item deleted successfully!');
    } catch (err) {
      console.error('Error deleting product item:', err);
      alert('Failed to delete product item. Please try again.');
    }
  };

  const productItemTypes = [
    { value: 'feature_card', label: 'Feature Card' },
    { value: 'pricing_plan', label: 'Pricing Plan' },
    { value: 'spec_card', label: 'Specification Card' },
    { value: 'security_feature', label: 'Security Feature' },
    { value: 'support_feature', label: 'Support Feature' },
    { value: 'migration_step', label: 'Migration Step' },
    { value: 'use_case', label: 'Use Case' },
    { value: 'badge', label: 'Badge' },
    { value: 'title', label: 'Title' },
    { value: 'description', label: 'Description' },
    { value: 'cta_primary', label: 'Primary CTA' },
    { value: 'cta_secondary', label: 'Secondary CTA' },
    { value: 'image', label: 'Image' }
  ];

  const getItemTypeColor = (itemType) => {
    switch (itemType) {
      case 'feature_card': return 'bg-green-100 text-green-700';
      case 'pricing_plan': return 'bg-blue-100 text-blue-700';
      case 'spec_card': return 'bg-purple-100 text-purple-700';
      case 'security_feature': return 'bg-red-100 text-red-700';
      case 'support_feature': return 'bg-yellow-100 text-yellow-700';
      case 'migration_step': return 'bg-indigo-100 text-indigo-700';
      case 'badge': return 'bg-pink-100 text-pink-700';
      case 'title': return 'bg-gray-100 text-gray-700';
      case 'description': return 'bg-gray-100 text-gray-700';
      case 'cta_primary': return 'bg-green-100 text-green-700';
      case 'cta_secondary': return 'bg-orange-100 text-orange-700';
      case 'image': return 'bg-cyan-100 text-cyan-700';
      case 'use_case': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Manage Product Section Items</h3>
              <p className="text-blue-100 mt-1">
                Section: {section?.title || 'Untitled'} ({section?.section_type})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* Add New Item Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Product Section Items</h4>
              <p className="text-sm text-gray-600 mt-1">Manage detailed content like feature cards, pricing plans, and specifications</p>
            </div>
            <button
              onClick={() => setEditingItem('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product items...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${getItemTypeColor(item.item_type)}`}>
                            {productItemTypes.find(t => t.value === item.item_type)?.label || item.item_type}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Order: {item.order_index}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                          {item.title || 'Untitled Item'}
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {item.description ? 
                            (item.description.length > 200 ? 
                              item.description.substring(0, 200) + '...' : 
                              item.description
                            ) : 
                            'No description'
                          }
                        </p>
                        {item.content && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <strong>Content:</strong> {item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Item"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 mb-4">
                    <DocumentTextIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first product item for this section.</p>
                  <button
                    onClick={() => setEditingItem('new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create First Item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Item Editor Modal */}
        {editingItem && (
          <ProductItemEditor
            item={editingItem === 'new' ? null : editingItem}
            section={section}
            productId={productId}
            itemTypes={productItemTypes}
            onSave={editingItem === 'new' ? handleCreateItem : (data) => handleUpdateItem(editingItem.id, data)}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
};

// Product Item Editor Component
const ProductItemEditor = ({ item, section, productId, itemTypes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    item_type: 'feature_card',
    icon: '',
    order_index: 0,
    is_visible: 1
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        content: item.content || '',
        item_type: item.item_type || 'feature_card',
        icon: item.icon || '',
        order_index: item.order_index || 0,
        is_visible: item.is_visible !== null ? item.is_visible : 1
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        item_type: 'feature_card',
        icon: '',
        order_index: 0,
        is_visible: 1
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">
                {item ? 'Edit Product Item' : 'Add New Product Item'}
              </h3>
              <p className="text-green-100 mt-1">
                Section: {section?.title || 'Untitled'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-green-100 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
              <select
                value={formData.item_type}
                onChange={(e) => setFormData({...formData, item_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {itemTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter item title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter item description..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (Optional)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Additional content or JSON data..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., CpuChipIcon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              {item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Products Admin Component
const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAdminProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDuplicateProduct = async (product) => {
    const newName = prompt('Enter new product name:', `${product.name} (Copy)`);
    if (!newName) return;

    try {
      await duplicateProduct(product.id, { name: newName });
      await fetchProducts();
      alert('Product duplicated successfully!');
    } catch (error) {
      alert('Error duplicating product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        await fetchProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleToggleVisibility = async (product) => {
    try {
      await toggleProductVisibility(product.id);
      await fetchProducts();
      alert(`Product ${product.is_visible ? 'hidden' : 'shown'} successfully!`);
    } catch (error) {
      alert('Error toggling product visibility: ' + error.message);
    }
  };

  const getTitle = () => {
    if (editingProduct) {
      return `Edit Product: ${editingProduct.name}`;
    }
    return 'Products Management';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {editingProduct ? (
        <ProductEditor 
          product={editingProduct}
          onBack={() => setEditingProduct(null)}
        />
      ) : (
        <ProductsManagement
          products={products}
          onEditProduct={handleEditProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleVisibility={handleToggleVisibility}
        />
      )}
    </div>
  );
};

// Section Editor Component
const SectionEditor = ({ section, sectionTypes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    description: '',
    order_index: 0,
    is_visible: 1,
    media_type: '',
    media_source: '',
    media_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (section) {
      setFormData({
        section_type: section.section_type || '',
        title: section.title || '',
        description: section.description || '',
        order_index: section.order_index !== null ? section.order_index : 0,
        is_visible: section.is_visible !== null ? section.is_visible : 1,
        media_type: section.media_type || '',
        media_source: section.media_source || '',
        media_url: section.media_url || ''
      });
      
      // Set preview URL if media exists
      if (section.media_url) {
        if (section.media_source === 'youtube') {
          setPreviewUrl(section.media_url);
        } else if (section.media_source === 'upload') {
          const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
          setPreviewUrl(`${baseUrl}${section.media_url}`);
        }
      }
    } else {
      setFormData({
        section_type: '',
        title: '',
        description: '',
        order_index: 0,
        is_visible: 1,
        media_type: '',
        media_source: '',
        media_url: ''
      });
      setPreviewUrl('');
    }
    setUploadError('');
  }, [section]);

  const handleFileUpload = async (file, type) => {
    setUploading(true);
    setUploadError('');
    
    try {
      const baseUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';
      const formData = new FormData();
      formData.append(type === 'image' ? 'image' : 'video', file);
      
      const endpoint = type === 'image' ? '/api/upload/image' : '/api/upload/video';
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData
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
      
      // Set preview URL
      setPreviewUrl(`${baseUrl}${data.filePath}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (type === 'image') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Only JPEG, JPG, and PNG images are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size too large. Maximum size is 10MB.');
        return;
      }
    } else if (type === 'video') {
      if (file.type !== 'video/mp4') {
        setUploadError('Invalid file type. Only MP4 videos are allowed.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('File size too large. Maximum size is 100MB.');
        return;
      }
    }
    
    handleFileUpload(file, type);
  };

  const handleYouTubeUrlChange = (e) => {
    const url = e.target.value;
    
    // Extract video ID for preview - using same logic as backend
    if (url) {
      // Handle various YouTube URL formats - same regex as backend extractYouTubeVideoId
      let videoId = null;
      
      // Try multiple patterns (exact same as backend)
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*&v=([^&\n?#]+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          videoId = match[1];
          break;
        }
      }
      
      if (videoId) {
        // Extract only the first 11 characters (YouTube video IDs are always 11 chars)
        const cleanVideoId = videoId.substring(0, 11);
        const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}`;
        setPreviewUrl(embedUrl);
        // Also update formData with the normalized embed URL (same as backend expects)
        setFormData(prev => ({
          ...prev,
          media_url: embedUrl
        }));
      } else {
        setPreviewUrl('');
        // Keep original URL in formData if extraction fails (backend will validate)
        setFormData(prev => ({
          ...prev,
          media_url: url
        }));
      }
    } else {
      setPreviewUrl('');
      setFormData(prev => ({
        ...prev,
        media_url: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate media_banner fields
    if (formData.section_type === 'media_banner') {
      if (!formData.media_type) {
        setUploadError('Please select media type (Video or Photo)');
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
    
    onSave(formData);
  };

  const selectedSectionType = sectionTypes.find(t => t.value === formData.section_type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-semibold text-gray-900">
              {section ? 'Edit Section' : 'Add New Section'}
            </h5>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
              <select
                value={formData.section_type}
                onChange={(e) => setFormData({...formData, section_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select section type...</option>
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedSectionType && (
                <p className="text-xs text-gray-500 mt-1">{selectedSectionType.description}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section title..."
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Sub-text</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={formData.section_type === 'media_banner' ? 3 : 12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder={formData.section_type === 'media_banner' ? 'Enter sub-text or description...' : 'Enter section description... (HTML supported)'}
              required
            />
            <div className="flex justify-between items-center mt-2">
              {formData.section_type !== 'media_banner' && (
                <p className="text-xs text-gray-500">
                  💡 <strong>HTML supported:</strong> Use tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; for formatting
                </p>
              )}
              <div className="text-xs text-gray-400">
                {formData.description.length} characters
              </div>
            </div>
          </div>

          {/* Media Banner Fields */}
          {formData.section_type === 'media_banner' && (
            <div className="space-y-6 border-t border-gray-200 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="media_type"
                      value="video"
                      checked={formData.media_type === 'video'}
                      onChange={(e) => {
                        setFormData({...formData, media_type: e.target.value, media_source: '', media_url: ''});
                        setPreviewUrl('');
                      }}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">Video</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="media_type"
                      value="image"
                      checked={formData.media_type === 'image'}
                      onChange={(e) => {
                        setFormData({...formData, media_type: e.target.value, media_source: '', media_url: ''});
                        setPreviewUrl('');
                      }}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">Photo</span>
                  </label>
                </div>
              </div>

              {formData.media_type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Source *</label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="media_source"
                        value="youtube"
                        checked={formData.media_source === 'youtube'}
                        onChange={(e) => {
                          setFormData({...formData, media_source: e.target.value, media_url: ''});
                          setPreviewUrl('');
                        }}
                        className="mr-2"
                        required
                      />
                      <span className="text-sm text-gray-700">YouTube Link</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="media_source"
                        value="upload"
                        checked={formData.media_source === 'upload'}
                        onChange={(e) => {
                          setFormData({...formData, media_source: e.target.value, media_url: ''});
                          setPreviewUrl('');
                        }}
                        className="mr-2"
                        required
                      />
                      <span className="text-sm text-gray-700">Upload File</span>
                    </label>
                  </div>

                  {formData.media_source === 'youtube' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
                      <input
                        type="url"
                        value={formData.media_url}
                        onChange={handleYouTubeUrlChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
                      </p>
                    </div>
                  )}

                  {formData.media_source === 'upload' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video File *</label>
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={!formData.media_url}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        MP4 format only. Maximum size: 100MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formData.media_type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo *</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!formData.media_url}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, JPG, or PNG format. Maximum size: 10MB
                  </p>
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{uploadError}</p>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-blue-800">Uploading file...</p>
                  </div>
                </div>
              )}

              {/* Preview */}
              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    {(formData.media_source === 'youtube' || (formData.media_type === 'video' && (formData.media_url.includes('youtube.com') || formData.media_url.includes('youtu.be')))) ? (
                      <div className="aspect-video w-full">
                        <iframe
                          src={`${previewUrl}${previewUrl.includes('?') ? '&' : '?'}autoplay=0&mute=0&controls=1&rel=0&enablejsapi=1`}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                      </div>
                    ) : formData.media_type === 'video' ? (
                      <div className="aspect-video w-full">
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-full rounded-lg"
                        ></video>
                      </div>
                    ) : (
                      <div className="w-full">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full h-auto rounded-lg"
                          onError={() => setPreviewUrl('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Examples */}
          {selectedSectionType && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h6 className="text-sm font-medium text-blue-900 mb-2">💡 Content Examples for {selectedSectionType.label}:</h6>
              <div className="text-xs text-blue-800 space-y-1">
                {selectedSectionType.value === 'hero' && (
                  <div>
                    <p><strong>Title:</strong> Transform Your Financial Future</p>
                    <p><strong>Content:</strong> &lt;p&gt;Accelerate innovation with our comprehensive platform...&lt;/p&gt;</p>
                  </div>
                )}
                {selectedSectionType.value === 'features' && (
                  <div>
                    <p><strong>Title:</strong> Key Features</p>
                    <p><strong>Content:</strong> &lt;ul&gt;&lt;li&gt;Enhanced Security&lt;/li&gt;&lt;li&gt;Scalable Solutions&lt;/li&gt;&lt;/ul&gt;</p>
                  </div>
                )}
                {selectedSectionType.value === 'pricing' && (
                  <div>
                    <p><strong>Title:</strong> Pricing Plans</p>
                    <p><strong>Content:</strong> &lt;h3&gt;Basic Plan&lt;/h3&gt;&lt;p&gt;Perfect for small businesses...&lt;/p&gt;</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
            >
              {section ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsAdmin;
