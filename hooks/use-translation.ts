"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Message } from "@/lib/types";
import { useEffect } from "react";

const STORAGE_KEYS = {
  FROM_LANG: "ulocat-from-lang",
  TO_LANG: "ulocat-to-lang",
  MESSAGES: "ulocat-messages",
} as const;

const MAX_STORED_MESSAGES = 50;

function getStoredLanguage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
}

function loadStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!stored) return [];
    const messages = JSON.parse(stored);
    return Array.isArray(messages) ? messages.slice(-MAX_STORED_MESSAGES) : [];
  } catch (error) {
    console.error('Error loading stored messages:', error);
    return [];
  }
}

function saveMessages(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    const recentMessages = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(recentMessages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export function useTranslation() {
  const [fromLang, setFromLang] = useState(() => 
    getStoredLanguage(STORAGE_KEYS.FROM_LANG, "en")
  );
  const [toLang, setToLang] = useState(() => 
    getStoredLanguage(STORAGE_KEYS.TO_LANG, "es")
  );
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => loadStoredMessages());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setLoadingState = useCallback((state: boolean) => {
    setIsLoading(state);
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Load messages on mount
  useEffect(() => {
    setMessages(loadStoredMessages());
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          fromLang,
          toLang,
        }),
      });

      const data = await response.json();

      if (data.translation) {
        const translationMatch = data.translation.match(/TRANSLATION:\s*([\s\S]*?)(?=\s*CONTEXT:|$)/i);
        const contextMatch = data.translation.match(/CONTEXT:\s*([\s\S]*?)$/i);
        
        const translation = translationMatch?.[1]?.trim() || data.translation.trim();
        const context = contextMatch?.[1]?.trim();

        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            text: inputText,
            translation: translation.replace(/^TRANSLATION:\s*/i, "").trim(),
            context: context,
            fromLang,
            toLang,
            timestamp: Date.now(),
          },
        ]);

        setInputText("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  const handleSwapLanguages = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
  }, [fromLang, toLang]);

  const updateFromLang = useCallback((value: string) => {
    setFromLang(value);
    localStorage.setItem(STORAGE_KEYS.FROM_LANG, value);
  }, []);

  const updateToLang = useCallback((value: string) => {
    setToLang(value);
    localStorage.setItem(STORAGE_KEYS.TO_LANG, value);
  }, []);

  return {
    messages,
    fromLang,
    toLang,
    inputText,
    isLoading,
    setInputText,
    handleSend,
    handleDeleteMessage,
    handleSwapLanguages,
    setFromLang: updateFromLang,
    setToLang: updateToLang,
    setMessages,
    setLoadingState,
  };
}
