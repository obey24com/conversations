import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // const audioFile = formData.get("audio") as Blob;

    // if (!audioFile) {
    //   return NextResponse.json(
    //     { error: "Audio file is required" },
    //     { status: 400 }
    //   );
    // }

    const audioFile = formData.get("audio");
    const language = formData.get("language"); // Default to English if language not specified

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Ensure language is a string if provided
    const languageString = typeof language === "string" ? language : undefined;

    // Convert the blob to a File object that OpenAI's API can handle
    // const file = new File([audioFile], 'audio.mp3', { type: 'audio/mp3' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
      // language: languageString,
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error("Speech to text error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Speech to text failed",
      },
      { status: 500 }
    );
  }
}
