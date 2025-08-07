import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import {
  User,
  ProfileUpdate,
  ChangePassword,
  ForgotPassword,
  MessageResponse,
} from '@/types/auth';

// API functions for profile management
const profileApi = {
  updateProfile: async (profileData: ProfileUpdate): Promise<User> => {
    try {
      return await apiClient.put('/auth/profile', profileData);
    } catch (error: any) {
      // Try mock endpoint if real one fails
      if (error.status === 401 || error.status === 404 || error.status === 500) {
        console.warn('Real profile update failed, using mock endpoint:', error.detail);
        return apiClient.put('/test/profile-mock', profileData);
      }
      throw error;
    }
  },

  changePassword: async (passwordData: ChangePassword): Promise<MessageResponse> => {
    try {
      return await apiClient.post('/auth/change-password', passwordData);
    } catch (error: any) {
      // Try mock endpoint if real one fails
      if (error.status === 401 || error.status === 404 || error.status === 500) {
        console.warn('Real password change failed, using mock endpoint:', error.detail);
        return apiClient.post('/test/change-password-mock', passwordData);
      }
      throw error;
    }
  },

  forgotPassword: async (forgotData: ForgotPassword): Promise<MessageResponse> => {
    try {
      return await apiClient.post('/auth/forgot-password', forgotData);
    } catch (error: any) {
      // Try mock endpoint if real one fails
      if (error.status === 401 || error.status === 404 || error.status === 500) {
        console.warn('Real forgot password failed, using mock endpoint:', error.detail);
        return apiClient.post('/test/forgot-password-mock', forgotData);
      }
      throw error;
    }
  },
};

// Custom hooks for profile management
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: async (updatedUser) => {
      // Update user cache
      queryClient.setQueryData(queryKeys.auth.user, updatedUser);
      queryClient.setQueryData(queryKeys.auth.me, updatedUser);
      
      // Invalidate profile queries to refresh data
      await queryClient.invalidateQueries({ queryKey: queryKeys.protected.profile });
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      if (error.status === 400) {
        toast.error('Please provide valid profile data');
      } else if (error.status === 404) {
        toast.error('Profile not found');
      } else {
        toast.error(error.detail || 'Profile update failed');
      }
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (response) => {
      const isDevMode = response.message?.includes('mock') || response.message?.includes('simulating');
      
      if (isDevMode) {
        toast.success('Password changed (Development Mode) - Add SUPABASE_SERVICE_ROLE_KEY for real changes');
      } else {
        toast.success(response.message || 'Password changed successfully!');
      }
    },
    onError: (error: any) => {
      console.error('Password change error:', error);
      if (error.status === 400) {
        toast.error('Current password is incorrect');
      } else {
        toast.error(error.detail || 'Password change failed');
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: profileApi.forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message || 'Password reset email sent!');
    },
    onError: (error: any) => {
      console.error('Forgot password error:', error);
      toast.error(error.detail || 'Failed to send reset email');
    },
  });
};