import { NextResponse } from "next/server";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB

export function validateAudioRequest(
  contentType: string | null,
  audioFile: unknown,
  language: string
): NextResponse | null {
  // Validate content type
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type. Expected multipart/form-data" },
      { status: 400 }
    );
  }

  // Validate audio file
  if (!audioFile || !(audioFile instanceof Blob)) {
    console.error("Invalid or missing audio file");
    return NextResponse.json(
      { error: "Audio file is required and must be a Blob" },
      { status: 400 }
    );
  }

  // Validate file size
  if (audioFile.size > MAX_AUDIO_SIZE) {
    return NextResponse.json(
      { error: "Audio file size exceeds 25MB limit" },
      { status: 400 }
    );
  }

  return null;
}
