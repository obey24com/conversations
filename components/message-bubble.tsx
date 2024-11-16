"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MessageBubbleProps {
  text: string;
  translation: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => void;
}

export function MessageBubble({ text, translation, cultural, isPlaying, onPlay }: MessageBubbleProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    });
  };

  return (
    <div className="w-full flex justify-center mb-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <div className={cn(
        "p-6 rounded-2xl w-[85%] max-w-2xl shadow-lg",
        "bg-white border border-gray-100",
        "transform translate-y-4 animate-[slideUp_0.5s_ease-out_forwards]",
        "hover:shadow-xl transition-shadow duration-300"
      )}>
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
