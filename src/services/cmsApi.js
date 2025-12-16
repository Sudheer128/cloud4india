import axios from 'axios';
import { CMS_URL } from '../utils/config.js';
import { toSlug } from '../utils/slugUtils.js';

// CMS API Configuration
const CMS_BASE_URL = `${CMS_URL}/api`;

// Create axios instance with default config
const cmsApi = axios.create({
  baseURL: CMS_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

// Add request interceptor to prevent caching for GET requests
cmsApi.interceptors.request.use((config) => {
  // For GET requests, always add cache-busting parameters
  if (config.method === 'get' || config.method === 'GET') {
    const separator = config.url.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    config.url = `${config.url}${separator}_t=${timestamp}&_r=${random}`;
    
    // Ensure no-cache headers
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }
  return config;
});

// API Service Functions

/**
 * Get all homepage content
 * @returns {Promise<Object>} Complete homepage data
 */
export const getHomepageContent = async () => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/homepage?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    throw error;
  }
};

/**
 * Get hero section content
 * @returns {Promise<Object>} Hero section data
 */
export const getHeroContent = async () => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/homepage?t=${timestamp}`);
    return response.data.hero;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    throw error;
  }
};

/**
 * Get why items content
 * @returns {Promise<Array>} Array of why items
 */
export const getWhyItems = async () => {
  try {
    const response = await cmsApi.get('/homepage');
    return response.data.whyItems;
  } catch (error) {
    console.error('Error fetching why items:', error);
    throw error;
  }
};

/**
 * Update hero section content
 * @param {Object} heroData - Hero section data to update
 * @returns {Promise<Object>} Updated hero data
 */
export const updateHeroContent = async (heroData) => {
  try {
    const response = await cmsApi.put('/hero', heroData);
    return response.data;
  } catch (error) {
    console.error('Error updating hero content:', error);
    throw error;
  }
};

/**
 * Create new why item
 * @param {Object} itemData - Why item data to create
 * @returns {Promise<Object>} Created why item data
 */
export const createWhyItem = async (itemData) => {
  try {
    const response = await cmsApi.post('/why-items', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating why item:', error);
    throw error;
  }
};

/**
 * Update why item content
 * @param {number} id - Why item ID
 * @param {Object} itemData - Why item data to update
 * @returns {Promise<Object>} Updated why item data
 */
export const updateWhyItem = async (id, itemData) => {
  try {
    const response = await cmsApi.put(`/why-items/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating why item:', error);
    throw error;
  }
};

/**
 * Delete why item
 * @param {number} id - Why item ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteWhyItem = async (id) => {
  try {
    const response = await cmsApi.delete(`/why-items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting why item:', error);
    throw error;
  }
};

/**
 * Check CMS health
 * @returns {Promise<Object>} Health status
 */
export const checkCMSHealth = async () => {
  try {
    const response = await cmsApi.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking CMS health:', error);
    throw error;
  }
};

/**
 * Get all marketplaces (including hidden) - for admin panel
 * @returns {Promise<Array>} Array of all marketplaces
 */
export const getAdminMarketplaces = async () => {
  try {
    const response = await cmsApi.get('/admin/marketplaces');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin marketplaces:', error);
    throw error;
  }
};

/**
 * Get all marketplaces
 * @returns {Promise<Array>} Array of marketplaces
 */
export const getMarketplaces = async () => {
  try {
    const response = await cmsApi.get('/marketplaces');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplaces:', error);
    throw error;
  }
};

/**
 * Get marketplace categories in order
 * @returns {Promise<Array>} Array of categories with order_index
 */
export const getMarketplaceCategories = async () => {
  try {
    const response = await cmsApi.get('/marketplaces/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace categories:', error);
    throw error;
  }
};

/**
 * Get single marketplace by ID
 * @param {number} id - Marketplace ID
 * @returns {Promise<Object>} Marketplace data
 */
