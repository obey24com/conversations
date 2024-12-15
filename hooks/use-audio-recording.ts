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
  const { toast } = useToast();
  const recorder = createAudioRecorder();

  const startRecording = useCallback(async () => {
    try {
      await recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [recorder, toast]);

  const stopRecording = useCallback(async () => {
    try {
      const audioBlob = await recorder.stop();
      setIsRecording(false);

      const transcribedText = await handleSpeechToText(audioBlob, fromLang, toLang);
      onTranscription(transcribedText);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Error",
        description: "Failed to process speech",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  }, [recorder, fromLang, toLang, onTranscription, toast]);

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
