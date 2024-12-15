import type { TranslationResult } from './types';

export function parseGeminiResponse(result: string): TranslationResult {
  if (!result) {
    return {
      translation: '',
      error: 'Empty response from Gemini API'
    };
  }

  try {
    // Extract translation and context using regex
    const translationMatch = result.match(/TRANSLATION:\s*([\s\S]*?)(?=\s*CONTEXT:|$)/i);
    const contextMatch = result.match(/CONTEXT:\s*([\s\S]*?)$/i);

    if (!translationMatch) {
      // If no proper format is found, treat the entire response as translation
      return {
        translation: result.trim(),
        context: undefined
      };
    }

    const translation = translationMatch[1].trim();
    const context = contextMatch?.[1]?.trim();

    // Validate the translation
    if (!translation) {
      return {
        translation: '',
        error: 'Empty translation in response'
      };
    }

    return {
      translation,
      context: context || undefined,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      translation: '',
      error: 'Failed to parse translation response'
    };
  }
}
