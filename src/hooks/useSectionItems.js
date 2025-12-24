import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch section items from CMS
 * @param {number} marketplaceId - The marketplace ID
 * @param {number} sectionId - The section ID
 * @returns {Object} { items, loading, error, refetch }
 */
export const useSectionItems = (marketplaceId, sectionId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!marketplaceId || !sectionId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}/api/marketplaces/${marketplaceId}/sections/${sectionId}/items`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setItems(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching section items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [marketplaceId, sectionId]);

  return {
    items,
    loading,
    error,
    refetch: fetchData
  };
};
