import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Temporarily return next() to disable all routing logic
  return NextResponse.next()
}
