import { API } from "../constants"
import { ENDPOINTS } from './endpoints'
import { getAuthToken, getRefreshToken } from '@/app/features/auth/utils/auth-utils'

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  message?: string
  meta?: unknown
}

type ApiRequestConfig = RequestInit & {
  timeoutMs?: number
}

/**
 * Base fetch request creator with auth, timeout, and error handling
 */
let isRefreshing = false;
const failedRequests: Array<() => void> = [];

async function refreshAuth() {
  try {
    // Get the refresh token from localStorage
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Send refresh token in the request body
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken }, { 
      timeoutMs: 5000,
      credentials: 'include', // Include cookies for cookie-based auth fallback
    });
    
    const newAccessToken = (response as any).accessToken;
    if (newAccessToken && typeof window !== 'undefined') {
      // Update the access token in localStorage (for immediate UI access)
      localStorage.setItem('finops-auth-token', newAccessToken);
    }
    return newAccessToken;
  } catch (error) {
    console.error('[AUTH] Refresh failed:', error);
    // Refresh failed, clear ALL auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finops-auth-token');
      localStorage.removeItem('finops-user');
      localStorage.removeItem('finops-refresh-token');
      localStorage.removeItem('authGraceUntil');
    }
    failedRequests.forEach(callback => callback());
    failedRequests.length = 0;
    throw error;
  }
}

const createRequest = async (url: string, options: ApiRequestConfig = {}): Promise<Response> => {
  const clientTimestamp = Date.now().toString();
  const {
    timeoutMs = API.TIMEOUT,
    headers: customHeaders,
    credentials,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(customHeaders);
    const isFormData = fetchOptions.body instanceof FormData;

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add timestamp only client-side (SSR safe)
    if (typeof window !== 'undefined' && !headers.has('x-client-timestamp')) {
      headers.set('x-client-timestamp', clientTimestamp);
    }

// Auth token from localStorage (Bearer fallback for cookies)
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(API.BASE_URL + url, {
      ...fetchOptions,
      signal: controller.signal,
      headers,
      credentials: credentials ?? 'include',
    });
    clearTimeout(timeoutId);

    // 401 handling
    if (res.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        await refreshAuth();
        // Retry the original request
        const retryRes = await fetch(API.BASE_URL + url, {
          ...fetchOptions,
          signal: controller.signal,
          headers,
          credentials: credentials ?? 'include',
        });
        clearTimeout(timeoutId);
        return retryRes;
      } catch (refreshError) {
        clearTimeout(timeoutId);
        throw refreshError;
      } finally {
        isRefreshing = false;
        // Retry queued requests
        failedRequests.forEach(callback => callback());
        failedRequests.length = 0;
      }
    }

    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && 'name' in error && error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout') as Error & { status?: number }
      timeoutError.status = 408
      throw timeoutError
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
  get: async <T = unknown>(url: string, config: ApiRequestConfig = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'GET',
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  post: async <T = unknown>(url: string, data?: unknown, config: ApiRequestConfig = {}): Promise<T> => {
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

  put: async <T = unknown>(url: string, data?: unknown, config: ApiRequestConfig = {}): Promise<T> => {
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

  patch: async <T = unknown>(url: string, data?: unknown, config: ApiRequestConfig = {}): Promise<T> => {
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

  del: async <T = unknown>(url: string, config: ApiRequestConfig = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'DELETE',
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'API Error')
    }
    return parseSuccessResponse<T>(res)
  },

  upload: async <T = unknown>(url: string, formData: FormData, config: ApiRequestConfig = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'POST',
      body: formData,
      ...config,
    });
    if (!res.ok) {
      throw await createApiError(res, 'Upload Error')
    }
    return parseSuccessResponse<T>(res)
  },
};

export default api;
