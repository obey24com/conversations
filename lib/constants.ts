import { NextResponse } from "next/server";
import { textToSpeech } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";
import { generatePetSound } from "@/lib/elevenlabs"; 

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, toLang } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Handle pet languages with ElevenLabs
    if (isPetLanguage(toLang)) {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        throw new Error("ElevenLabs API key is required for pet sounds");
      }

      const result = await generatePetSound(
        text,
        toLang as 'cat' | 'dog',
        apiKey
      );

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
    const audioBuffer = await textToSpeech(text);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
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
