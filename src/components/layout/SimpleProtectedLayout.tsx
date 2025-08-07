'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Navbar } from '@/components/layout/Navbar';
import { apiClient } from '@/lib/api';

interface SimpleProtectedLayoutProps {
  children: React.ReactNode;
}

export const SimpleProtectedLayout: React.FC<SimpleProtectedLayoutProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Simple token check
    const token = apiClient.getToken();
    console.log('🔍 SimpleProtectedLayout: Checking token...', !!token);
    
    if (!token) {
      console.log('❌ SimpleProtectedLayout: No token found, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    console.log('✅ SimpleProtectedLayout: Token found, allowing access');
  }, [router]);

  // Simple token check
  const token = apiClient.getToken();
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};