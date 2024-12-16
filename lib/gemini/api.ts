import type { GeminiRequest, GeminiResponse } from './types';
import { GEMINI_CONFIG } from './config';

export async function makeGeminiRequest(prompt: string): Promise<GeminiResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(GEMINI_CONFIG.ERROR_MESSAGES.MISSING_API_KEY);
  }

  const request: GeminiRequest = {
    contents: {
      role: "user",
      parts: [{ text: prompt }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_CONFIG.REQUEST_TIMEOUT);

  let retries = 0;
  while (retries < GEMINI_CONFIG.MAX_RETRIES) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error response:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      console.log('Gemini API response status:', response.status);
      return data;
    } catch (error) {
      console.error('Gemini API request error:', error);
      retries++;
      if (retries === GEMINI_CONFIG.MAX_RETRIES) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, GEMINI_CONFIG.RETRY_DELAY * Math.pow(2, retries)));
    }
  }

  throw new Error('Max retries exceeded');
}
