import { useState, useEffect } from 'react';
import { getMarketplaces, getMarketplace } from '../services/cmsApi';

/**
 * Custom hook to fetch marketplaces from CMS
 * @returns {Object} { marketplaces, loading, error, refetch }
 */
export const useMarketplaces = () => {
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMarketplaces();
      setMarketplaces(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplaces:', err);
      // Fallback to empty array on error
      setMarketplaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  return {
    marketplaces,
    loading,
    error,
    refetch: fetchMarketplaces
  };
};

/**
 * Custom hook to fetch single marketplace by ID
 * @param {number} id - Marketplace ID
 * @returns {Object} { marketplace, loading, error, refetch }
 */
export const useMarketplace = (id) => {
  const [marketplace, setMarketplace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplace = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getMarketplace(id);
      setMarketplace(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplace:', err);
      setMarketplace(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, [id]);

  return {
    marketplace,
    loading,
    error,
    refetch: fetchMarketplace
  };
};

// Default export
export default {
  useMarketplaces,
  useMarketplace
};
