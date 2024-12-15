"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X } from 'lucide-react';
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
  onPlay: () => void;
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
  const [isVisible, setIsVisible] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    if (bubbleRef.current) {
      const height = bubbleRef.current.offsetHeight;
      bubbleRef.current.style.setProperty('--message-height', `${height}px`);
      
      requestAnimationFrame(() => {
        if (bubbleRef.current) {
          bubbleRef.current.style.height = '0px';
          bubbleRef.current.style.marginBottom = '0px';
          bubbleRef.current.style.opacity = '0';
          bubbleRef.current.style.transform = 'translateY(-20px)';
        }
      });
    }

    setTimeout(() => {
      onDelete();
    }, 300);
  };

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        "transition-all duration-300 ease-out mb-4",
        "opacity-0 translate-y-4",
        isVisible && "opacity-100 translate-y-0",
        isDeleting && "pointer-events-none"
      )}
      style={{
        willChange: 'transform, opacity, height, margin',
      }}
    >
      <div 
        className={cn(
          "group relative p-8 rounded-2xl w-full max-w-[90%] mx-auto",
          "bg-white border border-gray-100 shadow-sm",
          "hover:shadow-lg transition-shadow duration-200"
        )}
      >
        <div className="absolute -right-2 -top-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-all duration-500",
              isPlaying 
                ? "text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600"
                : "text-gray-400 hover:text-gray-600 bg-white shadow-sm hover:shadow-md"
            )}
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4 transition-transform duration-500",
              isPlaying && [
                "animate-[wave_2s_ease-in-out_infinite]",
                "relative",
                "after:absolute after:inset-0",
                "after:bg-blue-500/20 after:rounded-full",
                "after:animate-[pulse_2s_ease-in-out_infinite]",
                "before:absolute before:inset-0",
                "before:bg-blue-500/10 before:rounded-full",
                "before:animate-[pulse_2s_ease-in-out_infinite_0.5s]"
              ]
            )} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 bg-white shadow-sm hover:shadow-md"
            onClick={() => copyToClipboard(translation)}
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-600 bg-white shadow-sm hover:shadow-md"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">{text}</p>
        <div className="mt-3">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">{translation}</p>
          
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