export const getMarketplace = async (id) => {
  try {
    const response = await cmsApi.get(`/marketplaces/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    throw error;
  }
};

/**
 * Get single marketplace by name/slug
 * @param {string} name - Marketplace name or slug
 * @returns {Promise<Object>} Marketplace data
 */
export const getMarketplaceByName = async (name) => {
  try {
    // First, get all marketplaces and find by name match
    const marketplaces = await getMarketplaces();
    const inputSlug = name.toLowerCase().trim();
    
    // Try multiple matching strategies
    const marketplace = marketplaces.find(s => {
      const marketplaceName = (s.name || '').trim();
      if (!marketplaceName) return false;
      
      // Strategy 1: Exact slug match (convert marketplace name to slug and compare)
      const marketplaceSlug = toSlug(marketplaceName);
      if (marketplaceSlug === inputSlug) {
        return true;
      }
      
      // Strategy 2: Direct name match (case-insensitive, normalize special chars)
      // Remove special characters and compare
      const normalizedName = marketplaceName.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special chars
        .replace(/\s+/g, '-'); // Replace spaces with hyphens
      const normalizedInput = inputSlug; // Input is already a slug
      if (normalizedName === normalizedInput) {
        return true;
      }
      
      // Strategy 3: Match without special characters (e.g., "nodejs" matches "Node.js")
      const nameNoSpecial = marketplaceName.toLowerCase().replace(/[^\w]/g, '');
      const inputNoSpecial = inputSlug.replace(/[^\w]/g, '');
      if (nameNoSpecial === inputNoSpecial) {
        return true;
      }
      
      // Strategy 4: Check if route contains the slug
      if (s.route) {
        const routePart = s.route.split('/').pop(); // Get last part of route
        const routeSlug = toSlug(routePart);
        if (routeSlug === inputSlug) {
          return true;
        }
      }
      
      // Strategy 5: Partial word match (for single-word inputs like "nodejs" matching "Node.js")
      // Check if input (without special chars) is contained in name (without special chars) or vice versa
      if (inputNoSpecial.length > 0 && nameNoSpecial.includes(inputNoSpecial)) {
        return true;
      }
      if (nameNoSpecial.length > 0 && inputNoSpecial.includes(nameNoSpecial)) {
        return true;
      }
      
      return false;
    });
    
    if (!marketplace) {
      // Log available marketplaces for debugging
      console.warn('Marketplace not found. Available marketplaces:', marketplaces.map(s => ({ 
        id: s.id,
        name: s.name, 
        slug: toSlug(s.name),
        route: s.route
      })));
      console.warn('Looking for slug:', inputSlug);
      throw new Error(`Marketplace not found: ${name}`);
    }
    
    console.log('Found marketplace:', { name: marketplace.name, id: marketplace.id, slug: toSlug(marketplace.name) });
    
    return marketplace;
  } catch (error) {
    console.error('Error fetching marketplace by name:', error);
    throw error;
  }
};

/**
 * Create new marketplace
 * @param {Object} marketplaceData - Marketplace data to create
 * @returns {Promise<Object>} Created marketplace data
 */
export const createMarketplace = async (marketplaceData) => {
  try {
    const response = await cmsApi.post('/marketplaces', marketplaceData);
    return response.data;
  } catch (error) {
    console.error('Error creating marketplace:', error);
    throw error;
  }
};

/**
 * Update marketplace
 * @param {number} id - Marketplace ID
 * @param {Object} marketplaceData - Marketplace data to update
 * @returns {Promise<Object>} Updated marketplace data
 */
export const updateMarketplace = async (id, marketplaceData) => {
  try {
    const response = await cmsApi.put(`/marketplaces/${id}`, marketplaceData);
    return response.data;
  } catch (error) {
    console.error('Error updating marketplace:', error);
    throw error;
  }
};

/**
 * Delete marketplace
 * @param {number} id - Marketplace ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteMarketplace = async (id) => {
  try {
    const response = await cmsApi.delete(`/marketplaces/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting marketplace:', error);
    throw error;
  }
};

/**
 * Duplicate marketplace
 * @param {number} id - Marketplace ID
 * @param {Object} duplicateData - New name and route for duplicate
 * @returns {Promise<Object>} Duplication result
 */
export const duplicateMarketplace = async (id, duplicateData) => {
  try {
    const response = await cmsApi.post(`/marketplaces/${id}/duplicate`, duplicateData);
    return response.data;
  } catch (error) {
    console.error('Error duplicating marketplace:', error);
    throw error;
  }
};

/**
 * Toggle marketplace visibility
 * @param {number} id - Marketplace ID
 * @returns {Promise<Object>} Toggle result
 */
export const toggleMarketplaceVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/marketplaces/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling marketplace visibility:', error);
    throw error;
  }
};

/**
 * Get marketplace sections
 * @param {number} id - Marketplace ID
 * @returns {Promise<Array>} Array of marketplace sections
 */
export const getMarketplaceSections = async (id) => {
  try {
    const response = await cmsApi.get(`/marketplaces/${id}/sections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace sections:', error);
    throw error;
  }
};

/**
 * Get items for a marketplace section
 * @param {number} marketplaceId - Marketplace ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of section items
 */
export const getMarketplaceItems = async (marketplaceId, sectionId) => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/marketplaces/${marketplaceId}/sections/${sectionId}/items?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    throw error;
  }
};

/**
 * Create marketplace section
 * @param {number} id - Marketplace ID
 * @param {Object} sectionData - Section data to create
 * @returns {Promise<Object>} Created section data
 */
export const createMarketplaceSection = async (id, sectionData) => {
  try {
    const response = await cmsApi.post(`/marketplaces/${id}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating marketplace section:', error);
    throw error;
  }
};

/**
 * Update marketplace section
 * @param {number} id - Marketplace ID
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data to update
 * @returns {Promise<Object>} Updated section data
 */
export const updateMarketplaceSection = async (id, sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/marketplaces/${id}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating marketplace section:', error);
    throw error;
  }
};

/**
 * Delete marketplace section
 * @param {number} id - Marketplace ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteMarketplaceSection = async (id, sectionId) => {
  try {
    const response = await cmsApi.delete(`/marketplaces/${id}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting marketplace section:', error);
    throw error;
  }
};

// ===== ABOUT US PAGE API FUNCTIONS =====

/**
 * Get all About Us page content
 * @returns {Promise<Object>} Complete About Us page data
 */
export const getAboutUsContent = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/about?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    throw error;
  }
};

/**
 * Update About Us hero section
 * @param {Object} data - Hero section data
 * @returns {Promise<Object>} Updated hero section
 */
export const updateAboutHero = async (data) => {
  try {
    const response = await cmsApi.put('/about/hero', data);
    return response.data;
  } catch (error) {
    console.error('Error updating About hero:', error);
    throw error;
  }
};

/**
 * Update About Us story section
 * @param {Object} data - Story section data
 * @returns {Promise<Object>} Updated story section
 */
export const updateAboutStory = async (data) => {
  try {
    const response = await cmsApi.put('/about/story', data);
    return response.data;
  } catch (error) {
    console.error('Error updating About story:', error);
    throw error;
  }
};

/**
 * Update About Us legacy section header
 * @param {Object} data - Legacy section header data
 * @returns {Promise<Object>} Updated legacy section
 */
