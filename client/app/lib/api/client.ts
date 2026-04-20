import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { API } from "../constants"
import { HTTP_STATUS } from "../constants/api"

const apiClient: AxiosInstance = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      window.location.href = "/login"
    }
    
    return Promise.reject(error)
  }
)

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),
    
  del: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config),
    
  upload: (url: string, formData: FormData, config?: AxiosRequestConfig) => 
    apiClient.post(url, formData, {
      ...config,
      headers: { "Content-Type": "multipart/form-data" },
    }),
}

export default api

