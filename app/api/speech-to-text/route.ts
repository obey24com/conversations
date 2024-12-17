import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;
    const language = formData.get("language") as string;
    const duration = Number(formData.get("duration")) || 1;

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Create a File object from the Blob
    const file = new File([audioFile], "audio.mp3", {
      type: audioFile.type || "audio/mp3",
      lastModified: Date.now()
    });

    // Special handling for pet languages
    if (isPetLanguage(language)) {
      try {
        // Generate pet sounds based on duration
        let petSounds = "";
        if (language === "cat") {
          petSounds = "m" + "e".repeat(Math.floor(duration)) + "ow" + 
                     "!".repeat(Math.floor(duration / 2));
        } else if (language === "dog") {
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
        const defaultSound = language === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }
    }

    // Regular language transcription
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text",
      language,
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
