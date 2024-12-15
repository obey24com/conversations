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

    console.log('Generated prompt:', prompt);

    // Make the API request
    const response = await makeGeminiRequest(prompt);
    console.log('Received Gemini response:', response);
    
    // Extract the text from the response
    const result = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      console.error('Empty response from Gemini API');
      throw new Error('Empty response from Gemini API');
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
