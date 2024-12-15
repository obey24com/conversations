export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyD3vgS8R0P91Rk7yC052OZORELMCx4VzFY',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  MAX_RETRIES: 3,
  TIMEOUT: 30000, // 30 seconds
  ERROR_MESSAGES: {
    INVALID_REQUEST: 'Invalid translation request',
    API_ERROR: 'Error communicating with Gemini API',
    RATE_LIMIT: 'Rate limit exceeded, please try again later',
    TIMEOUT: 'Request timed out',
  },
} as const;

export type GeminiErrorType = keyof typeof GEMINI_CONFIG.ERROR_MESSAGES;
