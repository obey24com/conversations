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
    // Adjust the text for better sound generation
    const soundText = text.toLowerCase().trim();
    
    // Configure the sound effect parameters based on the type of sound
    const duration = soundText.includes("meow") ? 1.0 : 0.8; // Cats slightly longer than dogs
    const influence = soundText.includes("meow") ? 0.7 : 0.5; // More variation for cats

    const response = await fetch(
      "https://api.elevenlabs.io/v2/text-to-speech/sound-effects",
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: soundText,
          duration_seconds: duration,
          prompt_influence: influence,
          style: soundText.includes("meow") ? "soft" : "energetic"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error("Received empty audio buffer from ElevenLabs API");
    }

    return { audio: audioBuffer };

  } catch (error) {
    console.error("ElevenLabs API error:", error);
    return {
      audio: new ArrayBuffer(0),
      error: error instanceof Error ? error.message : "Failed to generate sound effect"
    };
  }
}
