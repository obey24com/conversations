"use client";

import { Mic, Square } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface AudioControlsProps {
  isRecording: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export const AudioControls = forwardRef<HTMLAudioElement, AudioControlsProps>(
  function AudioControls({ isRecording, isLoading, onToggle }, ref) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className={cn(
            'shrink-0 transition-colors duration-200',
            isRecording && 'bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600',
          )}
          disabled={isLoading}
        >
          {isRecording ? (
            <Square className="h-4 w-4 fill-white text-white" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <audio ref={ref} className="hidden" />
      </>
    );
  },
);
