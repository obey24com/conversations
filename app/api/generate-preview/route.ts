import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import satori from 'satori';
import { createElement, Fragment } from 'react';

export const runtime = 'edge';

const interRegular = Buffer.from(
  // Hier würde der Base64-encodierte Inter Regular Font stehen
  '', 'base64'
);

const interBold = Buffer.from(
  // Hier würde der Base64-encodierte Inter Bold Font stehen
  '', 'base64'
);

export async function POST(request: Request) {
  try {
    const { text, translation, shareId } = await request.json();
    
    if (!text || !translation || !shareId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Erstelle React-Elemente für die Vorschau
    const element = createElement(
      Fragment,
      null,
      createElement(
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
            position: 'relative',
          },
        },
        [
          // Logo
          createElement(
            'div',
            {
              key: 'logo',
              style: {
                position: 'absolute',
                top: '24px',
                left: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              },
            },
            [
              createElement(
                'img',
                {
                  src: '/img/logo.png',
                  width: 40,
                  height: 40,
                  style: {
                    borderRadius: '8px',
                  },
                }
              ),
              createElement(
                'span',
                {
                  style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111',
                    fontFamily: 'Inter Bold',
                  },
                },
                'ULOCAT'
              ),
            ]
          ),
          
          // Hauptinhalt
          createElement(
            'div',
            {
              key: 'content',
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '800px',
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
          
          // Footer
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
                color: '#666',
                fontSize: '16px',
                fontFamily: 'Inter',
              },
            },
            'Translated with ULOCAT'
          ),
        ]
      )
    );

    // Generiere SVG mit satori
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

    // Speichere SVG in KV (24 Stunden Gültigkeit)
    const key = `preview:${shareId}`;
    await kv.set(key, svg, { ex: 86400 });

    // Gib die Preview-URL zurück
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
