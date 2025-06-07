"use client";

import { useMemo, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import type { TranslationMessage } from "@/lib/types";

interface MessageListProps {
  messages: TranslationMessage[];
  totalCount: number;
  isPlaying: number | null;
  onPlay: (text: string, index: number, targetLang: string) => void;
  onDelete: (id: string) => void;
}

export function MessageList({
  messages,
  totalCount,
  isPlaying,
  onPlay,
  onDelete,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // If no messages, show centered welcome state
  if (messages.length === 0) {
    return (
      <div className="relative flex-1 overflow-y-auto">
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 opacity-60 px-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🌍</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Start translating</h2>
            <p className="text-gray-500 max-w-md">
              Type, speak, or upload an image to begin your translation journey
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If there's only one message total (not just displayed), center it
  if (totalCount === 1 && messages.length === 1) {
    return (
      <div className="relative flex-1 overflow-y-auto">
        <div className="flex h-full items-center justify-center min-h-[60vh] px-4">
          <div className="w-full max-w-4xl">
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
    );
  }

  // For multiple messages total OR when showing latest of many, show normal layout
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
