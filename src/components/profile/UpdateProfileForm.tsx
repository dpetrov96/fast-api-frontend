'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const profileUpdateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100, 'Full name is too long').optional().or(z.literal('')),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

interface UpdateProfileFormProps {
  onSuccess?: () => void;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user?.full_name || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      console.log('🔄 Updating profile...', data);
      
      // Only send data if it's different from current values
      const updateData: { full_name?: string } = {};
      
      if (data.full_name && data.full_name !== user?.full_name) {
        updateData.full_name = data.full_name;
      }
      
      if (Object.keys(updateData).length === 0) {
        console.log('No changes detected');
        return;
      }
      
      await updateProfileMutation.mutateAsync(updateData);
      
      console.log('✅ Profile updated successfully');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      // Error is handled by the mutation
    }
  };

  const handleReset = () => {
    reset({
      full_name: user?.full_name || '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Update Profile
        </CardTitle>
        <CardDescription>
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <p className="text-xs text-muted-foreground">
              This is your display name that will be shown to other users
            </p>
          </div>

          {/* Current Values Display */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium text-muted-foreground mb-1">Current Information:</p>
            <p className="text-sm">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm">
              <strong>Full Name:</strong> {user?.full_name || 'Not set'}
            </p>
            <p className="text-sm">
              <strong>Account Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isSubmitting || updateProfileMutation.isPending}
            >
              Update Profile
            </Button>
          
          </div>
        </form>
      </CardContent>
    </Card>
  );
};