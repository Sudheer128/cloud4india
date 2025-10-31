import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_CMS_URL || (import.meta.env.PROD ? 'http://38.242.248.213:4002' : 'http://localhost:4002');

/**
 * Custom hook to fetch pricing hero section
 */
export const usePricingHero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/hero`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setHero(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pricing hero:', err);
      setHero(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    hero,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch pricing categories
 */
export const usePricingCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setCategories(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pricing categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch subcategories by category ID
 */
export const usePricingSubcategories = (categoryId) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!categoryId) {
      setSubcategories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/categories/${categoryId}/subcategories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setSubcategories(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pricing subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return {
    subcategories,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch pricing plans by subcategory ID
 */
export const usePricingPlans = (subcategoryId) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!subcategoryId) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/subcategories/${subcategoryId}/plans`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setPlans(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pricing plans:', err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subcategoryId]);

  return {
    plans,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch storage options
 */
export const useStorageOptions = () => {
  const [storageOptions, setStorageOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/storage`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      // Parse features JSON for each storage option
      const parsedResult = result.map(option => ({
        ...option,
        features: option.features ? JSON.parse(option.features) : []
      }));
      setStorageOptions(parsedResult);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching storage options:', err);
      setStorageOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    storageOptions,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch compute plans
 */
export const useComputePlans = () => {
  const [computePlans, setComputePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/compute-plans`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setComputePlans(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching compute plans:', err);
      setComputePlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    computePlans,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch disk offerings
 */
export const useDiskOfferings = () => {
  const [diskOfferings, setDiskOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/disk-offerings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setDiskOfferings(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching disk offerings:', err);
      setDiskOfferings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    diskOfferings,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Custom hook to fetch pricing FAQs
 */
export const usePricingFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pricing/faqs`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setFaqs(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pricing FAQs:', err);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchData
  };
};
