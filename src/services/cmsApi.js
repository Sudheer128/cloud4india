import axios from 'axios';

// CMS API Configuration
const CMS_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const cmsApi = axios.create({
  baseURL: CMS_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
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
 * Get products content
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    const response = await cmsApi.get('/homepage');
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
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
 * Update product content
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
 * Get all solutions
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
 * Get single solution
 * @param {number} id - Solution ID
 * @returns {Promise<Object>} Solution data
 */
export const getSolution = async (id) => {
  try {
    const response = await cmsApi.get(`/solutions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution:', error);
    throw error;
  }
};

/**
 * Create new solution
 * @param {Object} solutionData - Solution data to create
 * @returns {Promise<Object>} Created solution data
 */
export const createSolution = async (solutionData) => {
  try {
    const response = await cmsApi.post('/solutions', solutionData);
    return response.data;
  } catch (error) {
    console.error('Error creating solution:', error);
    throw error;
  }
};

/**
 * Update solution
 * @param {number} id - Solution ID
 * @param {Object} solutionData - Solution data to update
 * @returns {Promise<Object>} Updated solution data
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
 * Delete solution
 * @param {number} id - Solution ID
 * @returns {Promise<Object>} Deletion result
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
 * Duplicate solution
 * @param {number} id - Solution ID
 * @param {Object} duplicateData - New name and route for duplicate
 * @returns {Promise<Object>} Duplication result
 */
export const duplicateSolution = async (id, duplicateData) => {
  try {
    const response = await cmsApi.post(`/solutions/${id}/duplicate`, duplicateData);
    return response.data;
  } catch (error) {
    console.error('Error duplicating solution:', error);
    throw error;
  }
};

/**
 * Get solution sections
 * @param {number} id - Solution ID
 * @returns {Promise<Array>} Array of solution sections
 */
export const getSolutionSections = async (id) => {
  try {
    const response = await cmsApi.get(`/solutions/${id}/sections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching solution sections:', error);
    throw error;
  }
};

/**
 * Create solution section
 * @param {number} id - Solution ID
 * @param {Object} sectionData - Section data to create
 * @returns {Promise<Object>} Created section data
 */
export const createSolutionSection = async (id, sectionData) => {
  try {
    const response = await cmsApi.post(`/solutions/${id}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating solution section:', error);
    throw error;
  }
};

/**
 * Update solution section
 * @param {number} id - Solution ID
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data to update
 * @returns {Promise<Object>} Updated section data
 */
export const updateSolutionSection = async (id, sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/solutions/${id}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating solution section:', error);
    throw error;
  }
};

/**
 * Delete solution section
 * @param {number} id - Solution ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteSolutionSection = async (id, sectionId) => {
  try {
    const response = await cmsApi.delete(`/solutions/${id}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting solution section:', error);
    throw error;
  }
};

// Export the axios instance for custom requests
export { cmsApi };

// Default export
export default {
  getHomepageContent,
  getHeroContent,
  getWhyItems,
  getProducts,
  getSolutions,
  getSolution,
  createSolution,
  updateSolution,
  deleteSolution,
  duplicateSolution,
  getSolutionSections,
  createSolutionSection,
  updateSolutionSection,
  deleteSolutionSection,
  updateHeroContent,
  createWhyItem,
  updateWhyItem,
  deleteWhyItem,
  createProduct,
  updateProduct,
  deleteProduct,
  checkCMSHealth,
};
