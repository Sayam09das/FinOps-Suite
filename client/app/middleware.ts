import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

// Protected routes are handled client-side for cross-domain auth cookies.
const protectedPaths: string[] = [];

// Public routes
const publicPaths = ['/', '/login', '/register', '/sign-in', '/sign-up', '/oauth', '/api'];

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Public paths - allow access
  if (publicPaths.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  // Protected paths - verify session via backend auth check
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
        cache: 'no-store',
      });

      if (!backendRes.ok) {
        // Invalid/missing auth - redirect to login and clear cookies
        const response = NextResponse.redirect(new URL('/login', request.url));
        
        // Clear legacy cookie only
        response.cookies.delete('accessToken');
        
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }

      // Valid auth - proceed
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'no-store');
      return response;
      
    } catch (error) {
      console.error('Middleware auth check failed:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      
      response.cookies.delete('accessToken');
      
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }
  }

  // Other routes - allow
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next static/image
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
