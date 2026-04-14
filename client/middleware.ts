import { NextRequest, NextResponse } from 'next/server';

// These must match exactly what lib/auth/server.ts writes
const ACCESS_COOKIE = 'finops.access-token';
const REFRESH_COOKIE = 'finops.refresh-token';

const PROTECTED = ['/dashboard'];
const AUTH_PAGES = ['/login', '/register', '/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccess = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  const hasRefresh = Boolean(request.cookies.get(REFRESH_COOKIE)?.value);
  const isAuthenticated = hasAccess || hasRefresh;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Block unauthenticated access to protected routes
  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    const response = NextResponse.redirect(url);
    // Wipe any stale cookies so the browser doesn't cache them
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const next = request.nextUrl.searchParams.get('next');
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith('/') ? next : '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Add no-store cache headers to all protected responses so the browser
  // never serves a cached /dashboard after logout
  if (isProtected) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};
