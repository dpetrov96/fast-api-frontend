'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useMe, useLogin, useRegister, useLogout } from '@/hooks/useAuth';
import { AuthContextType, LoginRequest, RegisterRequest } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // React Query hooks
  const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logout = useLogout();

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      // If we have a token, fetch user data
      refetchUser();
    }
    setIsLoading(false);
  }, [refetchUser]);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('🔐 AuthContext: Starting login mutation...');
      const result = await loginMutation.mutateAsync(credentials);
      console.log('✅ AuthContext: Login mutation successful, navigating to dashboard...');
      router.push('/dashboard');
      console.log('📍 AuthContext: Navigation triggered');
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      // Error is handled in the mutation's onError
      throw error;
    }
  };

  const register = async (credentials: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(credentials);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled in the mutation's onError
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const refreshToken = async () => {
    // This would be implemented if we had a refresh endpoint
    // For now, we'll redirect to login on token expiry
    handleLogout();
  };

  const value: AuthContextType = {
    user: user || null,
    token: apiClient.getToken(),
    isAuthenticated: !!user && !!apiClient.getToken(),
    isLoading: isLoading || isUserLoading,
    login,
    register,
    logout: handleLogout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;