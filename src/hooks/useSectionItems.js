import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch section items from CMS
 * @param {number} solutionId - The solution ID
 * @param {number} sectionId - The section ID
 * @returns {Object} { items, loading, error, refetch }
 */
export const useSectionItems = (solutionId, sectionId) => {
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
      const response = await fetch(`http://localhost:3000/api/solutions/${solutionId}/sections/${sectionId}/items`);
      
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
  }, [solutionId, sectionId]);

  return {
    items,
    loading,
    error,
    refetch: fetchData
  };
};
