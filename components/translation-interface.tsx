"use client";

import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useAudioHandling } from "@/hooks/use-audio-handling";
import { useScrollHandling } from "@/hooks/use-scroll-handling";
import { useAudioRecording } from "@/hooks/use-audio-recording";
import { MessageBubble } from "./message-bubble";
import { TranslationControls } from "./translation-controls";

export function TranslationInterface() {
  const {
    messages,
    fromLang,
    toLang,
    inputText,
    isLoading,
    setInputText,
    handleSend,
    handleDeleteMessage,
    handleSwapLanguages,
    setFromLang,
    setToLang,
  } = useTranslation();

  const {
    isPlaying,
    playTranslation,
    audioRef,
  } = useAudioHandling();

  const { messagesEndRef } = useScrollHandling(messages);

  const [mounted, setMounted] = useState(false);
  const [isSwapActive, setIsSwapActive] = useState(false);
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const [swapMessage, setSwapMessage] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  // Initialize audio recording hook
  const { isRecording, toggleRecording } = useAudioRecording(
    fromLang,
    toLang,
    async (transcribedText) => {
      if (transcribedText) {
        try {
          setIsLoading(true);
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: transcribedText,
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
                text: transcribedText,
                translation: translation.replace(/^TRANSLATION:\s*/i, "").trim(),
                context: context,
                fromLang,
                toLang,
                timestamp: Date.now(),
              },
            ]);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to translate speech",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 2) {
      setIsSwapActive(prev => !prev);
      setIsSwapActiveFirst(false);
      setSwapMessage(isSwapActive ? "Auto Switch is OFF" : "Auto Switch is ON");
      setTimeout(() => setSwapMessage(""), 3000);
    } else if (event.detail === 1) {
      setIsSwapping(true);
      handleSwapLanguages();
      setTimeout(() => setIsSwapping(false), 300);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden border-b border-gray-200">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Languages className="h-8 w-8 animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-primary/10" />
                <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite_0.5s] rounded-full bg-primary/5" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Translating...</p>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="h-full overflow-y-auto px-4">
          <div className="flex flex-col-reverse space-y-reverse space-y-4 py-8">
            <div ref={messagesEndRef} />
            {[...messages].reverse().map((message, index) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                translation={message.translation}
                fromLang={message.fromLang}
                toLang={message.toLang}
                context={message.context}
                isPlaying={isPlaying === index}
                onPlay={() => playTranslation(message.translation, index, message.toLang)}
                onDelete={() => handleDeleteMessage(message.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <TranslationControls
        fromLang={fromLang}
        toLang={toLang}
        inputText={inputText}
        isLoading={isLoading}
        isRecording={isRecording}
        isSwapping={isSwapping}
        isSwapActive={isSwapActive}
        isSwapActiveFirst={isSwapActiveFirst}
        swapMessage={swapMessage}
        onFromLangChange={setFromLang}
        onToLangChange={setToLang}
        onInputChange={setInputText}
        onSend={handleSend}
        onRecord={toggleRecording}
        onSwap={handleButtonClick}
      />

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
