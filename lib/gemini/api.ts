import type { GeminiRequest, GeminiResponse } from './types';

const TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

export async function makeGeminiRequest(prompt: string): Promise<GeminiResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const request: GeminiRequest = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.3,
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
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
      }

      return response.json();
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }

  throw new Error('Max retries exceeded');
}
