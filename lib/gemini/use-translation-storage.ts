"use client";

import { useState, useEffect } from 'react';
import type { Message } from '@/lib/types';

const STORAGE_KEYS = {
  FROM_LANG: "ulocat-from-lang",
  TO_LANG: "ulocat-to-lang",
  MESSAGES: "ulocat-messages",
  AUTO_SWITCH: "ulocat-auto-switch",
} as const;

const MAX_STORED_MESSAGES = 50;

export function useTranslationStorage() {
  const [storedMessages, setStoredMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        if (stored) {
          const messages = JSON.parse(stored);
          setStoredMessages(messages.slice(-MAX_STORED_MESSAGES));
        }
      } catch (error) {
        console.error('Error loading stored messages:', error);
      }
    };

    loadMessages();
  }, []);

  const saveMessages = (messages: Message[]) => {
    try {
      const recentMessages = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(recentMessages));
      setStoredMessages(recentMessages);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const getStoredLanguage = (key: keyof typeof STORAGE_KEYS, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
  };

  const setStoredLanguage = (key: keyof typeof STORAGE_KEYS, value: string) => {
    localStorage.setItem(key, value);
  };

  return {
    storedMessages,
    saveMessages,
    getStoredLanguage,
    setStoredLanguage,
  };
}
