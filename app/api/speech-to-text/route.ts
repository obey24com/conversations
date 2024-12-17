import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateAudioRequest } from "@/lib/audio/validation";
import { transcribeAudio } from "@/lib/audio/transcription";
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

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      console.error("Invalid or missing audio file");
      return NextResponse.json(
        { error: "Speech to text service is not properly configured" },
        { status: 500 }
      );
    }

    // Get content type header
    const headersList = headers();
    const contentType = headersList.get("content-type");

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language") as string;

    // Validate request
    const validationError = validateAudioRequest(contentType, audioFile, language);
    if (validationError) {
      return validationError;
    }

    // Process audio
    return await transcribeAudio(audioFile as Blob, language);
  } catch (error) {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : 'Unknown error';
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
