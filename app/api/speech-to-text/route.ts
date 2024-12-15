import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { isPetLanguage } from "@/lib/languages";

export const runtime = "edge";

async function getAudioDuration(audioBlob: Blob): Promise<number> {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.duration;
}

function generatePetSounds(type: string, duration: number): string {
  if (type === "cat") {
    return "m" + "e".repeat(Math.floor(duration)) + "ow" + 
           "!".repeat(Math.floor(duration / 2));
  } else if (type === "dog") {
    const sounds = ["woof", "bark", "ruff"];
    const repetitions = Math.floor(duration);
    return Array(repetitions)
      .fill(null)
      .map(() => sounds[Math.floor(Math.random() * sounds.length)])
      .join(" ") + "!".repeat(Math.floor(duration / 2));
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language") as string;

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required and must be a Blob" },
        { status: 400 }
      );
    }

    // Special handling for pet languages
    if (isPetLanguage(language)) {
      try {
        const duration = await getAudioDuration(audioFile);
        const petSounds = generatePetSounds(language, duration);
        
        if (petSounds) {
          return NextResponse.json({ text: petSounds });
        }
        
        // Fallback to simple pet sounds if generation fails
        const defaultSound = language === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      } catch (error) {
        console.error("Error processing pet audio:", error);
        const defaultSound = language === "cat" ? "meow meow!" : "woof woof!";
        return NextResponse.json({ text: defaultSound });
      }
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
    console.error("Speech to text error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Speech to text failed",
      },
      { status: 500 }
    );
  }
}
