import { useState, useEffect } from 'react';
import { 
  getSolutionSections, 
  getSolutionItems,
  getSolutionSectionsByRoute,
  getSolutionByRoute,
  getSolution
} from '../services/cmsApi';

/**
 * Hook to fetch all solution data (sections + items) for a solution
 * Supports both numeric solutionId and route string
 * @param {number|string} solutionIdOrRoute - Solution ID (number) or route slug (string)
 * @returns {Object} { sections, itemsBySection, loading, error, refetch }
 */
export const useSolutionData = (solutionIdOrRoute) => {
  const [sections, setSections] = useState([]);
  const [itemsBySection, setItemsBySection] = useState({});
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolutionData = async () => {
    if (!solutionIdOrRoute) {
      setSections([]);
      setItemsBySection({});
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Determine if solutionIdOrRoute is a number (ID) or string (route)
      const isNumericId = !isNaN(parseInt(solutionIdOrRoute)) && solutionIdOrRoute.toString().match(/^\d+$/);
      let solutionId;
      let sectionsData;
      
      let solutionData;
      if (isNumericId) {
        // Use ID-based API
        solutionId = parseInt(solutionIdOrRoute);
        // Fetch solution data by ID
        solutionData = await getSolution(solutionId);
        sectionsData = await getSolutionSections(solutionId);
      } else {
        // Use route-based API - first get solution by route to get ID
        solutionData = await getSolutionByRoute(solutionIdOrRoute);
        solutionId = solutionData.id;
        sectionsData = await getSolutionSectionsByRoute(solutionIdOrRoute);
      }
      
      // Store solution data
      setSolution(solutionData);
      
      // Filter out hidden sections
      const visibleSections = sectionsData.filter(section => section.is_visible !== 0);
      setSections(visibleSections);
      
      // Fetch items for each visible section
      const itemsPromises = visibleSections.map(section => 
        getSolutionItems(solutionId, section.id)
      );
      
      const itemsResults = await Promise.all(itemsPromises);
      
      // Create itemsBySection object
      const itemsMap = {};
      visibleSections.forEach((section, index) => {
        itemsMap[section.id] = itemsResults[index] || [];
      });
      
      setItemsBySection(itemsMap);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching solution data:', err);
      setSections([]);
      setItemsBySection({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutionData();
  }, [solutionIdOrRoute]);

  return {
    sections,
    itemsBySection,
    solution,
    loading,
    error,
    refetch: fetchSolutionData
  };
};

