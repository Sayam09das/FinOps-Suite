import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeaders: Record<string, string> = {};
    
    cookieStore.getAll().forEach((cookie: any) => {
      cookieHeaders[cookie.name] = cookie.value;
    });

    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/${params.id}`, {
      method: 'PUT',
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
    console.error('Transaction update proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const cookieHeaders: Record<string, string> = {};
    
    cookieStore.getAll().forEach((cookie: any) => {
      cookieHeaders[cookie.name] = cookie.value;
    });

    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/${params.id}`, {
      method: 'DELETE',
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
    console.error('Transaction delete proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

