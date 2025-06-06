export const MAX_STORED_MESSAGES = 50;

import type { TranslationMessage } from './types';
import { STORAGE_KEYS } from './constants';
import { isValidLanguageCode, LanguageCode } from './languages';

export function getStoredLanguage(
  key: string,
  fallback: LanguageCode,
): LanguageCode {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored && isValidLanguageCode(stored) ? stored : fallback;
}

export function getStoredAutoSwitch(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTO_SWITCH) === 'true';
}

export function getStoredMessages(): TranslationMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!stored) return [];
  try {
    const messages: TranslationMessage[] = JSON.parse(stored);
    return messages.map((msg) => ({
      ...msg,
      id: msg.id || Math.random().toString(36).substr(2, 9),
    }));
  } catch {
    return [];
  }
}

export function storeMessages(messages: TranslationMessage[]): void {
  if (typeof window === 'undefined') return;
  const limited = messages.slice(-MAX_STORED_MESSAGES);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(limited));
}
