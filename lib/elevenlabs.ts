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
    console.log("Generating sound effect for:", text);

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
          duration_seconds: 2.0,
          prompt_influence: 0.3
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    // Get the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error("Received empty audio buffer from ElevenLabs API");
    }

    console.log("Successfully generated sound effect, buffer size:", audioBuffer.byteLength);
    return { audio: audioBuffer };

  } catch (error) {
    console.error("ElevenLabs API error:", error);
    return {
      audio: new ArrayBuffer(0),
      error: error instanceof Error ? error.message : "Failed to generate sound effect"
    };
  }
}