export const updateAboutLegacy = async (data) => {
  try {
    const response = await cmsApi.put('/about/legacy', data);
    return response.data;
  } catch (error) {
    console.error('Error updating About legacy:', error);
    throw error;
  }
};

// Stats CRUD
export const getAboutStats = async (includeHidden = false) => {
  try {
    const url = includeHidden ? '/about/stats?all=true' : '/about/stats';
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const createAboutStat = async (data) => {
  try {
    const response = await cmsApi.post('/about/stats', data);
    return response.data;
  } catch (error) {
    console.error('Error creating stat:', error);
    throw error;
  }
};

export const updateAboutStat = async (id, data) => {
  try {
    const response = await cmsApi.put(`/about/stats/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating stat:', error);
    throw error;
  }
};

export const deleteAboutStat = async (id) => {
  try {
    const response = await cmsApi.delete(`/about/stats/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting stat:', error);
    throw error;
  }
};

// Testimonials Section Header
export const updateAboutTestimonialsSection = async (data) => {
  try {
    const response = await cmsApi.put('/about/testimonials-section', data);
    return response.data;
  } catch (error) {
    console.error('Error updating testimonials section:', error);
    throw error;
  }
};

// Testimonials CRUD
export const getAboutTestimonials = async (includeHidden = false) => {
  try {
    const url = includeHidden ? '/about/testimonials?all=true' : '/about/testimonials';
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const createAboutTestimonial = async (data) => {
  try {
    const response = await cmsApi.post('/about/testimonials', data);
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateAboutTestimonial = async (id, data) => {
  try {
    const response = await cmsApi.put(`/about/testimonials/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteAboutTestimonial = async (id) => {
  try {
    const response = await cmsApi.delete(`/about/testimonials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// Ratings CRUD
export const getAboutRatings = async (includeHidden = false) => {
  try {
    const url = includeHidden ? '/about/ratings?all=true' : '/about/ratings';
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

export const createAboutRating = async (data) => {
  try {
    const response = await cmsApi.post('/about/ratings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating rating:', error);
    throw error;
  }
};

export const updateAboutRating = async (id, data) => {
  try {
    const response = await cmsApi.put(`/about/ratings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

export const deleteAboutRating = async (id) => {
  try {
    const response = await cmsApi.delete(`/about/ratings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};

// Approach Section Header
export const updateAboutApproachSection = async (data) => {
  try {
    const response = await cmsApi.put('/about/approach-section', data);
    return response.data;
  } catch (error) {
    console.error('Error updating approach section:', error);
    throw error;
  }
};

// Approach Items CRUD
export const getAboutApproachItems = async (includeHidden = false) => {
  try {
    const url = includeHidden ? '/about/approach-items?all=true' : '/about/approach-items';
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching approach items:', error);
    throw error;
  }
};

export const createAboutApproachItem = async (data) => {
  try {
    const response = await cmsApi.post('/about/approach-items', data);
    return response.data;
  } catch (error) {
    console.error('Error creating approach item:', error);
    throw error;
  }
};

export const updateAboutApproachItem = async (id, data) => {
  try {
    const response = await cmsApi.put(`/about/approach-items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating approach item:', error);
    throw error;
  }
};

export const deleteAboutApproachItem = async (id) => {
  try {
    const response = await cmsApi.delete(`/about/approach-items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting approach item:', error);
    throw error;
  }
};

// Toggle visibility
export const toggleAboutStatVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/about/stats/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling stat visibility:', error);
    throw error;
  }
};

export const toggleAboutTestimonialVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/about/testimonials/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling testimonial visibility:', error);
    throw error;
  }
};

export const toggleAboutRatingVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/about/ratings/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling rating visibility:', error);
    throw error;
  }
};

export const toggleAboutApproachItemVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/about/approach-items/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling approach item visibility:', error);
    throw error;
  }
};

// Toggle visibility for main sections
export const toggleAboutHeroVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/hero/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling hero visibility:', error);
    throw error;
  }
};

export const toggleAboutStoryVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/story/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling story visibility:', error);
    throw error;
  }
};

export const toggleAboutLegacyVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/legacy/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling legacy visibility:', error);
    throw error;
  }
};

export const toggleAboutTestimonialsSectionVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/testimonials-section/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling testimonials section visibility:', error);
    throw error;
  }
};

export const toggleAboutApproachSectionVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/approach-section/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling approach section visibility:', error);
    throw error;
  }
};

// Mission & Vision Section
export const updateAboutMissionVision = async (data) => {
  try {
    const response = await cmsApi.put('/about/mission-vision', data);
    return response.data;
  } catch (error) {
    console.error('Error updating mission & vision:', error);
    throw error;
  }
};

export const toggleAboutMissionVisionVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/mission-vision/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling mission & vision visibility:', error);
    throw error;
  }
};

// Core Values Section Header
export const updateAboutCoreValuesSection = async (data) => {
  try {
    const response = await cmsApi.put('/about/core-values-section', data);
    return response.data;
  } catch (error) {
    console.error('Error updating core values section:', error);
    throw error;
  }
};

export const toggleAboutCoreValuesSectionVisibility = async () => {
  try {
    const response = await cmsApi.put('/about/core-values-section/toggle-visibility');
    return response.data;
  } catch (error) {
    console.error('Error toggling core values section visibility:', error);
    throw error;
  }
};

// Core Values CRUD
export const getAboutCoreValues = async (includeHidden = false) => {
  try {
    const url = includeHidden ? '/about/core-values?all=true' : '/about/core-values';
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching core values:', error);
    throw error;
  }
};

