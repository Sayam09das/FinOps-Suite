import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes with cookie sync grace period
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('finops.access-token')?.value
    const refreshToken = request.cookies.get('finops.refresh-token')?.value
    const token = accessToken || refreshToken

    // Grace period: 3s sync window for serverless (Render.com)
    const now = Date.now()
    const clientTimestamp = request.headers.get('x-client-timestamp') 
      ? parseInt(request.headers.get('x-client-timestamp')!) 
      : now
    const syncWindow = 3000 // 3s

    if (!token && (now - clientTimestamp > syncWindow)) {
      console.log(`[MIDDLEWARE] No token after ${syncWindow}ms grace: ${pathname}`)
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
