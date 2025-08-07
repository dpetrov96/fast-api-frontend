'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useChangePassword } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
  confirm_password: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('new_password');

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      console.log('🔄 Changing password...');
      
      await changePasswordMutation.mutateAsync({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      
      console.log('✅ Password changed successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('❌ Password change failed:', error);
      // Error is handled by the mutation
    }
  };

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

  const passwordStrength = getPasswordStrength(newPassword || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your account password for better security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password Field */}
          <div className="space-y-2">
            <label htmlFor="current_password" className="text-sm font-medium">
              Current Password
            </label>
            <div className="relative">
              <Input
                id="current_password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                className="pr-10"
                error={errors.current_password?.message}
                {...register('current_password')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label htmlFor="new_password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="pr-10"
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
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className="pr-10"
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isSubmitting || changePasswordMutation.isPending}
            >
              Change Password
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || changePasswordMutation.isPending}
              className="flex-1"
            >
              Clear Form
            </Button>
          </div>

          {/* Development Mode Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">⚠️ Development Mode:</p>
              <ul className="text-xs space-y-1">
                <li>• Password changes are currently simulated</li>
                <li>• Both old and new passwords will work after "change"</li>
                <li>• Add <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to .env for real changes</li>
                <li>• See <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">SETUP_SERVICE_KEY.md</code> for instructions</li>
              </ul>
            </div>
          </div>

          {/* Security Notes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">🔒 Security Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Use a unique password you don't use elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• You'll stay logged in after changing your password</li>
                <li>• This will not affect other logged-in sessions</li>
              </ul>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};