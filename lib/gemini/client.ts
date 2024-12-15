import type { TranslationResult } from './types';
import { generateTranslationPrompt } from './prompts';
import { makeGeminiRequest } from './api';
import { parseGeminiResponse } from './parser';

export async function translateWithGemini(
  text: string,
  fromLang: string,
  toLang: string
): Promise<TranslationResult> {
  try {
    console.log('Starting translation with Gemini:', { text, fromLang, toLang });

    // Generate the translation prompt
    const prompt = generateTranslationPrompt({
      text,
      fromLang,
      toLang,
    });

    // Make the API request
    const response = await makeGeminiRequest(prompt);
    
    // Extract the text from the response
    const result = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!result) {
      throw new Error(GEMINI_CONFIG.ERROR_MESSAGES.EMPTY_RESPONSE);
    }

    // Parse the response into translation and context
    return parseGeminiResponse(result);
  } catch (error) {
    console.error('Translation error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return {
      translation: '',
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}
