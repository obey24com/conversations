export const GEMINI_CONFIG = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  MODEL: 'gemini-pro',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  ERROR_MESSAGES: {
    INVALID_REQUEST: 'Invalid translation request',
    API_ERROR: 'Error communicating with Gemini API',
    RATE_LIMIT: 'Rate limit exceeded, please try again later',
    TIMEOUT: 'Request timed out',
    MISSING_API_KEY: 'Gemini API key is not configured',
    EMPTY_RESPONSE: 'Empty response from Gemini API',
    PARSE_ERROR: 'Failed to parse translation response'
  },
} as const;

export type GeminiErrorType = keyof typeof GEMINI_CONFIG.ERROR_MESSAGES;
