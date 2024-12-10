import { NextResponse } from "next/server";
import { translateText } from "@/lib/openai";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    console.log('Translation request received');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { text, fromLang, toLang } = body;

    if (!text?.trim()) {
      console.log('Missing text in request');
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!fromLang || !toLang) {
      console.log('Missing language parameters:', { fromLang, toLang });
      return NextResponse.json(
        { error: "Source and target languages are required" },
        { status: 400 }
      );
    }

    console.log('Calling translateText with:', { textLength: text.length, fromLang, toLang });
    const translation = await translateText(text, fromLang, toLang);

    if (!translation) {
      console.error('Translation returned null or undefined');
      throw new Error('Translation failed - no response received');
    }

    console.log('Translation successful, response length:', translation.length);
    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation route error:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
