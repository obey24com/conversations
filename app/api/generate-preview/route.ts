import { NextResponse } from "next/server";
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { html, shareId } = await request.json();
    
    if (!html || !shareId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Launch browser
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({ width: 1200, height: 630 });
    
    // Set content and wait for it to load
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    await browser.close();

    // Upload to Firebase Storage
    const storage = getStorage();
    const imageRef = ref(storage, `previews/${shareId}.png`);
    
    await uploadString(imageRef, `data:image/png;base64,${screenshot}`, 'data_url');
    const imageUrl = await getDownloadURL(imageRef);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview image' },
      { status: 500 }
    );
  }
}
