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
5. Always include both TRANSLATION and CONTEXT sections
6. For cultural context, explain the animal's mood, intention, or behavior

${userPrompt}`;
  }

  if (!isPetFrom && isPetTo) {
    return `You are a translator converting human language (${fromLang}) into ${toLang} animal sounds.
Follow these rules strictly:
1. Convert the text into appropriate ${toLang} sounds/expressions
2. Present the output exactly in this format:
   TRANSLATION: [${toLang} animal sounds]
   CONTEXT: [Explanation of the sounds' meaning in ${fromLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings
5. Always include both TRANSLATION and CONTEXT sections
6. Make the animal sounds natural and appropriate for the context

${userPrompt}`;
  }

  if (isPetFrom && isPetTo) {
    return `You are an expert translator fluent in both ${fromLang} and ${toLang} animal languages.
Follow these rules strictly:
1. Convert the animal sounds while preserving their meaning
2. Present the output exactly in this format:
   TRANSLATION: [${toLang} animal sounds]
   CONTEXT: [Explanation of the translation in simple terms]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings
5. Always include both TRANSLATION and CONTEXT sections
6. Ensure the translated sounds convey the same emotion/intention

${userPrompt}`;
  }

  return `You are a professional translator from ${fromLang} to ${toLang}.
Follow these rules strictly:
1. Translate naturally as if the text was originally written in ${toLang}
2. Present the output exactly in this format:
   TRANSLATION: [Your ${toLang} translation]
   CONTEXT: [Cultural nuances, idioms, or important context in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English
4. Only translate the text after these headings into ${toLang}
5. Always include both TRANSLATION and CONTEXT sections
6. Preserve tone, formality, and cultural context
7. For idioms or cultural references, explain their meaning in the CONTEXT section

${userPrompt}`;
}
