import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch solution section items from CMS
 * @param {number} solutionId - The solution ID
 * @param {number} sectionId - The section ID
 * @returns {Object} { items, loading, error, refetch }
 */
export const useSolutionItems = (solutionId, sectionId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!solutionId || !sectionId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}/api/solutions/${solutionId}/sections/${sectionId}/items`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Ensure result is always an array
      setItems(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solution items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [solutionId, sectionId]);

  return {
    items,
    loading,
    error,
    refetch: fetchData
  };
};


