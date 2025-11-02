import { useState, useEffect } from 'react';
import { 
  getProductSections, 
  getProductItems,
  getAdminProductSections,
  getAdminProductItems,
  getProductSectionsByRoute,
  getProductItemsByRoute
} from '../services/cmsApi';

/**
 * Hook to fetch product sections for a specific product
 * @param {number} productId - Product ID
 * @param {boolean} admin - Whether to fetch admin data (including hidden)
 * @returns {Object} { sections, loading, error, refetch }
 */
export const useProductSections = (productId, admin = false) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = admin 
        ? await getAdminProductSections(productId)
        : await getProductSections(productId);
      setSections(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [productId, admin]);

  return {
    sections,
    loading,
    error,
    refetch: fetchSections
  };
};

/**
 * Hook to fetch product items for a specific section
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {boolean} admin - Whether to fetch admin data (including hidden)
 * @returns {Object} { items, loading, error, refetch }
 */
export const useProductItems = (productId, sectionId, admin = false) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    if (!productId || !sectionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = admin 
        ? await getAdminProductItems(productId, sectionId)
        : await getProductItems(productId, sectionId);
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [productId, sectionId, admin]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems
  };
};

/**
 * Hook to fetch all product data (sections + items) for a product
 * Supports both numeric productId and route string
 * @param {number|string} productIdOrRoute - Product ID (number) or route slug (string)
 * @param {boolean} admin - Whether to fetch admin data (including hidden)
 * @returns {Object} { sections, itemsBySection, loading, error, refetch }
 */
export const useProductData = (productIdOrRoute, admin = false) => {
  const [sections, setSections] = useState([]);
  const [itemsBySection, setItemsBySection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductData = async () => {
    if (!productIdOrRoute) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Determine if productIdOrRoute is a number (ID) or string (route)
      const isRoute = typeof productIdOrRoute === 'string' && isNaN(parseInt(productIdOrRoute));
      
      let sectionsData;
      
      if (isRoute) {
        // Use route-based API
        if (admin) {
          // Admin mode doesn't support route-based queries yet, fallback to error
          throw new Error('Admin mode not supported for route-based queries');
        }
        sectionsData = await getProductSectionsByRoute(productIdOrRoute);
      } else {
        // Use ID-based API
        const productId = typeof productIdOrRoute === 'number' 
          ? productIdOrRoute 
          : parseInt(productIdOrRoute);
        sectionsData = admin 
          ? await getAdminProductSections(productId)
          : await getProductSections(productId);
      }
      
      setSections(sectionsData);
      
      // Fetch items for each section
      const itemsPromises = sectionsData.map(section => {
        if (isRoute) {
          // Use route-based API for items
          return getProductItemsByRoute(productIdOrRoute, section.id);
        } else {
          // Use ID-based API for items
          const productId = typeof productIdOrRoute === 'number' 
            ? productIdOrRoute 
            : parseInt(productIdOrRoute);
          return admin 
            ? getAdminProductItems(productId, section.id)
            : getProductItems(productId, section.id);
        }
      });
      
      const itemsResults = await Promise.all(itemsPromises);
      
      // Create itemsBySection object
      const itemsMap = {};
      sectionsData.forEach((section, index) => {
        itemsMap[section.id] = itemsResults[index] || [];
      });
      
      setItemsBySection(itemsMap);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productIdOrRoute, admin]);

  return {
    sections,
    itemsBySection,
    loading,
    error,
    refetch: fetchProductData
  };
};


