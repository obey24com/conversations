"use client";

import { useToast } from "@/components/ui/use-toast";

export async function handleSpeechToText(
  audioBlob: Blob,
  fromLang: string,
  toLang: string
) {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("language", fromLang);

    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new Error("No transcription received");
    }

    return data.text;
  } catch (error) {
    console.error("Speech to text error:", error);
    throw error;
  }
}
