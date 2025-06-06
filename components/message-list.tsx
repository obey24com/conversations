"use client";

import { useMemo, useRef, useEffect } from 'react';
import { MessageBubble } from './message-bubble';
import type { TranslationMessage } from '@/lib/types';

interface MessageListProps {
  messages: TranslationMessage[];
  isPlaying: number | null;
  onPlay: (text: string, index: number, targetLang: string) => void;
  onDelete: (id: string) => void;
}

export function MessageList({ messages, isPlaying, onPlay, onDelete }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

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
