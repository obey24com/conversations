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
    // Extract translation and context using regex
    const translationMatch = result.match(/TRANSLATION:\s*([\s\S]*?)(?=\s*CONTEXT:|$)/i)?.at(1)?.trim();
    const contextMatch = result.match(/CONTEXT:\s*([\s\S]*?)$/i)?.at(1)?.trim();

    console.log('Translation match:', translationMatch);
    console.log('Context match:', contextMatch);

    if (!translationMatch && !contextMatch) {
      // If no proper format is found, treat the entire response as translation
      return {
        translation: result.trim(),
        context: undefined
      };
    }

    if (!translationMatch) {
      throw new Error('Missing translation in response');
    }

    // Validate the translation
    if (!translationMatch) {
      return {
        translation: '',
        error: GEMINI_CONFIG.ERROR_MESSAGES.PARSE_ERROR
      };
    }

    return {
      translation: translationMatch,
      context: contextMatch || undefined,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      translation: '',
      error: GEMINI_CONFIG.ERROR_MESSAGES.PARSE_ERROR
    };
  }
}
