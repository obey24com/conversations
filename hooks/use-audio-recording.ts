"use client";

import { useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createAudioRecorder, type AudioRecorder } from "@/lib/audio/recorder";
import { handleSpeechToText } from "@/lib/audio/speech-to-text"; 

export function useAudioRecording(
  fromLang: string,
  toLang: string,
  onTranscription: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const { toast } = useToast();
  
  // Initialize recorder on first use
  const ensureRecorder = () => {
    if (!recorderRef.current) {
      recorderRef.current = createAudioRecorder();
    }
  };

  const startRecording = useCallback(async () => {
    try {
      if (isRecording || isProcessing || recorderRef.current?.isRecording) {
        console.log('Recording already in progress');
        return;
      }

      ensureRecorder();
      if (!recorderRef.current) {
        throw new Error("Failed to initialize recorder");
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
      setIsRecording(false);
    }
  }, [isRecording, isProcessing, toast]);

  const stopRecording = useCallback(async () => {
    try {
      if (!isRecording || isProcessing || !recorderRef.current) {
        console.log('No active recording to stop');
        return;
      }

      setIsProcessing(true);
      const audioBlob = await recorderRef.current?.stop();
      setIsRecording(false);
      
      // Clean up the recorder
      recorderRef.current.cleanup();
      recorderRef.current = null; // Clear the recorder after stopping

      const transcribedText = await handleSpeechToText(audioBlob, fromLang, toLang);
      setIsProcessing(false);
      onTranscription(transcribedText);
    } catch (error) {
      console.error("Error processing recording:", error);
      setIsProcessing(false);
      setIsRecording(false);

      toast({
        title: "Processing Error",
        description: "Failed to process speech. Please try again and speak clearly",
        variant: "destructive",
      });
    }
  }, [fromLang, toLang, onTranscription, toast, isRecording, isProcessing]);

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
    isProcessing
  };
}
