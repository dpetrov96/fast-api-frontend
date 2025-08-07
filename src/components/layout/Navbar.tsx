'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                FastAPI Auth
              </span>
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {user?.full_name || user?.email}
              </span>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-2 dark:text-white">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User info */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {user?.full_name || user?.email}
                </span>
              </div>


              {/* Action buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};