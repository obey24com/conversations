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
    console.log(`Generating ${petType} sound for text:`, text);

    const response = await fetch(
      "https://api.elevenlabs.io/v1/sound-generation",
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          duration_seconds: 2.0,
          prompt_influence: 0.3
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

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
