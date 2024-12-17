import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";
import { headers } from "next/headers";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "Speech to text service is not properly configured" },
        { status: 500 }
      );
    }

    // Get content type header
    const headersList = headers();
    const contentType = headersList.get("content-type");
    
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language") as string;

    if (!audioFile || !(audioFile instanceof Blob)) {
      console.error("Invalid or missing audio file");
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Validate audio file size
    const maxSize = 25 * 1024 * 1024; // 25MB limit
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "Audio file size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    try {
      // Handle pet languages with predefined responses
      if (isPetLanguage(language)) {
        const defaultSound = language === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }

      // Regular language transcription
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "text",
        language: language,
      });

      if (!transcription) {
        throw new Error("No transcription received from OpenAI");
      }

      return NextResponse.json({ text: transcription });
    } catch (error) {
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to process audio" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Speech to text error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
