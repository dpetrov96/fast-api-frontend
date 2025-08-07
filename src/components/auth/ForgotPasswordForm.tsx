'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log('🔄 Requesting password reset...', data);
      
      await forgotPasswordMutation.mutateAsync(data);
      
      console.log('✅ Password reset email sent');
      reset();
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      // Error is handled by the mutation
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || forgotPasswordMutation.isPending}
          >
            Send Reset Link
          </Button>

          {/* Success Message */}
          {forgotPasswordMutation.isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium">Email sent!</p>
                <p>If your email exists in our system, you'll receive a password reset link shortly.</p>
                <p className="mt-2 text-xs">
                  Check your email (including spam folder) and click the reset link to continue.
                </p>
              </div>
            </div>
          )}

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

          {/* Help Information */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium text-muted-foreground mb-2">What happens next:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• We'll send a secure reset link to your email</li>
              <li>• The link will expire after 24 hours for security</li>
              <li>• Click the link to create a new password</li>
              <li>• You'll be able to login with your new password</li>
            </ul>
          </div>

          {/* Support Information */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Having trouble? The reset link should arrive within a few minutes.
              Check your spam folder if you don't see it.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};