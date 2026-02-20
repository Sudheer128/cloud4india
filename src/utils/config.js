// Environment Configuration Utility
// All URLs must be set via environment variables - no fallbacks

export const API_URL = import.meta.env.VITE_API_URL;
export const CMS_URL = import.meta.env.VITE_CMS_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;

// Cloud4India Admin API
export const CLOUD4INDIA_API_URL = import.meta.env.VITE_CLOUD4INDIA_API_URL || 'https://portal.cloud4india.com/backend/api';
export const CLOUD4INDIA_API_KEY = import.meta.env.VITE_CLOUD4INDIA_API_KEY;

// Portal and External URLs
export const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || 'https://portal.cloud4india.com';
export const DOCS_URL = import.meta.env.VITE_DOCS_URL || 'https://docs.cloud4india.com';
export const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'https://cloud4india.com';

// Static config
export const APP_NAME = 'Cloud4India';
export const APP_VERSION = '1.0.0';
export const AI_API_URL = 'https://api.openai.com/v1/chat/completions';
export const AI_MODEL = 'gpt-3.5-turbo';
export const OPENROUTER_APP_NAME = 'Cloud4India';

export const appConfig = {
  API_URL,
  CMS_URL,
  BASE_URL,
  APP_NAME,
  APP_VERSION,
  AI_API_KEY,
  AI_API_URL,
  AI_MODEL,
  OPENROUTER_APP_NAME,
  OPENROUTER_SITE_URL: BASE_URL,
  CLOUD4INDIA_API_URL,
  CLOUD4INDIA_API_KEY,
  PORTAL_URL,
  DOCS_URL,
  MAIN_SITE_URL,
};

export default appConfig;
