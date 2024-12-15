"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Message } from "@/lib/types";

const STORAGE_KEYS = {
  FROM_LANG: "ulocat-from-lang",
  TO_LANG: "ulocat-to-lang",
  MESSAGES: "ulocat-messages",
} as const;

export function useTranslationState() {
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
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

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleSwapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
  };

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
  };
}
