import { NextResponse } from "next/server";
import { translateText } from "@/lib/openai";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: "Translation service is not properly configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const { text, fromLang, toLang } = body;

    if (!text?.trim() || !fromLang || !toLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const translation = await translateText(text, fromLang, toLang);

    return NextResponse.json({ translation });
  } catch (error) {
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: typeof error === 'object' ? error : undefined
    };
    
    return NextResponse.json(
      { error: errorDetails.message || "Internal server error" },
      { status: 500 }
    );
  }
}
