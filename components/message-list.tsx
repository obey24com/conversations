"use client";

import { useMemo, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import type { TranslationMessage } from "@/lib/types";

interface MessageListProps {
  messages: TranslationMessage[];
  isPlaying: number | null;
  onPlay: (text: string, index: number, targetLang: string) => void;
  onDelete: (id: string) => void;
}

export function MessageList({
  messages,
  isPlaying,
  onPlay,
  onDelete,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // If no messages, show centered welcome state (except on mobile)
  if (messages.length === 0) {
    return (
      <div className="relative flex-1 overflow-y-auto">
        <div className="flex h-full items-center justify-center md:min-h-[60vh]">
          <div className="mx-auto w-full max-w-5xl px-4 pt-20 md:pt-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-2 opacity-60">
              <h2 className="text-xl font-medium text-gray-700">Start a conversation</h2>
              <p className="text-sm text-gray-500">Type, speak, or upload an image to translate</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's only one message, center it (except on mobile)
  if (messages.length === 1) {
    return (
      <div className="relative flex-1 overflow-y-auto">
        <div className="flex h-full items-center justify-center md:min-h-[60vh]">
          <div className="mx-auto w-full max-w-5xl px-4 pt-20 md:pt-4 flex flex-col items-center justify-center">
            <div className="w-full">
              <MessageBubble
                key={reversedMessages[0].id}
                text={reversedMessages[0].text}
                translation={reversedMessages[0].translation}
                phonetic={reversedMessages[0].phonetic}
                fromLang={reversedMessages[0].fromLang}
                toLang={reversedMessages[0].toLang}
                cultural={reversedMessages[0].cultural}
                isPlaying={isPlaying === 0}
                onPlay={() => onPlay(reversedMessages[0].translation, 0, reversedMessages[0].toLang)}
                onDelete={() => onDelete(reversedMessages[0].id)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For multiple messages, show normal scrollable list
  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 pt-20 flex flex-col items-center">
        <div className="w-full space-y-4">
          {reversedMessages.map((message, index) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              translation={message.translation}
              phonetic={message.phonetic}
              fromLang={message.fromLang}
              toLang={message.toLang}
              cultural={message.cultural}
              isPlaying={isPlaying === index}
              onPlay={() => onPlay(message.translation, index, message.toLang)}
              onDelete={() => onDelete(message.id)}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
