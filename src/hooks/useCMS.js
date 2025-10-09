import { useState, useEffect } from 'react';
import { 
  getHomepageContent, 
  getHeroContent, 
  getWhyItems, 
  getProducts,
  checkCMSHealth 
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

/**
 * Custom hook to check CMS health
 * @returns {Object} { isHealthy, loading, error, checkHealth }
 */
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

// Default export with all hooks
export default {
  useHomepageContent,
  useHeroContent,
  useWhyItems,
  useProducts,
  useCMSHealth,
  useLoading,
  useError
};
