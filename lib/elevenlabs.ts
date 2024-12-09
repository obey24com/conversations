export interface ElevenLabsResponse {
  audio: string;
  error?: string;
}

export async function generateSoundEffect(
  text: string,
  isPet: boolean,
  apiKey: string
): Promise<ElevenLabsResponse> {
  if (!isPet) return { audio: "", error: "Not a pet sound" };

  try {
    // Use the correct endpoint for sound effects
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
          // Sound effect settings
          sfx_category: text.toLowerCase().includes("meow") ? "cat" : "dog",
          duration_multiplier: 1.0,
          random_seed: Math.floor(Math.random() * 100000),
          // Optional settings for more variety
          variations: [{
            rate: 1.0,
            pitch: 1.0,
            reverb: 0.1
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API error response:", errorData);
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    return { audio: `data:audio/mpeg;base64,${base64Audio}` };
  } catch (error) {
    console.error("ElevenLabs API error:", error);
    return {
      audio: "",
      error: error instanceof Error ? error.message : "Failed to generate sound effect",
    };
  }
}
