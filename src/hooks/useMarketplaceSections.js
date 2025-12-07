import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch marketplace sections from CMS
 * @param {number} marketplaceId - The marketplace ID
 * @returns {Object} { sections, loading, error, refetch }
 */
export const useMarketplaceSections = (marketplaceId) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!marketplaceId) {
      setSections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || (import.meta.env.PROD ? 'http://38.242.248.213:4002' : 'http://localhost:4002')}/api/marketplaces/${marketplaceId}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      // Filter out hidden sections (is_visible = 0 or false)
      const visibleSections = result.filter(section => section.is_visible !== 0);
      setSections(visibleSections);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplace sections:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [marketplaceId]);

  return {
    sections,
    loading,
    error,
    refetch: fetchData
  };
};
