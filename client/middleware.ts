import { NextResponse } from 'next/server'
 
export function middleware() {
  // Auth cookies are issued by the API domain in production, so Vercel
  // middleware cannot reliably verify them on page navigation.
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
