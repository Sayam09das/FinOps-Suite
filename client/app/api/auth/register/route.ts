import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies, readApiEnvelope, requestBackend } from '@/lib/auth/server';
import type { AuthResponseData } from '@/lib/api/types';
import { extractAuthUser } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await requestBackend('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await readApiEnvelope<AuthResponseData>(response);

  if (!response.ok || !payload?.data) {
    return NextResponse.json(
      payload ?? {
        success: false,
        message: 'Unable to create your account right now.',
      },
      { status: response.status },
    );
  }

  await setAuthCookies(payload.data);

  return NextResponse.json(
    {
      success: true,
      data: extractAuthUser(payload.data),
      message: payload.message ?? 'Account created successfully',
    },
    { status: response.status },
  );
}
