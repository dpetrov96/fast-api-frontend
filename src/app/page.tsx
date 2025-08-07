'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Zap, Database, Key } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                FastAPI Auth
              </span>
            </div>
            <div className="flex items-center space-x-4 dark:text-white">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Secure Authentication
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A complete authentication system built with FastAPI and Next.js. 
            Featuring JWT tokens, secure password hashing, and beautiful UI components.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Key className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>JWT Authentication</CardTitle>
              <CardDescription>
                Secure stateless authentication using JSON Web Tokens with automatic token refresh.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Password Security</CardTitle>
              <CardDescription>
                Passwords are hashed using bcrypt with salt for maximum security and protection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Supabase Integration</CardTitle>
              <CardDescription>
                Built on Supabase for reliable authentication and database management.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>
                Built with FastAPI and Next.js for lightning-fast performance and SEO optimization.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Protected Routes</CardTitle>
              <CardDescription>
                Role-based access control with middleware protection for sensitive endpoints.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Key className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>React Query</CardTitle>
              <CardDescription>
                Powerful data fetching with caching, background updates, and error handling.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Built with Modern Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              FastAPI
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              Next.js 14
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              TypeScript
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              React Query
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              Tailwind CSS
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              Supabase
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              JWT
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2025 FastAPI Auth App.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}