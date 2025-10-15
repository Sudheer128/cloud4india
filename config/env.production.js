// Production Environment Configuration
export const config = {
  NODE_ENV: 'production',
  APP_ENV: 'production',
  API_URL: 'http://161.97.155.89:3004',
  APP_NAME: 'Cloud4India',
  APP_VERSION: '1.0.0',
  DEBUG: false,
  BASE_URL: 'http://161.97.155.89:3004',
  // AI Service Configuration (OpenRouter API)
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  AI_MODEL: 'qwen/qwen3-coder:free' // Qwen free model via OpenRouter
}
