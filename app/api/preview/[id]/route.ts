import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const key = `preview:${params.id}`;
    const svg = await kv.get<string>(key);

    if (!svg) {
      return NextResponse.json(
        { error: "Preview not found" },
        { status: 404 }
      );
    }
    
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving preview:', error);
    return NextResponse.json(
      { error: 'Failed to serve preview image' },
      { status: 500 }
    );
  }
}