export const createAboutCoreValue = async (data) => {
  try {
    const response = await cmsApi.post('/about/core-values', data);
    return response.data;
  } catch (error) {
    console.error('Error creating core value:', error);
    throw error;
  }
};

export const updateAboutCoreValue = async (id, data) => {
  try {
    const response = await cmsApi.put(`/about/core-values/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating core value:', error);
    throw error;
  }
};

export const deleteAboutCoreValue = async (id) => {
  try {
    const response = await cmsApi.delete(`/about/core-values/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting core value:', error);
    throw error;
  }
};

export const toggleAboutCoreValueVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/about/core-values/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling core value visibility:', error);
    throw error;
  }
};

// Export the axios instance for custom requests
export { cmsApi };

// ===== MAIN PAGES API FUNCTIONS =====

/**
 * Get main marketplaces page content
 * @param {boolean} includeHidden - Include hidden sections (for admin)
 * @returns {Promise<Object>} Main marketplaces page data with hero and sections
 */
export const getMainMarketplacesContent = async (includeHidden = false) => {
  try {
    const timestamp = new Date().getTime();
    const url = includeHidden 
      ? `/main-marketplaces?t=${timestamp}&all=true`
      : `/main-marketplaces?t=${timestamp}`;
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching main marketplaces content:', error);
    throw error;
  }
};

/**
 * Update main marketplaces page hero content
 * @param {Object} heroData - Hero section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainMarketplacesHero = async (heroData) => {
  try {
    const response = await cmsApi.put('/main-marketplaces/hero', heroData);
    return response.data;
  } catch (error) {
    console.error('Error updating main marketplaces hero:', error);
    throw error;
  }
};

/**
 * Get all main marketplaces sections (including hidden ones for admin)
 * @returns {Promise<Array>} All sections
 */
export const getAllMainMarketplacesSections = async () => {
  try {
    const response = await cmsApi.get('/main-marketplaces/sections/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all main marketplaces sections:', error);
    throw error;
  }
};

/**
 * Duplicate main marketplaces section
 * @param {number} sectionId - Section ID to duplicate
 * @returns {Promise<Object>} Duplicate response
 */
