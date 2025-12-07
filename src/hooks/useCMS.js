import { useState, useEffect } from 'react';
import { 
  getHomepageContent, 
  getHeroContent, 
  getWhyItems, 
  getMarketplaces,
  getProducts,
  checkCMSHealth,
  getMainMarketplacesContent,
  getMainProductsContent,
  getMainSolutionsContent,
  getComprehensiveSectionContent,
  getFeatureBanners
} from '../services/cmsApi';

/**
 * Custom hook to fetch all homepage content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useHomepageContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getHomepageContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching homepage content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch hero section content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useHeroContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getHeroContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hero content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch why items content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useWhyItems = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWhyItems();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching why items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch marketplaces content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMarketplaces = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMarketplaces();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch products content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProducts();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export const useCMSHealth = () => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkCMSHealth();
      setIsHealthy(result.status === 'healthy');
    } catch (err) {
      setError(err.message);
      setIsHealthy(false);
      console.error('Error checking CMS health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    isHealthy,
    loading,
    error,
    checkHealth
  };
};

/**
 * Custom hook for loading states
 * @returns {Object} { isLoading, startLoading, stopLoading }
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading
  };
};

/**
 * Custom hook for error handling
 * @returns {Object} { error, setError, clearError }
 */
export const useError = () => {
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  return {
    error,
    setError,
    clearError
  };
};

/**
 * Custom hook to fetch main marketplaces page content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMainMarketplacesContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMainMarketplacesContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching main marketplaces content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch main products page content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMainProductsContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMainProductsContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching main products content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch main solutions page content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMainSolutionsContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMainSolutionsContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching main solutions content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch comprehensive section content
 * @returns {Object} { data, loading, error, refetch }
 */
export const useComprehensiveSectionContent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getComprehensiveSectionContent();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching comprehensive section content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch feature banners
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFeatureBanners = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFeatureBanners();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching feature banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Default export with all hooks
export default {
  useHomepageContent,
  useHeroContent,
  useWhyItems,
  useMarketplaces,
  useProducts,
  useCMSHealth,
  useLoading,
  useError,
  useMainMarketplacesContent,
  useMainProductsContent,
  useMainSolutionsContent,
  useComprehensiveSectionContent,
  useFeatureBanners
};
