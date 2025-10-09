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
  duplicateSolution,
  deleteSolution
} from '../services/cmsApi';

const AdminPanel = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('hero');
  const [editingItem, setEditingItem] = useState(null);
  const [editingSolution, setEditingSolution] = useState(null);

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Cloud4India CMS</h1>
          <p className="text-sm text-gray-600 mt-1">Content Management</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            <button
              onClick={() => {
                setActiveSection('home');
                setEditingSolution(null);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${
                activeSection === 'home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Home Page
            </button>
            
            <button
              onClick={() => {
                setActiveSection('solutions');
                setEditingSolution(null);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${
                activeSection === 'solutions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Solutions
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeSection === 'home' && 'Home Page Management'}
            {activeSection === 'solutions' && 'Solutions Management'}
            {activeSection === 'solution-editor' && `Edit: ${editingSolution?.name}`}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
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
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
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
  onDeleteProduct
}) => {
  return (
    <div>
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'hero', label: 'Hero Section' },
            { id: 'why', label: 'Why Items' },
            { id: 'products', label: 'Products' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      </div>
    </div>
  );
};

// Solutions Management Component
const SolutionsManagement = ({ solutions, onEditSolution, onDuplicateSolution, onDeleteSolution }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Manage Solutions</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add New Solution
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <div key={solution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    solution.category === 'Industry' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {solution.category}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{solution.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{solution.description}</p>
                <p className="text-xs text-gray-500">Route: {solution.route}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEditSolution(solution)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDuplicateSolution(solution)}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Duplicate
              </button>
              <button
                onClick={() => onDeleteSolution(solution)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Solution Editor Component
const SolutionEditor = ({ solution, onBack }) => {
  const [activeTab, setActiveTab] = useState('card');
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
    { value: 'hero', label: 'Hero Section', description: 'Main banner with title and description' },
    { value: 'benefits', label: 'Benefits Section', description: 'Key benefits and advantages' },
    { value: 'segments', label: 'Segments Section', description: 'Different segments or categories' },
    { value: 'success_story', label: 'Success Story', description: 'Customer success stories' },
    { value: 'technology', label: 'Technology Section', description: 'Technical details and features' },
    { value: 'use_cases', label: 'Use Cases', description: 'Real-world use cases and examples' },
    { value: 'roi', label: 'ROI Section', description: 'Return on investment information' },
    { value: 'implementation', label: 'Implementation', description: 'How to get started' },
    { value: 'resources', label: 'Resources', description: 'Additional resources and links' },
    { value: 'cta', label: 'Call to Action', description: 'Final call to action section' }
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
        <nav className="flex space-x-8">
          {[
            { id: 'card', label: 'Card Details' },
            { id: 'sections', label: 'Page Sections' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Card Details Tab */}
      {activeTab === 'card' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold mb-4">Solution Card Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={cardData.category}
                onChange={(e) => setCardData({...cardData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Industry">Industry</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={cardData.description}
              onChange={(e) => setCardData({...cardData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
              <input
                type="text"
                value={cardData.route}
                onChange={(e) => setCardData({...cardData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
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

          <button
            onClick={handleSaveCard}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Card Details'}
          </button>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold">Page Sections</h4>
            <button
              onClick={() => setEditingSection('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Section
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sections...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mr-2">
                          {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                        </span>
                        <span className="text-sm text-gray-500">Order: {section.order_index}</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{section.title || 'Untitled Section'}</h5>
                      <p className="text-gray-600 text-sm">{section.content || 'No content'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSection(section.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {sections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No sections created yet.</p>
                  <p className="text-sm">Click "Add New Section" to get started.</p>
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

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h5 className="text-lg font-semibold mb-4">
        {section ? 'Edit Section' : 'Add New Section'}
      </h5>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
          <select
            value={formData.section_type}
            onChange={(e) => setFormData({...formData, section_type: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select section type...</option>
            {sectionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Section title..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Section content... (HTML supported)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use HTML tags for formatting. For example: &lt;h3&gt;Subtitle&lt;/h3&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {section ? 'Update Section' : 'Create Section'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Why Items</h2>
        <button
          onClick={() => onEdit('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Item
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {whyItems?.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
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
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            {editing === 'new' ? 'Add New Item' : 'Edit Item'}
          </h3>
          
          <div className="space-y-4 mb-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing === 'new' ? 'Create Item' : 'Update Item'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => onEdit('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {products?.map((product, index) => (
          <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
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
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            {editing === 'new' ? 'Add New Product' : 'Edit Product'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                required
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing === 'new' ? 'Create Product' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminPanel;