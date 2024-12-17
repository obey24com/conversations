import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";
import { isPetLanguage } from "@/lib/languages";
import { getAudioDuration } from "./utils";

export async function transcribeAudio(audioFile: Blob, language: string): Promise<NextResponse> {
  try {
    if (isPetLanguage(language)) {
      try {
        const duration = await getAudioDuration(audioFile);
        
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
        // Fallback to simple pet sounds if audio processing fails
        const defaultSound = language === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }
    }
    
    // Create a File object with the required properties
    const file = new File([audioFile], "audio.mp3", {
      type: audioFile.type || "audio/mp3",
      lastModified: Date.now()
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text",
      language: language,
    });

    if (!transcription?.trim()) {
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
