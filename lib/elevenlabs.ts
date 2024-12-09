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
    // Use the "sound effects" voice ID for pet sounds
    const voiceId = "2EiwWnXFnvU5JabPnv8n"; // Sound effects voice ID
    
    // First, generate the sound effect using the Sound Effects API
    const sfxResponse = await fetch(
      "https://api.elevenlabs.io/v1/sound-effects/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          sfx_category: text.toLowerCase().includes("meow") ? "cat" : "dog",
          seed: Math.floor(Math.random() * 100000), // Random seed for variation
        }),
      }
    );

    if (!sfxResponse.ok) {
      throw new Error(`ElevenLabs API error: ${sfxResponse.statusText}`);
    }

    const audioBlob = await sfxResponse.blob();
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
