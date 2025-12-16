import { useState, useEffect } from 'react';
import { 
  getMarketplaceSections, 
  getMarketplaceItems,
  getMarketplaceByName
} from '../services/cmsApi';

/**
 * Hook to fetch all marketplace data (sections + items) for a marketplace
 * Supports both numeric marketplaceId and route string (app name)
 * @param {number|string} marketplaceIdOrName - Marketplace ID (number) or app name (string)
 * @returns {Object} { sections, itemsBySection, marketplace, loading, error, refetch }
 */
export const useMarketplaceData = (marketplaceIdOrName) => {
  const [sections, setSections] = useState([]);
  const [itemsBySection, setItemsBySection] = useState({});
  const [marketplace, setMarketplace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplaceData = async () => {
    if (!marketplaceIdOrName) {
      setSections([]);
      setItemsBySection({});
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Determine if marketplaceIdOrName is a number (ID) or string (name)
      const isNumericId = !isNaN(parseInt(marketplaceIdOrName)) && marketplaceIdOrName.toString().match(/^\d+$/);
      let marketplaceId;
      let sectionsData;
      let marketplaceData;
      
      if (isNumericId) {
        // Use ID-based API
        marketplaceId = parseInt(marketplaceIdOrName);
        // For now, we'll need to get marketplace data separately if needed
        // For sections, we can use the ID directly
        sectionsData = await getMarketplaceSections(marketplaceId);
      } else {
        // Use name-based API - first get marketplace by name to get ID
        marketplaceData = await getMarketplaceByName(marketplaceIdOrName);
        marketplaceId = marketplaceData.id;
        sectionsData = await getMarketplaceSections(marketplaceId);
      }
      
      // Store marketplace data if we have it
      if (marketplaceData) {
        setMarketplace(marketplaceData);
      }
      
      // Filter out hidden sections
      const visibleSections = sectionsData.filter(section => section.is_visible !== 0);
      setSections(visibleSections);
      
      // Fetch items for each visible section
      const itemsPromises = visibleSections.map(section => 
        getMarketplaceItems(marketplaceId, section.id)
      );
      
      const itemsResults = await Promise.all(itemsPromises);
      
      // Create itemsBySection object
      const itemsMap = {};
      visibleSections.forEach((section, index) => {
        itemsMap[section.id] = itemsResults[index] || [];
      });
      
      setItemsBySection(itemsMap);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplace data:', err);
      setSections([]);
      setItemsBySection({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [marketplaceIdOrName]);

  return {
    sections,
    itemsBySection,
    marketplace,
    loading,
    error,
    refetch: fetchMarketplaceData
  };
};

