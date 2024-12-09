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
    // Determine if it's a cat or dog sound
    const isCat = text.toLowerCase().includes("meow") || text.toLowerCase().includes("purr");
    
    // Use different voice IDs for cat and dog sounds
    const voiceId = isCat ? "ThT5KcBeYPX3keUQqHPh" : "VR6AewLTigWG4xSOukaG";
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.30,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API error: ${response.statusText} ${JSON.stringify(errorData)}`);
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
