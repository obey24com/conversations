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
    const sfxCategory = isCat ? "cat" : "dog";
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/2EiwWnXFnvU5JabPnv8n/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioBase64 = await blobToBase64(audioBlob);
    
    return { audio: audioBase64 };
  } catch (error) {
    console.error("ElevenLabs API error:", error);
    return {
      audio: "",
      error: error instanceof Error ? error.message : "Failed to generate sound effect",
    };
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
