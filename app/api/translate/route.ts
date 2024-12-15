import { NextResponse } from "next/server";
import { translateWithGemini } from "@/lib/gemini";
import { z } from "zod";

export const runtime = 'edge';

// Input validation schema
const TranslationSchema = z.object({
  text: z.string().min(1),
  fromLang: z.string().min(1),
  toLang: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    console.log('Translation request received');
    
    const body = await request.json();

    // Validate input
    const validationResult = TranslationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Invalid request body:', validationResult.error);
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }
    
    const { text, fromLang, toLang } = validationResult.data;

    console.log('Calling translateWithGemini with:', { 
      textLength: text.length, 
      fromLang, 
      toLang 
    });

    const result = await translateWithGemini(text, fromLang, toLang);
    console.log('Translation result:', result);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
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
      stack: error instanceof Error ? error.stack : undefined,
      body: typeof error === 'object' ? error : undefined
    });
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
