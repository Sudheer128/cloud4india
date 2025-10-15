import React, { useState, useEffect } from 'react';
import { 
  getHomepageContent, 
  updateHeroContent, 
  createWhyItem,
  updateWhyItem, 
  deleteWhyItem,
  createProduct,
  updateProduct, 
  deleteProduct,
  getSolutions,
  createSolution,
  updateSolution,
  duplicateSolution,
  deleteSolution
} from '../services/cmsApi';
import { enhanceDescription, generateFallbackDescription } from '../services/aiService';
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon, HomeIcon, Squares2X2Icon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, DocumentDuplicateIcon, CubeIcon } from '@heroicons/react/24/outline';

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
  const [homepageData, setHomepageData] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('hero');
  const [editingItem, setEditingItem] = useState(null);
  const [editingSolution, setEditingSolution] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homepage, solutionsData] = await Promise.all([
        getHomepageContent(),
        getSolutions()
      ]);
      setHomepageData(homepage);
      setSolutions(solutionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      await fetchData();
      setEditingItem(null);
      alert('Product created successfully!');
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await updateProduct(id, productData);
      await fetchData();
      setEditingItem(null);
      alert('Product updated successfully!');
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await fetchData();
        alert('Product deleted successfully!');
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  // Solutions Handlers for Home Page Management
  const handleCreateSolution = async (solutionData) => {
    try {
      await createSolution(solutionData);
      await fetchData();
      setEditingItem(null);
      alert('Solution created successfully!');
    } catch (err) {
      alert('Error creating solution: ' + err.message);
    }
  };

  const handleUpdateSolution = async (id, solutionData) => {
    try {
      await updateSolution(id, solutionData);
      await fetchData();
      setEditingItem(null);
      alert('Solution updated successfully!');
    } catch (err) {
      alert('Error updating solution: ' + err.message);
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

  const handleDeleteSolution = async (solution) => {
    if (window.confirm(`Are you sure you want to delete "${solution.name}"? This will also delete all its sections.`)) {
      try {
        await deleteSolution(solution.id);
        await fetchData();
        alert('Solution deleted successfully!');
      } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex text-gray-900 font-inter">
      {/* Sidebar Navigation */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/70 backdrop-blur-xl border-r border-gray-200 transition-all duration-200`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-gray-200`}>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">Cloud4India CMS</h1>
              <p className="text-sm text-gray-600 mt-1">Content Management</p>
            </div>
          )}
          <button
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            {sidebarCollapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <nav className="mt-6">
          <div className={`${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            <button
              onClick={() => {
                setActiveSection('home');
                setEditingSolution(null);
              }}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${
                activeSection === 'home'
                  ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title="Home Page"
            >
              <HomeIcon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && 'Home Page'}
            </button>
            
            <button
              onClick={() => {
                setActiveSection('products');
                setEditingSolution(null);
              }}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${
                activeSection === 'products'
                  ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title="Products"
            >
              <CubeIcon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && 'Products'}
            </button>
            
            <button
              onClick={() => {
                setActiveSection('solutions');
                setEditingSolution(null);
              }}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${
                activeSection === 'solutions'
                  ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title="Solutions"
            >
              <Squares2X2Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && 'Solutions'}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
            {activeSection === 'home' && 'Home Page Management'}
            {activeSection === 'products' && 'Products Management'}
            {activeSection === 'solutions' && 'Solutions Management'}
            {activeSection === 'solution-editor' && `Edit: ${editingSolution?.name}`}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === 'home' && (
            <HomePageManagement 
              homepageData={homepageData}
              solutions={solutions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              onUpdateHero={handleUpdateHero}
              onCreateWhyItem={handleCreateWhyItem}
              onUpdateWhyItem={handleUpdateWhyItem}
              onDeleteWhyItem={handleDeleteWhyItem}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onCreateSolution={handleCreateSolution}
              onUpdateSolution={handleUpdateSolution}
              onDeleteSolution={handleDeleteSolution}
              onDuplicateSolution={handleDuplicateSolution}
            />
          )}
          
          {activeSection === 'products' && (
            <ProductsManagement 
              products={homepageData?.products}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}
          
          {activeSection === 'solutions' && (
            <SolutionsManagement 
              solutions={solutions}
              onEditSolution={handleEditSolution}
              onDuplicateSolution={handleDuplicateSolution}
              onDeleteSolution={handleDeleteSolution}
            />
          )}
          
          {activeSection === 'solution-editor' && editingSolution && (
            <SolutionEditor 
              solution={editingSolution}
              onBack={() => setActiveSection('solutions')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Home Page Management Component
const HomePageManagement = ({ 
  homepageData, 
  solutions,
  activeTab, 
  setActiveTab, 
  editingItem, 
  setEditingItem,
  onUpdateHero,
  onCreateWhyItem,
  onUpdateWhyItem,
  onDeleteWhyItem,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateSolution,
  onUpdateSolution,
  onDeleteSolution,
  onDuplicateSolution
}) => {
  return (
    <div>
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex gap-2 bg-white/60 border border-gray-200 rounded-xl p-1 w-fit">
          {[
            { id: 'hero', label: 'Hero Section' },
            { id: 'why', label: 'Why Items' },
            { id: 'products', label: 'Products' },
            { id: 'solutions', label: 'Solutions' }
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
        
        {activeTab === 'products' && (
          <ProductsEditor 
            products={homepageData?.products} 
            onCreate={onCreateProduct}
            onUpdate={onUpdateProduct}
            onDelete={onDeleteProduct}
            editing={editingItem}
            onEdit={setEditingItem}
            onCancel={() => setEditingItem(null)}
          />
        )}
        
        {activeTab === 'solutions' && (
          <SolutionsEditor 
            solutions={solutions} 
            onCreate={onCreateSolution}
            onUpdate={onUpdateSolution}
            onDelete={onDeleteSolution}
            onDuplicate={onDuplicateSolution}
            editing={editingItem}
            onEdit={setEditingItem}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
};

// Solutions Management Component
const SolutionsManagement = ({ solutions, onEditSolution, onDuplicateSolution, onDeleteSolution }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Solutions</h3>
        <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>Add New Solution</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Solution</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {solutions.map((solution) => (
            <li key={solution.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    solution.category === 'Industry'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {solution.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{solution.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{solution.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{solution.route}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => onEditSolution(solution)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Page Content"
                    aria-label="Edit Page Content"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateSolution(solution)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                    title="Duplicate"
                    aria-label="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSolution(solution)}
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
            <h3 className="text-sm font-medium text-blue-800">Solution Page Management</h3>
            <p className="mt-1 text-sm text-blue-700">
              Click the <strong>Edit</strong> button (blue) to manage the complete content of each solution page including hero sections, benefits, use cases, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = ({ products, onCreateProduct, onUpdateProduct, onDeleteProduct, editingItem, setEditingItem }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Products</h3>
        <button 
          onClick={() => setEditingItem('new')}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Product</div>
          <div>Description</div>
          <div>Category</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {products?.map((product) => (
            <li key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.category === 'Generative AI'
                      ? 'bg-purple-100 text-purple-700'
                      : product.category === 'Artificial Intelligence (AI)'
                      ? 'bg-blue-100 text-blue-700'
                      : product.category === 'Compute'
                      ? 'bg-green-100 text-green-700'
                      : product.category === 'Storage'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{product.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{product.category}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => setEditingItem(product.id)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
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

      {/* Product Editor Modal */}
      {editingItem && (
        <ProductsEditor 
          products={products} 
          onCreate={onCreateProduct}
          onUpdate={onUpdateProduct}
          onDelete={onDeleteProduct}
          editing={editingItem}
          onEdit={setEditingItem}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

// Solutions Editor Component
const SolutionsEditor = ({ solutions, onCreate, onUpdate, onDelete, onDuplicate, editing, onEdit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: '',
    border_color: '',
    route: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (editing && editing !== 'new' && solutions) {
      const solution = solutions.find(solution => solution.id === editing);
      if (solution) {
        setFormData({
          name: solution.name,
          description: solution.description,
          category: solution.category,
          color: solution.color,
          border_color: solution.border_color,
          route: solution.route
        });
      }
    } else if (editing === 'new') {
      setFormData({
        name: '',
        description: '',
        category: '',
        color: '',
        border_color: '',
        route: ''
      });
    }
  }, [editing, solutions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing === 'new') {
      onCreate(formData);
    } else {
      onUpdate(editing, formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      color: '',
      border_color: '',
      route: ''
    });
    onCancel();
  };

  const handleEnhanceDescription = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a solution name first before enhancing the description.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter some basic description first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await enhanceDescription(
        formData.name,
        formData.description,
        'solution'
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
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Solutions</h2>
        <button
          onClick={() => onEdit('new')}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Solution
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {solutions?.map((solution, index) => (
          <div key={solution.id} className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow-md hover:bg-white transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                    solution.category === 'Industry'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {solution.category}
                  </span>
                  <h3 className="font-medium text-gray-900">{solution.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">{solution.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Route: {solution.route}</span>
                  <span className="text-sm text-gray-500">Color: {solution.color}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(solution.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDuplicate(solution)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => onDelete(solution.id)}
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

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={!!editing}
        onClose={handleCancel}
        title={editing === 'new' ? 'Add New Solution' : 'Edit Solution'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category...</option>
                <option value="Industry">Industry</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing || !formData.name.trim() || !formData.description.trim()}
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
                    Enhance with Google AI
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
              Tip: Enter a basic description and solution name first, then click "Enhance with AI" to generate a more detailed and professional description.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
              <input
                type="text"
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/solutions/example"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="from-blue-50 to-blue-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input
                type="text"
                value={formData.border_color}
                onChange={(e) => setFormData({...formData, border_color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="border-blue-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              {editing === 'new' ? 'Create Solution' : 'Update Solution'}
            </button>
          </div>
        </form>
      </Modal>
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
    route: ''
  });
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (solution) {
      setCardData({
        name: solution.name,
        description: solution.description,
        category: solution.category,
        color: solution.color,
        border_color: solution.border_color,
        route: solution.route
      });
      loadSections();
    }
  }, [solution]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/solutions/${solution.id}/sections`);
      const sectionsData = await response.json();
      setSections(sectionsData);
    } catch (err) {
      console.error('Error loading sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCard = async () => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:3000/api/solutions/${solution.id}`, {
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
      const response = await fetch(`http://localhost:3000/api/solutions/${solution.id}/sections`, {
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
      const response = await fetch(`http://localhost:3000/api/solutions/${solution.id}/sections/${sectionId}`, {
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
        const response = await fetch(`http://localhost:3000/api/solutions/${solution.id}/sections/${sectionId}`, {
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

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> Use Tailwind CSS classes for colors (e.g., from-blue-50 to-blue-100)</p>
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
                    <span className={`inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 mb-2 ${
                      cardData.category === 'Industry' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
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
                    Enhance with AI
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
                  Enhance with AI
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

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={!!editing}
        onClose={handleCancel}
        title={editing === 'new' ? 'Add New Item' : 'Edit Item'}
      >
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
                    Enhance with Google AI
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              {editing === 'new' ? 'Create Item' : 'Update Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Products Editor Component
const ProductsEditor = ({ products, onCreate, onUpdate, onDelete, editing, onEdit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: '',
    border_color: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (editing && editing !== 'new' && products) {
      const product = products.find(product => product.id === editing);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          color: product.color,
          border_color: product.border_color
        });
      }
    } else if (editing === 'new') {
      setFormData({
        name: '',
        description: '',
        category: '',
        color: '',
        border_color: ''
      });
    }
  }, [editing, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing === 'new') {
      onCreate(formData);
    } else {
      onUpdate(editing, formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      color: '',
      border_color: ''
    });
    onCancel();
  };

  const handleEnhanceDescription = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a product name first before enhancing the description.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter some basic description first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await enhanceDescription(
        formData.name,
        formData.description,
        'product'
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
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => onEdit('new')}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {products?.map((product, index) => (
          <div key={product.id} className="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm hover:shadow-md hover:bg-white transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-500">Category: {product.category}</span>
                  <span className="text-sm text-gray-500">Color: {product.color}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(product.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(product.id)}
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

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={!!editing}
        onClose={handleCancel}
        title={editing === 'new' ? 'Add New Product' : 'Edit Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing || !formData.name.trim() || !formData.description.trim()}
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
                    Enhance with Google AI
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
              Tip: Enter a basic description and product name first, then click "Enhance with AI" to generate a more detailed and professional description.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="from-blue-50 to-blue-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input
                type="text"
                value={formData.border_color}
                onChange={(e) => setFormData({...formData, border_color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="border-blue-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              {editing === 'new' ? 'Create Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;