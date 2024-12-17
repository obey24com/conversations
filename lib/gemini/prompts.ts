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
1. Interpret the ${fromLang}'s sounds or body language accurately and naturally
2. Present the output exactly in this format:
   TRANSLATION: [Your interpretation in ${toLang}]
   CONTEXT: [Cultural or behavioral context in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings into ${toLang}
5. ALWAYS include both TRANSLATION and CONTEXT sections
6. In CONTEXT, explain:
   - The animal's mood and emotional state
   - Behavioral cues and body language
   - Cultural significance if applicable

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
5. ALWAYS include both TRANSLATION and CONTEXT sections
6. In CONTEXT, explain:
   - Why these specific sounds were chosen
   - The emotional tone they convey
   - How they match the original meaning

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
5. ALWAYS include both TRANSLATION and CONTEXT sections
6. In CONTEXT, explain:
   - How the meaning was preserved
   - Any adjustments made for cultural differences
   - The emotional equivalence between languages

${userPrompt}`;
  }

  return `You are a professional translator from ${fromLang} to ${toLang}.
Follow these rules strictly:
1. Translate the text naturally as if it was originally written in ${toLang}
2. Present the output exactly in this format:
   TRANSLATION: [Your ${toLang} translation]
   CONTEXT: [Cultural nuances, idioms, or important context in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings into ${toLang}
5. ALWAYS include both TRANSLATION and CONTEXT sections
6. In CONTEXT, explain:
   - Cultural nuances and adaptations
   - Idioms and their meanings
   - Changes in tone or formality
   - Important cultural or social context
   - Any potential misunderstandings to avoid

${userPrompt}`;
}
