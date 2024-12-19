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
  context,
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
          "hover:shadow-lg transition-shadow duration-200",
          "pr-16 md:pr-20" // Add padding for buttons
        )}
      >
        {/* Mobile buttons - always visible at top */}
        <div className="md:hidden absolute -top-2 left-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md transition-all duration-500 backdrop-blur-sm"
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4 transition-transform duration-500",
              isPlaying && "text-blue-500 animate-[wave_2s_ease-in-out_infinite]"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md backdrop-blur-sm"
            onClick={() => copyToClipboard(translation)}
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        {/* Desktop buttons - right side, always visible */}
        <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4 transition-transform duration-500",
              isPlaying && "text-blue-500 animate-[wave_2s_ease-in-out_infinite]",
              "hover:scale-110"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            onClick={() => copyToClipboard(translation)}
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 hover:scale-110" />
          </Button>
        </div>

        {/* Close button - top right, visible on hover for desktop */}
        <div className={cn(
          "absolute -top-2 right-2",
          "md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md backdrop-blur-sm"
            onClick={handleDelete}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">{text}</p>
        <div className="mt-3">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">{translation}</p>

          {context && (
            <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 italic leading-relaxed">
              {context}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
