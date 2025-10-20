import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch solution sections from CMS
 * @param {number} solutionId - The solution ID
 * @returns {Object} { sections, loading, error, refetch }
 */
export const useSolutionSections = (solutionId) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!solutionId) {
      setSections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/api/solutions/${solutionId}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      // Filter out hidden sections (is_visible = 0 or false)
      const visibleSections = result.filter(section => section.is_visible !== 0);
      setSections(visibleSections);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solution sections:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [solutionId]);

  return {
    sections,
    loading,
    error,
    refetch: fetchData
  };
};
