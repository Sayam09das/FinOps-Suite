import { API } from "../constants"

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  message?: string
  meta?: unknown
}

/**
 * Base fetch request creator with auth, timeout, and error handling
 */
const createRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const clientTimestamp = Date.now().toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add timestamp only client-side (SSR safe)
    if (typeof window !== 'undefined') {
      headers['x-client-timestamp'] = clientTimestamp;
    }

    // Fallback auth token from localStorage (backup for cookie issues)
    const token = typeof window !== 'undefined' ? localStorage.getItem('finops-auth-token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    Object.entries(options.headers || {}).forEach(([key, value]) => {
      headers[key as string] = value as string;
    });

    const res = await fetch(API.BASE_URL + url, {
      signal: controller.signal,
      headers,
      credentials: 'include',
      ...options,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && 'name' in error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

const parseSuccessResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }

  const payload = JSON.parse(text) as ApiEnvelope<T> | T

  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    ('data' in payload || 'message' in payload)
  ) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}

const createApiError = async (res: Response, prefix: string) => {
  const errorText = await res.text()
  let message = errorText

  try {
    const parsed = JSON.parse(errorText) as ApiEnvelope<unknown>
    if (parsed?.message) {
      message = parsed.message
    }
  } catch {
    // Keep raw text when response is not JSON.
  }

  const error = new Error(`${prefix} ${res.status}: ${message}`) as Error & { status?: number }
  error.status = res.status
  return error
}

/**
 * API wrapper matching previous fetch methods
 */
export const api = {
  get: async <T = unknown>(url: string, config: RequestInit = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'GET',
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  post: async <T = unknown>(url: string, data?: unknown, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'POST',
      body,
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  put: async <T = unknown>(url: string, data?: unknown, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'PUT',
      body,
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  patch: async <T = unknown>(url: string, data?: unknown, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'PATCH',
      body,
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  del: async <T = unknown>(url: string, config: RequestInit = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'DELETE',
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  upload: async <T = unknown>(url: string, formData: FormData, config: RequestInit = {}): Promise<T> => {
    // Don't set Content-Type for FormData - let browser set
    const headers = new Headers(config.headers)
    headers.delete('Content-Type') // Ensure no Content-Type for multipart

    const res = await createRequest(url, {
      method: 'POST',
      body: formData,
      headers,
    });
    if (!res.ok) {
      throw await createApiError(res, 'Upload Error')
    }
    return parseSuccessResponse<T>(res)
  },
};

export default api;
