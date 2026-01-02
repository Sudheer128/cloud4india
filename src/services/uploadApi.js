import axios from 'axios';
import { CMS_URL } from '../utils/config.js';

const CMS_BASE_URL = `${CMS_URL}/api`;

const cmsApi = axios.create({
    baseURL: CMS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Upload image to server with organized folder structure
 * @param {File} file - Image file to upload
 * @param {string} category - Category: products, marketplaces, solutions, about, homepage, logos, general
 * @param {string} entityName - Entity name (e.g., "GPU Compute", "Node.js")
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadImage = async (file, category = 'general', entityName = '') => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (entityName) params.append('entityName', entityName);

        const response = await cmsApi.post(`/upload/image?${params.toString()}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data && response.data.filePath) {
            return {
                ...response.data,
                filePath: `${CMS_URL}${response.data.filePath}`
            };
        }
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Upload video to server with organized folder structure
 * @param {File} file - Video file to upload
 * @param {string} category - Category: products, marketplaces, solutions, general
 * @param {string} entityName - Entity name
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadVideo = async (file, category = 'general', entityName = '') => {
    try {
        const formData = new FormData();
        formData.append('video', file);

        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (entityName) params.append('entityName', entityName);

        const response = await cmsApi.post(`/upload/video?${params.toString()}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data && response.data.filePath) {
            return {
                ...response.data,
                filePath: `${CMS_URL}${response.data.filePath}`
            };
        }
        return response.data;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};
