import { useState, useEffect } from 'react';
import { CMS_URL } from '../utils/config';

/**
 * Custom hook to fetch global feature visibility settings
 * Controls visibility of main features (Products, Marketplace, Solutions, etc.)
 * across the entire website: Navbar, Homepage sections, Footer, etc.
 * 
 * Usage:
 *   const { features, loading } = useGlobalFeatureVisibility();
 *   if (features.products) { ... show products feature everywhere ... }
 */
export const useGlobalFeatureVisibility = () => {
  const [features, setFeatures] = useState({
    home: false,
    about_us: false,
    marketplace: true,
    products: false,
    solutions: true,
    pricing: false,
    price_estimator: true,
    contact_us: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const response = await fetch(`${CMS_URL}/api/global-features?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch feature visibility settings');
        }

        const data = await response.json();
        
        // Convert array to object with feature_name as key
        const featuresMap = {};
        data.forEach(feature => {
          featuresMap[feature.feature_name] = feature.is_visible === 1;
        });
        
        setFeatures(featuresMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching feature visibility:', err);
        setError(err.message);
        // Keep default settings on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return {
    features,
    loading,
    error,
    // Helper to check if a feature is visible
    isVisible: (featureName) => features[featureName] !== false,
  };
};

export default useGlobalFeatureVisibility;