export const duplicateMainMarketplacesSection = async (sectionId) => {
  try {
    const response = await cmsApi.post(`/main-marketplaces/sections/${sectionId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating main marketplaces section:', error);
    throw error;
  }
};

/**
 * Delete main marketplaces section
 * @param {number} sectionId - Section ID to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteMainMarketplacesSection = async (sectionId) => {
  try {
    const response = await cmsApi.delete(`/main-marketplaces/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting main marketplaces section:', error);
    throw error;
  }
};

/**
 * Toggle main marketplaces section visibility
 * @param {number} sectionId - Section ID to toggle
 * @returns {Promise<Object>} Toggle response
 */
export const toggleMainMarketplacesSectionVisibility = async (sectionId) => {
  try {
    const response = await cmsApi.patch(`/main-marketplaces/sections/${sectionId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling main marketplaces section visibility:', error);
    throw error;
  }
};

/**
 * Create new main marketplaces section
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Create response
 */
export const createMainMarketplacesSection = async (sectionData) => {
  try {
    const response = await cmsApi.post('/main-marketplaces/sections', sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating main marketplaces section:', error);
    throw error;
  }
};

/**
 * Update main marketplaces section
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainMarketplacesSection = async (sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/main-marketplaces/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating main marketplaces section:', error);
    throw error;
  }
};

// ========== SOLUTIONS API FUNCTIONS ==========

/**
 * Get all solutions (visible only)
 * @returns {Promise<Array>} Array of solutions
 */
export const getSolutions = async () => {
  try {
    const response = await cmsApi.get('/solutions');
    return response.data;
  } catch (error) {
    console.error('Error fetching solutions:', error);
    throw error;
  }
};

/**
 * Get all solutions (admin - includes hidden)
 * @returns {Promise<Array>} Array of all solutions
 */
export const getAdminSolutions = async () => {
  try {
    const response = await cmsApi.get('/admin/solutions');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin solutions:', error);
    throw error;
  }
};

/**
 * Toggle solution visibility
 * @param {number} id - Solution ID
 * @returns {Promise<Object>} Toggle response
 */
export const toggleSolutionVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/solutions/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling solution visibility:', error);
    throw error;
  }
};

/**
 * Duplicate solution
 * @param {number} id - Solution ID to duplicate
 * @param {Object} duplicateData - Optional data for duplicate
 * @returns {Promise<Object>} Duplicate response
 */
export const duplicateSolution = async (id, duplicateData = {}) => {
  try {
    const response = await cmsApi.post(`/solutions/${id}/duplicate`, duplicateData);
    return response.data;
  } catch (error) {
    console.error('Error duplicating solution:', error);
    throw error;
  }
};

/**
 * Delete solution
 * @param {number} id - Solution ID to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteSolution = async (id) => {
  try {
    const response = await cmsApi.delete(`/solutions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting solution:', error);
    throw error;
  }
};

/**
 * Update solution
 * @param {number} id - Solution ID
 * @param {Object} solutionData - Solution data
 * @returns {Promise<Object>} Update response
 */
export const updateSolution = async (id, solutionData) => {
  try {
    const response = await cmsApi.put(`/solutions/${id}`, solutionData);
    return response.data;
  } catch (error) {
    console.error('Error updating solution:', error);
    throw error;
  }
};

/**
 * Get solution categories in order
 * @returns {Promise<Array>} Array of categories with order_index
 */
export const getSolutionCategories = async () => {
  try {
    const response = await cmsApi.get('/solutions/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching solution categories:', error);
    throw error;
  }
};

/**
 * Get main solutions page content
 * @param {boolean} includeHidden - Include hidden sections (for admin)
 * @returns {Promise<Object>} Main solutions page data with hero and sections
 */
export const getMainSolutionsContent = async (includeHidden = false) => {
  try {
    const timestamp = new Date().getTime();
    const url = includeHidden 
      ? `/main-solutions?t=${timestamp}&all=true`
      : `/main-solutions?t=${timestamp}`;
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching main solutions content:', error);
    throw error;
  }
};

/**
 * Update main solutions page hero content
 * @param {Object} heroData - Hero section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainSolutionsHero = async (heroData) => {
  try {
    const response = await cmsApi.put('/main-solutions/hero', heroData);
    return response.data;
  } catch (error) {
    console.error('Error updating main solutions hero:', error);
    throw error;
  }
};

/**
 * Update main solutions section
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainSolutionsSection = async (sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/main-solutions/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating main solutions section:', error);
    throw error;
  }
};

/**
 * Duplicate main solutions section
 * @param {number} sectionId - Section ID to duplicate
 * @returns {Promise<Object>} Duplicate response
 */
export const duplicateMainSolutionsSection = async (sectionId) => {
  try {
    const response = await cmsApi.post(`/main-solutions/sections/${sectionId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating main solutions section:', error);
    throw error;
  }
};

/**
 * Delete main solutions section
 * @param {number} sectionId - Section ID to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteMainSolutionsSection = async (sectionId) => {
  try {
    const response = await cmsApi.delete(`/main-solutions/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting main solutions section:', error);
    throw error;
  }
};

/**
 * Toggle main solutions section visibility
 * @param {number} sectionId - Section ID to toggle
 * @returns {Promise<Object>} Toggle response
 */
export const toggleMainSolutionsSectionVisibility = async (sectionId) => {
  try {
    const response = await cmsApi.patch(`/main-solutions/sections/${sectionId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling main solutions section visibility:', error);
    throw error;
  }
};

/**
 * Create new main solutions section
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Create response
 */
export const createMainSolutionsSection = async (sectionData) => {
  try {
    const response = await cmsApi.post('/main-solutions/sections', sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating main solutions section:', error);
    throw error;
  }
};

/**
 * Get single solution by ID
 * @param {number} id - Solution ID
 * @returns {Promise<Object>} Solution data
 */
export const getSolution = async (id) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/solutions/${id}?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution:', error);
    throw error;
  }
};

/**
 * Get single solution by route slug
 * @param {string} route - Solution route
 * @returns {Promise<Object>} Solution data
 */
export const getSolutionByRoute = async (route) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/solutions/by-route/${route}?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution by route:', error);
    throw error;
  }
};

/**
 * Get solution by name/slug
 * @param {string} name - Solution name or slug
 * @returns {Promise<Object>} Solution data
 */
export const getSolutionByName = async (name) => {
  try {
    // First, get all solutions and find by name match
    const solutions = await getSolutions();
    const inputSlug = name.toLowerCase().trim();
    
    // Try multiple matching strategies
    const solution = solutions.find(s => {
      const solutionName = (s.name || '').trim();
      if (!solutionName) return false;
      
      // Strategy 1: Exact slug match
      const solutionSlug = toSlug(solutionName);
      if (solutionSlug === inputSlug) {
        return true;
      }
      
      // Strategy 2: Direct name match
      const normalizedName = solutionName.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      const normalizedInput = inputSlug;
      if (normalizedName === normalizedInput) {
        return true;
      }
      
      // Strategy 3: Match without special characters
      const nameNoSpecial = solutionName.toLowerCase().replace(/[^\w]/g, '');
      const inputNoSpecial = inputSlug.replace(/[^\w]/g, '');
      if (nameNoSpecial === inputNoSpecial) {
        return true;
      }
      
      // Strategy 4: Check if route contains the slug
      if (s.route) {
        const routePart = s.route.split('/').pop();
        const routeSlug = toSlug(routePart);
        if (routeSlug === inputSlug) {
          return true;
        }
      }
      
      // Strategy 5: Partial word match
      if (inputNoSpecial.length > 0 && nameNoSpecial.includes(inputNoSpecial)) {
        return true;
      }
      
      return false;
    });
    
    if (!solution) {
      throw new Error(`Solution not found: ${name}`);
    }
    
    return solution;
  } catch (error) {
    console.error('Error fetching solution by name:', error);
    throw error;
  }
};

/**
 * Get solution sections
 * @param {number} solutionId - Solution ID
 * @returns {Promise<Array>} Array of sections
 */
export const getSolutionSections = async (solutionId) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/solutions/${solutionId}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution sections:', error);
    throw error;
  }
};

/**
 * Get solution sections by route
 * @param {string} route - Solution route
 * @returns {Promise<Array>} Array of sections
 */
export const getSolutionSectionsByRoute = async (route) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/solutions/by-route/${route}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution sections by route:', error);
    throw error;
  }
};

/**
 * Get solution section items
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of items
 */
export const getSolutionItems = async (solutionId, sectionId) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/solutions/${solutionId}/sections/${sectionId}/items?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution items:', error);
    throw error;
  }
};

/**
 * Create solution section
 * @param {number} solutionId - Solution ID
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Create response
 */
export const createSolutionSection = async (solutionId, sectionData) => {
  try {
    const response = await cmsApi.post(`/solutions/${solutionId}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating solution section:', error);
    throw error;
  }
};

/**
 * Update solution section
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Update response
 */
export const updateSolutionSection = async (solutionId, sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/solutions/${solutionId}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating solution section:', error);
    throw error;
  }
};

/**
 * Delete solution section
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSolutionSection = async (solutionId, sectionId) => {
  try {
    const response = await cmsApi.delete(`/solutions/${solutionId}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting solution section:', error);
    throw error;
  }
};

/**
 * Create solution section item
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Create response
 */
export const createSolutionItem = async (solutionId, sectionId, itemData) => {
  try {
    const response = await cmsApi.post(`/solutions/${solutionId}/sections/${sectionId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating solution item:', error);
    throw error;
  }
};

/**
 * Update solution section item
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @param {number} itemId - Item ID
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Update response
 */
export const updateSolutionItem = async (solutionId, sectionId, itemId, itemData) => {
  try {
    const response = await cmsApi.put(`/solutions/${solutionId}/sections/${sectionId}/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating solution item:', error);
    throw error;
  }
};

/**
 * Delete solution section item
 * @param {number} solutionId - Solution ID
 * @param {number} sectionId - Section ID
 * @param {number} itemId - Item ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSolutionItem = async (solutionId, sectionId, itemId) => {
  try {
    const response = await cmsApi.delete(`/solutions/${solutionId}/sections/${sectionId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting solution item:', error);
    throw error;
  }
};

// ============================================================
// PRODUCTS API FUNCTIONS (Mirroring Marketplaces Structure)
// ============================================================

/**
 * Get all products (including hidden) - for admin panel
 * @returns {Promise<Array>} Array of all products
 */
export const getAdminProducts = async () => {
  try {
    const response = await cmsApi.get('/admin/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin products:', error);
    throw error;
  }
};

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    const response = await cmsApi.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get product categories in order
 * @returns {Promise<Array>} Array of categories with order_index
 */
export const getProductCategories = async () => {
  try {
    const response = await cmsApi.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

/**
 * Get single product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProduct = async (id) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/${id}?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Get single product by route slug
 * @param {string} route - Product route
 * @returns {Promise<Object>} Product data
 */
export const getProductByRoute = async (route) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/by-route/${route}?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by route:', error);
    throw error;
  }
};

/**
 * Create new product
 * @param {Object} productData - Product data to create
 * @returns {Promise<Object>} Created product data
 */
export const createProduct = async (productData) => {
  try {
    const response = await cmsApi.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update product
 * @param {number} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Promise<Object>} Updated product data
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await cmsApi.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete product
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProduct = async (id) => {
  try {
    const response = await cmsApi.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Duplicate product
 * @param {number} id - Product ID to duplicate
 * @param {Object} duplicateData - Data for duplicate (name, route)
 * @returns {Promise<Object>} Duplicate result
 */
export const duplicateProduct = async (id, duplicateData) => {
  try {
    const response = await cmsApi.post(`/products/${id}/duplicate`, duplicateData);
    return response.data;
  } catch (error) {
    console.error('Error duplicating product:', error);
    throw error;
  }
};

/**
 * Toggle product visibility
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Toggle result
 */
export const toggleProductVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/products/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    throw error;
  }
};

/**
 * Get all sections for a product
 * @param {number} id - Product ID
 * @returns {Promise<Array>} Array of sections
 */
export const getProductSections = async (id) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/${id}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product sections:', error);
    throw error;
  }
};

/**
 * Get product sections by route
 * @param {string} route - Product route
 * @returns {Promise<Array>} Array of sections
 */
export const getProductSectionsByRoute = async (route) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/by-route/${route}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product sections by route:', error);
    throw error;
  }
};

/**
 * Create product section
 * @param {number} id - Product ID
 * @param {Object} sectionData - Section data to create
 * @returns {Promise<Object>} Created section data
 */
export const createProductSection = async (id, sectionData) => {
  try {
    const response = await cmsApi.post(`/products/${id}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating product section:', error);
    throw error;
  }
};

/**
 * Update product section
 * @param {number} id - Product ID
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data to update
 * @returns {Promise<Object>} Updated section data
 */
export const updateProductSection = async (id, sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/products/${id}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating product section:', error);
    throw error;
  }
};

/**
 * Delete product section
 * @param {number} id - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProductSection = async (id, sectionId) => {
  try {
    const response = await cmsApi.delete(`/products/${id}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product section:', error);
    throw error;
  }
};

/**
 * Get all items for a product section
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of items
 */
export const getProductItems = async (productId, sectionId) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/${productId}/sections/${sectionId}/items?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product items:', error);
    throw error;
  }
};

