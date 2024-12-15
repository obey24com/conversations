export const GEMINI_ERRORS = {
  EMPTY_RESPONSE: 'Empty response from Gemini API',
  PARSE_ERROR: 'Failed to parse translation response',
  API_ERROR: 'Error communicating with Gemini API',
  INVALID_FORMAT: 'Invalid response format from Gemini API',
  RATE_LIMIT: 'Rate limit exceeded, please try again later',
  TIMEOUT: 'Request timed out',
} as const;

export type GeminiErrorType = keyof typeof GEMINI_ERRORS;

export class GeminiError extends Error {
  constructor(type: GeminiErrorType) {
    super(GEMINI_ERRORS[type]);
    this.name = 'GeminiError';
  }
}
