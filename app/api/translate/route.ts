import { NextResponse } from "next/server";
import { translateText } from "@/lib/openai";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, fromLang, toLang } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const translation = await translateText(text, fromLang, toLang);

    if (!translation) {
      return NextResponse.json({ error: "No translation generated" }, { status: 500 });
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
