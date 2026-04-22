import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes with cookie sync grace period
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('finops.access-token')?.value
    const refreshToken = request.cookies.get('finops.refresh-token')?.value
    const token = accessToken || refreshToken

    // 8s grace period for serverless cookie sync (Render/Vercel cold starts)
    const clientTimestampStr = request.headers.get('x-client-timestamp')
    if (clientTimestampStr) {
      const clientTime = parseInt(clientTimestampStr, 10)
      if (!isNaN(clientTime)) {
        const now = Date.now()
        const graceWindow = 8000 // 8s for cold starts
        if (now - clientTime < graceWindow) {
          console.log(`[MIDDLEWARE] Grace period OK: ${pathname} (${now - clientTime}ms ago)`)
          return NextResponse.next()
        }
      }
    }

    // Final token check after grace period
    if (!token) {
      console.log(`[MIDDLEWARE] No token: ${pathname} → login`)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log(`[MIDDLEWARE] Token OK: ${pathname}`)
  }

  return NextResponse.next()
}
 
// Apply to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
