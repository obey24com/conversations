"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Message } from "@/lib/types";

const STORAGE_KEYS = {
  FROM_LANG: "ulocat-from-lang",
  TO_LANG: "ulocat-to-lang",
  MESSAGES: "ulocat-messages",
} as const;

function getStoredLanguage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
}

export function useTranslation() {
  const [fromLang, setFromLang] = useState(() => 
    getStoredLanguage(STORAGE_KEYS.FROM_LANG, "en")
  );
  const [toLang, setToLang] = useState(() => 
    getStoredLanguage(STORAGE_KEYS.TO_LANG, "es")
  );
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        const [translation, ...culturalNotes] = data.translation.split("\nCONTEXT:");

        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            text: inputText,
            translation: translation.replace("TRANSLATION:", "").trim(),
            cultural: culturalNotes.length ? culturalNotes.join("\n").trim() : undefined,
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
  };
}