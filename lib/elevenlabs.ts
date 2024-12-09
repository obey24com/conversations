export interface ElevenLabsResponse {
  audio: ArrayBuffer;
  error?: string;
}

export async function generateSoundEffect(
  text: string,
  isPet: boolean,
  apiKey: string
): Promise<ElevenLabsResponse> {
  if (!isPet) return { audio: new ArrayBuffer(0), error: "Not a pet sound" };

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/sound-effects/generate",
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          duration_seconds: 2,
          prompt_influence: 0.3
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API error response:", errorData);
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    // Get the audio data as ArrayBuffer directly
    const audioBuffer = await response.arrayBuffer();
    return { audio: audioBuffer };

  } catch (error) {
    console.error("ElevenLabs API error:", error);
    return {
      audio: new ArrayBuffer(0),
      error: error instanceof Error ? error.message : "Failed to generate sound effect"
    };
  }
}
