import axios from 'axios';
import { CMS_URL } from '../utils/config.js';

// CMS API Configuration
const CMS_BASE_URL = `${CMS_URL}/api`;

// Create axios instance with default config
const cmsApi = axios.create({
    baseURL: CMS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// MEDIA UPLOAD API FUNCTIONS
// ============================================

/**
 * Upload image to server
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await cmsApi.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Return the full URL with CMS backend server address
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
 * Upload video to server
 * @param {File} file - Video file to upload
 * @returns {Promise<Object>} Upload response with file path
 */
export const uploadVideo = async (file) => {
    try {
        const formData = new FormData();
        formData.append('video', file);

        const response = await cmsApi.post('/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};
