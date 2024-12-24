import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent)
  const host = request.headers.get('host') || ''
  
  // If on mobile and trying to access desktop domain, redirect to main domain
  if (isMobile && host.startsWith('desktop.')) {
    return NextResponse.redirect(`https://ulocat.com${request.nextUrl.pathname}`)
  }
  
  // If on desktop and not on desktop domain, redirect to desktop domain
  if (!isMobile && !host.startsWith('desktop.')) {
    return NextResponse.redirect(`https://desktop.ulocat.com${request.nextUrl.pathname}`)
  }

  return NextResponse.next()
}
