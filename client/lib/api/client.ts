import type { ApiEnvelope } from './types';

type ApiRequestOptions = Omit<RequestInit, 'credentials'>;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const parseResponsePayload = async <T>(
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

export const apiRequest = async <T>(
  input: string,
  init: ApiRequestOptions = {},
): Promise<T> => {
  const headers = new Headers(init.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers,
  });

  const payload = await parseResponsePayload<T>(response);
  const message =
    payload?.message ||
    (response.ok ? 'Request completed successfully.' : 'Request failed.');

  if (!response.ok || payload?.success === false) {
    throw new ApiError(message, response.status, payload);
  }

  return (payload?.data ?? null) as T;
};
