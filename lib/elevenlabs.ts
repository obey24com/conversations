export interface ElevenLabsResponse {
  audio: ArrayBuffer;
  error?: string;
}

export async function generatePetSound(
  text: string,
  petType: 'cat' | 'dog',
  apiKey: string
): Promise<ElevenLabsResponse> {
  try {
    // Adjust the text for better sound generation
    const soundText = text.toLowerCase().trim();
    
    // Configure the sound effect parameters based on the type of sound
    const isCat = petType === 'cat';
    const duration = isCat ? 1.0 : 0.8; // Cats slightly longer than dogs
    const influence = isCat ? 0.7 : 0.5; // More variation for cats

    // Use the correct endpoint for sound effects
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/sound-effects",
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
          style: isCat ? "soft" : "energetic"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error response:", errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
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
