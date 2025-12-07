import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch product items from CMS
 * @param {number} productId - The product ID
 * @param {number} sectionId - The section ID
 * @returns {Object} { items, loading, error, refetch }
 */
export const useProductItems = (productId, sectionId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!productId || !sectionId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || (import.meta.env.PROD ? 'http://38.242.248.213:4002' : 'http://localhost:4002')}/api/products/${productId}/sections/${sectionId}/items`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setItems(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId, sectionId]);

  return {
    items,
    loading,
    error,
    refetch: fetchData
  };
};








