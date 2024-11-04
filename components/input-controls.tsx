"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputControlsProps {
  inputText: string;
  isLoading: boolean;
  isRecording: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onRecord: () => void;
}

export function InputControls({
  inputText,
  isLoading,
  isRecording,
  onInputChange,
  onSend,
  onRecord
}: InputControlsProps) {
  return (
    <div className="flex gap-2 w-full">
      <Input
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder=" Speak naturally and let ULOCAT translate it for you ..."
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
        className="flex-1"
        disabled={isLoading}
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRecord}
        className={cn(
          "shrink-0 transition-colors duration-200",
          isRecording && "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white"
        )}
        disabled={isLoading}
      >
        <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
      </Button>
      
      <Button 
        onClick={onSend} 
        disabled={!inputText.trim() || isLoading}
        className={cn(
          "shrink-0 transition-all duration-200",
          isLoading && "opacity-70"
        )}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
