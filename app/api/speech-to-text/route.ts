import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language");
    const headersList = headers();
    const contentType = headersList.get("content-type") || "";

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Handle pet languages with simple responses
    if (typeof language === "string" && isPetLanguage(language)) {
      const petSounds = language === "cat" ? "meow meow!" : "woof woof!";
      return NextResponse.json({ text: petSounds });
    }

    // Validate audio file type
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
      language: typeof language === "string" ? language : undefined,
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error("Speech to text error:", error);
    return NextResponse.json(
      {
        error: "Failed to process audio",
      },
      { status: 500 }
    );
  }
}
