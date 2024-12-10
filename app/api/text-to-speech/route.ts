import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
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

    // Handle pet sounds using ElevenLabs
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
      } catch (error) {
        console.error("ElevenLabs error:", error);
        return NextResponse.json(
          { error: "Failed to generate pet sound" },
          { status: 500 }
        );
      }
    }

    // Use OpenAI for regular text-to-speech
    try {
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
      console.error("OpenAI text to speech error:", error);
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Text to speech error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Text to speech failed" },
      { status: 500 }
    );
  }
}
