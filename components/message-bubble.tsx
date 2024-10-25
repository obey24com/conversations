"use client";

import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  text: string;
  translation: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => void;
}

export function MessageBubble({ text, translation, cultural, isPlaying, onPlay }: MessageBubbleProps) {
  return (
    <div className="w-full flex justify-center mb-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <div className={cn(
        "p-4 rounded-lg w-[85%] max-w-2xl",
        "bg-primary/90 text-primary-foreground",
        "transform translate-y-4 animate-[slideUp_0.5s_ease-out_forwards]"
      )}>
        <p className="text-sm opacity-70">{text}</p>
        <div className="mt-2 flex items-start gap-2">
          <p className="font-medium flex-1">{translation}</p>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4",
              isPlaying && "animate-pulse"
            )} />
          </Button>
        </div>
        {cultural && (
          <p className="mt-2 text-sm opacity-70 border-t border-primary-foreground/20 pt-2">
            {cultural}
          </p>
        )}
      </div>
    </div>
  );
}