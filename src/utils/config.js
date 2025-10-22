// Environment Configuration Utility

const getEnvironment = () => {
  // Check if we're in production build
  if (import.meta.env.PROD) {
    return 'production'
  }
  
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'local'
  }
  
  // Default to local
  return 'local'
}

const config = {
  local: {
    NODE_ENV: 'development',
    APP_ENV: 'local',
    API_URL: import.meta.env.VITE_CMS_API_URL || 'http://localhost:4002',
    CMS_API_URL: import.meta.env.VITE_CMS_API_URL || 'http://localhost:4002',
    APP_NAME: 'Cloud4India',
    APP_VERSION: '1.0.0',
    DEBUG: true,
    BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:4001',
    // AI Service Configuration (OpenRouter API)
    AI_API_KEY: import.meta.env.VITE_AI_API_KEY || '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',
    AI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    AI_MODEL: 'qwen/qwen3-235b-a22b:free', // Qwen free model via OpenRouter
    OPENROUTER_APP_NAME: 'Cloud4India',
    OPENROUTER_SITE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:4001'
  },
  production: {
    NODE_ENV: 'production',
    APP_ENV: 'production',
    API_URL: import.meta.env.VITE_CMS_API_URL || 'http://161.97.155.89:4002',
    CMS_API_URL: import.meta.env.VITE_CMS_API_URL || 'http://161.97.155.89:4002',
    APP_NAME: 'Cloud4India',
    APP_VERSION: '1.0.0',
    DEBUG: false,
    BASE_URL: import.meta.env.VITE_BASE_URL || 'http://161.97.155.89:4001',
    // AI Service Configuration (OpenRouter API)
    AI_API_KEY: import.meta.env.VITE_AI_API_KEY || '',
    AI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    AI_MODEL: 'qwen/qwen3-coder:free', // Qwen free model via OpenRouter
    OPENROUTER_APP_NAME: 'Cloud4India',
    OPENROUTER_SITE_URL: import.meta.env.VITE_BASE_URL || 'http://161.97.155.89:4001'
  }
}

const currentEnv = getEnvironment()
export const appConfig = config[currentEnv]

// Export individual values for easy access
export const {
  NODE_ENV,
  APP_ENV,
  API_URL,
  APP_NAME,
  APP_VERSION,
  DEBUG,
  BASE_URL,
  AI_API_KEY,
  AI_API_URL,
  AI_MODEL,
  OPENROUTER_APP_NAME,
  OPENROUTER_SITE_URL
} = appConfig

export default appConfig