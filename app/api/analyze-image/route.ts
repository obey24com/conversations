import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { translateText } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { image, fromLang, toLang } = await request.json();

    if (!image || !fromLang || !toLang) {
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
          role: "user",
          content: [
            { type: "text", text: "What does this image contain? Please describe the text content if any, maintaining the exact formatting and structure." },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high"
              },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Failed to analyze image");
    }

    // Translate the extracted text
    const translation = await translateText(text, fromLang, toLang);

    return NextResponse.json({ text, translation });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
