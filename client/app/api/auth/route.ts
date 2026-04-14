import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urlMap: Record<string, string> = {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      oauth: '/api/auth/oauth',
      refresh: '/api/auth/refresh',
    };

    const action = body.action || request.nextUrl.searchParams.get('action');
    const backendPath = urlMap[action || 'login'] || '/api/auth/login';

    const backendRes = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    // Forward cookies to frontend
    const backendCookies = backendRes.headers.get('set-cookie');
    const response = NextResponse.json(await backendRes.json(), {
      status: backendRes.status,
    });

    if (backendCookies) {
      const cookiesArray = backendCookies.split(',');
      cookiesArray.forEach(cookieStr => {
        const cookie = cookieStr.split(';')[0];
        response.cookies.set(cookie.split('=')[0].trim(), cookie.split('=')[1].trim());
      });
    }

    return response;
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

