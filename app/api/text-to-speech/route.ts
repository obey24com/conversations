import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";
import { generatePetSound } from "@/lib/elevenlabs";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, toLang } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if we're translating to a pet language
    if (isPetLanguage(toLang)) {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        console.error("ElevenLabs API key is missing");
        return NextResponse.json(
          { error: "ElevenLabs API key is required for pet sounds" },
          { status: 500 }
        );
      }

      try {
        console.log("Generating pet sound for language:", toLang);
        
        // Extract the first sound from the text (e.g., first "meow" or "woof")
        const firstSound = text.split(/[,!\s]+/)[0];
        console.log("Using sound:", firstSound);
        
        const result = await generatePetSound(
          firstSound,
          toLang as 'cat' | 'dog',
          apiKey
        );

        if (result.error) {
          console.error("ElevenLabs error:", result.error);
          throw new Error(result.error);
        }

        if (!result.audio || result.audio.byteLength === 0) {
          throw new Error("No audio data received");
        }

        // Return the audio buffer with proper headers
        return new Response(result.audio, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': result.audio.byteLength.toString(),
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
      } catch (error) {
        console.error("ElevenLabs error:", error);
        return NextResponse.json(
          { error: "Failed to generate pet sound" },
          { status: 500 }
        );
      }
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
