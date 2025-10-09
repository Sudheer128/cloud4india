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
    API_URL: 'http://localhost:3001',
    APP_NAME: 'Cloud4India',
    APP_VERSION: '1.0.0',
    DEBUG: true,
    BASE_URL: 'http://localhost:3001'
  },
  production: {
    NODE_ENV: 'production',
    APP_ENV: 'production',
    API_URL: 'http://161.97.155.89:3004',
    APP_NAME: 'Cloud4India',
    APP_VERSION: '1.0.0',
    DEBUG: false,
    BASE_URL: 'http://161.97.155.89:3004'
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
  BASE_URL
} = appConfig

export default appConfig
