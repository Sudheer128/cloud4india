import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  getHomepageContent, 
  updateHeroContent, 
  createWhyItem,
  updateWhyItem, 
  deleteWhyItem,
  getAdminSolutions,
  duplicateSolution,
  toggleSolutionVisibility,
  // New Product CMS API functions
  getAdminProducts,
  toggleProductVisibility,
  duplicateProduct,
  getAdminProductSections,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  toggleProductSectionVisibility,
  getAdminProductItems,
  createProductItem,
  updateProductItem,
  deleteProductItem,
  toggleProductItemVisibility
} from '../services/cmsApi';
import { enhanceDescription, generateFallbackDescription } from '../services/aiService';
import PricingAdmin from './PricingAdmin';
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon, DocumentDuplicateIcon, DocumentTextIcon, EyeIcon, EyeSlashIcon, CheckIcon, ListBulletIcon } from '@heroicons/react/24/outline';

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all animate-slideIn sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-transparent px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100 p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const location = useLocation();
  const [homepageData, setHomepageData] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('hero');
  const [editingItem, setEditingItem] = useState(null);
  const [editingSolution, setEditingSolution] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homepage, solutionsData, productsData] = await Promise.all([
        getHomepageContent(),
        getAdminSolutions(),
        getAdminProducts()
      ]);
      setHomepageData(homepage);
      setSolutions(solutionsData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync activeSection with URL hash - react to location changes and hash changes
  useEffect(() => {
    const updateSection = () => {
      // Use window.location.hash directly as React Router doesn't track hash changes automatically
      const hash = window.location.hash.slice(1);
      if (hash === 'solutions') {
        setActiveSection('solutions');
      } else if (hash === 'products') {
        setActiveSection('products');
      } else if (hash === 'pricing') {
        setActiveSection('pricing');
      } else {
        // If no hash and we're on /admin, show home section
        if (location.pathname === '/admin') {
          setActiveSection('home');
        }
      }
    };
    
    // Always update when this effect runs
    updateSection();
    
    // Listen for hash changes
    const handleHashChange = () => {
      updateSection();
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Also listen for popstate (browser back/forward)
    const handlePopState = () => {
      setTimeout(updateSection, 0);
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, location.hash]);

  // Update URL hash when section changes
  const updateActiveSection = (section) => {
    setActiveSection(section);
    if (section === 'solutions') {
      window.location.hash = 'solutions';
    } else if (section === 'products') {
      window.location.hash = 'products';
    } else if (section === 'pricing') {
      window.location.hash = 'pricing';
    } else {
      window.location.hash = '';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Home Page Handlers
  const handleUpdateHero = async (heroData) => {
    try {
      await updateHeroContent(heroData);
      await fetchData();
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    }
  };

  const handleCreateWhyItem = async (itemData) => {
    try {
      await createWhyItem(itemData);
      await fetchData();
      setEditingItem(null);
      alert('Why item created successfully!');
    } catch (err) {
      alert('Error creating why item: ' + err.message);
    }
  };

  const handleUpdateWhyItem = async (id, itemData) => {
    try {
      await updateWhyItem(id, itemData);
      await fetchData();
      setEditingItem(null);
      alert('Why item updated successfully!');
    } catch (err) {
      alert('Error updating why item: ' + err.message);
    }
  };

  const handleDeleteWhyItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this why item?')) {
      try {
        await deleteWhyItem(id);
        await fetchData();
        alert('Why item deleted successfully!');
      } catch (err) {
        alert('Error deleting why item: ' + err.message);
      }
    }
  };

  // Enhanced Product Handlers for CMS
  const handleToggleProductVisibility = async (id) => {
    try {
      await toggleProductVisibility(id);
      await fetchData();
      alert('Product visibility toggled successfully!');
    } catch (err) {
      alert('Error toggling product visibility: ' + err.message);
    }
  };

  const handleDuplicateProduct = async (id, options = {}) => {
    try {
      const result = await duplicateProduct(id, options);
      await fetchData();
      alert(`Product duplicated successfully! Created ${result.sectionsDuplicated} sections with ${result.itemsDuplicated} items.`);
    } catch (err) {
      alert('Error duplicating product: ' + err.message);
    }
  };

  const handleCreateProductSection = async (productId, sectionData) => {
    try {
      await createProductSection(productId, sectionData);
      await fetchData();
      alert('Product section created successfully!');
    } catch (err) {
      alert('Error creating product section: ' + err.message);
    }
  };

  const handleUpdateProductSection = async (productId, sectionId, sectionData) => {
    try {
      await updateProductSection(productId, sectionId, sectionData);
      await fetchData();
      alert('Product section updated successfully!');
    } catch (err) {
      alert('Error updating product section: ' + err.message);
    }
  };

  const handleDeleteProductSection = async (productId, sectionId) => {
    if (window.confirm('Are you sure you want to delete this product section?')) {
      try {
        await deleteProductSection(productId, sectionId);
        await fetchData();
        alert('Product section deleted successfully!');
      } catch (err) {
        alert('Error deleting product section: ' + err.message);
      }
    }
  };

  const handleToggleProductSectionVisibility = async (productId, sectionId) => {
    try {
      await toggleProductSectionVisibility(productId, sectionId);
      await fetchData();
      alert('Product section visibility toggled successfully!');
    } catch (err) {
      alert('Error toggling product section visibility: ' + err.message);
    }
  };

  const handleCreateProductItem = async (productId, sectionId, itemData) => {
    try {
      await createProductItem(productId, sectionId, itemData);
      await fetchData();
      alert('Product item created successfully!');
    } catch (err) {
      alert('Error creating product item: ' + err.message);
    }
  };

  const handleUpdateProductItem = async (productId, sectionId, itemId, itemData) => {
    try {
      await updateProductItem(productId, sectionId, itemId, itemData);
      await fetchData();
      alert('Product item updated successfully!');
    } catch (err) {
      alert('Error updating product item: ' + err.message);
    }
  };

  const handleDeleteProductItem = async (productId, sectionId, itemId) => {
    if (window.confirm('Are you sure you want to delete this product item?')) {
      try {
        await deleteProductItem(productId, sectionId, itemId);
        await fetchData();
        alert('Product item deleted successfully!');
      } catch (err) {
        alert('Error deleting product item: ' + err.message);
      }
    }
  };

  const handleToggleProductItemVisibility = async (productId, sectionId, itemId) => {
    try {
      await toggleProductItemVisibility(productId, sectionId, itemId);
      await fetchData();
      alert('Product item visibility toggled successfully!');
    } catch (err) {
      alert('Error toggling product item visibility: ' + err.message);
    }
  };

  // Product Editor Handler
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveSection('product-editor');
  };

  // Solutions Handlers for Home Page Management
  const handleToggleSolutionVisibility = async (solution) => {
    try {
      await toggleSolutionVisibility(solution.id);
      await fetchData();
      alert(`Solution ${solution.is_visible ? 'hidden' : 'shown'} successfully!`);
    } catch (err) {
      alert('Error toggling solution visibility: ' + err.message);
    }
  };

  // Solutions Handlers
  const handleEditSolution = (solution) => {
    setEditingSolution(solution);
    setActiveSection('solution-editor');
  };

  const handleDuplicateSolution = async (solution) => {
    const newName = prompt('Enter new solution name:', `${solution.name} (Copy)`);
    if (!newName) return;
    
    const newRoute = prompt('Enter new route:', `/solutions/${solution.name.toLowerCase().replace(/\s+/g, '-')}-copy`);
    if (!newRoute) return;

    try {
      await duplicateSolution(solution.id, { newName, newRoute });
      await fetchData();
      alert('Solution duplicated successfully!');
    } catch (err) {
      alert('Error duplicating solution: ' + err.message);
    }
  };

  const handleDeleteSolution = async (solutionOrId) => {
    // Handle both solution object and ID
    const solution = typeof solutionOrId === 'object' ? solutionOrId : solutions.find(s => s.id === solutionOrId);
    
    if (!solution) {
      alert('Solution not found!');
      return;
    }

    console.log('Attempting to delete solution:', solution);

    if (window.confirm(`Are you sure you want to delete "${solution.name}"? This will also delete all its sections.`)) {
      try {
        console.log('Calling deleteSolution API with ID:', solution.id);
        const result = await deleteSolution(solution.id);
        console.log('Delete API result:', result);
        
        console.log('Refreshing data...');
        await fetchData();
        console.log('Data refreshed successfully');
        
        alert('Solution deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting solution: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading admin panel</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Content */}
          {activeSection === 'home' && (
          <HomePageManagement 
            homepageData={homepageData} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onUpdateHero={handleUpdateHero}
            onCreateWhyItem={handleCreateWhyItem}
            onUpdateWhyItem={handleUpdateWhyItem}
            onDeleteWhyItem={handleDeleteWhyItem}
          />
          )}
          
          {activeSection === 'products' && (
            <ProductsManagement 
              products={products}
              onEditProduct={handleEditProduct}
              onDuplicateProduct={handleDuplicateProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleVisibility={handleToggleProductVisibility}
            />
          )}
          
          {activeSection === 'solutions' && (
            <SolutionsManagement 
              solutions={solutions}
              onEditSolution={handleEditSolution}
              onDuplicateSolution={handleDuplicateSolution}
              onDeleteSolution={handleDeleteSolution}
              onToggleVisibility={handleToggleSolutionVisibility}
            />
          )}
          
          {activeSection === 'pricing' && (
            <PricingAdmin />
          )}
          
          {activeSection === 'solution-editor' && editingSolution && (
            <SolutionEditor 
              solution={editingSolution}
              onBack={() => updateActiveSection('solutions')}
            />
          )}
          
          {activeSection === 'product-editor' && editingProduct && (
            <ProductEditor 
              product={editingProduct}
              onBack={() => updateActiveSection('products')}
            />
          )}
    </div>
  );
};

// Home Page Management Component
const HomePageManagement = ({ 
  homepageData, 
  activeTab, 
  setActiveTab, 
  editingItem, 
  setEditingItem,
  onUpdateHero,
  onCreateWhyItem,
  onUpdateWhyItem,
  onDeleteWhyItem
}) => {
  return (
    <div>
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex gap-2 bg-white/60 border border-gray-200 rounded-xl p-1 w-fit">
          {[
            { id: 'hero', label: 'Hero Section' },
            { id: 'why', label: 'Why Items' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'hero' && (
          <HeroEditor 
            hero={homepageData?.hero} 
            onUpdate={onUpdateHero}
          />
        )}
        
        {activeTab === 'why' && (
          <WhyItemsEditor 
            whyItems={homepageData?.whyItems} 
            onCreate={onCreateWhyItem}
            onUpdate={onUpdateWhyItem}
            onDelete={onDeleteWhyItem}
            editing={editingItem}
            onEdit={setEditingItem}
            onCancel={() => setEditingItem(null)}
          />
        )}
        
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = ({ products, onEditProduct, onDuplicateProduct, onDeleteProduct, onToggleVisibility }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Products</h3>
        <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
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

// Product Sections Editor Component
const ProductSectionsEditor = ({
  product,
  productSections,
  productItems,
  loadingSections,
  loadingItems,
  onCreateSection,
  onUpdateSection,
  onDeleteSection,
  onToggleSectionVisibility,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItemVisibility,
  onLoadSections,
  onLoadItems,
  onClose,
  setEditingItem
}) => {
  const [editingSection, setEditingSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (product && !productSections.length && !loadingSections) {
      onLoadSections();
    }
  }, [product, productSections.length, loadingSections, onLoadSections]);

  // Refresh items when productItems prop changes
  useEffect(() => {
    // This will trigger a re-render when productItems are updated
  }, [productItems]);

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    
    // Load items when expanding
    if (!expandedSections[sectionId]) {
      onLoadItems(sectionId);
    }
  };

  const getSectionItems = (sectionId) => {
    const key = `${product.id}-${sectionId}`;
    return productItems[key] || [];
  };

  const getItemTypeLabel = (itemType) => {
    const labels = {
      'feature_card': 'Feature Card',
      'pricing_plan': 'Pricing Plan',
      'spec_card': 'Specification Card',
      'security_feature': 'Security Feature',
      'support_feature': 'Support Feature',
      'migration_step': 'Migration Step',
      'use_case': 'Use Case'
    };
    return labels[itemType] || itemType;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit Sections: ${product?.name}`}>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product?.name}</h3>
              <p className="text-sm text-gray-600">Manage sections and content for this product</p>
            </div>
            <button
              onClick={() => setEditingSection('new')}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Section
            </button>
          </div>

          {/* Sections List */}
          {loadingSections ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading sections...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {productSections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg">
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSectionExpansion(section.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ChevronDoubleRightIcon 
                          className={`w-4 h-4 transition-transform ${
                            expandedSections[section.id] ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      <div>
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-600">{section.section_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        section.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {section.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => setEditingSection(section.id)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="Edit Section"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleSectionVisibility(product.id, section.id)}
                        className={`p-1 rounded ${
                          section.is_visible ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={section.is_visible ? 'Hide Section' : 'Show Section'}
                      >
                        {section.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteSection(product.id, section.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                        title="Delete Section"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Items */}
                  {expandedSections[section.id] && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-900">Section Items</h5>
                        <button
                          onClick={() => setEditingItem({ sectionId: section.id, type: 'new' })}
                          className="inline-flex items-center gap-1 text-sm bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                        >
                          <PlusIcon className="w-3 h-3" />
                          Add Item
                        </button>
                      </div>
                      
                      {loadingItems[`${product.id}-${section.id}`] ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {getSectionItems(section.id).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-gray-900">{item.title}</p>
                                  <p className="text-sm text-gray-600">{getItemTypeLabel(item.item_type)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.is_visible ? 'Visible' : 'Hidden'}
                                </span>
                                <button
                                  onClick={() => setEditingItem({ sectionId: section.id, itemId: item.id, type: 'edit' })}
                                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                                  title="Edit Item"
                                >
                                  <PencilSquareIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    onToggleItemVisibility(product.id, section.id, item.id);
                                    // Reload items for this section after toggle
                                    setTimeout(() => {
                                      onLoadItems(section.id);
                                    }, 500);
                                  }}
                                  className={`p-1 rounded ${
                                    item.is_visible ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'
                                  }`}
                                  title={item.is_visible ? 'Hide Item' : 'Show Item'}
                                >
                                  {item.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => onDeleteItem(product.id, section.id, item.id)}
                                  className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded"
                                  title="Delete Item"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {getSectionItems(section.id).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No items in this section</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {productSections.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sections found for this product</p>
                  <button
                    onClick={() => setEditingSection('new')}
                    className="mt-2 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Product Item Editor Component
const ProductItemEditor = ({
  product,
  section,
  item,
  itemType,
  onCreateItem,
  onUpdateItem,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    item_type: itemType === 'new' ? 'feature_card' : item?.item_type || 'feature_card',
    icon: item?.icon || 'CpuChipIcon',
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
        icon: item.icon || 'CpuChipIcon',
        order_index: item.order_index || 0,
        is_visible: item.is_visible !== null ? item.is_visible : 1
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        item_type: 'feature_card',
        icon: 'CpuChipIcon',
        order_index: 0,
        is_visible: 1
      });
    }
  }, [item, itemType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (item) {
      // Update existing item
      onUpdateItem(product.id, section.id, item.id, formData);
    } else {
      // Create new item
      onCreateItem(product.id, section.id, formData);
    }
    onClose();
  };

  const itemTypes = [
    { value: 'feature_card', label: 'Feature Card' },
    { value: 'pricing_plan', label: 'Pricing Plan' },
    { value: 'spec_card', label: 'Specification Card' },
    { value: 'security_feature', label: 'Security Feature' },
    { value: 'support_feature', label: 'Support Feature' },
    { value: 'migration_step', label: 'Migration Step' },
    { value: 'use_case', label: 'Use Case' }
  ];

  const icons = [
    'CpuChipIcon', 'ShieldCheckIcon', 'ClockIcon', 'CurrencyDollarIcon',
    'ChartBarIcon', 'GlobeAltIcon', 'UsersIcon', 'ServerIcon',
    'CircleStackIcon', 'CheckIcon', 'StarIcon', 'ArrowRightIcon'
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title={`${item ? 'Edit' : 'Add'} Item: ${section?.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter item title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter item description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Type
            </label>
            <select
              value={formData.item_type}
              onChange={(e) => setFormData({...formData, item_type: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {itemTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {icons.map(icon => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        {/* Content (for complex items like pricing) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Content (JSON format for complex data)
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder='{"price": "$99/month", "features": ["Feature 1", "Feature 2"]}'
          />
          <p className="text-xs text-gray-500 mt-1">
            For pricing plans, use JSON format with price, features, specifications, etc.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {item ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Solutions Editor Component
const SolutionsEditor = () => null;

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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sectionsData = await response.json();
      console.log(`Loaded ${sectionsData.length} sections:`, sectionsData);
      setSections(sectionsData);
    } catch (err) {
      console.error('Error loading sections:', err);
      setSections([]); // Ensure sections is always an array
    } finally {
      setLoading(false);
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

  const handleCreateSection = async (sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section created successfully!');
      } else {
        throw new Error('Failed to create section');
      }
    } catch (err) {
      alert('Error creating section: ' + err.message);
    }
  };

  const handleUpdateSection = async (sectionId, sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section updated successfully!');
      } else {
        throw new Error('Failed to update section');
      }
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section? This will also delete all items in this section.')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadSections();
          alert('Section deleted successfully!');
        } else {
          throw new Error('Failed to delete section');
        }
      } catch (err) {
        alert('Error deleting section: ' + err.message);
      }
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${product.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });
      
      if (response.ok) {
        await loadSections();
        alert(`Section ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
      } else {
        throw new Error('Failed to toggle section visibility');
      }
    } catch (err) {
      alert('Error toggling section visibility: ' + err.message);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section', description: 'Main banner with title, subtitle, and call-to-action buttons' },
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
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Edit Product: {product.name}</h3>
      </div>

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
            <CubeIcon className="h-5 w-5 mr-2 text-blue-600" />
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
                              : sectionTypes.find(t => t.value === section.section_type)?.value === 'features'
                              ? 'bg-green-100 text-green-700'
                              : sectionTypes.find(t => t.value === section.section_type)?.value === 'pricing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                          </span>
                          <span className="text-xs text-gray-500">Order: {section.display_order}</span>
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
        <SectionItemsManager
          section={managingItems}
          productId={product.id}
          onClose={() => setManagingItems(null)}
          isProduct={true}
        />
      )}
    </div>
  );
};

// Solution Editor Component
const SolutionEditor = ({ solution, onBack }) => {
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
    if (solution) {
      setCardData({
        name: solution.name,
        description: solution.description,
        category: solution.category,
        color: solution.color,
        border_color: solution.border_color,
        route: solution.route,
        gradient_start: solution.gradient_start || 'blue',
        gradient_end: solution.gradient_end || 'blue-700'
      });
      loadSections();
    }
  }, [solution]);

  const loadSections = async () => {
    try {
      setLoading(true);
      console.log(`Loading sections for solution ID: ${solution.id}`);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sectionsData = await response.json();
      console.log(`Loaded ${sectionsData.length} sections:`, sectionsData);
      setSections(sectionsData);
    } catch (err) {
      console.error('Error loading sections:', err);
      setSections([]); // Ensure sections is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCard = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      
      if (response.ok) {
        alert('Solution card updated successfully!');
      } else {
        throw new Error('Failed to update solution');
      }
    } catch (err) {
      alert('Error updating solution: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSection = async (sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section created successfully!');
      } else {
        throw new Error('Failed to create section');
      }
    } catch (err) {
      alert('Error creating section: ' + err.message);
    }
  };

  const handleUpdateSection = async (sectionId, sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section updated successfully!');
      } else {
        throw new Error('Failed to update section');
      }
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadSections();
          alert('Section deleted successfully!');
        } else {
          throw new Error('Failed to delete section');
        }
      } catch (err) {
        alert('Error deleting section: ' + err.message);
      }
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });
      
      if (response.ok) {
        await loadSections();
        alert(`Section ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
      } else {
        throw new Error('Failed to toggle section visibility');
      }
    } catch (err) {
      alert('Error toggling section visibility: ' + err.message);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section', description: 'Main banner with title, subtitle, and call-to-action buttons' },
    { value: 'benefits', label: 'Key Benefits', description: 'Main benefits and value propositions' },
    { value: 'segments', label: 'Industry Segments', description: 'Different industry segments or target markets' },
    { value: 'success_story', label: 'Success Stories', description: 'Customer testimonials and case studies' },
    { value: 'technology', label: 'Technology Features', description: 'Technical capabilities and innovations' },
    { value: 'use_cases', label: 'Use Cases & Solutions', description: 'Real-world applications and scenarios' },
    { value: 'roi', label: 'ROI & Value', description: 'Return on investment and business value' },
    { value: 'implementation', label: 'Implementation Timeline', description: 'Step-by-step implementation process' },
    { value: 'resources', label: 'Resources & Support', description: 'Documentation, training, and support materials' },
    { value: 'cta', label: 'Call to Action', description: 'Final engagement section with contact forms' },
    { value: 'stats', label: 'Statistics & Metrics', description: 'Key performance indicators and metrics' },
    { value: 'comparison', label: 'Comparison Table', description: 'Feature comparisons and competitive analysis' },
    { value: 'faq', label: 'FAQ Section', description: 'Frequently asked questions' },
    { value: 'testimonials', label: 'Client Testimonials', description: 'Customer feedback and reviews' },
    { value: 'pricing', label: 'Pricing Information', description: 'Pricing tiers and cost information' }
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Edit Solution: {solution.name}</h3>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Solution Overview', description: 'Basic solution information' },
            { id: 'sections', label: 'Page Sections', description: 'Manage page content sections' },
            { id: 'preview', label: 'Preview', description: 'Preview the solution page' }
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

      {/* Solution Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-6 flex items-center">
            <CubeIcon className="h-5 w-5 mr-2 text-blue-600" />
            Solution Overview & Card Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solution Name</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Financial Services"
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
                <option value="">Select category...</option>
                <option value="Industry">Industry</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={cardData.description}
              onChange={(e) => setCardData({...cardData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description for the solution card..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">This appears on the solutions overview page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Route</label>
              <input
                type="text"
                value={cardData.route}
                onChange={(e) => setCardData({...cardData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/solutions/financial-services"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Background</label>
              <input
                type="text"
                value={cardData.color}
                onChange={(e) => setCardData({...cardData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="from-blue-50 to-blue-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Border</label>
              <input
                type="text"
                value={cardData.border_color}
                onChange={(e) => setCardData({...cardData, border_color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="border-blue-200"
                required
              />
            </div>
          </div>

          {/* Gradient Color Picker */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Gradient Colors</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Start Color</label>
                <select
                  value={cardData.gradient_start}
                  onChange={(e) => setCardData({...cardData, gradient_start: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="blue">Blue (Financial Services)</option>
                  <option value="purple">Purple (Financial Services Copy)</option>
                  <option value="green">Green (Retail)</option>
                  <option value="orange">Orange (Healthcare)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gradient End Color</label>
                <select
                  value={cardData.gradient_end}
                  onChange={(e) => setCardData({...cardData, gradient_end: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="blue-100">Blue-100 (Financial Services)</option>
                  <option value="purple-100">Purple-100 (Financial Services Copy)</option>
                  <option value="green-100">Green-100 (Retail)</option>
                  <option value="orange-100">Orange-100 (Healthcare)</option>
                </select>
              </div>
            </div>
            
            {/* Gradient Preview */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className={`w-full h-16 bg-gradient-to-br from-${cardData.gradient_start}-50 to-${cardData.gradient_end} rounded-lg border border-gray-300 flex items-center justify-center`}>
                <span className="text-gray-700 font-medium text-sm">Light Gradient Preview</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>🎨 <strong>Perfect Colors:</strong> Only your 4 beautiful colors are available. New solutions will randomly get one of these colors!</p>
            </div>
            <button
              onClick={handleSaveCard}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Overview'
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
              <p className="text-sm text-gray-600 mt-1">Manage all sections of the solution page</p>
            </div>
            <button
              onClick={() => setEditingSection('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
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
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                            section.section_type === 'hero' ? 'bg-purple-100 text-purple-700' :
                            section.section_type === 'benefits' ? 'bg-green-100 text-green-700' :
                            section.section_type === 'segments' ? 'bg-blue-100 text-blue-700' :
                            section.section_type === 'use_cases' ? 'bg-orange-100 text-orange-700' :
                            section.section_type === 'cta' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Order: {section.order_index}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                          {section.title || 'Untitled Section'}
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {section.content ? 
                            (section.content.length > 200 ? 
                              section.content.substring(0, 200) + '...' : 
                              section.content
                            ) : 
                            'No content'
                          }
                        </p>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(section.created_at).toLocaleDateString()} • 
                          Updated: {new Date(section.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingSection(section.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setManagingItems(section.id)}
                          className="text-green-600 hover:text-green-800 text-sm bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Items
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(section.id, section.is_visible !== 0)}
                          className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                            section.is_visible !== 0 
                              ? 'text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100' 
                              : 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100'
                          }`}
                        >
                          {section.is_visible !== 0 ? 'Hide' : 'Unhide'}
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sections created yet</h3>
                  <p className="text-gray-500 mb-4">Start building your solution page by adding content sections.</p>
                  <button
                    onClick={() => setEditingSection('new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section Editor */}
          {editingSection && (
            <SectionEditor
              section={editingSection === 'new' ? null : sections.find(s => s.id === editingSection)}
              sectionTypes={sectionTypes}
              onCreate={handleCreateSection}
              onUpdate={handleUpdateSection}
              onCancel={() => setEditingSection(null)}
            />
          )}

          {/* Section Items Manager */}
          {managingItems && (
            <SectionItemsManager
              section={sections.find(s => s.id === managingItems)}
              solutionId={solution.id}
              onCancel={() => setManagingItems(null)}
            />
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Solution Page Preview</h4>
              <p className="text-sm text-gray-600 mt-1">Preview how your solution page will look</p>
            </div>
            <div className="flex space-x-3">
              <a
                href={cardData.route}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Live Page
              </a>
              <button
                onClick={loadSections}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh Preview
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading preview...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Solution Overview Card */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">Solution Overview</h5>
                <div className={`bg-gradient-to-br ${cardData.color} border ${cardData.border_color} rounded-xl p-4 max-w-md`}>
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      cardData.category === 'Content Management Systems'
                        ? 'bg-sky-100 text-sky-700'
                        : cardData.category === 'Databases'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cardData.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{cardData.name}</h3>
                    <p className="text-gray-600 text-sm">{cardData.description}</p>
                  </div>
                  <div className="text-blue-600 font-medium text-sm">
                    View solution →
                  </div>
                </div>
              </div>

              {/* Page Sections Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Page Content ({sections.length} sections)</h5>
                {sections.length > 0 ? (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {index + 1}. {section.title || 'Untitled Section'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              section.section_type === 'hero' ? 'bg-purple-100 text-purple-700' :
                              section.section_type === 'benefits' ? 'bg-green-100 text-green-700' :
                              section.section_type === 'segments' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {section.content ? 
                            (section.content.length > 150 ? 
                              section.content.substring(0, 150) + '...' : 
                              section.content
                            ) : 
                            'No content'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No sections created yet. Add sections to see them here.</p>
                )}
              </div>

              {/* Page Structure Summary */}
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Page Structure Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-900">Route</div>
                    <div className="text-gray-600">{cardData.route || 'Not set'}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-900">Sections</div>
                    <div className="text-gray-600">{sections.length} content sections</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-900">Category</div>
                    <div className="text-gray-600">{cardData.category || 'Not set'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Section Editor Component
const SectionEditor = ({ section, sectionTypes, onCreate, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    content: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        section_type: section.section_type || '',
        title: section.title || '',
        content: section.content || ''
      });
    } else {
      setFormData({
        section_type: '',
        title: '',
        content: ''
      });
    }
  }, [section]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (section) {
      onUpdate(section.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const handleEnhanceContent = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a section title first before enhancing the content.');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please enter some basic content first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedContent = await enhanceDescription(
        formData.title,
        formData.content,
        formData.section_type || 'section'
      );
      setFormData({
        ...formData,
        content: enhancedContent
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      if (error.message.includes('rate limit')) {
        alert('Rate limit reached. Your request has been queued and will be processed automatically. Please wait...');
      } else {
        alert(error.message);
      }
    } finally {
      setIsEnhancing(false);
    }
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                type="button"
                onClick={handleEnhanceContent}
                disabled={isEnhancing || !formData.title.trim() || !formData.content.trim()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEnhancing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enhance with OpenAI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter section content... (HTML supported)"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 <strong>HTML supported:</strong> Use tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; for formatting
              </p>
              <div className="text-xs text-gray-400">
                {formData.content.length} characters
              </div>
            </div>
          </div>

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
                {selectedSectionType.value === 'benefits' && (
                  <div>
                    <p><strong>Title:</strong> Key Benefits</p>
                    <p><strong>Content:</strong> &lt;ul&gt;&lt;li&gt;Enhanced Security&lt;/li&gt;&lt;li&gt;Scalable Solutions&lt;/li&gt;&lt;/ul&gt;</p>
                  </div>
                )}
                {selectedSectionType.value === 'use_cases' && (
                  <div>
                    <p><strong>Title:</strong> Real-World Applications</p>
                    <p><strong>Content:</strong> &lt;h3&gt;Banking Automation&lt;/h3&gt;&lt;p&gt;Streamline operations...&lt;/p&gt;</p>
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

// Existing Editor Components (HeroEditor, WhyItemsEditor, ProductsEditor)
// ... (keeping the existing components from the previous AdminPanel)

// Hero Editor Component
const HeroEditor = ({ hero, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        description: hero.description || '',
        primary_button_text: hero.primary_button_text || '',
        primary_button_link: hero.primary_button_link || '',
        secondary_button_text: hero.secondary_button_text || '',
        secondary_button_link: hero.secondary_button_link || ''
      });
    }
  }, [hero]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleEnhanceDescription = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title first before enhancing the description.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter some basic description first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await enhanceDescription(
        formData.title,
        formData.description,
        'hero'
      );
      setFormData({
        ...formData,
        description: enhancedDescription
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      if (error.message.includes('rate limit')) {
        alert('Rate limit reached. Your request has been queued and will be processed automatically. Please wait...');
      } else {
        alert(error.message);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Hero Section</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={isEnhancing || !formData.title.trim() || !formData.description.trim()}
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEnhancing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enhancing...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Enhance with OpenAI
                </>
              )}
            </button>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a basic description first, then use 'Enhance with AI' to improve it..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Enter a basic description and title first, then click "Enhance with AI" to generate a more compelling hero description. Note: Free tier has rate limits - requests are automatically queued.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
            <input
              type="text"
              value={formData.primary_button_text}
              onChange={(e) => setFormData({...formData, primary_button_text: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link</label>
            <input
              type="text"
              value={formData.primary_button_link}
              onChange={(e) => setFormData({...formData, primary_button_link: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
            <input
              type="text"
              value={formData.secondary_button_text}
              onChange={(e) => setFormData({...formData, secondary_button_text: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
            <input
              type="text"
              value={formData.secondary_button_link}
              onChange={(e) => setFormData({...formData, secondary_button_link: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Hero Section
        </button>
      </form>
    </div>
  );
};

// Why Items Editor Component
const WhyItemsEditor = ({ whyItems, onCreate, onUpdate, onDelete, editing, onEdit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (editing && editing !== 'new' && whyItems) {
      const item = whyItems.find(item => item.id === editing);
      if (item) {
        setFormData({
          title: item.title,
          content: item.content,
          link: item.link || ''
        });
      }
    } else if (editing === 'new') {
      setFormData({
        title: '',
        content: '',
        link: ''
      });
    }
  }, [editing, whyItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      link: formData.link || '#'
    };
    
    if (editing === 'new') {
      onCreate(dataToSubmit);
    } else {
      onUpdate(editing, dataToSubmit);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      link: ''
    });
    onCancel();
  };

  const handleEnhanceDescription = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title first before enhancing the description.');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please enter some basic description first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await enhanceDescription(
        formData.title,
        formData.content,
        'why_item'
      );
      setFormData({
        ...formData,
        content: enhancedDescription
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      if (error.message.includes('rate limit')) {
        alert('Rate limit reached. Your request has been queued and will be processed automatically. Please wait...');
      } else {
        alert(error.message);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Why Items</h2>
        <button
          onClick={() => onEdit('new')}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {whyItems?.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow-md hover:bg-white transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.content}</p>
                {item.link && item.link !== '#' && (
                  <p className="text-blue-600 text-sm mt-1">Link: {item.link}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(item.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fast Modal for Add/Edit Form */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editing === 'new' ? 'Add New Item' : 'Edit Item'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter item title"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing || !formData.title.trim() || !formData.content.trim()}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isEnhancing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Enhance with OpenAI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a basic description first, then use 'Enhance with AI' to improve it..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Enter a basic description and title first, then click "Enhance with AI" to generate a more detailed and professional description.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  {editing === 'new' ? 'Create Item' : 'Update Item'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Section Items Manager Component
const SectionItemsManager = ({ section, solutionId, productId, onCancel, onClose, isProduct = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const entityId = isProduct ? productId : solutionId;
  const entityType = isProduct ? 'products' : 'solutions';
  const closeHandler = onClose || onCancel;

  useEffect(() => {
    if (section) {
      loadItems();
    }
  }, [section]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const apiPath = isProduct 
        ? `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/products/${entityId}/sections/${section.id}/items`
        : `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${entityId}/sections/${section.id}/items`;
      
      console.log(`Loading items from: ${apiPath}`);
      console.log(`Entity ID: ${entityId}, Section ID: ${section.id}, Is Product: ${isProduct}`);
      
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const itemsData = await response.json();
      console.log(`Loaded ${itemsData.length} items:`, itemsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error loading section items:', err);
      console.error('API Path:', isProduct 
        ? `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/products/${entityId}/sections/${section.id}/items`
        : `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${entityId}/sections/${section.id}/items`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/${entityType}/${entityId}/sections/${section.id}/items`;
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
    } catch (err) {
      console.error('Error creating item:', err);
      alert('Failed to create item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/${entityType}/${entityId}/sections/${section.id}/items/${itemId}`;
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
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/${entityType}/${entityId}/sections/${section.id}/items/${itemId}`;
      const response = await fetch(apiPath, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems(); // Reload items
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const itemTypes = isProduct ? [
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
  ] : [
    { value: 'benefit', label: 'Benefit Card' },
    { value: 'feature', label: 'Feature' },
    { value: 'stat', label: 'Statistic' },
    { value: 'use_case', label: 'Use Case' },
    { value: 'technology', label: 'Technology' },
    { value: 'segment', label: 'Segment' },
    { value: 'step', label: 'Step' },
    { value: 'resource', label: 'Resource' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Manage Section Items</h3>
              <p className="text-green-100 mt-1">
                Section: {section?.title || 'Untitled'} ({section?.section_type})
              </p>
            </div>
            <button
              onClick={closeHandler}
              className="text-green-100 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* Add New Item Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Section Items</h4>
              <p className="text-sm text-gray-600 mt-1">Manage detailed content like cards, stats, and features</p>
            </div>
            <button
              onClick={() => setEditingItem('new')}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                            // Product item types
                            item.item_type === 'feature_card' ? 'bg-green-100 text-green-700' :
                            item.item_type === 'pricing_plan' ? 'bg-blue-100 text-blue-700' :
                            item.item_type === 'spec_card' ? 'bg-purple-100 text-purple-700' :
                            item.item_type === 'security_feature' ? 'bg-red-100 text-red-700' :
                            item.item_type === 'support_feature' ? 'bg-yellow-100 text-yellow-700' :
                            item.item_type === 'migration_step' ? 'bg-indigo-100 text-indigo-700' :
                            item.item_type === 'badge' ? 'bg-pink-100 text-pink-700' :
                            item.item_type === 'title' ? 'bg-gray-100 text-gray-700' :
                            item.item_type === 'description' ? 'bg-gray-100 text-gray-700' :
                            item.item_type === 'cta_primary' ? 'bg-green-100 text-green-700' :
                            item.item_type === 'cta_secondary' ? 'bg-orange-100 text-orange-700' :
                            item.item_type === 'image' ? 'bg-cyan-100 text-cyan-700' :
                            // Solution item types
                            item.item_type === 'benefit' ? 'bg-green-100 text-green-700' :
                            item.item_type === 'feature' ? 'bg-blue-100 text-blue-700' :
                            item.item_type === 'stat' ? 'bg-purple-100 text-purple-700' :
                            item.item_type === 'use_case' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {itemTypes.find(t => t.value === item.item_type)?.label || item.item_type}
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
                        {item.icon && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Icon:</strong> {item.icon}
                          </div>
                        )}
                        {item.value && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Value:</strong> {item.value}
                          </div>
                        )}
                        {item.label && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Label:</strong> {item.label}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items created yet</h3>
                  <p className="text-gray-500 mb-4">Add detailed content like benefit cards, features, or statistics.</p>
                  <button
                    onClick={() => setEditingItem('new')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add First Item
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Item Editor */}
          {editingItem && (
            <SectionItemEditor
              item={editingItem === 'new' ? null : items.find(i => i.id === editingItem)}
              itemTypes={itemTypes}
              onCreate={handleCreateItem}
              onUpdate={handleUpdateItem}
              onCancel={() => setEditingItem(null)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Section Item Editor Component
const SectionItemEditor = ({ item, itemTypes, onCreate, onUpdate, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    item_type: '',
    title: '',
    description: '',
    icon: '',
    value: '',
    label: '',
    features: ''
  });
  const [featuresList, setFeaturesList] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        item_type: item.item_type || '',
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        value: item.value || '',
        label: item.label || '',
        features: item.features || ''
      });
      
      // Parse features from JSON
      try {
        if (item.features) {
          const parsedFeatures = JSON.parse(item.features);
          setFeaturesList(Array.isArray(parsedFeatures) ? parsedFeatures : []);
        } else {
          setFeaturesList([]);
        }
      } catch (e) {
        console.error('Error parsing features:', e);
        setFeaturesList([]);
      }
    } else {
      setFormData({
        item_type: '',
        title: '',
        description: '',
        icon: '',
        value: '',
        label: '',
        features: ''
      });
      setFeaturesList([]);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      onUpdate(item.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...featuresList];
    newFeatures[index] = value;
    setFeaturesList(newFeatures);
    
    // Update the features field in formData
    setFormData(prev => ({
      ...prev,
      features: JSON.stringify(newFeatures)
    }));
  };

  const addFeature = () => {
    const newFeatures = [...featuresList, ''];
    setFeaturesList(newFeatures);
    
    // Update the features field in formData
    setFormData(prev => ({
      ...prev,
      features: JSON.stringify(newFeatures)
    }));
  };

  const removeFeature = (index) => {
    if (featuresList.length > 1) {
      const newFeatures = featuresList.filter((_, i) => i !== index);
      setFeaturesList(newFeatures);
      
      // Update the features field in formData
      setFormData(prev => ({
        ...prev,
        features: JSON.stringify(newFeatures)
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <h3 className="text-xl font-bold">
            {item ? 'Edit Item' : 'Create New Item'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Item Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Type *
              </label>
              <select
                value={formData.item_type}
                onChange={(e) => handleInputChange('item_type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select item type...</option>
                {itemTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter item title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter item description..."
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (optional)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ShieldCheckIcon, ChartBarIcon..."
              />
            </div>

            {/* Value (for stats) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value (for statistics)
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 99.9%, $2.5M, 10x..."
              />
            </div>

            {/* Label (for stats) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label (for statistics)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Uptime, Cost Savings, Performance Boost..."
              />
            </div>

            {/* Features (Individual bullet points) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (Bullet Points)
              </label>
              <div className="space-y-2">
                {featuresList.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 text-sm w-6">•</span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={featuresList.length <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Feature
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                item ? 'Update Item' : 'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;