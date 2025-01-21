import { NextResponse } from 'next/server' 
import type { NextRequest } from 'next/server'
const DESKTOP_DOMAIN = 'https://desktop.ulocat.com'

function isMobileDevice(userAgent: string): boolean {
  return /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export function middleware(request: NextRequest) {
  // Get the User-Agent header
  const userAgent = request.headers.get('user-agent') || ''

  // If it's a desktop device and not already on the desktop domain
  if (!isMobileDevice(userAgent) && !request.url.includes('desktop.ulocat.com')) {
    // Construct the new URL with the desktop domain
    const url = new URL(request.url)
    const newUrl = `${DESKTOP_DOMAIN}${url.pathname}${url.search}`

    // Return permanent redirect (301)
    return NextResponse.redirect(newUrl, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Vary': 'User-Agent'
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
