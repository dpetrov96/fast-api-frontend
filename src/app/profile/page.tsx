'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UpdateProfileForm } from '@/components/profile/UpdateProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProtected';
import { formatDateTime } from '@/lib/utils';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Error loading profile data. Please try refreshing the page.
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const displayUser = profileData || user;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {displayUser?.full_name || 'User Profile'}
              </CardTitle>
              <CardDescription>
                {displayUser?.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Full Name
                  </label>
                  <p className="text-sm">{displayUser?.full_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <p className="text-sm">{displayUser?.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    User ID
                  </label>
                  <p className="text-sm font-mono text-xs break-all">
                    {displayUser?.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Account Created
                  </label>
                  <p className="text-sm">
                    {displayUser?.created_at ? formatDateTime(displayUser.created_at) : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Authentication Method
                  </label>
                  <p className="text-sm">JWT Token</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Update Form */}
      <UpdateProfileForm onSuccess={() => refetch()} />

      {/* Change Password Form */}
      <ChangePasswordForm />
    </div>
  );
}