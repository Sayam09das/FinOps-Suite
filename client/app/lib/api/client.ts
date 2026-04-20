import { API } from "../constants"
import { AUTH } from "../constants/auth"
import { HTTP_STATUS } from "../constants/api"

/**
 * Base fetch request creator with auth, timeout, and error handling
 */
const createRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem(AUTH.LOCAL_STORAGE_TOKEN);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    Object.entries(options.headers || {}).forEach(([key, value]) => {
      headers[key as string] = value as string;
    });

    const res = await fetch(API.BASE_URL + url, {
      signal: controller.signal,
      headers,
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

/**
 * API wrapper matching previous axios methods
 */
export const api = {
  get: async <T = any>(url: string, config: RequestInit = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'GET',
      ...config,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },

  post: async <T = any>(url: string, data?: any, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'POST',
      body,
      ...config,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },

  put: async <T = any>(url: string, data?: any, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'PUT',
      body,
      ...config,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },

  patch: async <T = any>(url: string, data?: any, config: RequestInit = {}): Promise<T> => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await createRequest(url, {
      method: 'PATCH',
      body,
      ...config,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },

  del: async <T = any>(url: string, config: RequestInit = {}): Promise<T> => {
    const res = await createRequest(url, {
      method: 'DELETE',
      ...config,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },

  upload: async <T = any>(url: string, formData: FormData, config: RequestInit = {}): Promise<T> => {
    // Don't set Content-Type for FormData - let browser set
    const headers = config.headers ? (config.headers as any) : {};
    delete headers['Content-Type']; // Ensure no Content-Type for multipart

    const res = await createRequest(url, {
      method: 'POST',
      body: formData,
      headers: headers,
    });
    if (!res.ok) {
      if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(AUTH.LOCAL_STORAGE_USER);
        window.location.href = AUTH.LOGIN_PATH;
      }
      const errorText = await res.text();
      throw new Error(`Upload Error ${res.status}: ${errorText}`);
    }
    return res.json() as Promise<T>;
  },
};

export default api;

