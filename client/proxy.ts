import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from '@/lib/auth/server';

const authPages = new Set(['/login', '/register', '/auth', '/sign-in', '/sign-up']);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie =
    Boolean(request.cookies.get(ACCESS_COOKIE_NAME)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE_NAME)?.value);

  if (pathname.startsWith('/dashboard') && !hasSessionCookie) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (authPages.has(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/auth', '/sign-in', '/sign-up'],
};
