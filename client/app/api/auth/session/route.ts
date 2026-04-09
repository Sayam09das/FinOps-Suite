import { NextResponse } from 'next/server';
import {
  BackendRequestError,
  clearAuthCookies,
  getBackendErrorMessage,
  getAccessToken,
  readApiEnvelope,
  refreshAuthSession,
  requestBackend,
} from '@/lib/auth/server';
import type { CurrentUser } from '@/lib/api/types';

const emptySessionResponse = (message = 'No active session') =>
  NextResponse.json(
    {
      success: true,
      data: null,
      message,
    },
    { status: 200 },
  );

const temporarySessionFailureMessage =
  'Session check is temporarily unavailable. Please try again shortly.';

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      const refreshedUser = await refreshAuthSession();

      if (!refreshedUser) {
        return emptySessionResponse();
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
        return emptySessionResponse();
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
      if (response.status === 401) {
        await clearAuthCookies();
        return emptySessionResponse();
      }

      if (response.status >= 500) {
        return emptySessionResponse(temporarySessionFailureMessage);
      }

      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to load the current session.',
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return emptySessionResponse(temporarySessionFailureMessage);
    }

    return NextResponse.json(
      {
        success: false,
        message: getBackendErrorMessage(
          error,
          'Unable to load the current session.',
        ),
      },
      { status: 500 },
    );
  }
}
