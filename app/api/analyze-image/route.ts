import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { translateText } from "@/lib/openai"; 

const SYSTEM_PROMPT = `You are a precise text extractor. Your task is to:
1. Extract text EXACTLY as it appears in the image
2. Preserve ALL formatting:
   - Maintain exact numbering (1., 2., etc.)
   - Keep bullet points (•, -, *, etc.)
   - Preserve paragraph breaks
   - Maintain indentation
   - Keep any special characters
3. Do not add or remove any formatting
4. Do not interpret or modify the text
5. If there are multiple sections, maintain their exact layout
6. For lists, keep the original structure and spacing
7. Detect and specify the language of the text`;

export async function POST(request: Request) {
  try {
    const { image, toLang } = await request.json();

    if (!image || !toLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Analyze image with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
          {
            type: "image_url",
            image_url: {
              url: image,
              detail: "high"
            }
          },
          {
            type: "text",
            text: "Extract and format ALL text from this image, preserving exact structure and formatting."
          }
          ]
        },
      ],
      temperature: 0,
      max_tokens: 1000
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Failed to analyze image");
    }

    // Detect language using OpenAI
    const langResponse = await openai.chat.completions.create({
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

    const detectedLang = langResponse.choices[0]?.message?.content?.trim().toLowerCase() || 'en';

    // Translate the extracted text
    const translation = await translateText(text, detectedLang, toLang);

    return NextResponse.json({ 
      text, 
      translation,
      detectedLang 
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
