"use client";

export async function handleSpeechToText(
  audioBlob: Blob,
  fromLang: string,
  toLang: string
): Promise<string | undefined> {
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
    return data.text?.trim();
  } catch (error) {
    console.error("Speech to text error:", error);
    throw error;
  }
}
