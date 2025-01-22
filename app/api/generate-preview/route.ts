import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import satori from 'satori';
import { createElement } from 'react';

export const runtime = 'edge';

// Embed the Inter font as base64
const interRegular = Buffer.from(`
  /* Base64-encoded Inter Regular font */
`, 'base64');

const interBold = Buffer.from(`
  /* Base64-encoded Inter Bold font */
`, 'base64');

export async function POST(request: Request) {
  try {
    const { text, translation, shareId } = await request.json();
    
    if (!text || !translation || !shareId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Create React elements for satori
    const element = createElement(
      'div',
      {
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
      },
      [
        createElement(
          'div',
          {
            key: 'content',
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
          },
          [
            createElement(
              'p',
              {
                key: 'text',
                style: {
                  fontSize: '18px',
                  color: '#666',
                  margin: 0,
                  fontFamily: 'Inter',
                },
              },
              text
            ),
            createElement(
              'p',
              {
                key: 'translation',
                style: {
                  fontSize: '24px',
                  color: '#111',
                  margin: 0,
                  fontFamily: 'Inter Bold',
                },
              },
              translation
            ),
          ]
        ),
        createElement(
          'div',
          {
            key: 'footer',
            style: {
              position: 'absolute',
              bottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          },
          createElement(
            'p',
            {
              style: {
                fontSize: '16px',
                color: '#666',
                margin: 0,
                fontFamily: 'Inter',
              },
            },
            'Translated with ULOCAT'
          )
        ),
      ]
    );

    // Generate SVG using satori
    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegular,
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
    });

    // Store SVG in KV (with 24-hour expiration)
    const key = `preview:${shareId}`;
    await kv.set(key, svg, { ex: 86400 });

    // Return the preview URL
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
