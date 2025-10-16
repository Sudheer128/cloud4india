// Local Development Environment Configuration
export const config = {
  NODE_ENV: 'development',
  APP_ENV: 'local',
  API_URL: 'http://localhost:3001',
  APP_NAME: 'Cloud4India',
  APP_VERSION: '1.0.0',
  DEBUG: true,
  BASE_URL: 'http://localhost:3001',
  // AI Service Configuration (OpenRouter API)
  AI_API_KEY: process.env.AI_API_KEY || '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',
  AI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  AI_MODEL: 'qwen/qwen3-235b-a22b:free' // Qwen free model via OpenRouter
}
