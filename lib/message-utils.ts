import type { TranslationMessage } from './types';

export function createMessage({
  text,
  translation,
  fromLang,
  toLang,
  cultural,
}: {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
}): TranslationMessage {
  return {
    id: Math.random().toString(36).substr(2, 9),
    text,
    translation: translation.trim(),
    cultural: cultural?.trim() || undefined,
    fromLang,
    toLang,
    timestamp: Date.now(),
  };
}
