"use client";

import { getAudioDuration } from "./duration";

export async function handleSpeechToText(
  audioBlob: Blob,
  fromLang: string,
  toLang: string
): Promise<string | undefined> {
  try {
    // Get audio duration on the client side
    const duration = await getAudioDuration(audioBlob);
    
    // Create form data with audio, language, and duration
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("language", fromLang);
    formData.append("duration", String(duration));

    // Send request to speech-to-text endpoint
    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text?.trim();
  } catch (error) {
    console.error("Speech to text error:", error);
    throw error;
  }
}
