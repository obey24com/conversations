"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { isPetLanguage } from '@/lib/languages';

interface MessageBubbleProps {
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
    setTimeout(() => {
      onDelete();
    }, 300);
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
        <div className="mt-2">
          <p className="font-medium">{translation}</p>
          
          <div className="flex justify-end gap-1 mt-2 opacity-50 hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-gray-900 hover:bg-transparent"
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
              className="h-8 px-2 text-gray-500 hover:text-gray-900 hover:bg-transparent"
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
