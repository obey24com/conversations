"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useAudioHandling() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 44100,
            sampleSize: 16,
            noiseSuppression: true,
            echoCancellation: true,
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
        console.error("Error accessing microphone:", error);
        toast({
          title: "Error",
          description: "Could not access microphone",
          variant: "destructive",
        });
      }
    }
  };

  const playTranslation = async (text: string, index: number, targetLang: string) => {
    try {
      setIsPlaying(index);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, toLang: targetLang }),
      });

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsPlaying(null);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
      setIsPlaying(null);
    }
  };

  return {
    isRecording,
    isPlaying,
    toggleRecording,
    playTranslation,
    audioRef,
  };
}