/**
 * Create product item
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {Object} itemData - Item data to create
 * @returns {Promise<Object>} Created item data
 */
export const createProductItem = async (productId, sectionId, itemData) => {
  try {
    const response = await cmsApi.post(`/products/${productId}/sections/${sectionId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating product item:', error);
    throw error;
  }
};

/**
 * Update product item
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {number} itemId - Item ID
 * @param {Object} itemData - Item data to update
 * @returns {Promise<Object>} Updated item data
 */
export const updateProductItem = async (productId, sectionId, itemId, itemData) => {
  try {
    const response = await cmsApi.put(`/products/${productId}/sections/${sectionId}/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating product item:', error);
    throw error;
  }
};

/**
 * Delete product item
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {number} itemId - Item ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProductItem = async (productId, sectionId, itemId) => {
  try {
    const response = await cmsApi.delete(`/products/${productId}/sections/${sectionId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product item:', error);
    throw error;
  }
};

/**
 * Get main products page content
 * @param {boolean} includeHidden - Include hidden sections
 * @returns {Promise<Object>} Main products page data
 */
export const getMainProductsContent = async (includeHidden = false) => {
  try {
    const timestamp = new Date().getTime();
    const url = includeHidden 
      ? `/main-products?t=${timestamp}&all=true`
      : `/main-products?t=${timestamp}`;
    const response = await cmsApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching main products content:', error);
    throw error;
  }
};

/**
 * Get all products with their card data (for ProductsMainAdmin)
 * Auto-creates card entries if they don't exist
 * @returns {Promise<Array>} Array of products with their card data
 */
export const getProductsWithCards = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/with-cards?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products with cards:', error);
    throw error;
  }
};

