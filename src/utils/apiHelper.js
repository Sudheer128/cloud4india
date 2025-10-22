import { CMS_URL } from './config.js';

/**
 * Get the CMS API URL for the current environment
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Complete API URL
 */
export const getCMSApiUrl = (endpoint) => {
  const baseUrl = `${CMS_URL}/api`;
  return endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
};

/**
 * Make a fetch request to the CMS API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const fetchCMS = (endpoint, options = {}) => {
  const url = getCMSApiUrl(endpoint);
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};

export default {
  getCMSApiUrl,
  fetchCMS,
};
