"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useState, useRef, useEffect } from 'react';

export interface MessageBubbleProps {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => Promise<void>;
  onDelete: () => void;
}

export function MessageBubble({ 
  text, 
  translation,
  fromLang,
  toLang, 
  cultural, 
  isPlaying, 
  onPlay,
  onDelete
}: MessageBubbleProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    if (bubbleRef.current) {
      bubbleRef.current.style.setProperty('--message-height', `${bubbleRef.current.offsetHeight}px`);
      bubbleRef.current.classList.add('message-bubble-exit');
      
      requestAnimationFrame(() => {
        if (bubbleRef.current) {
          bubbleRef.current.classList.add('message-bubble-exit-active');
        }
      });
    }

    setTimeout(() => {
      onDelete();
    }, 300);
  };

  const handlePlay = async () => {
    if (isLoading || isPlaying) return;
    
    setIsLoading(true);
    try {
      await onPlay();
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        "message-bubble transition-all duration-300 ease-out mb-4",
        isDeleting && "pointer-events-none"
      )}
    >
      <div 
        className={cn(
          "group relative p-8 rounded-2xl w-full max-w-[90%] mx-auto",
          "bg-white border border-gray-100 shadow-sm",
          "hover:shadow-lg transition-shadow duration-200"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-sm hover:shadow-md"
          onClick={handleDelete}
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </Button>

        <p className="text-sm text-gray-500 mb-4">{text}</p>
        <div className="mt-3">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">{translation}</p>
          
          <div className="flex justify-end gap-2 mt-4 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-gray-400 hover:text-gray-600",
                "transition-all duration-200",
                (isLoading || isPlaying) && "bg-gray-50"
              )}
              onClick={handlePlay}
              disabled={isLoading || isPlaying}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className={cn(
                  "h-4 w-4",
                  isPlaying && "animate-pulse text-blue-500"
                )} />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-gray-400 hover:text-gray-600"
              onClick={() => copyToClipboard(translation)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {cultural && (
            <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 italic leading-relaxed">
              {cultural}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
