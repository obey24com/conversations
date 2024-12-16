"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { handleSpeechToText } from "@/lib/audio/speech-to-text";

export function useAudioRecording(
  fromLang: string,
  toLang: string,
  onTranscription: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          sampleSize: 16,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
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

  const stopRecording = useCallback(async () => {
    try {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      // Process the recorded audio after stopping
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      handleSpeechToText(audioBlob, fromLang, toLang)
        .then(transcribedText => {
          if (transcribedText) {
            onTranscription(transcribedText);
          }
        })
        .catch(error => {
          console.error("Error processing speech:", error);
          toast({
            title: "Error",
            description: "Failed to process speech",
            variant: "destructive",
          });
        });
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording, fromLang, toLang, onTranscription, toast]);

  return {
    isRecording,
    toggleRecording,
  };
}
