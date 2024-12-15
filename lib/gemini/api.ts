import type { GeminiRequest, GeminiResponse } from './types';
import { GEMINI_CONFIG } from './config';

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(GEMINI_CONFIG.ERROR_MESSAGES.MISSING_API_KEY);
  }
  return apiKey;
}

export async function makeGeminiRequest(prompt: string): Promise<GeminiResponse> {
  const apiKey = getApiKey();

  const request: GeminiRequest = {
    contents: {
      role: "user",
      parts: [{ text: prompt }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_CONFIG.REQUEST_TIMEOUT);

  let retries = 0;
  while (retries < GEMINI_CONFIG.MAX_RETRIES) {
    try {
      const response = await fetch(
        `${GEMINI_CONFIG.BASE_URL}/models/${GEMINI_CONFIG.MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error response:', error);
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
