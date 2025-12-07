import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { 
  getMainProductsContent, 
  getProductsWithCards,
  updateMainProductsHero, 
  updateMainProductsSection,
  toggleMainProductsSectionVisibility
} from '../services/cmsApi';

const ProductsMainAdmin = () => {
  const [mainPageData, setMainPageData] = useState(null);
  const [productsWithCards, setProductsWithCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
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
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    features: ['', '', '', ''] // Exactly 4 features
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch hero content
      const heroData = await getMainProductsContent(true);
      setMainPageData(heroData);
      
      // Initialize hero form
      if (heroData.hero) {
        setHeroForm({
          title: heroData.hero.title || '',
          subtitle: heroData.hero.subtitle || '',
          description: heroData.hero.description || '',
          stat1_label: heroData.hero.stat1_label || 'Global Customers',
          stat1_value: heroData.hero.stat1_value || '10K+',
          stat2_label: heroData.hero.stat2_label || 'Uptime SLA',
          stat2_value: heroData.hero.stat2_value || '99.9%',
          stat3_label: heroData.hero.stat3_label || 'Data Centers',
          stat3_value: heroData.hero.stat3_value || '15+',
          stat4_label: heroData.hero.stat4_label || 'Support Rating',
          stat4_value: heroData.hero.stat4_value || '4.9★'
        });
      }
      
      // Fetch all products with their card data
      const productsData = await getProductsWithCards();
      setProductsWithCards(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHeroUpdate = async () => {
    try {
      await updateMainProductsHero(heroForm);
      await fetchData();
      setEditingHero(false);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero: ' + err.message);
    }
  };

  const startEditingCard = (item) => {
    const features = item.card.features || [];
    // Ensure exactly 4 features
    const paddedFeatures = [...features, '', '', '', ''].slice(0, 4);
    
    setCardForm({
      title: item.card.title || item.product.name,
      description: item.card.description || item.product.description || '',
      features: paddedFeatures
    });
    setEditingCard(item);
    setShowEditModal(true);
  };

  const handleCardUpdate = async () => {
    if (!editingCard || !editingCard.card.id) {
      alert('Error: Card entry not found. Please refresh the page.');
      return;
    }

    try {
      // Filter out empty features
      const filteredFeatures = cardForm.features.filter(f => f && f.trim());
      
      await updateMainProductsSection(editingCard.card.id, {
        title: cardForm.title,
        description: cardForm.description,
        features: filteredFeatures, // Send as array, backend will convert to JSON
        is_visible: editingCard.card.is_visible,
        order_index: editingCard.card.order_index
      });
      
      await fetchData();
      setShowEditModal(false);
      setEditingCard(null);
      alert('Product card updated successfully!');
    } catch (err) {
      alert('Error updating card: ' + err.message);
    }
  };

  const handleToggleVisibility = async (cardId) => {
    try {
      await toggleMainProductsSectionVisibility(cardId);
      await fetchData();
    } catch (err) {
      alert('Error toggling visibility: ' + err.message);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...cardForm.features];
    newFeatures[index] = value;
    setCardForm({...cardForm, features: newFeatures});
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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
                {[1, 2, 3, 4].map(num => (
                  <React.Fragment key={num}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stat {num} Label</label>
                      <input
                        type="text"
                        value={heroForm[`stat${num}_label`]}
                        onChange={(e) => setHeroForm({...heroForm, [`stat${num}_label`]: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stat {num} Value</label>
                      <input
                        type="text"
                        value={heroForm[`stat${num}_value`]}
                        onChange={(e) => setHeroForm({...heroForm, [`stat${num}_value`]: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </React.Fragment>
                ))}
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
                <h3 className="text-lg font-medium text-gray-900">{mainPageData?.hero?.title || 'Our Products'}</h3>
                <p className="text-sm text-gray-600">{mainPageData?.hero?.subtitle || 'Cloud Services - Made in India'}</p>
                <p className="text-sm text-gray-500 mt-2">{mainPageData?.hero?.description || 'Discover our comprehensive suite of cloud computing services designed to power your business transformation.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Cards Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Product Cards</h2>
            <p className="text-sm text-gray-500">Edit card content for each product. Changes only affect the products listing page.</p>
          </div>
          
          {productsWithCards.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products found.</p>
          ) : (
            <div className="space-y-4">
              {productsWithCards.map((item) => (
                <div key={item.product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{item.card.title || item.product.name}</h3>
                        {item.card.category && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {item.card.category}
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          item.card.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.card.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{item.card.description || item.product.description || 'No description'}</p>
                      
                      {/* Features Display */}
                      {item.card.features && item.card.features.length > 0 ? (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {item.card.features.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 mb-3">No features added yet</p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        Product: {item.product.name} | Route: /products/{item.product.route || 'no-route'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => startEditingCard(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit Card"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(item.card.id)}
                        className={`p-2 rounded-lg ${
                          item.card.is_visible 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={item.card.is_visible ? 'Hide' : 'Show'}
                      >
                        {item.card.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Card Modal */}
      {showEditModal && editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Card: {editingCard.product.name}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCard(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Changes here only affect the product card on the products listing page. 
                  The actual product page content remains unchanged.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.title}
                  onChange={(e) => setCardForm({...cardForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter card title"
                />
                <p className="mt-1 text-xs text-gray-500">This appears on the product card (not the product page)</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={cardForm.description}
                  onChange={(e) => setCardForm({...cardForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter card description"
                />
                <p className="mt-1 text-xs text-gray-500">This appears on the product card (not the product page)</p>
              </div>

              {/* Features - Exactly 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (4 Bullet Points) <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-gray-500 text-sm w-8">{index + 1}.</span>
                      <input
                        type="text"
                        value={cardForm.features[index] || ''}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1} (optional)`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">Empty features will be hidden. Maximum 4 features.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCardUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCard(null);
                  }}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsMainAdmin;
