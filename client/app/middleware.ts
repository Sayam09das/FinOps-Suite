import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';
 
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
 
// Protected routes
const protectedPaths = ['/dashboard'];
 
// Public routes
const publicPaths = ['/', '/login', '/register', '/sign-in', '/sign-up', '/oauth'];
 
export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const { pathname } = request.nextUrl;
 
  // Public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
 
  // Protected paths - verify session
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      });
 
      if (!res.ok) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Clear any stale cookies
        response.cookies.delete('accessToken');
        return response;
      }
 
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware auth check failed:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }
 
  return NextResponse.next();
}
 
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
};

