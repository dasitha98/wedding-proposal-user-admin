'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRequestPasswordResetOtpMutation } from '../../../features/auth/data/api/authApi';
import { AuthShell } from '../../../features/auth/presentation/components/AuthShell';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../../features/auth/presentation/validation/authSchemas';
import { Button, Input } from '../../../shared/components';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [requestOtp, { isLoading }] = useRequestPasswordResetOtpMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    try {
      await requestOtp(values).unwrap();
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not send a reset code to that email. Please try again.');
    }
  };

  return (
    <AuthShell tagline="Forgotten details happen — let's get you back in.">
      <h2 className="font-display text-3xl font-semibold text-ink">Forgot password?</h2>
      <p className="mt-2 text-sm text-ink-muted">Enter your email and we&apos;ll send you a verification code.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

        <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
          Send reset code
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Remembered your password?{' '}
        <Link href="/sign-in" className="font-semibold text-primary-dark hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
