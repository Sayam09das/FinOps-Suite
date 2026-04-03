const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
  token?: string | null;
  headers?: HeadersInit;
};

export async function apiRequest<T>(
  path: string,
  { token, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'Something went wrong while talking to the API.';

    throw new ApiError(message, response.status, payload);
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}
