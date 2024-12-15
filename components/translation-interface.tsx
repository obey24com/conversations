"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, ArrowLeftRight, Square, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useAudioHandling } from "@/hooks/use-audio-handling";
import { useScrollHandling } from "@/hooks/use-scroll-handling";
import { LanguageSelect } from "./language-select";
import { MessageBubble } from "./message-bubble";

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
    isRecording,
    isPlaying,
    toggleRecording,
    playTranslation,
    audioRef,
  } = useAudioHandling();

  const { messagesEndRef } = useScrollHandling(messages);

  const [mounted, setMounted] = useState(false);
  const [isSwapActive, setIsSwapActive] = useState(false);
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const [swapMessage, setSwapMessage] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

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
      <div className="relative flex-1 overflow-hidden">
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
                cultural={message.cultural}
                isPlaying={isPlaying === index}
                onPlay={() => playTranslation(message.translation, index, message.toLang)}
                onDelete={() => handleDeleteMessage(message.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="border-t bg-white px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full max-w-5xl space-y-3">
          <div className="flex w-full justify-between gap-2">
            <LanguageSelect
              value={fromLang}
              setValue={setFromLang}
              onValueChange={setFromLang}
            />

            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "relative mx-2 flex items-center justify-center transition-all duration-300",
                  isSwapping && "scale-90 opacity-50",
                  isSwapActiveFirst
                    ? "bg-transparent"
                    : isSwapActive
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white",
                )}
                onClick={handleButtonClick}
              >
                <ArrowLeftRight className={cn(
                  "transition-transform duration-300",
                  isSwapping && "rotate-180"
                )} />
                {swapMessage && (
                  <div className="absolute -top-10 left-1/2 w-[135px] -translate-x-1/2 transform rounded bg-black px-3 py-2 text-xs text-white">
                    {swapMessage}
                  </div>
                )}
              </Button>
            </div>

            <LanguageSelect
              value={toLang}
              setValue={setToLang}
              onValueChange={setToLang}
              align="end"
            />
          </div>

          <div className="flex w-full gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1 text-lg"
              style={{ fontSize: "16px" }}
              disabled={isLoading}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                "shrink-0 transition-colors duration-200",
                isRecording && "border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600"
              )}
              disabled={isLoading}
            >
              {isRecording ? (
                <Square className="h-4 w-4 fill-white text-white" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={cn(
                "shrink-0 transition-all duration-200",
                isLoading && "opacity-70"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
