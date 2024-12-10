import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";
import { generateSoundEffect } from "@/lib/elevenlabs";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, toLang } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if we're translating to a pet language
    if (isPetLanguage(toLang)) {
      // Extract the first word for the sound effect (e.g., "meow" or "woof")
      const firstSound = text.split(/[,!\s]+/)[0].toLowerCase();
      
      // Generate appropriate pet sound based on language
      let soundToGenerate = firstSound;
      if (toLang === "cat" && !firstSound.includes("meow")) {
        soundToGenerate = "meow";
      } else if (toLang === "dog" && !firstSound.includes("woof") && !firstSound.includes("bark")) {
        soundToGenerate = "woof";
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("ElevenLabs API key is missing");
      }

      const result = await generateSoundEffect(soundToGenerate, true, apiKey);
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.audio || result.audio.byteLength === 0) {
        throw new Error("No audio data received");
      }

      return new Response(result.audio, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': result.audio.byteLength.toString(),
        },
      });
    }

    // Use OpenAI for regular text-to-speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const audioData = await mp3.arrayBuffer();

    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Text to speech error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Text to speech failed" },
      { status: 500 }
    );
  }
}
