import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import { User, DashboardData } from '@/types/auth';

// API functions for protected endpoints
const protectedApi = {
  getProfile: async (): Promise<User> => {
    return apiClient.get('/protected/profile');
  },

  getDashboard: async (): Promise<DashboardData> => {
    return apiClient.get('/protected/dashboard');
  },

  getAdminData: async (): Promise<any> => {
    return apiClient.get('/protected/admin-only');
  },
};

// Custom hooks for protected data
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.protected.profile,
    queryFn: protectedApi.getProfile,
    enabled: !!apiClient.getToken(),
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.protected.dashboard,
    queryFn: protectedApi.getDashboard,
    enabled: !!apiClient.getToken(),
  });
};

export const useAdminData = () => {
  return useQuery({
    queryKey: ['protected', 'admin'],
    queryFn: protectedApi.getAdminData,
    enabled: !!apiClient.getToken(),
    retry: false, // Don't retry if user doesn't have admin access
  });
};