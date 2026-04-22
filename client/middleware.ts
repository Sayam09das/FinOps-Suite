import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes with cookie sync grace period
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('finops.access-token')?.value
    const refreshToken = request.cookies.get('finops.refresh-token')?.value
    const token = accessToken || refreshToken

    // Always allow dashboard during 5s sync window (fix TS errors)
    const clientTimestampStr = request.headers.get('x-client-timestamp')
    if (clientTimestampStr) {
      const clientTime = parseInt(clientTimestampStr, 10)
      if (!isNaN(clientTime)) {
        const now = Date.now()
        const syncWindow = 5000 // 5s grace period
        
        if ((now - clientTime) < syncWindow) {
          console.log(`[MIDDLEWARE] Grace period: ${pathname} (${now - clientTime}ms)`)
          return NextResponse.next()
        }
      }
    }

    // Grace period: 3s sync window for serverless (Render.com)
    // Remove duplicate logic - simplified

    if (!token) {
      console.log(`[MIDDLEWARE] No token found: ${pathname}`)
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Allow recent requests during sync
    if (clientTimestamp > (now - syncWindow)) {
      console.log(`[MIDDLEWARE] Grace period active: ${pathname}`)
    }
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
