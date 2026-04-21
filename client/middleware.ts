import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect only dashboard routes
  if (pathname.startsWith('/dashboard') ) {
    // Get auth token from cookies
  const accessToken = request.cookies.get('finops.access-token')?.value
  const refreshToken = request.cookies.get('finops.refresh-token')?.value
  const token = accessToken || refreshToken

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
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
