import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import MarketplaceBasicInfo from '../components/MarketplaceEditor/MarketplaceBasicInfo';
import SectionManager from '../components/MarketplaceEditor/SectionManager';
import ItemManager from '../components/MarketplaceEditor/ItemManager';

const MarketplacesAdminNew = () => {
  const navigate = useNavigate();
  const { marketplaceId = 'new' } = useParams();
  
  const [currentTab, setCurrentTab] = useState('basic');
  const [marketplace, setMarketplace] = useState(null);
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [managingSection, setManagingSection] = useState(null);

  useEffect(() => {
    loadData();
  }, [marketplaceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all marketplaces
      const marketplacesRes = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/marketplaces`);
      if (marketplacesRes.ok) {
        const allMarketplaces = await marketplacesRes.json();
        setMarketplaces(allMarketplaces);

        // Load specific marketplace if not new
        if (marketplaceId !== 'new') {
          const currentMarketplace = allMarketplaces.find(m => m.id === parseInt(marketplaceId));
          if (currentMarketplace) {
            setMarketplace(currentMarketplace);
          } else {
            // If not found, redirect to new
            navigate('/admin/marketplaces-new/new');
          }
        } else {
          setMarketplace({ id: 'new' });
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async (formData) => {
    setSaving(true);
    try {
      const url = marketplaceId === 'new'
        ? `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces`
        : `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/marketplaces/${marketplaceId}`;

      const method = marketplaceId === 'new' ? 'POST' : 'PUT';

      // Ensure route has /marketplace/ prefix
      const routeWithPrefix = formData.route.startsWith('/marketplace/')
        ? formData.route
        : `/marketplace/${formData.route}`;

      // Add default values for fields server expects but we don't show in UI
      const payload = {
        ...formData,
        route: routeWithPrefix,
        color: '#10b981', // Default green
        border_color: '#059669', // Default green border
        enable_single_page: 1 // Always enabled for marketplaces
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedMarketplace = await response.json();
        
        // If new marketplace, redirect to edit page
        if (marketplaceId === 'new') {
          navigate(`/admin/marketplaces-new/${savedMarketplace.id}`);
          alert('Marketplace app created! Now add sections to build your page.');
        } else {
          alert('Marketplace app updated successfully!');
          await loadData();
        }
      } else {
        throw new Error('Failed to save marketplace');
      }
    } catch (err) {
      alert('Error saving marketplace: ' + err.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If managing section items, show ItemManager
  if (managingSection) {
    return (
      <ItemManager
        marketplace={marketplace}
        section={managingSection}
        onBack={() => setManagingSection(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/marketplace')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Marketplace Apps</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {marketplaceId === 'new' ? 'New Marketplace App' : marketplace?.name || 'Edit Marketplace App'}
                </h1>
                {marketplace && marketplaceId !== 'new' && (
                  <p className="text-sm text-gray-600">
                    Category: {marketplace.category} • ID: {marketplace.id}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <TabButton
              label="1. Basic Info"
              active={currentTab === 'basic'}
              onClick={() => setCurrentTab('basic')}
              status={marketplace && marketplace.name ? 'complete' : 'pending'}
            />
            <TabButton
              label="2. Page Sections"
              active={currentTab === 'sections'}
              onClick={() => setCurrentTab('sections')}
              disabled={marketplaceId === 'new'}
              status="pending"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'basic' && (
          <MarketplaceBasicInfo
            marketplace={marketplace}
            onSave={handleSaveBasicInfo}
            saving={saving}
          />
        )}

        {currentTab === 'sections' && (
          <SectionManager
            marketplaceId={marketplaceId}
            onManageItems={(section) => setManagingSection(section)}
          />
        )}
      </div>

    </div>
  );
};

// Tab Button Component
const TabButton = ({ label, active, onClick, disabled, status }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all flex items-center gap-2 ${
        active
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
      {status === 'complete' && !active && (
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
      )}
      {disabled && (
        <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
};

export default MarketplacesAdminNew;

