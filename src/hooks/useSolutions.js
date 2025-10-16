import { useState, useEffect } from 'react';
import { getSolutions, getSolution } from '../services/cmsApi';

/**
 * Custom hook to fetch solutions from CMS
 * @returns {Object} { solutions, loading, error, refetch }
 */
export const useSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSolutions();
      setSolutions(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solutions:', err);
      // Fallback to empty array on error
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  return {
    solutions,
    loading,
    error,
    refetch: fetchSolutions
  };
};

/**
 * Custom hook to fetch single solution by ID
 * @param {number} id - Solution ID
 * @returns {Object} { solution, loading, error, refetch }
 */
export const useSolution = (id) => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolution = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getSolution(id);
      setSolution(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solution:', err);
      setSolution(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolution();
  }, [id]);

  return {
    solution,
    loading,
    error,
    refetch: fetchSolution
  };
};

// Default export
export default {
  useSolutions,
  useSolution
};
