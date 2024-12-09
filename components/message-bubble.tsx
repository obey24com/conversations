"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface MessageBubbleProps {
  text: string;
  translation: string;
  fromLang: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
}

export function MessageBubble({ 
  text, 
  translation, 
  fromLang,
  cultural, 
  isPlaying, 
  onPlay,
  onDelete 
}: MessageBubbleProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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
    // Wait for animation to complete before actual deletion
    setTimeout(() => {
      onDelete();
    }, 300); // Match this with CSS transition duration
  };

  return (
    <div className={cn(
      "w-full flex justify-center mb-4",
      "opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]",
      isDeleting && "animate-[fadeOut_0.3s_ease-out_forwards]"
    )}>
      <div className={cn(
        "group p-6 rounded-2xl w-[85%] max-w-2xl shadow-lg relative",
        "bg-white border border-gray-100",
        "transform translate-y-4 animate-[slideUp_0.5s_ease-out_forwards]",
        "hover:shadow-xl transition-all duration-300",
        isDeleting && "transform scale-95 opacity-0 transition-all duration-300"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          onClick={handleDelete}
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </Button>

        <p className="text-sm text-gray-500 mb-3">{text}</p>
        <div className="mt-2 space-y-3">
          <p className="text-lg font-medium text-gray-900">{translation}</p>
          
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-gray-100 transition-colors duration-200",
                isPlaying && "text-blue-600"
              )}
              onClick={onPlay}
            >
              <Volume2 className={cn(
                "h-4 w-4 mr-2",
                isPlaying && "animate-[pulse_1.5s_ease-in-out_infinite]"
              )} />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 transition-colors duration-200"
              onClick={() => copyToClipboard(translation)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          {cultural && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 italic">
                {cultural}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
