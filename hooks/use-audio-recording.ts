"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useAudioRecording(
  fromLang: string,
  toLang: string,
  onTranscription: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("language", fromLang);

      console.log("Sending audio:", {
        size: audioBlob.size,
        type: audioBlob.type,
        language: fromLang
      });

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.text) {
        onTranscription(data.text);
      }
    } catch (error) {
      console.error("Speech to text error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process speech",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || 'audio/webm'
      });
      handleSpeechToText(audioBlob);
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    toggleRecording,
  };
}
