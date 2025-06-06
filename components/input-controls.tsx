"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputControlsProps {
  inputText: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function InputControls({
  inputText,
  isLoading,
  onInputChange,
  onSend,
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
