'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { 
  parseResetTokensFromUrl, 
  cleanUrlAfterTokenExtraction, 
  hasResetTokensInUrl,
  isResetTokenExpired,
  getTokenTimeRemaining,
  type SupabaseResetTokens 
} from '@/lib/supabase-reset';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetTokens, setResetTokens] = useState<SupabaseResetTokens | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('new_password');

  // Extract tokens from URL fragments
  useEffect(() => {
    const extractTokensFromUrl = () => {
      console.log('🔍 Checking for reset tokens in URL...');

      if (!hasResetTokensInUrl()) {
        console.warn('⚠️ No reset tokens found in URL');
        toast.error('No reset token found. Please use the link from your email.');
        return;
      }

      const tokens = parseResetTokensFromUrl();
      console.log('🔑 Extracted tokens:', tokens);

      if (tokens) {
        // Check if token is expired
        if (isResetTokenExpired(tokens)) {
          toast.error('Reset link has expired. Please request a new password reset.');
          return;
        }

        setResetTokens(tokens);
        setTimeRemaining(getTokenTimeRemaining(tokens));
        
        // Clean the URL
        cleanUrlAfterTokenExtraction();
        
        toast.success('Reset link verified! Please enter your new password.');
      } else {
        console.warn('⚠️ Invalid reset tokens');
        toast.error('Invalid reset link. Please request a new password reset.');
      }
    };

    extractTokensFromUrl();
  }, []);

  // Update time remaining every minute
  useEffect(() => {
    if (!resetTokens) return;

    const interval = setInterval(() => {
      const remaining = getTokenTimeRemaining(resetTokens);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        toast.error('Reset link has expired. Please request a new password reset.');
        clearInterval(interval);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [resetTokens]);

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: strengthLabels[strength - 1] || 'Very Weak',
      color: strengthColors[strength - 1] || 'bg-red-500',
    };
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resetTokens) {
      toast.error('No reset token available. Please request a new password reset.');
      return;
    }

    // Check if token is expired before submitting
    if (isResetTokenExpired(resetTokens)) {
      toast.error('Reset link has expired. Please request a new password reset.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Resetting password...');

      // Try to use Supabase's built-in password update with access token
      if (resetTokens.access_token) {
        try {
          // Set the access token temporarily to make authenticated request
          const originalToken = apiClient.getToken();
          apiClient.setToken(resetTokens.access_token);
          
          // Try to update password using change-password endpoint (since we have valid session)
          await apiClient.post('/auth/change-password', {
            current_password: 'dummy', // Won't be used in reset flow
            new_password: data.new_password,
          });
          
          // Restore original token
          if (originalToken) {
            apiClient.setToken(originalToken);
          } else {
            apiClient.clearToken();
          }
          
          toast.success('Password reset successful! You can now login with your new password.');
          router.push('/auth/login');
          return;
          
        } catch (error: any) {
          console.log('Failed with access token, trying reset endpoint...', error);
          
          // Restore original token on error
          const originalToken = apiClient.getToken();
          if (originalToken) {
            apiClient.setToken(originalToken);
          } else {
            apiClient.clearToken();
          }
        }
      }

      // Fallback to our reset endpoint
      await apiClient.post('/auth/reset-password', {
        token: resetTokens.refresh_token || resetTokens.access_token,
        new_password: data.new_password,
      });

      toast.success('Password reset successful! You can now login with your new password.');
      router.push('/auth/login');

    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      
      if (error.status === 400) {
        toast.error('Invalid or expired reset token. Please request a new password reset.');
      } else {
        toast.error(error.detail || 'Password reset failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  // Show loading if no token is detected yet
  if (!resetTokens) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Password Reset</CardTitle>
          <CardDescription className="text-center">
            Verifying reset link...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your reset link...
            </p>
          </div>
          
          <div className="mt-6">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Request new reset link
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
        
        {/* Time Remaining Indicator */}
        {timeRemaining > 0 && (
          <div className="flex items-center justify-center text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            <Clock className="h-4 w-4 mr-1" />
            Reset link expires in {timeRemaining} minute{timeRemaining !== 1 ? 's' : ''}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-2">
            <label htmlFor="new_password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="pl-10 pr-10"
                error={errors.new_password?.message}
                {...register('new_password')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{passwordStrength.label}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Password must contain: uppercase, lowercase, number (8+ characters)
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirm_password" className="text-sm font-medium">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className="pl-10 pr-10"
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>

          {/* Security Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">🔒 Security Notice:</p>
              <ul className="text-xs space-y-1">
                <li>• This reset link can only be used once</li>
                <li>• Your new password will take effect immediately</li>
                <li>• You'll be able to login with your new password</li>
                <li>• All other sessions will remain active</li>
              </ul>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};