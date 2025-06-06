"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';
import { MessageBubble } from './message-bubble';
import { cn } from '@/lib/utils';
import type { TranslationMessage } from '@/lib/types';

interface MessageListProps {
  messages: TranslationMessage[];
  isPlaying: number | null;
  onPlay: (text: string, index: number, targetLang: string) => void;
  onDelete: (id: string) => void;
}

export function MessageList({ messages, isPlaying, onPlay, onDelete }: MessageListProps) {
  const [showPrevious, setShowPrevious] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 pt-20 flex flex-col items-center">
        {reversedMessages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="mb-2 mt-1 h-8 w-8 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white/95 backdrop-blur-sm"
            onClick={() => setShowPrevious(!showPrevious)}
          >
            <ChevronUp
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                showPrevious && 'rotate-180',
              )}
            />
          </Button>
        )}

        <div className="w-full">
          {showPrevious &&
            reversedMessages.slice(1).map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'w-full transition-all duration-300',
                  'opacity-0 translate-y-4',
                  showPrevious && 'opacity-100 translate-y-0',
                )}
              >
                <MessageBubble
                  text={message.text}
                  translation={message.translation}
                  phonetic={message.phonetic}
                  fromLang={message.fromLang}
                  toLang={message.toLang}
                  cultural={message.cultural}
                  isPlaying={isPlaying === index + 1}
                  onPlay={() => onPlay(message.translation, index + 1, message.toLang)}
                  onDelete={() => onDelete(message.id)}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-8 mt-4">
        <div ref={messagesEndRef} />
        {reversedMessages[0] && (
          <div className="w-full">
            <MessageBubble
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
        )}
      </div>
    </div>
  );
}
