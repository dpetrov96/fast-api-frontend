import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Only redirect if we have a token (meaning it's expired)
          // Don't redirect on login/register failures
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          const isAuthEndpoint = currentPath.includes('/auth/') || 
                                 error.config?.url?.includes('/auth/login') ||
                                 error.config?.url?.includes('/auth/register');
          
          if (this.token && !isAuthEndpoint) {
            // Token expired or invalid - clear and redirect
            this.clearToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );

    // Initialize token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      detail: error.message || 'An unexpected error occurred',
    };
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Generic request methods
  async get<T>(url: string) {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any) {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;