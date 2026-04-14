import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieHeaders: Record<string, string> = {};
    
    cookieStore.getAll().forEach((cookie: any) => {
      cookieHeaders[cookie.name] = cookie.value;
    });

    const backendRes = await fetch(`${BACKEND_URL}/api/transactions`, {
      method: 'GET',
      headers: {
        'Cookie': Object.entries(cookieHeaders)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
      },
      credentials: 'include',
    });

    const data = await backendRes.json();

    return NextResponse.json({ success: true, data }, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error('Transactions proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeaders: Record<string, string> = {};
    
    cookieStore.getAll().forEach((cookie: any) => {
      cookieHeaders[cookie.name] = cookie.value;
    });

    const backendRes = await fetch(`${BACKEND_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': Object.entries(cookieHeaders)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await backendRes.json();
    return NextResponse.json({ success: true, data }, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error('Transactions POST proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

