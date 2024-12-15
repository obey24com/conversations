import type { GeminiResponse, TranslationResult } from './types';

export function validateGeminiResponse(response: GeminiResponse): string {
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text?.trim()) {
    throw new Error('Empty or invalid response from Gemini API');
  }

  return text;
}

export function validateTranslationResult(result: TranslationResult): void {
  if (!result.translation?.trim()) {
    throw new Error('Empty translation result');
  }
}
