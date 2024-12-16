"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createAudioRecorder, type AudioRecorder } from "@/lib/audio/recorder";
import { handleSpeechToText } from "@/lib/audio/speech-to-text"; 

export function useAudioRecording(
  fromLang: string,
  toLang: string,
  onTranscription: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const isProcessingRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    recorderRef.current = createAudioRecorder();
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (isRecording || !recorderRef.current || isProcessingRef.current) {
        console.log('Recording already in progress');
        return;
      }

      await recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone Error",
        description: "Please ensure you've granted microphone permissions and no other app is using it",
        variant: "destructive",
      });
    }
  }, [isRecording, toast]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recorderRef.current || !isRecording || isProcessingRef.current) {
        console.log('No active recording to stop');
        return;
      }

      isProcessingRef.current = true;
      const audioBlob = await recorderRef.current.stop();
      setIsRecording(false);

      const transcribedText = await handleSpeechToText(audioBlob, fromLang, toLang);
      isProcessingRef.current = false;
      onTranscription(transcribedText);
    } catch (error) {
      console.error("Error processing recording:", error);
      isProcessingRef.current = false;
      setIsRecording(false);

      toast({
        title: "Processing Error",
        description: "Failed to process speech. Please try again and speak clearly",
        variant: "destructive",
      });
    }
  }, [fromLang, toLang, onTranscription, toast, isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    toggleRecording,
  };
}
