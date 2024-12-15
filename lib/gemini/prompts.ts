import { GeminiTranslationOptions } from './types';
import { isPetLanguage } from '@/lib/languages';

export function generateTranslationPrompt({
  text,
  fromLang,
  toLang,
  includeContext = true,
}: GeminiTranslationOptions): string {
  const isPetFrom = isPetLanguage(fromLang);
  const isPetTo = isPetLanguage(toLang);

  if (isPetFrom && !isPetTo) {
    return `Translate the following ${fromLang} sounds into ${toLang}:
${text}

Format your response as:
TRANSLATION: [Your translation in ${toLang}]
${includeContext ? 'CONTEXT: [Any cultural or contextual notes in ${toLang}]' : ''}`;
  }

  if (!isPetFrom && isPetTo) {
    return `Convert the following ${fromLang} text into ${toLang} animal sounds:
${text}

Format your response as:
TRANSLATION: [${toLang} sounds]
${includeContext ? 'CONTEXT: [Brief explanation of the sounds and their meaning]' : ''}`;
  }

  if (isPetFrom && isPetTo) {
    return `Translate these ${fromLang} sounds into ${toLang} sounds:
${text}

Format your response as:
TRANSLATION: [${toLang} equivalent sounds]
${includeContext ? 'CONTEXT: [Explanation of the sound translation]' : ''}`;
  }

  return `Translate this ${fromLang} text into natural ${toLang}:
${text}

Format your response as:
TRANSLATION: [Your translation]
${includeContext ? 'CONTEXT: [Any cultural context or nuances that might be helpful]' : ''}`;
}
