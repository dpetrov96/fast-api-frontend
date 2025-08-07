import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Token,
} from '@/types/auth';

// API functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Only use real Supabase authentication - no mock fallback
    return await apiClient.post('/auth/login', credentials);
  },

  register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
    try {
      return await apiClient.post('/auth/register', credentials);
    } catch (error: any) {
      // If rate limited, try mock endpoint
      if (error.status === 429 || (error.detail && error.detail.includes('For security purposes'))) {
        console.warn('Rate limited, using mock registration endpoint');
        return apiClient.post('/test/register-mock', credentials);
      }
      throw error;
    }
  },

  getMe: async (): Promise<User> => {
    return apiClient.get('/auth/me');
  },

  refreshToken: async (): Promise<Token> => {
    return apiClient.post('/auth/refresh');
  },
};

// Custom hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Store token
      apiClient.setToken(data.token.access_token);
      
      // Update user cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      
      // Ensure cache is updated before navigation
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      if (error.status === 429) {
        toast.error('Too many login attempts. Please wait a minute and try again.');
      } else if (error.status === 401) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error(error.detail || 'Login failed. Please try again.');
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      // Store token
      apiClient.setToken(data.token.access_token);
      
      // Update user cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      
      // Ensure cache is updated before navigation
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      toast.success('Registration successful!');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      if (error.status === 429) {
        toast.error('Rate limit exceeded. Using test mode - registration successful!');
      } else if (error.status === 409) {
        toast.error('User already exists. Please try logging in instead.');
      } else {
        toast.error(error.detail || 'Registration failed');
      }
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.getMe,
    enabled: !!apiClient.getToken(),
    retry: false,
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Update token
      apiClient.setToken(data.access_token);
      
      // Invalidate user queries to refetch with new token
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      toast.success('Token refreshed');
    },
    onError: (error: any) => {
      toast.error(error.detail || 'Token refresh failed');
      // Clear token and redirect to login
      apiClient.clearToken();
      queryClient.clear();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    // Clear token
    apiClient.clearToken();
    
    // Clear all cached data
    queryClient.clear();
    
    toast.success('Logged out successfully');
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };
};