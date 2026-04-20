import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get auth token from cookies (set by backend login)
  const token = request.cookies.get('auth-token')?.value || request.cookies.get('refresh-token')?.value
 
  const { pathname } = request.nextUrl
 
  // Public pages - redirect if authenticated
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard/maindashboard', request.url))
    }
    return NextResponse.next()
  }
 
  // All other pages - require auth
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  // Protected - continue
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
