import { NextRequest, NextResponse } from 'next/server';
import {
  BackendRequestError,
  getBackendErrorMessage,
  readApiEnvelope,
  requestBackend,
  setAuthCookies,
} from '@/lib/auth/server';
import type { AuthResponseData } from '@/lib/api/types';
import { extractAuthUser } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await requestBackend('/api/auth/login', {
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
          message: 'Unable to sign you in right now.',
        },
        { status: 200 },
      );
    }

    await setAuthCookies(payload.data);

    return NextResponse.json(
      {
        success: true,
        data: extractAuthUser(payload.data),
        message: payload.message ?? 'Login successful',
      },
      { status: response.status },
    );
  } catch (error) {
    const status = error instanceof BackendRequestError ? error.status : 500;
    return NextResponse.json(
      {
        success: false,
        message: getBackendErrorMessage(
          error,
          'Unable to sign you in right now.',
        ),
      },
      { status: status >= 500 ? 200 : status },
    );
  }
}
