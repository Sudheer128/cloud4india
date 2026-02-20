import { useState, useEffect } from 'react';
import { CMS_URL } from '../utils/config';

/**
 * Custom hook to fetch homepage section visibility settings from database
 * Replaces hardcoded visibility flags with database-driven configuration
 * 
 * Usage:
 *   const { settings, loading } = useVisibilitySettings();
 *   if (settings.marketplaces) { ... show marketplaces section ... }
 */
export const useVisibilitySettings = () => {
  const [settings, setSettings] = useState({
    hero: true,
    client_logos: true,
    comprehensive: true,
    why: true,
    feature_banners: true,
    products: true,
    marketplaces: true,
    solutions: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const response = await fetch(`${CMS_URL}/api/homepage-visibility?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch visibility settings');
        }

        const data = await response.json();
        
        // Convert array to object with section_name as key
        const settingsMap = {};
        data.forEach(section => {
          settingsMap[section.section_name] = section.is_visible === 1;
        });
        
        setSettings(settingsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching visibility settings:', err);
        setError(err.message);
        // Keep default settings on error
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    // Helper to check if a section is visible
    isVisible: (sectionName) => settings[sectionName] !== false,
  };
};

export default useVisibilitySettings;
