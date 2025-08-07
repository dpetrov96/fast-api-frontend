import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    me: ['auth', 'me'] as const,
  },
  protected: {
    profile: ['protected', 'profile'] as const,
    dashboard: ['protected', 'dashboard'] as const,
  },
} as const;