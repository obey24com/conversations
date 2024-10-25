import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Convert the blob to a File object that OpenAI's API can handle
    const file = new File([audioFile], 'audio.mp3', { type: 'audio/mp3' });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text",
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error("Speech to text error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Speech to text failed" },
      { status: 500 }
    );
  }
}