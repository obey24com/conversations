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
      if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json(
          { error: "ElevenLabs API key is required for pet sounds" },
          { status: 500 }
        );
      }

      try {
        // Generate pet sound effect using ElevenLabs
        const result = await generateSoundEffect(
          text,
          true,
          process.env.ELEVENLABS_API_KEY
        );

        if (result.error) {
          throw new Error(result.error);
        }

        // Convert base64 to binary
        const binaryStr = atob(result.audio.split(',')[1]);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Return the audio data with the correct content type
        return new Response(bytes.buffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
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

    // Get the audio data as an ArrayBuffer
    const audioData = await mp3.arrayBuffer();

    // Return the audio data with the correct content type
    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
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
