import type { TranslationResult } from './types';
import { GEMINI_CONFIG } from './config';

export function parseGeminiResponse(result: string): TranslationResult {
  console.log('Parsing Gemini response:', result);

  if (!result) {
    return {
      translation: '',
      error: GEMINI_CONFIG.ERROR_MESSAGES.EMPTY_RESPONSE
    };
  }

  try {
    // Extract translation and context using more robust regex
    const translationMatch = result.match(/TRANSLATION:\s*([\s\S]*?)(?=\s*CONTEXT:|$)/i);
    const contextMatch = result.match(/CONTEXT:\s*([\s\S]*?)$/i);

    console.log('Translation match:', translationMatch);
    console.log('Context match:', contextMatch);

    const translation = translationMatch?.[1]?.trim();
    const context = contextMatch?.[1]?.trim();

    if (!translation && !context) {
      // If no proper format is found, treat the entire response as translation
      return {
        translation: result.trim(),
        context: undefined
      };
    }

    if (!translation) {
      throw new Error('Missing translation in response');
    }

    return {
      translation,
      context: context || undefined,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      translation: '',
      error: GEMINI_CONFIG.ERROR_MESSAGES.PARSE_ERROR
    };
  }
}
