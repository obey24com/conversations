"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useState, useRef, useEffect } from 'react';

export interface MessageBubbleProps {
  text: string;
  translation: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
}

export function MessageBubble({ 
  text, 
  translation, 
  cultural, 
  isPlaying, 
  onPlay,
  onDelete
}: MessageBubbleProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      setHeight(bubbleRef.current.offsetHeight);
    }
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
    if (!bubbleRef.current) return;
    
    setIsDeleting(true);
    
    // Set initial height and trigger animation
    if (height) {
      bubbleRef.current.style.height = `${height}px`;
      bubbleRef.current.style.marginBottom = '1rem';
      
      // Force reflow
      bubbleRef.current.offsetHeight;
      
      // Start collapse animation
      requestAnimationFrame(() => {
        if (bubbleRef.current) {
          bubbleRef.current.style.height = '0';
          bubbleRef.current.style.marginBottom = '0';
          bubbleRef.current.style.opacity = '0';
          bubbleRef.current.style.transform = 'translateY(-20px)';
        }
      });
    }

    // Remove element after animation
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        "message-bubble transition-all duration-300 ease-out mb-4",
        isDeleting && "pointer-events-none"
      )}
      style={{
        willChange: 'transform, opacity, height, margin'
      }}
    >
      <div 
        className={cn(
          "group relative p-6 rounded-2xl w-[85%] max-w-2xl mx-auto",
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

        <p className="text-sm text-gray-500 mb-3">{text}</p>
        <div className="mt-2">
          <p className="text-lg font-medium text-gray-900">{translation}</p>
          
          <div className="flex justify-end gap-1 mt-3 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-gray-600"
              onClick={onPlay}
            >
              <Volume2 className={cn(
                "h-4 w-4",
                isPlaying && "animate-pulse"
              )} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-gray-600"
              onClick={() => copyToClipboard(translation)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {cultural && (
            <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 italic">
              {cultural}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
