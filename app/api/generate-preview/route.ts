import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { join } from 'path';
import * as fs from 'fs';

// Use Edge runtime for better performance
export const runtime = 'edge';

const interRegPath = join(process.cwd(), 'public/fonts/Inter-Regular.ttf');
const interBoldPath = join(process.cwd(), 'public/fonts/Inter-Bold.ttf');

// Load fonts
const interReg = fs.readFileSync(interRegPath);
const interBold = fs.readFileSync(interBoldPath);

export async function POST(request: Request) {
  try {
    const { text, translation, shareId } = await request.json();
    
    if (!text || !translation || !shareId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Generate SVG using satori
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '48px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '90%',
                  gap: '24px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
                children: [
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: '18px',
                        color: '#666',
                        margin: 0,
                        fontFamily: 'Inter',
                      },
                      children: text,
                    },
                  },
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: '24px',
                        color: '#111',
                        margin: 0,
                        fontFamily: 'Inter Bold',
                      },
                      children: translation,
                    },
                  },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  bottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                },
                children: [
                  {
                    type: 'img',
                    props: {
                      src: 'data:image/png;base64,...', // Add your base64 logo here
                      width: 32,
                      height: 32,
                    },
                  },
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: '16px',
                        color: '#666',
                        margin: 0,
                        fontFamily: 'Inter',
                      },
                      children: 'Translated with ULOCAT',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interReg,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter Bold',
            data: interBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    // Convert SVG to PNG
    const resvg = new Resvg(svg);
    const pngBuffer = resvg.render().asPng();

    // Store in KV (with 24-hour expiration)
    const key = `preview:${shareId}`;
    await kv.set(key, pngBuffer.toString('base64'), { ex: 86400 });

    // Return the KV key as the URL
    const previewUrl = `/api/preview/${shareId}`;
    return NextResponse.json({ imageUrl: previewUrl });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview image' },
      { status: 500 }
    );
  }
}
