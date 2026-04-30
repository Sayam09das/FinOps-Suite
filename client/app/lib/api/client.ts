import { API } from "../constants"
import { ENDPOINTS } from './endpoints'
import { 
  getRefreshToken, 
  setRefreshToken, 
  setAuthData 
} from '@/app/features/auth/utils/auth-utils'

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
 * 
 * AUTHENTICATION STRATEGY:
 * 1. Cookies via httpOnly (PRIMARY) - set automatically by browser
 * 2. localStorage tokens (FALLBACK) - used when cookies fail
 * 3. Token refresh flow when access token expires
 */
let isRefreshing = false;
const failedRequests: Array<() => void> = [];

/**
 * Get access token from localStorage (fallback)
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('finops-auth-token');
}

/**
 * Get refresh token from localStorage (fallback)
 */
function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('finops-refresh-token');
}

/**
 * Store tokens in localStorage after login/refresh
 */
function storeTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  
  // Always store access token
  localStorage.setItem('finops-auth-token', accessToken);
  
  // Store refresh token if provided (for token refresh flow)
  if (refreshToken) {
    localStorage.setItem('finops-refresh-token', refreshToken);
  }
}

async function refreshAuth() {
  try {
    // Get the refresh token from localStorage (fallback) or use cookie-based refresh
    const storedRefreshToken = getStoredRefreshToken();
    const refreshTokenToUse = storedRefreshToken || getRefreshToken();
    
    if (!refreshTokenToUse) {
      console.error('[AUTH] No refresh token available - trying cookie-based refresh');
      // Try cookie-based refresh by sending empty body - cookies are sent automatically
      // This will fail if cookies aren't available, but provides good diagnostics
    }
    
    // Create refresh request with cookie support
    const refreshOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: refreshTokenToUse ? JSON.stringify({ refreshToken: refreshTokenToUse }) : '{}',
      credentials: 'include', // CRITICAL: Include cookies for cookie-based auth
    };
    
    const response = await fetch(API.BASE_URL + ENDPOINTS.AUTH.REFRESH, {
      ...refreshOptions,
      // No timeout wrapper for refresh - give it time to complete
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[AUTH] Refresh response not OK:', response.status, errorText);
      throw new Error('Token refresh failed');
    }
    
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }
    
    // Get tokens from response - check for tokens in various formats
    const newAccessToken = data?.accessToken || data?.data?.accessToken;
    const newRefreshToken = data?.refreshToken || data?.data?.refreshToken;
    
    if (newAccessToken) {
      // Store tokens in localStorage for future use
      storeTokens(newAccessToken, newRefreshToken);
      console.log('[AUTH] Tokens refreshed and stored successfully');
      return newAccessToken;
    }
    
    // If no new access token but response was OK, maybe using cookie-based auth
    // In this case, the cookie should already be set
    if (response.ok) {
      const accessFromLocalStorage = getAccessToken();
      if (accessFromLocalStorage) {
        console.log('[AUTH] Using cookie-based refresh (no new tokens in response)');
        return accessFromLocalStorage;
      }
    }
    
    throw new Error('No access token in refresh response');
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
    // Only use token if it's valid (length > 10 to filter out garbage/invalid tokens)
    const token = getAccessToken();
    if (token && token.length > 10 && !headers.has('Authorization')) {
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
