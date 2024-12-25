import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";

// Remove edge runtime to allow File API usage
// export const runtime = "edge";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const SUPPORTED_MIME_TYPES = [
  'audio/webm',
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/mpga',
  'audio/m4a',
  'audio/wav'
];

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

    // Validate audio file
    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Audio file size must be less than 25MB" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!SUPPORTED_MIME_TYPES.includes(audioFile.type)) {
      return NextResponse.json(
        { error: `Unsupported audio format. Supported formats: ${SUPPORTED_MIME_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    console.log("Processing audio file:", {
      size: audioFile.size,
      type: audioFile.type,
    });

    const languageString = typeof language === "string" ? language : "en";

    // Special handling for pet languages
    if (languageString && isPetLanguage(languageString)) {
      try {
        const duration = 2;
        let petSounds = "";
        
        if (languageString === "cat") {
          petSounds = "m" + "e".repeat(Math.floor(duration)) + "ow" + 
                     "!".repeat(Math.floor(duration / 2));
        } else if (languageString === "dog") {
          const sounds = ["woof", "bark", "ruff"];
          const repetitions = Math.floor(duration);
          petSounds = Array(repetitions)
            .fill(null)
            .map(() => sounds[Math.floor(Math.random() * sounds.length)])
            .join(" ") + "!".repeat(Math.floor(duration / 2));
        }

        return NextResponse.json({ text: petSounds });
      } catch (error) {
        console.error("Error processing pet audio:", error);
        const defaultSound = languageString === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }
    }

    // Regular language transcription
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "text",
        language: languageString || undefined,
      });

      if (!transcription) {
        throw new Error("No transcription received from OpenAI");
      }
      
      console.log("Transcription received:", transcription);
      return NextResponse.json({ text: transcription });
    } catch (error) {
      console.error("OpenAI transcription error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Transcription failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Speech to text error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Speech to text failed" },
      { status: 500 }
    );
  }
}
