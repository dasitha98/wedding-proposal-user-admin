'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useResetPasswordMutation } from '../../../features/auth/data/api/authApi';
import { AuthShell } from '../../../features/auth/presentation/components/AuthShell';
import { PasswordStrengthMeter } from '../../../features/auth/presentation/components/PasswordStrengthMeter';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../../../features/auth/presentation/validation/authSchemas';
import { Button, Input } from '../../../shared/components';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const newPassword = watch('newPassword', '');

  useEffect(() => {
    if (!token) router.replace('/forgot-password');
  }, [token, router]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(null);
    try {
      await resetPassword({ resetToken: token, newPassword: values.newPassword }).unwrap();
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not reset your password. The link may have expired.');
    }
  };

  if (done) {
    return (
      <AuthShell>
        <h2 className="font-display text-3xl font-semibold text-ink">Password updated</h2>
        <p className="mt-2 text-sm text-ink-muted">Your password has been reset successfully.</p>
        <Button fullWidth size="lg" className="mt-8" onClick={() => router.push('/sign-in')}>
          Continue to sign in
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell tagline="A fresh start begins with a strong password.">
      <h2 className="font-display text-3xl font-semibold text-ink">Set a new password</h2>
      <p className="mt-2 text-sm text-ink-muted">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input label="New password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
          <PasswordStrengthMeter password={newPassword} />
        </div>
        <Input
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

        <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
          Reset password
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
