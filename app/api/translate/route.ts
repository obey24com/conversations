import { NextResponse } from "next/server";
import { translateWithGemini } from "@/lib/gemini";
import { headers } from "next/headers";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    console.log('Request headers:', Object.fromEntries(headersList.entries()));
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: "Translation service is not properly configured" },
        { status: 500 }
      );
    }

    console.log('Translation request received');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { text, fromLang, toLang } = body;

    if (!text?.trim() || !fromLang || !toLang) {
      console.error('Missing required parameters:', { text, fromLang, toLang });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log('Calling translateWithGemini with:', { 
      textLength: text.length, 
      fromLang, 
      toLang 
    });

    const result = await translateWithGemini(text, fromLang, toLang);
    console.log('Translation result:', {
      hasError: !!result.error,
      translationLength: result.translation?.length,
      contextLength: result.context?.length
    });

    if (result.error) {
      console.error('Translation error:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Format the response to match the existing format
    const response = result.context
      ? `TRANSLATION: ${result.translation}\nCONTEXT: ${result.context}`
      : `TRANSLATION: ${result.translation}`;
    
    console.log('Translation successful, response length:', response.length);
    return NextResponse.json({ translation: response });
  } catch (error) {
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: typeof error === 'object' ? error : undefined
    };
    console.error("Translation route error:", errorDetails);
    
    return NextResponse.json(
      { error: errorDetails.message || "Internal server error" },
      { status: 500 }
    );
  }
}
