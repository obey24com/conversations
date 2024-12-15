import { NextResponse } from "next/server";
import { translateWithGemini } from "@/lib/gemini";

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

    console.log('Calling translateWithGemini with:', { 
      textLength: text.length, 
      fromLang, 
      toLang 
    });

    const result = await translateWithGemini(text, fromLang, toLang);

    if (result.error) {
      throw new Error(result.error);
    }

    // Format the response to match the existing format
    const response = result.context
      ? `TRANSLATION: ${result.translation}\nCONTEXT: ${result.context}`
      : `TRANSLATION: ${result.translation}`;

    console.log('Translation successful, response length:', response.length);
    return NextResponse.json({ translation: response });
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
