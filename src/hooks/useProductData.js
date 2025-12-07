import { useState, useEffect } from 'react';
import { 
  getProductSections, 
  getProductItems,
  getProductSectionsByRoute,
  getProductByRoute,
  getProduct
} from '../services/cmsApi';

/**
 * Hook to fetch all product data (sections + items) for a product
 * Supports both numeric productId and route string
 * @param {number|string} productIdOrRoute - Product ID (number) or route slug (string)
 * @returns {Object} { sections, itemsBySection, loading, error, refetch }
 */
export const useProductData = (productIdOrRoute) => {
  const [sections, setSections] = useState([]);
  const [itemsBySection, setItemsBySection] = useState({});
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductData = async () => {
    if (!productIdOrRoute) {
      setSections([]);
      setItemsBySection({});
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Determine if productIdOrRoute is a number (ID) or string (route)
      const isNumericId = !isNaN(parseInt(productIdOrRoute)) && productIdOrRoute.toString().match(/^\d+$/);
      let productId;
      let sectionsData;
      
      let productData;
      if (isNumericId) {
        // Use ID-based API
        productId = parseInt(productIdOrRoute);
        // Fetch product data by ID
        productData = await getProduct(productId);
        sectionsData = await getProductSections(productId);
      } else {
        // Use route-based API - first get product by route to get ID
        productData = await getProductByRoute(productIdOrRoute);
        productId = productData.id;
        sectionsData = await getProductSectionsByRoute(productIdOrRoute);
      }
      
      // Store product data
      setProduct(productData);
      
      // Filter out hidden sections
      const visibleSections = sectionsData.filter(section => section.is_visible !== 0);
      setSections(visibleSections);
      
      // Fetch items for each visible section
      const itemsPromises = visibleSections.map(section => 
        getProductItems(productId, section.id)
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
      console.error('Error fetching product data:', err);
      setSections([]);
      setItemsBySection({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productIdOrRoute]);

  return {
    sections,
    itemsBySection,
    product,
    loading,
    error,
    refetch: fetchProductData
  };
};

