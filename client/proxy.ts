import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from '@/lib/auth/server';

const PROTECTED = ['/dashboard'];
const AUTH_PAGES = ['/login', '/register', '/auth', '/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAuthenticated =
    Boolean(request.cookies.get(ACCESS_COOKIE_NAME)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE_NAME)?.value);

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Block unauthenticated access to protected routes
  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    url.searchParams.set('next', `${pathname}${search}`);
    const response = NextResponse.redirect(url);
    response.cookies.delete(ACCESS_COOKIE_NAME);
    response.cookies.delete(REFRESH_COOKIE_NAME);
    return response;
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const next = request.nextUrl.searchParams.get('next') ??
      request.nextUrl.searchParams.get('redirectTo');
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith('/') && !AUTH_PAGES.some((p) => next.startsWith(p))
      ? next
      : '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Prevent browser from caching protected pages so back-button after logout
  // always triggers a fresh request (and the middleware re-checks cookies)
  if (isProtected) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  }

  return NextResponse.next();
}


