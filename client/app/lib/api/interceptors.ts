import axios, { type InternalAxiosRequestConfig } from "axios"
import { apiClient } from "./client"
import { AUTH } from "../constants/auth"

// Request interceptor - adds auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH.LOCAL_STORAGE_TOKEN)
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

// Response interceptor - handles errors globally
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH.LOCAL_STORAGE_TOKEN)
      localStorage.removeItem(AUTH.LOCAL_STORAGE_USER)
      window.location.href = AUTH.LOGIN_PATH
    }
    
    if (error.response?.status === 403) {
      console.error("Access denied")
    }
    
    return Promise.reject(error)
  }
)

export {}

