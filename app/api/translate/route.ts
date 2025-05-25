import { NextResponse } from "next/server";
import { translateText, isOpenAIConfigured } from "@/lib/openai";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: "OpenAI API is not configured" },
        { status: 503 }
      );
    }

    console.log('Translation request received');

    const body = await request.json();
    console.log('Request body:', body);

    let { text, fromLang, toLang } = body;

    if (!text?.trim()) {
      console.log('Missing text in request');
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!toLang) {
      console.log('Missing target language parameter');
      return NextResponse.json(
        { error: "Target language is required" },
        { status: 400 }
      );
    }

    // Detect language using OpenAI
    const detectionResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a language detection expert. Return ONLY the ISO 639-1 language code (e.g., 'en', 'es', 'fr', etc.) for the given text. Just the code, nothing else."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0,
      max_tokens: 2
    });

    const detectedLang = detectionResponse.choices[0]?.message?.content?.trim().toLowerCase() || 'en';
    fromLang = detectedLang; // Update the source language

    console.log('Calling translateText with:', { textLength: text.length, fromLang, toLang });
    const translation = await translateText(text, fromLang, toLang);

    if (!translation) {
      console.error('Translation returned null or undefined');
      throw new Error('Translation failed - no response received');
    }

    console.log('Translation successful, response length:', translation.length);
    return NextResponse.json({ 
      translation,
      detectedLang: fromLang
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Vary': 'Accept-Language'
      }
    });
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
