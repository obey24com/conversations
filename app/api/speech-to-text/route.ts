import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language") || "en";

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    const languageString = typeof language === "string" ? language : "en";

    // Special handling for pet languages
    if (languageString && isPetLanguage(languageString)) {
      try {
        const duration = 2; // Default duration for pet sounds
        
        // Generate pet sounds based on duration
        let petSounds = "";
        if (languageString === "cat") {
          // Longer meows for longer recordings
          petSounds = "m" + "e".repeat(Math.floor(duration)) + "ow" + 
                     "!".repeat(Math.floor(duration / 2));
        } else if (languageString === "dog") {
          // Mix of barks and woofs for longer recordings
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
        // Fallback to simple pet sounds if audio processing fails
        const defaultSound = languageString === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }
    }

    // Regular language transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
      language: languageString,
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
