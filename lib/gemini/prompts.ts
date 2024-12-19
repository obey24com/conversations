import { GeminiTranslationOptions } from './types';
import { isPetLanguage } from '@/lib/languages';

export function generateTranslationPrompt({
  text,
  fromLang,
  toLang,
}: GeminiTranslationOptions): string {
  const isPetFrom = isPetLanguage(fromLang);
  const isPetTo = isPetLanguage(toLang);

  const userPrompt = `Translate this text from ${fromLang} to ${toLang}:\n${text}`;

  if (isPetFrom && !isPetTo) {
    return `You are a translator that converts ${fromLang} animal language into ${toLang}. 
Follow these rules strictly:
1. Interpret the ${fromLang}'s sounds or body language accurately
2. Present the output exactly in this format:
   TRANSLATION: [Your interpretation in ${toLang}]
   CONTEXT: [Cultural or behavioral context in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings into ${toLang}
5. You MUST ALWAYS include both TRANSLATION and CONTEXT sections
6. The CONTEXT section MUST explain:
   - The animal's mood and emotional state
   - Behavioral cues and body language
   - Cultural significance if applicable
7. Never skip the CONTEXT section, even if the translation seems straightforward

${userPrompt}`;
  }

  if (!isPetFrom && isPetTo) {
    return `You are a translator converting human language (${fromLang}) into ${toLang} animal sounds.
Follow these rules strictly:
1. Convert the text naturally into appropriate ${toLang} sounds/expressions
2. Present the output exactly in this format:
   TRANSLATION: [${toLang} animal sounds]
   CONTEXT: [Explanation of the sounds' meaning in ${fromLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings
5. You MUST ALWAYS include both TRANSLATION and CONTEXT sections
6. The CONTEXT section MUST explain:
   - Why these specific sounds were chosen
   - The emotional tone they convey
   - How they match the original meaning
7. Never skip the CONTEXT section, even if the translation seems straightforward

${userPrompt}`;
  }

  if (isPetFrom && isPetTo) {
    return `You are an expert translator fluent in both ${fromLang} and ${toLang} animal languages.
Follow these rules strictly:
1. Convert the animal sounds naturally while preserving their meaning
2. Present the output exactly in this format:
   TRANSLATION: [${toLang} animal sounds]
   CONTEXT: [Explanation of the translation in simple terms]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings
5. You MUST ALWAYS include both TRANSLATION and CONTEXT sections
6. The CONTEXT section MUST explain:
   - How the meaning was preserved
   - Any adjustments made for cultural differences
   - The emotional equivalence between languages
7. Never skip the CONTEXT section, even if the translation seems straightforward

${userPrompt}`;
  }

  return `You are a professional translator from ${fromLang} to ${toLang}.
Follow these rules strictly:
1. Translate the text naturally into ${toLang}
2. Present the output exactly in this format:
   TRANSLATION: [Your ${toLang} translation]
   CONTEXT: [Cultural nuances, idioms, or important context - MUST be in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings into ${toLang}
5. You MUST ALWAYS include both TRANSLATION and CONTEXT sections
6. The CONTEXT section MUST explain:
   - Cultural nuances and adaptations (in ${toLang})
   - Idioms and their meanings (in ${toLang})
   - Changes in tone or formality (in ${toLang})
   - Important cultural or social context (in ${toLang})
   - Any potential misunderstandings to avoid (in ${toLang})
7. Never skip the CONTEXT section, even if the translation seems straightforward
8. CRITICAL: The CONTEXT section MUST be written in ${toLang}, not English

${userPrompt}`;
}
