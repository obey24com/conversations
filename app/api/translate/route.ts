import { NextResponse } from "next/server";
import { translateText } from "@/lib/openai";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, fromLang, toLang } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!fromLang || !toLang) {
      return NextResponse.json(
        { error: "Source and target languages are required" },
        { status: 400 }
      );
    }

    const translation = await translateText(text, fromLang, toLang);

    if (!translation) {
      throw new Error('Translation failed');
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
