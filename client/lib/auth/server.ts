import 'server-only';

import { cookies } from 'next/headers';
import { apiUrl } from '@/lib/env';
import type {
  ApiEnvelope,
  AuthResponseData,
  AuthUser,
  OAuthProvider,
} from '@/lib/api/types';
import { extractAuthUser } from '@/lib/api/types';

export const ACCESS_COOKIE_NAME = 'finops.access-token';
export const REFRESH_COOKIE_NAME = 'finops.refresh-token';

const accessCookieMaxAge = 60 * 60 * 24 * 7;
const refreshCookieMaxAge = 60 * 60 * 24 * 30;

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

type OAuthBridgePayload = {
  email: string;
  name: string;
  provider: OAuthProvider;
  providerId: string;
};

export class BackendRequestError extends Error {
  constructor(
    message = 'Unable to reach the backend service right now.',
    public readonly status = 503,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendRequestError';
  }
}

const buildBackendUrl = (path: string) => new URL(path, apiUrl).toString();

export const readApiEnvelope = async <T>(
  response: Response,
): Promise<ApiEnvelope<T> | null> => {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ApiEnvelope<T>;
  } catch {
    return null;
  }
};

export const requestBackend = async (
  path: string,
  init: RequestInit = {},
): Promise<Response> => {
  const headers = new Headers(init.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  try {
    return await fetch(buildBackendUrl(path), {
      ...init,
      cache: 'no-store',
      headers,
    });
  } catch (error) {
    throw new BackendRequestError(
      `Unable to connect to the backend at ${apiUrl}.`,
      503,
      error,
    );
  }
};

export const setAuthCookies = async (
  payload: Pick<AuthResponseData, 'accessToken' | 'refreshToken'>,
) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, payload.accessToken, {
    ...authCookieOptions,
    maxAge: accessCookieMaxAge,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, payload.refreshToken, {
    ...authCookieOptions,
    maxAge: refreshCookieMaxAge,
  });
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? null;
};

export const getRefreshToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
};

export const refreshAuthSession = async (): Promise<AuthUser | null> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthCookies();
    return null;
  }

  const response = await requestBackend('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await readApiEnvelope<AuthResponseData>(response);

  if (!response.ok || !payload?.data) {
    await clearAuthCookies();
    return null;
  }

  await setAuthCookies(payload.data);
  return extractAuthUser(payload.data);
};

export const proxyWithAuth = async (
  path: string,
  init: RequestInit = {},
): Promise<Response> => {
  const execute = async (token: string | null) => {
    const headers = new Headers(init.headers);

    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return requestBackend(path, {
      ...init,
      headers,
    });
  };

  let response = await execute(await getAccessToken());

  if (response.status !== 401) {
    return response;
  }

  const refreshedUser = await refreshAuthSession();

  if (!refreshedUser) {
    return response;
  }

  response = await execute(await getAccessToken());
  return response;
};

export const exchangeOAuthWithBackend = async (
  payload: OAuthBridgePayload,
  options: { persistCookies?: boolean } = {},
): Promise<AuthUser> => {
  const response = await requestBackend('/api/auth/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const envelope = await readApiEnvelope<AuthResponseData>(response);

  if (!response.ok || !envelope?.data) {
    const message = envelope?.message || 'OAuth sign-in could not be completed.';
    throw new Error(message);
  }

  if (options.persistCookies !== false) {
    try {
      await setAuthCookies(envelope.data);
    } catch {
      // The sign-in callback can run outside a mutable cookie context.
      // The dedicated OAuth exchange route will persist cookies afterwards.
    }
  }

  return extractAuthUser(envelope.data);
};

export const getBackendErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (error instanceof BackendRequestError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