/**
 * Update main products page hero content
 * @param {Object} heroData - Hero section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainProductsHero = async (heroData) => {
  try {
    const response = await cmsApi.put('/main-products/hero', heroData);
    return response.data;
  } catch (error) {
    console.error('Error updating main products hero:', error);
    throw error;
  }
};

/**
 * Get all main products sections (including hidden ones for admin)
 * @returns {Promise<Array>} All sections
 */
export const getAllMainProductsSections = async () => {
  try {
    const response = await cmsApi.get('/main-products/sections/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all main products sections:', error);
    throw error;
  }
};

/**
 * Duplicate main products section
 * @param {number} sectionId - Section ID to duplicate
 * @returns {Promise<Object>} Duplicate response
 */
export const duplicateMainProductsSection = async (sectionId) => {
  try {
    const response = await cmsApi.post(`/main-products/sections/${sectionId}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating main products section:', error);
    throw error;
  }
};

/**
 * Delete main products section
 * @param {number} sectionId - Section ID to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteMainProductsSection = async (sectionId) => {
  try {
    const response = await cmsApi.delete(`/main-products/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting main products section:', error);
    throw error;
  }
};

/**
 * Toggle main products section visibility
 * @param {number} sectionId - Section ID to toggle
 * @returns {Promise<Object>} Toggle response
 */
export const toggleMainProductsSectionVisibility = async (sectionId) => {
  try {
    const response = await cmsApi.put(`/main-products/sections/${sectionId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling main products section visibility:', error);
    throw error;
  }
};

/**
 * Create new main products section
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Create response
 */
export const createMainProductsSection = async (sectionData) => {
  try {
    const response = await cmsApi.post('/main-products/sections', sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating main products section:', error);
    throw error;
  }
};

/**
 * Update main products section
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data
 * @returns {Promise<Object>} Update response
 */
export const updateMainProductsSection = async (sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/main-products/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating main products section:', error);
    throw error;
  }
};

/**
 * Get all products for a section
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of products
 */
export const getAllProductsForSection = async (sectionId) => {
  try {
    const response = await cmsApi.get(`/main-products/sections/${sectionId}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products for section:', error);
    throw error;
  }
};

/**
 * Get comprehensive section content (header, features, stats)
 * @returns {Promise<Object>} Comprehensive section data
 */
export const getComprehensiveSectionContent = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/comprehensive-section?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comprehensive section content:', error);
    throw error;
  }
};

/**
 * Update comprehensive section header
 * @param {Object} headerData - Header data (title, description)
 * @returns {Promise<Object>} Update response
 */
export const updateComprehensiveSectionHeader = async (headerData) => {
  try {
    const response = await cmsApi.put('/comprehensive-section/header', headerData);
    return response.data;
  } catch (error) {
    console.error('Error updating comprehensive section header:', error);
    throw error;
  }
};

/**
 * Update comprehensive section feature card
 * @param {number} id - Feature ID
 * @param {Object} featureData - Feature data (title, description, button_text, icon_type, order_index, is_visible)
 * @returns {Promise<Object>} Update response
 */
export const updateComprehensiveSectionFeature = async (id, featureData) => {
  try {
    const response = await cmsApi.put(`/comprehensive-section/features/${id}`, featureData);
    return response.data;
  } catch (error) {
    console.error('Error updating comprehensive section feature:', error);
    throw error;
  }
};

/**
 * Update comprehensive section statistic
 * @param {number} id - Statistic ID
 * @param {Object} statData - Statistic data (value, label, order_index, is_visible)
 * @returns {Promise<Object>} Update response
 */
export const updateComprehensiveSectionStat = async (id, statData) => {
  try {
    const response = await cmsApi.put(`/comprehensive-section/stats/${id}`, statData);
    return response.data;
  } catch (error) {
    console.error('Error updating comprehensive section stat:', error);
    throw error;
  }
};

/**
 * Get feature banners (for frontend - only visible)
 * @returns {Promise<Array>} Array of feature banners
 */
export const getFeatureBanners = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/feature-banners?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature banners:', error);
    throw error;
  }
};

/**
 * Get all feature banners (for admin - including hidden)
 * @returns {Promise<Array>} Array of all feature banners
 */
export const getAllFeatureBanners = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/feature-banners/all?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all feature banners:', error);
    throw error;
  }
};

/**
 * Create new feature banner
 * @param {Object} bannerData - Banner data
 * @returns {Promise<Object>} Create response
 */
export const createFeatureBanner = async (bannerData) => {
  try {
    const response = await cmsApi.post('/feature-banners', bannerData);
    return response.data;
  } catch (error) {
    console.error('Error creating feature banner:', error);
    throw error;
  }
};

/**
 * Update feature banner
 * @param {number} id - Banner ID
 * @param {Object} bannerData - Banner data
 * @returns {Promise<Object>} Update response
 */
