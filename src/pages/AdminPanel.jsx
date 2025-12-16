import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  getHomepageContent, 
  updateHeroContent, 
  createWhyItem,
  updateWhyItem, 
  deleteWhyItem,
  getAdminMarketplaces,
  duplicateMarketplace,
  toggleMarketplaceVisibility,
  // Comprehensive Section API functions
  getComprehensiveSectionContent,
  updateComprehensiveSectionHeader,
  updateComprehensiveSectionFeature,
  updateComprehensiveSectionStat,
  // Feature Banners API functions
  getAllFeatureBanners,
  createFeatureBanner,
  updateFeatureBanner,
  deleteFeatureBanner,
  toggleFeatureBannerVisibility
} from '../services/cmsApi';
import PricingAdmin from './PricingAdmin';
import { toSlug } from '../utils/slugUtils';
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
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('hero');
  const [editingItem, setEditingItem] = useState(null);
  const [editingMarketplace, setEditingMarketplace] = useState(null);
  const [comprehensiveSectionData, setComprehensiveSectionData] = useState(null);
  const [featureBanners, setFeatureBanners] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homepage, marketplacesData, comprehensiveData, bannersData] = await Promise.all([
        getHomepageContent(),
        getAdminMarketplaces(),
        getComprehensiveSectionContent(),
        getAllFeatureBanners()
      ]);
      setHomepageData(homepage);
      setMarketplaces(marketplacesData);
      setComprehensiveSectionData(comprehensiveData);
      setFeatureBanners(bannersData);
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
      if (hash === 'marketplaces') {
        setActiveSection('marketplaces');
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
    if (section === 'marketplaces') {
      window.location.hash = 'marketplaces';
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

  // Comprehensive Section Handlers
  const handleUpdateComprehensiveHeader = async (headerData) => {
    try {
      await updateComprehensiveSectionHeader(headerData);
      await fetchData();
      alert('Comprehensive section header updated successfully!');
    } catch (err) {
      alert('Error updating comprehensive section header: ' + err.message);
    }
  };

  const handleUpdateComprehensiveFeature = async (id, featureData) => {
    try {
      await updateComprehensiveSectionFeature(id, featureData);
      await fetchData();
      alert('Feature card updated successfully!');
    } catch (err) {
      alert('Error updating feature card: ' + err.message);
    }
  };

  const handleUpdateComprehensiveStat = async (id, statData) => {
    try {
      await updateComprehensiveSectionStat(id, statData);
      await fetchData();
      alert('Statistic updated successfully!');
    } catch (err) {
      alert('Error updating statistic: ' + err.message);
    }
  };

  // Feature Banners Handlers
  const handleCreateFeatureBanner = async (bannerData) => {
    try {
      await createFeatureBanner(bannerData);
      await fetchData();
      alert('Feature banner created successfully!');
    } catch (err) {
      alert('Error creating feature banner: ' + err.message);
    }
  };

  const handleUpdateFeatureBanner = async (id, bannerData) => {
    try {
      await updateFeatureBanner(id, bannerData);
      await fetchData();
      alert('Feature banner updated successfully!');
    } catch (err) {
      alert('Error updating feature banner: ' + err.message);
    }
  };

  const handleDeleteFeatureBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature banner?')) {
      try {
        await deleteFeatureBanner(id);
        await fetchData();
        alert('Feature banner deleted successfully!');
      } catch (err) {
        alert('Error deleting feature banner: ' + err.message);
      }
    }
  };

  const handleToggleFeatureBannerVisibility = async (id) => {
    try {
      await toggleFeatureBannerVisibility(id);
      await fetchData();
      alert('Feature banner visibility toggled successfully!');
    } catch (err) {
      alert('Error toggling feature banner visibility: ' + err.message);
    }
  };

  // Marketplaces Handlers for Home Page Management
  const handleToggleMarketplaceVisibility = async (marketplace) => {
    try {
      await toggleMarketplaceVisibility(marketplace.id);
      await fetchData();
      alert(`Marketplace ${marketplace.is_visible ? 'hidden' : 'shown'} successfully!`);
    } catch (err) {
      alert('Error toggling marketplace visibility: ' + err.message);
    }
  };

  // Marketplaces Handlers
  const handleEditMarketplace = (marketplace) => {
    setEditingMarketplace(marketplace);
    setActiveSection('marketplace-editor');
  };

  const handleDuplicateMarketplace = async (marketplace) => {
    const newName = prompt('Enter new marketplace name:', `${marketplace.name} (Copy)`);
    if (!newName) return;
    
    const newRoute = prompt('Enter new route:', `/marketplace/${toSlug(marketplace.name)}-copy`);
    if (!newRoute) return;

    try {
      await duplicateMarketplace(marketplace.id, { newName, newRoute });
      await fetchData();
      alert('Marketplace duplicated successfully!');
    } catch (err) {
      alert('Error duplicating marketplace: ' + err.message);
    }
  };

  const handleDeleteMarketplace = async (marketplaceOrId) => {
    // Handle both marketplace object and ID
    const marketplace = typeof marketplaceOrId === 'object' ? marketplaceOrId : marketplaces.find(s => s.id === marketplaceOrId);
    
    if (!marketplace) {
      alert('Marketplace not found!');
      return;
    }

    console.log('Attempting to delete marketplace:', marketplace);

    if (window.confirm(`Are you sure you want to delete "${marketplace.name}"? This will also delete all its sections.`)) {
      try {
        console.log('Calling deleteMarketplace API with ID:', marketplace.id);
        const result = await deleteMarketplace(marketplace.id);
        console.log('Delete API result:', result);
        
        console.log('Refreshing data...');
        await fetchData();
        console.log('Data refreshed successfully');
        
        alert('Marketplace deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting marketplace: ' + err.message);
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
            comprehensiveSectionData={comprehensiveSectionData}
            onUpdateComprehensiveHeader={handleUpdateComprehensiveHeader}
            onUpdateComprehensiveFeature={handleUpdateComprehensiveFeature}
            onUpdateComprehensiveStat={handleUpdateComprehensiveStat}
            featureBanners={featureBanners}
            onCreateFeatureBanner={handleCreateFeatureBanner}
            onUpdateFeatureBanner={handleUpdateFeatureBanner}
            onDeleteFeatureBanner={handleDeleteFeatureBanner}
            onToggleFeatureBannerVisibility={handleToggleFeatureBannerVisibility}
          />
          )}
          
          {activeSection === 'marketplaces' && (
            <MarketplacesManagement 
              marketplaces={marketplaces}
              onEditMarketplace={handleEditMarketplace}
              onDuplicateMarketplace={handleDuplicateMarketplace}
              onDeleteMarketplace={handleDeleteMarketplace}
              onToggleVisibility={handleToggleMarketplaceVisibility}
            />
          )}
          
          {activeSection === 'pricing' && (
            <PricingAdmin />
          )}
          
          {activeSection === 'marketplace-editor' && editingMarketplace && (
            <MarketplaceEditor 
              marketplace={editingMarketplace}
              onBack={() => updateActiveSection('marketplaces')}
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
  onDeleteWhyItem,
  comprehensiveSectionData,
  onUpdateComprehensiveHeader,
  onUpdateComprehensiveFeature,
  onUpdateComprehensiveStat,
  featureBanners,
  onCreateFeatureBanner,
  onUpdateFeatureBanner,
  onDeleteFeatureBanner,
  onToggleFeatureBannerVisibility
}) => {
  return (
    <div>
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex gap-2 bg-white/60 border border-gray-200 rounded-xl p-1 w-fit">
          {[
            { id: 'hero', label: 'Hero Section' },
            { id: 'why', label: 'Why Items' },
            { id: 'sections-config', label: 'Section Headings' },
            { id: 'comprehensive', label: 'Comprehensive Section' },
            { id: 'feature-banners', label: 'Feature Banners' }
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

        {activeTab === 'sections-config' && (
          <SectionsConfigEditor 
            sectionsConfig={homepageData?.sectionsConfig}
          />
        )}

        {activeTab === 'comprehensive' && (
          <ComprehensiveSectionEditor 
            data={comprehensiveSectionData}
            onUpdateHeader={onUpdateComprehensiveHeader}
            onUpdateFeature={onUpdateComprehensiveFeature}
            onUpdateStat={onUpdateComprehensiveStat}
          />
        )}

        {activeTab === 'feature-banners' && (
          <FeatureBannersEditor 
            banners={featureBanners}
            onCreate={onCreateFeatureBanner}
            onUpdate={onUpdateFeatureBanner}
            onDelete={onDeleteFeatureBanner}
            onToggleVisibility={onToggleFeatureBannerVisibility}
          />
        )}
        
      </div>
    </div>
  );
};

// Marketplaces Management Component
const MarketplacesManagement = ({ marketplaces, onEditMarketplace, onDuplicateMarketplace, onDeleteMarketplace, onToggleVisibility }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Marketplace</h3>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Marketplace</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {marketplaces.map((marketplace) => (
            <li key={marketplace.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    marketplace.category === 'Industry'
                      ? 'bg-sky-100 text-sky-700'
                      : marketplace.category === 'Technology'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {marketplace.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{marketplace.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{marketplace.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{marketplace.route}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => onEditMarketplace(marketplace)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Page Content"
                    aria-label="Edit Page Content"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateMarketplace(marketplace)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                    title="Duplicate"
                    aria-label="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(marketplace)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg ${
                      marketplace.is_visible !== 0 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    title={marketplace.is_visible !== 0 ? 'Hide Marketplace' : 'Show Marketplace'}
                    aria-label={marketplace.is_visible !== 0 ? 'Hide Marketplace' : 'Show Marketplace'}
                  >
                    {marketplace.is_visible !== 0 ? (
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
                    onClick={() => onDeleteMarketplace(marketplace)}
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
    </div>
  );
};



// Marketplaces Editor Component
const MarketplacesEditor = () => null;


// Marketplace Editor Component
const MarketplaceEditor = ({ marketplace, onBack }) => {
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
    if (marketplace) {
      setCardData({
        name: marketplace.name,
        description: marketplace.description,
        category: marketplace.category,
        color: marketplace.color,
        border_color: marketplace.border_color,
        route: marketplace.route,
        gradient_start: marketplace.gradient_start || 'blue',
        gradient_end: marketplace.gradient_end || 'blue-700'
      });
      loadSections();
    }
  }, [marketplace]);

  const loadSections = async () => {
    try {
      setLoading(true);
      console.log(`Loading sections for marketplace ID: ${marketplace.id}`);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections`);
      
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      
      if (response.ok) {
        alert('Marketplace card updated successfully!');
      } else {
        throw new Error('Failed to update marketplace');
      }
    } catch (err) {
      alert('Error updating marketplace: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSection = async (sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections`, {
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections/${sectionId}`, {
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
        const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections/${sectionId}`, {
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplace.id}/sections/${sectionId}`, {
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
    { value: 'technology', label: 'Technology Features', description: 'Technical capabilities and innovations' },
    { value: 'use_cases', label: 'Use Cases & Marketplaces', description: 'Real-world applications and scenarios' },
    { value: 'roi', label: 'ROI & Value', description: 'Return on investment and business value' },
    { value: 'implementation', label: 'Implementation Timeline', description: 'Step-by-step implementation process' },
    { value: 'resources', label: 'Resources & Support', description: 'Documentation, training, and support materials' },
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
        <h3 className="text-xl font-semibold text-gray-900">Edit Marketplace: {marketplace.name}</h3>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Marketplace Overview', description: 'Basic marketplace information' },
            { id: 'sections', label: 'Page Sections', description: 'Manage page content sections' },
            { id: 'preview', label: 'Preview', description: 'Preview the marketplace page' }
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

      {/* Marketplace Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-6 flex items-center">
            <CubeIcon className="h-5 w-5 mr-2 text-blue-600" />
            Marketplace Overview & Card Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marketplace Name</label>
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
              placeholder="Brief description for the marketplace card..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">This appears on the marketplaces overview page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Route</label>
              <input
                type="text"
                value={cardData.route}
                onChange={(e) => setCardData({...cardData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/marketplace/financial-services"
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
              <p>🎨 <strong>Perfect Colors:</strong> Only your 4 beautiful colors are available. New marketplaces will randomly get one of these colors!</p>
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
              <p className="text-sm text-gray-600 mt-1">Manage all sections of the marketplace page</p>
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
                  <p className="text-gray-500 mb-4">Start building your marketplace page by adding content sections.</p>
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
              marketplaceId={marketplace.id}
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
              <h4 className="text-lg font-semibold text-gray-900">Marketplace Page Preview</h4>
              <p className="text-sm text-gray-600 mt-1">Preview how your marketplace page will look</p>
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
              {/* Marketplace Overview Card */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">Marketplace Overview</h5>
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
                    View marketplace →
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
                    <p><strong>Content:</strong> &lt;ul&gt;&lt;li&gt;Enhanced Security&lt;/li&gt;&lt;li&gt;Scalable Marketplaces&lt;/li&gt;&lt;/ul&gt;</p>
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

// Existing Editor Components (HeroEditor, WhyItemsEditor)
// ... (keeping the existing components from the previous AdminPanel)

// Hero Editor Component
const HeroEditor = ({ hero, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    primary_button_text: ''
  });
  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        description: hero.description || '',
        primary_button_text: hero.primary_button_text || ''
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
            placeholder="Enter description..."
            required
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
            <input
              type="text"
              value={formData.primary_button_text}
              onChange={(e) => setFormData({...formData, primary_button_text: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
  
  const [whyHeaderForm, setWhyHeaderForm] = useState({
    heading: '',
    description: ''
  });
  
  const [savingHeader, setSavingHeader] = useState(false);

  // Load Why section header from API
  useEffect(() => {
    const fetchWhyConfig = async () => {
      try {
        const CMS_URL = import.meta.env.VITE_CMS_URL || import.meta.env.VITE_CMS_API_URL || 'http://149.13.60.6:4002';
        const response = await fetch(`${CMS_URL}/api/homepage`);
        const data = await response.json();
        if (data.sectionsConfig?.why) {
          setWhyHeaderForm({
            heading: data.sectionsConfig.why.heading || '',
            description: data.sectionsConfig.why.description || ''
          });
        }
      } catch (error) {
        console.error('Error loading why config:', error);
      }
    };
    fetchWhyConfig();
  }, []);
  
  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
        const CMS_URL = import.meta.env.VITE_CMS_URL || import.meta.env.VITE_CMS_API_URL || 'http://149.13.60.6:4002';
        const response = await fetch(`${CMS_URL}/api/homepage/sections/why`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whyHeaderForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      alert('Why section header updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving configuration');
    } finally {
      setSavingHeader(false);
    }
  };

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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Why Section Header */}
      <div className="mb-8 pb-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Why Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={whyHeaderForm.heading}
              onChange={(e) => setWhyHeaderForm({...whyHeaderForm, heading: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Why Cloud4India?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={whyHeaderForm.description}
              onChange={(e) => setWhyHeaderForm({...whyHeaderForm, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description..."
            />
          </div>
          <button
            onClick={handleSaveHeader}
            disabled={savingHeader}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {savingHeader ? 'Saving...' : 'Save Why Section Header'}
          </button>
        </div>
      </div>
      
      {/* Why Items List */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Why Items (Expandable Cards)</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description..."
                  required
                />
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
const SectionItemsManager = ({ section, marketplaceId, onCancel, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const closeHandler = onClose || onCancel;

  useEffect(() => {
    if (section) {
      loadItems();
    }
  }, [section]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items`;
      
      console.log(`Loading items from: ${apiPath}`);
      console.log(`Marketplace ID: ${marketplaceId}, Section ID: ${section.id}`);
      
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const itemsData = await response.json();
      console.log(`Loaded ${itemsData.length} items:`, itemsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error loading section items:', err);
      console.error('API Path:', `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items`;
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
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items/${itemId}`;
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
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}/sections/${section.id}/items/${itemId}`;
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

  const itemTypes = [
    { value: 'benefit', label: 'Benefit Card' },
    { value: 'feature', label: 'Feature' },
    { value: 'stat', label: 'Statistic' },
    { value: 'use_case', label: 'Use Case' },
    { value: 'technology', label: 'Technology' },
    { value: 'segment', label: 'Segment' },
    { value: 'step', label: 'Step' },
    { value: 'resource', label: 'Resource' },
    ...(section?.section_type === 'media_banner' ? [{ value: 'media_item', label: 'Media Item' }] : [])
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
                            // Marketplace item types
                            item.item_type === 'benefit' ? 'bg-green-100 text-green-700' :
                            item.item_type === 'feature' ? 'bg-blue-100 text-blue-700' :
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
                            // Marketplace item types
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
              section={section}
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
const SectionItemEditor = ({ item, section, itemTypes, onCreate, onUpdate, onCancel, saving }) => {
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
  const [contentJSON, setContentJSON] = useState({});
  const isMediaBanner = section?.section_type === 'media_banner';

  useEffect(() => {
    if (item) {
      setFormData({
        item_type: item.item_type || (isMediaBanner ? 'media_item' : ''),
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        value: item.value || '',
        label: item.label || '',
        features: item.features || ''
      });
      
      // Parse content JSON for media_banner items
      if (isMediaBanner && item.content) {
        try {
          const parsedContent = JSON.parse(item.content);
          setContentJSON(parsedContent);
        } catch (e) {
          console.error('Error parsing content:', e);
          setContentJSON({
            media_type: 'image',
            media_source: 'upload',
            media_url: ''
          });
        }
      } else if (isMediaBanner) {
        // Initialize empty media content for new items
        setContentJSON({
          media_type: 'image',
          media_source: 'upload',
          media_url: ''
        });
      }
      
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
        item_type: isMediaBanner ? 'media_item' : '',
        title: '',
        description: '',
        icon: '',
        value: '',
        label: '',
        features: ''
      });
      setFeaturesList([]);
      if (isMediaBanner) {
        setContentJSON({
          media_type: 'image',
          media_source: 'upload',
          media_url: ''
        });
      }
    }
  }, [item, isMediaBanner]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For media_banner items, validate and include content JSON
    let finalData = { ...formData };
    if (isMediaBanner) {
      if (!contentJSON.media_type) {
        alert('Please select a media type (Image or Video)');
        return;
      }
      if (contentJSON.media_type === 'video' && !contentJSON.media_source) {
        alert('Please select a video source (YouTube or Upload)');
        return;
      }
      if (!contentJSON.media_url || contentJSON.media_url.trim() === '') {
        alert('Please provide a media URL or upload a file');
        return;
      }
      finalData.content = JSON.stringify(contentJSON);
      console.log('Media banner item - contentJSON:', contentJSON);
      console.log('Media banner item - finalData:', finalData);
    }
    
    if (item) {
      console.log('Updating item with data:', finalData);
      onUpdate(item.id, finalData);
    } else {
      console.log('Creating item with data:', finalData);
      onCreate(finalData);
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
            {!isMediaBanner && (
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
            )}
            {isMediaBanner && (
              <input type="hidden" value="media_item" />
            )}

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

            {/* Media Banner Fields */}
            {isMediaBanner && (
              <>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-900">
                    <strong>Media Item</strong> - Add photos or videos to the gallery carousel
                  </p>
                </div>
                
                {/* Media Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Media Type *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="media_type"
                        value="image"
                        checked={contentJSON.media_type === 'image'}
                        onChange={(e) => setContentJSON(prev => ({ ...prev, media_type: e.target.value, media_source: 'upload', media_url: '' }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">📷 Photo</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="media_type"
                        value="video"
                        checked={contentJSON.media_type === 'video'}
                        onChange={(e) => setContentJSON(prev => ({ ...prev, media_type: e.target.value, media_source: 'youtube', media_url: '' }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">🎥 Video</span>
                    </label>
                  </div>
                </div>
                
                {/* Video Source (only if video) */}
                {contentJSON.media_type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Video Source *</label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="video_source"
                          value="youtube"
                          checked={contentJSON.media_source === 'youtube'}
                          onChange={(e) => setContentJSON(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">YouTube URL</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="video_source"
                          value="upload"
                          checked={contentJSON.media_source === 'upload'}
                          onChange={(e) => setContentJSON(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Upload Video File</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Media URL Input */}
                {contentJSON.media_source === 'youtube' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
                    <input
                      type="url"
                      value={contentJSON.media_url || ''}
                      onChange={(e) => setContentJSON(prev => ({ ...prev, media_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {contentJSON.media_type === 'video' ? 'Video URL' : 'Image URL'} *
                    </label>
                    <input
                      type="url"
                      value={contentJSON.media_url || ''}
                      onChange={(e) => setContentJSON(prev => ({ ...prev, media_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={contentJSON.media_type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the full URL to your {contentJSON.media_type === 'video' ? 'video' : 'image'} file
                    </p>
                  </div>
                )}
              </>
            )}

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

// Comprehensive Section Editor Component
const ComprehensiveSectionEditor = ({ 
  data, 
  onUpdateHeader, 
  onUpdateFeature, 
  onUpdateStat 
}) => {
  const [headerData, setHeaderData] = useState({
    title: '',
    description: ''
  });
  const [features, setFeatures] = useState([]);
  const [stats, setStats] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null);
  const [editingStat, setEditingStat] = useState(null);

  useEffect(() => {
    if (data) {
      setHeaderData({
        title: data.header?.title || '',
        description: data.header?.description || ''
      });
      setFeatures(data.features || []);
      setStats(data.stats || []);
    }
  }, [data]);

  const handleHeaderSubmit = (e) => {
    e.preventDefault();
    onUpdateHeader(headerData);
  };

  const handleFeatureSubmit = (e, feature) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const featureData = {
      title: formData.get('title'),
      description: formData.get('description'),
      button_text: formData.get('button_text'),
      icon_type: formData.get('icon_type'),
      order_index: feature.order_index,
      is_visible: feature.is_visible !== undefined ? feature.is_visible : 1
    };
    onUpdateFeature(feature.id, featureData);
    setEditingFeature(null);
  };

  const handleStatSubmit = (e, stat) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const statData = {
      value: formData.get('value'),
      label: formData.get('label'),
      order_index: stat.order_index,
      is_visible: stat.is_visible !== undefined ? stat.is_visible : 1
    };
    onUpdateStat(stat.id, statData);
    setEditingStat(null);
  };

  const iconTypes = [
    { value: 'chart', label: 'Chart (Scale)' },
    { value: 'users', label: 'Users (Trusted)' },
    { value: 'lightning', label: 'Lightning (Fast)' },
    { value: 'checkmark', label: 'Checkmark (Recognition)' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Header</h2>
        <form onSubmit={handleHeaderSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={headerData.title}
              onChange={(e) => setHeaderData({...headerData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={headerData.description}
              onChange={(e) => setHeaderData({...headerData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Update Header
          </button>
        </form>
      </div>

      {/* Feature Cards Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Feature Cards</h2>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
              {editingFeature === feature.id ? (
                <form onSubmit={(e) => handleFeatureSubmit(e, feature)} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={feature.title}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={feature.description}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      name="button_text"
                      defaultValue={feature.button_text}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                    <select
                      name="icon_type"
                      defaultValue={feature.icon_type}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {iconTypes.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFeature(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      {feature.button_text && (
                        <p className="text-xs text-blue-600 mt-1">Button: {feature.button_text}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Icon: {feature.icon_type}</p>
                    </div>
                    <button
                      onClick={() => setEditingFeature(feature.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Statistics</h2>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
              {editingStat === stat.id ? (
                <form onSubmit={(e) => handleStatSubmit(e, stat)} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      name="value"
                      defaultValue={stat.value}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 200+, 120, 38"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      name="label"
                      defaultValue={stat.label}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStat(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-sm text-gray-600 ml-2">{stat.label}</span>
                  </div>
                  <button
                    onClick={() => setEditingStat(stat.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Feature Banners Editor Component
const FeatureBannersEditor = ({ 
  banners, 
  onCreate, 
  onUpdate, 
  onDelete, 
  onToggleVisibility 
}) => {
  const [editingBanner, setEditingBanner] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const gradientOptions = [
    { value: 'phulkari-fuchsia', label: 'Fuchsia' },
    { value: 'phulkari-red', label: 'Red' },
    { value: 'phulkari-gold', label: 'Gold' },
    { value: 'phulkari-turquoise', label: 'Turquoise' },
    { value: 'phulkari-blue-light', label: 'Blue Light' },
    { value: 'phulkari-peach', label: 'Peach' },
    { value: 'saree-teal', label: 'Teal' },
    { value: 'saree-lime', label: 'Lime' },
    { value: 'saree-rose', label: 'Rose' },
    { value: 'saree-coral', label: 'Coral' },
    { value: 'saree-amber', label: 'Amber' }
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bannerData = {
      category: formData.get('category'),
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      cta_text: formData.get('cta_text'),
      cta_link: formData.get('cta_link'),
      order_index: parseInt(formData.get('order_index')) || banners.length + 1,
      is_visible: formData.get('is_visible') === 'on' ? 1 : 0
    };
    onCreate(bannerData);
    setShowCreateForm(false);
    e.target.reset();
  };

  const handleUpdateSubmit = (e, banner) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bannerData = {
      category: formData.get('category'),
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      cta_text: formData.get('cta_text'),
      cta_link: formData.get('cta_link'),
      order_index: parseInt(formData.get('order_index')) || banner.order_index,
      is_visible: formData.get('is_visible') === 'on' ? 1 : 0
    };
    onUpdate(banner.id, bannerData);
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feature Banners</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {showCreateForm ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Create New Banner</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Innovation, Event, Security"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  name="order_index"
                  defaultValue={banners.length + 1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                name="subtitle"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  name="cta_text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  name="cta_link"
                  defaultValue="#"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_visible"
                defaultChecked
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Visible</label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Banner
            </button>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            {editingBanner === banner.id ? (
              <form onSubmit={(e) => handleUpdateSubmit(e, banner)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={banner.category}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                    <input
                      type="number"
                      name="order_index"
                      defaultValue={banner.order_index}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={banner.title}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <textarea
                    name="subtitle"
                    rows={2}
                    defaultValue={banner.subtitle}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                    <input
                      type="text"
                      name="cta_text"
                      defaultValue={banner.ctaText}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                    <input
                      type="text"
                      name="cta_link"
                      defaultValue={banner.ctaLink}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_visible"
                    defaultChecked={banner.is_visible === 1}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Visible</label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {banner.category}
                      </span>
                      {banner.is_visible === 0 && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Hidden
                        </span>
                      )}
                      <span className="text-xs text-gray-500">Order: {banner.order_index}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-600">CTA: {banner.ctaText}</span>
                      <span className="text-gray-500">Link: {banner.ctaLink}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Gradient: {banner.gradient_start} → {banner.gradient_mid} → {banner.gradient_end}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBanner(banner.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleVisibility(banner.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {banner.is_visible === 1 ? (
                        <>
                          <EyeSlashIcon className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4" />
                          Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(banner.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Section Headings Config Editor Component
const SectionsConfigEditor = ({ sectionsConfig }) => {
  const [formData, setFormData] = useState({
    why: { heading: '', description: '' },
    products: { heading: '', button_text: '', filter_text: '', search_placeholder: '' },
    marketplaces: { heading: '', button_text: '', filter_text: '', search_placeholder: '' },
    solutions: { heading: '', button_text: '', filter_text: '', search_placeholder: '' }
  });
  
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    if (sectionsConfig) {
      setFormData({
        why: {
          heading: sectionsConfig.why?.heading || 'Why Cloud4India?',
          description: sectionsConfig.why?.description || ''
        },
        products: {
          heading: sectionsConfig.products?.heading || 'Explore our Products',
          button_text: sectionsConfig.products?.button_text || 'View more Products',
          filter_text: sectionsConfig.products?.filter_text || 'Filter by category',
          search_placeholder: sectionsConfig.products?.search_placeholder || 'Search categories'
        },
        marketplaces: {
          heading: sectionsConfig.marketplaces?.heading || 'Explore our Apps',
          button_text: sectionsConfig.marketplaces?.button_text || 'View more Apps',
          filter_text: sectionsConfig.marketplaces?.filter_text || 'Filter by category',
          search_placeholder: sectionsConfig.marketplaces?.search_placeholder || 'Search categories'
        },
        solutions: {
          heading: sectionsConfig.solutions?.heading || 'Explore our Solutions',
          button_text: sectionsConfig.solutions?.button_text || 'View more Solutions',
          filter_text: sectionsConfig.solutions?.filter_text || 'Filter by category',
          search_placeholder: sectionsConfig.solutions?.search_placeholder || 'Search categories'
        }
      });
    }
  }, [sectionsConfig]);

  const handleSave = async (sectionName) => {
    setSaving(sectionName);
    try {
      const CMS_URL = import.meta.env.VITE_CMS_URL || import.meta.env.VITE_CMS_API_URL || 'http://149.13.60.6:4002';
      const response = await fetch(`${CMS_URL}/api/homepage/sections/${sectionName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData[sectionName])
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      alert(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section config updated successfully!`);
      window.location.reload();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving configuration');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <h2 className="text-xl font-semibold mb-6">Homepage Section Headings & Text</h2>
      
      {/* Products Section Config */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Products Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={formData.products.heading}
              onChange={(e) => setFormData({...formData, products: {...formData.products, heading: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.products.button_text}
              onChange={(e) => setFormData({...formData, products: {...formData.products, button_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Text</label>
            <input
              type="text"
              value={formData.products.filter_text}
              onChange={(e) => setFormData({...formData, products: {...formData.products, filter_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
            <input
              type="text"
              value={formData.products.search_placeholder}
              onChange={(e) => setFormData({...formData, products: {...formData.products, search_placeholder: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('products')}
          disabled={saving === 'products'}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving === 'products' ? 'Saving...' : 'Save Products Section'}
        </button>
      </div>

      {/* Marketplaces Section Config */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Marketplaces Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={formData.marketplaces.heading}
              onChange={(e) => setFormData({...formData, marketplaces: {...formData.marketplaces, heading: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.marketplaces.button_text}
              onChange={(e) => setFormData({...formData, marketplaces: {...formData.marketplaces, button_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Text</label>
            <input
              type="text"
              value={formData.marketplaces.filter_text}
              onChange={(e) => setFormData({...formData, marketplaces: {...formData.marketplaces, filter_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
            <input
              type="text"
              value={formData.marketplaces.search_placeholder}
              onChange={(e) => setFormData({...formData, marketplaces: {...formData.marketplaces, search_placeholder: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('marketplaces')}
          disabled={saving === 'marketplaces'}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving === 'marketplaces' ? 'Saving...' : 'Save Marketplaces Section'}
        </button>
      </div>

      {/* Solutions Section Config */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Solutions Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={formData.solutions.heading}
              onChange={(e) => setFormData({...formData, solutions: {...formData.solutions, heading: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.solutions.button_text}
              onChange={(e) => setFormData({...formData, solutions: {...formData.solutions, button_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Text</label>
            <input
              type="text"
              value={formData.solutions.filter_text}
              onChange={(e) => setFormData({...formData, solutions: {...formData.solutions, filter_text: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
            <input
              type="text"
              value={formData.solutions.search_placeholder}
              onChange={(e) => setFormData({...formData, solutions: {...formData.solutions, search_placeholder: e.target.value}})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('solutions')}
          disabled={saving === 'solutions'}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving === 'solutions' ? 'Saving...' : 'Save Solutions Section'}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;