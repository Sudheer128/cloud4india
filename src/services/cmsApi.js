import axios from 'axios';
import { CMS_URL } from '../utils/config.js';

// CMS API Configuration
const CMS_BASE_URL = `${CMS_URL}/api`;

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
 * Get all solutions (including hidden) - for admin panel
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
 * Toggle solution visibility
 * @param {number} id - Solution ID
 * @returns {Promise<Object>} Toggle result
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

// Product Sections API Functions

/**
 * Get all product sections for a specific product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} Array of product sections
 */
/**
 * Get product by route slug
 * @param {string} route - Product route slug (e.g., 'microsoft-365-licenses')
 * @returns {Promise<Object>} Product data
 */
export const getProductByRoute = async (route) => {
  try {
    const response = await cmsApi.get(`/products/by-route/${route}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by route:', error);
    throw error;
  }
};

/**
 * Get product sections by route slug
 * @param {string} route - Product route slug
 * @returns {Promise<Array>} Array of product sections
 */
export const getProductSectionsByRoute = async (route) => {
  try {
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/by-route/${route}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product sections by route:', error);
    throw error;
  }
};

/**
 * Get product items for a section by route slug
 * @param {string} route - Product route slug
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of product items
 */
export const getProductItemsByRoute = async (route, sectionId) => {
  try {
    const response = await cmsApi.get(`/products/by-route/${route}/sections/${sectionId}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product items by route:', error);
    throw error;
  }
};

/**
 * Get product variants (pricing items) by product route - for popup dropdown
 * @param {string} route - Product route slug
 * @returns {Promise<Array>} Array of product variants with name, price, and route
 */
export const getProductVariantsByRoute = async (route) => {
  try {
    const response = await cmsApi.get(`/products/by-route/${route}/variants`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product variants by route:', error);
    throw error;
  }
};

export const getProductSections = async (productId) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/products/${productId}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product sections:', error);
    throw error;
  }
};

/**
 * Get all product sections for admin (including hidden)
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} Array of product sections
 */
export const getAdminProductSections = async (productId) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await cmsApi.get(`/admin/products/${productId}/sections?t=${timestamp}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin product sections:', error);
    throw error;
  }
};

/**
 * Create new product section
 * @param {number} productId - Product ID
 * @param {Object} sectionData - Section data to create
 * @returns {Promise<Object>} Created section data
 */
export const createProductSection = async (productId, sectionData) => {
  try {
    const response = await cmsApi.post(`/products/${productId}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating product section:', error);
    throw error;
  }
};

/**
 * Update product section
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {Object} sectionData - Section data to update
 * @returns {Promise<Object>} Updated section data
 */
export const updateProductSection = async (productId, sectionId, sectionData) => {
  try {
    const response = await cmsApi.put(`/products/${productId}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Error updating product section:', error);
    throw error;
  }
};

/**
 * Delete product section
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProductSection = async (productId, sectionId) => {
  try {
    const response = await cmsApi.delete(`/products/${productId}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product section:', error);
    throw error;
  }
};

/**
 * Toggle product section visibility
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Toggle result
 */
export const toggleProductSectionVisibility = async (productId, sectionId) => {
  try {
    const response = await cmsApi.patch(`/products/${productId}/sections/${sectionId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product section visibility:', error);
    throw error;
  }
};

// Product Items API Functions

/**
 * Get all items for a specific product section
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of product items
 */
export const getProductItems = async (productId, sectionId) => {
  try {
    const response = await cmsApi.get(`/products/${productId}/sections/${sectionId}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product items:', error);
    throw error;
  }
};

/**
 * Get all items for admin (including hidden)
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @returns {Promise<Array>} Array of product items
 */
export const getAdminProductItems = async (productId, sectionId) => {
  try {
    const response = await cmsApi.get(`/admin/products/${productId}/sections/${sectionId}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin product items:', error);
    throw error;
  }
};

/**
 * Create new product item
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
 * Toggle product item visibility
 * @param {number} productId - Product ID
 * @param {number} sectionId - Section ID
 * @param {number} itemId - Item ID
 * @returns {Promise<Object>} Toggle result
 */
export const toggleProductItemVisibility = async (productId, sectionId, itemId) => {
  try {
    const response = await cmsApi.patch(`/products/${productId}/sections/${sectionId}/items/${itemId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product item visibility:', error);
    throw error;
  }
};

// Product Management API Functions

/**
 * Get all products for admin (including hidden)
 * @returns {Promise<Array>} Array of products
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
 * Toggle product visibility
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Toggle result
 */
export const toggleProductVisibility = async (productId) => {
  try {
    const response = await cmsApi.put(`/products/${productId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    throw error;
  }
};

/**
 * Duplicate product with all sections and items
 * @param {number} productId - Product ID
 * @param {Object} options - Duplication options (newName, newRoute)
 * @returns {Promise<Object>} Duplication result
 */
export const duplicateProduct = async (productId, options = {}) => {
  try {
    const response = await cmsApi.post(`/products/${productId}/duplicate`, options);
    return response.data;
  } catch (error) {
    console.error('Error duplicating product:', error);
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
  getAdminSolutions,
  getSolution,
  createSolution,
  updateSolution,
  deleteSolution,
  duplicateSolution,
  toggleSolutionVisibility,
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
  // New Product CMS API functions
  getProductByRoute,
  getProductSectionsByRoute,
  getProductItemsByRoute,
  getProductVariantsByRoute,
  getProductSections,
  getAdminProductSections,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  toggleProductSectionVisibility,
  getProductItems,
  getAdminProductItems,
  createProductItem,
  updateProductItem,
  deleteProductItem,
  toggleProductItemVisibility,
  getAdminProducts,
  toggleProductVisibility,
  duplicateProduct,
  checkCMSHealth,
  // Main Pages API functions
  getMainProductsContent,
  getMainSolutionsContent,
  updateMainProductsHero,
  updateMainSolutionsHero,
  updateMainProductsSection,
  updateMainSolutionsSection,
  duplicateMainProductsSection,
  deleteMainProductsSection,
  toggleMainProductsSectionVisibility,
  createMainProductsSection,
  getAllProductsForSection,
  getAllMainSolutionsSections,
  duplicateMainSolutionsSection,
  deleteMainSolutionsSection,
  toggleMainSolutionsSectionVisibility,
  createMainSolutionsSection,
};

// ===== MAIN PAGES API FUNCTIONS =====

/**
 * Get main products page content
 * @param {boolean} includeHidden - Include hidden sections (for admin)
 * @returns {Promise<Object>} Main products page data with hero and sections
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
 * Get all main solutions sections (including hidden ones for admin)
 * @returns {Promise<Array>} All sections
 */
export const getAllMainSolutionsSections = async () => {
  try {
    const response = await cmsApi.get('/main-solutions/sections/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all main solutions sections:', error);
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
 * Toggle visibility of main products section
 * @param {number} sectionId - Section ID
 * @returns {Promise<Object>} Toggle response
 */
export const toggleMainProductsSectionVisibility = async (sectionId) => {
  try {
    const response = await cmsApi.patch(`/main-products/sections/${sectionId}/toggle-visibility`);
    return response.data;
  } catch (error) {
    console.error('Error toggling main products section visibility:', error);
    throw error;
  }
};

/**
 * Create new main products section
 * @param {Object} sectionData - Section data (product_id, title, description, is_visible)
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
 * Get all products (for dropdown when creating new section)
 * @returns {Promise<Array>} All products
 */
export const getAllProductsForSection = async () => {
  try {
    const response = await cmsApi.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