export const updateFeatureBanner = async (id, bannerData) => {
  try {
    const response = await cmsApi.put(`/feature-banners/${id}`, bannerData);
    return response.data;
  } catch (error) {
    console.error('Error updating feature banner:', error);
    throw error;
  }
};

/**
 * Delete feature banner
 * @param {number} id - Banner ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteFeatureBanner = async (id) => {
  try {
    const response = await cmsApi.delete(`/feature-banners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feature banner:', error);
    throw error;
  }
};

/**
 * Toggle feature banner visibility
 * @param {number} id - Banner ID
 * @returns {Promise<Object>} Toggle response
 */
export const toggleFeatureBannerVisibility = async (id) => {
  try {
    const response = await cmsApi.patch(`/feature-banners/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling feature banner visibility:', error);
    throw error;
  }
};

// Default export (placed after all function declarations to avoid TDZ errors)
export default {
  // Homepage
  getHomepageContent,
  getHeroContent,
  updateHeroContent,

  // Why items
  getWhyItems,
  createWhyItem,
  updateWhyItem,
  deleteWhyItem,

  // Marketplaces basic
  getMarketplaces,
  getAdminMarketplaces,
  getMarketplace,
  getMarketplaceByName,
  getMarketplaceCategories,
  createMarketplace,
  updateMarketplace,
  deleteMarketplace,
  duplicateMarketplace,
  toggleMarketplaceVisibility,
  getMarketplaceSections,
  getMarketplaceItems,
  createMarketplaceSection,
  updateMarketplaceSection,
  deleteMarketplaceSection,

  // Health
  checkCMSHealth,

  // Main pages API
  getMainMarketplacesContent,
  updateMainMarketplacesHero,
  updateMainMarketplacesSection,
  getAllMainMarketplacesSections,
  duplicateMainMarketplacesSection,
  deleteMainMarketplacesSection,
  toggleMainMarketplacesSectionVisibility,
  createMainMarketplacesSection,

  // Products basic
  getProducts,
  getAdminProducts,
  getProduct,
  getProductByRoute,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleProductVisibility,
  getProductSections,
  getProductSectionsByRoute,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  getProductItems,
  createProductItem,
  updateProductItem,
  deleteProductItem,

  // Main products page API
  getMainProductsContent,
  getProductsWithCards,
  updateMainProductsHero,
  updateMainProductsSection,
  getAllMainProductsSections,
  duplicateMainProductsSection,
  deleteMainProductsSection,
  toggleMainProductsSectionVisibility,
  createMainProductsSection,
  getAllProductsForSection,
};

// ==================== Integrity Pages API ====================

/**
 * Get all integrity pages
 * @param {boolean} showAll - Include hidden pages
 * @returns {Promise<Array>} Array of integrity pages
 */
export const getIntegrityPages = async (showAll = false) => {
  try {
    // Add cache busting to ensure fresh data
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const url = showAll 
      ? `/integrity-pages?all=true&t=${timestamp}&r=${random}` 
      : `/integrity-pages?t=${timestamp}&r=${random}`;
    const response = await cmsApi.get(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching integrity pages:', error);
    throw error;
  }
};

/**
 * Get single integrity page by slug
 * @param {string} slug - Page slug
 * @param {boolean} showAll - Include hidden pages
 * @returns {Promise<Object>} Integrity page data
 */
export const getIntegrityPage = async (slug, showAll = false) => {
  try {
    // Add unique timestamp and random number to prevent caching
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const url = showAll 
      ? `/integrity-pages/${slug}?all=true&t=${timestamp}&r=${random}` 
      : `/integrity-pages/${slug}?t=${timestamp}&r=${random}`;
    const response = await cmsApi.get(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching integrity page:', error);
    throw error;
  }
};

/**
 * Create new integrity page
 * @param {Object} pageData - Page data (slug, title, content, is_visible)
 * @returns {Promise<Object>} Created page data
 */
export const createIntegrityPage = async (pageData) => {
  try {
    const response = await cmsApi.post('/integrity-pages', pageData);
    return response.data;
  } catch (error) {
    console.error('Error creating integrity page:', error);
    throw error;
  }
};

/**
 * Update integrity page
 * @param {number} id - Page ID
 * @param {Object} pageData - Page data to update
 * @returns {Promise<Object>} Update response
 */
export const updateIntegrityPage = async (id, pageData) => {
  try {
    console.log('📡 API Call - Updating integrity page:', { id, pageData });
    const response = await cmsApi.put(`/integrity-pages/${id}`, pageData);
    console.log('📥 API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Error updating integrity page:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Delete integrity page
 * @param {number} id - Page ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteIntegrityPage = async (id) => {
  try {
    const response = await cmsApi.delete(`/integrity-pages/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting integrity page:', error);
    throw error;
  }
};

/**
 * Toggle integrity page visibility
 * @param {number} id - Page ID
 * @returns {Promise<Object>} Toggle response
 */
export const toggleIntegrityPageVisibility = async (id) => {
  try {
    const response = await cmsApi.put(`/integrity-pages/${id}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling integrity page visibility:', error);
    throw error;
  }
};

/**
 * Duplicate integrity page
 * @param {number} id - Page ID to duplicate
 * @param {Object} duplicateData - Optional data for duplicate (slug, title)
 * @returns {Promise<Object>} Duplicate response
 */
export const duplicateIntegrityPage = async (id, duplicateData = {}) => {
  try {
    const response = await cmsApi.post(`/integrity-pages/${id}/duplicate`, duplicateData);
    return response.data;
  } catch (error) {
    console.error('Error duplicating integrity page:', error);
    throw error;
  }
};
