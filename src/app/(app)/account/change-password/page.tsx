'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useChangePasswordMutation } from '../../../../features/auth/data/api/authApi';
import { PasswordStrengthMeter } from '../../../../features/auth/presentation/components/PasswordStrengthMeter';
import { changePasswordSchema, type ChangePasswordFormValues } from '../../../../features/auth/presentation/validation/authSchemas';
import { Button, Input } from '../../../../shared/components';
import { Card } from '../../../../shared/components/Card';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const newPassword = watch('newPassword', '');

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setFormError(null);
    try {
      await changePassword(values).unwrap();
      router.push('/account');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Your current password is incorrect.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Change Password</h1>
      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register('currentPassword')} />
          <div className="flex flex-col gap-1.5">
            <Input label="New password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
            <PasswordStrengthMeter password={newPassword} />
          </div>
          <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

          {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

          <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
