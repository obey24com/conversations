import { GEMINI_CONFIG } from './config';
import type { GeminiRequest, GeminiResponse, TranslationResult } from './types';
import { generateTranslationPrompt } from './prompts';

async function makeGeminiRequest(prompt: string): Promise<GeminiResponse> {
  const request: GeminiRequest = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const response = await fetch(
    `${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  return response.json();
}

export async function translateWithGemini(
  text: string,
  fromLang: string,
  toLang: string
): Promise<TranslationResult> {
  try {
    const prompt = generateTranslationPrompt({
      text,
      fromLang,
      toLang,
    });

    const response = await makeGeminiRequest(prompt);
    const result = response.candidates[0]?.content.parts[0]?.text;

    if (!result) {
      throw new Error('Empty response from Gemini API');
    }

    // Parse the response to extract translation and context
    const translationMatch = result.match(/TRANSLATION:\s*([\s\S]*?)(?=CONTEXT:|$)/i);
    const contextMatch = result.match(/CONTEXT:\s*([\s\S]*?)$/i);

    return {
      translation: translationMatch?.[1]?.trim() ?? result.trim(),
      context: contextMatch?.[1]?.trim(),
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translation: '',
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}
