import { NextResponse } from 'next/server';
import {
  clearAuthCookies,
  getAccessToken,
  readApiEnvelope,
  refreshAuthSession,
  requestBackend,
} from '@/lib/auth/server';
import type { CurrentUser } from '@/lib/api/types';

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const refreshedUser = await refreshAuthSession();

    if (!refreshedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: refreshedUser,
        message: 'Session restored',
      },
      { status: 200 },
    );
  }

  let response = await requestBackend('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const refreshedUser = await refreshAuthSession();

    if (!refreshedUser) {
      await clearAuthCookies();
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    response = await requestBackend('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
  }

  const payload = await readApiEnvelope<CurrentUser>(response);

  if (!response.ok || !payload?.data) {
    await clearAuthCookies();
    return NextResponse.json(
      payload ?? {
        success: false,
        message: 'Unauthorized',
      },
      { status: response.status || 401 },
    );
  }

  return NextResponse.json(payload, { status: response.status });
}
