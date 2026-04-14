import type { ApiEnvelope } from './types';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiRequestBody =
  | BodyInit
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined;

type ApiRequestOptions = Omit<RequestInit, 'body' | 'credentials' | 'method'> & {
  body?: ApiRequestBody;
  method?: ApiMethod;
};

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

const hasJsonContentType = (response: Response) =>
  response.headers.get('content-type')?.includes('application/json') ?? false;

const isSerializableBody = (
  body: ApiRequestBody,
): body is Record<string, unknown> | unknown[] => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  return (
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body)
  );
};

const prepareRequestBody = (
  body: ApiRequestBody,
  headers: Headers,
): BodyInit | undefined => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isSerializableBody(body)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return JSON.stringify(body);
  }

  if (typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return body;
};

const parseResponsePayload = async <T>(response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  if (hasJsonContentType(response)) {
    try {
      return (await response.json()) as ApiEnvelope<T>;
    } catch {
      return null;
    }
  }

  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ApiEnvelope<T>;
  } catch {
    return raw;
  }
};

const isApiEnvelope = <T>(payload: unknown): payload is ApiEnvelope<T> =>
  payload !== null &&
  typeof payload === 'object' &&
  'success' in payload;

const extractErrorMessage = (response: Response, payload: unknown): string => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }

    if ('error' in payload && typeof payload.error === 'string') {
      return payload.error;
    }
  }

  return response.ok
    ? 'Request completed successfully.'
    : `Request failed with status ${response.status}.`;
};

export const apiRequest = async <T>(
  input: string,
  init: ApiRequestOptions = {},
): Promise<T> => {
  const baseURL = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL ?? '' : '';
  const url = `${baseURL}${input.startsWith('/') ? '' : '/'}${input}`;
  const headers = new Headers(init.headers);
  const body = prepareRequestBody(init.body, headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    body,
    credentials: 'include',
    cache: 'no-store',
    headers,
  });


  const payload = await parseResponsePayload<T>(response);
  const message = extractErrorMessage(response, payload);

  if (!response.ok || (isApiEnvelope<T>(payload) && payload.success === false)) {
    throw new ApiError(message, response.status, payload);
  }

  if (isApiEnvelope<T>(payload)) {
    return (payload.data ?? null) as T;
  }

  return (payload ?? null) as T;
};

export const apiClient = {
  request: apiRequest,

  get: <T>(input: string, init: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
    apiRequest<T>(input, {
      ...init,
      method: 'GET',
    }),

  post: <T>(
    input: string,
    body?: ApiRequestBody,
    init: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ) =>
    apiRequest<T>(input, {
      ...init,
      method: 'POST',
      body,
    }),

  put: <T>(
    input: string,
    body?: ApiRequestBody,
    init: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ) =>
    apiRequest<T>(input, {
      ...init,
      method: 'PUT',
      body,
    }),

  delete: <T>(
    input: string,
    init: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ) =>
    apiRequest<T>(input, {
      ...init,
      method: 'DELETE',
    }),
};
