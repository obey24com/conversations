import { GeminiTranslationOptions } from './types';
import { isPetLanguage } from '@/lib/languages';

export function generateTranslationPrompt({ text, fromLang, toLang }: GeminiTranslationOptions): string {
  const isPetFrom = isPetLanguage(fromLang);
  const isPetTo = isPetLanguage(toLang);

  const userPrompt = `Translate this text from ${fromLang} to ${toLang}:\n${text}`;

  if (isPetFrom && !isPetTo) {
    return `You are a translator specializing in converting ${fromLang} animal sounds into natural ${toLang} expressions.
Follow these rules:
1. Interpret the ${fromLang}'s sounds considering mood, emotion, and intention
2. Translate into natural, culturally appropriate ${toLang} expressions
3. Format the output exactly as:
   TRANSLATION: [Your natural interpretation in ${toLang}]
4. Focus on conveying the emotional and behavioral meaning, not literal sounds
5. Ensure the translation would make sense to a native ${toLang} speaker

${userPrompt}`;
  }

  if (!isPetFrom && isPetTo) {
    return `You are a translator converting ${fromLang} into authentic ${toLang} animal expressions.
Follow these rules:
1. Convert the meaning into appropriate ${toLang} animal sounds
2. Choose sounds that match the emotional tone and intention
3. Format the output exactly as:
   TRANSLATION: [Natural ${toLang} animal sounds]
4. Make sure the sounds would be recognized by real ${toLang} animals

${userPrompt}`;
  }

  if (isPetFrom && isPetTo) {
    return `You are an expert in both ${fromLang} and ${toLang} animal communication.
Follow these rules:
1. Convert between animal languages preserving emotional meaning
2. Adapt sounds to match the target animal's natural expressions
3. Format the output exactly as:
   TRANSLATION: [Natural ${toLang} animal sounds]
4. Ensure the translation maintains the original intention

${userPrompt}`;
  }

  return `You are a professional translator specializing in natural, culturally-aware translation from ${fromLang} to ${toLang}.
Follow these rules:
1. Translate for meaning and cultural appropriateness, not word-for-word
2. Adapt idioms, expressions, and cultural references to ${toLang} equivalents
3. Maintain the original tone while using natural ${toLang} phrasing
4. Consider cultural differences and adjust accordingly
5. Format the output exactly as:
   TRANSLATION: [Your natural ${toLang} translation]
6. The translation should read as if originally written in ${toLang}
7. Focus on how a native ${toLang} speaker would naturally express this idea

${userPrompt}`;
}
