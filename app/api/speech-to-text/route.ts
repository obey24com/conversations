import { NextResponse } from "next/server";
import { validateAudioRequest } from "@/lib/audio/validation";
import { transcribeAudio } from "@/lib/audio/transcription";

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language");

    console.log("Received audio file:", {
      exists: !!audioFile,
      type: audioFile instanceof Blob ? audioFile.type : typeof audioFile,
      size: audioFile instanceof Blob ? audioFile.size : 0
    });

    // Validate request
    const validationError = validateAudioRequest(
      request.headers.get("content-type"),
      audioFile,
      typeof language === "string" ? language : "en"
    );

    if (validationError) {
      return validationError;
    }

    // At this point we know audioFile is a Blob
    return transcribeAudio(
      audioFile as Blob,
      typeof language === "string" ? language : "en"
    );
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
