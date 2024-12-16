"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createAudioRecorder } from "@/lib/audio/recorder";
import { handleSpeechToText } from "@/lib/audio/speech-to-text"; 

export function useAudioRecording(
  fromLang: string,
  toLang: string,
  onTranscription: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const recorder = createAudioRecorder();

  const startRecording = useCallback(async () => {
    try {
      if (isRecording) {
        console.log('Recording already in progress');
        return;
      }

      await recorder.start();
      setIsInitialized(true);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone Error",
        description: "Please ensure you've granted microphone permissions and no other app is using it",
        variant: "destructive",
      });
    }
  }, [recorder, toast]);

  const stopRecording = useCallback(async () => {
    try {
      if (!isInitialized || !isRecording) {
        console.log('No active recording to stop');
        return;
      }
      const audioBlob = await recorder.stop();
      setIsRecording(false);
      setIsInitialized(false);

      const transcribedText = await handleSpeechToText(audioBlob, fromLang, toLang);
      onTranscription(transcribedText);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process speech. Please try again and speak clearly",
        variant: "destructive",
      });
      setIsRecording(false);
      setIsInitialized(false);
    }
  }, [recorder, fromLang, toLang, onTranscription, toast, isInitialized, isRecording]);

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
