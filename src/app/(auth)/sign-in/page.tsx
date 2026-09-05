'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { toAuthSession, useLoginMutation } from '../../../features/auth/data/api/authApi';
import { ApiRequestError } from '../../../core/api/apiClient';
import { getPostSignInPath } from '../../../features/auth/domain/entities/AuthUser';
import { AuthShell } from '../../../features/auth/presentation/components/AuthShell';
import { GoogleSignInButton } from '../../../features/auth/presentation/components/GoogleSignInButton';
import { sessionEstablished } from '../../../features/auth/presentation/state/authSlice';
import { signInSchema, type SignInFormValues } from '../../../features/auth/presentation/validation/authSchemas';
import { useAppDispatch } from '../../../core/store/hooks';
import { Button, Input } from '../../../shared/components';

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    // Dev-only prefill matching the backend's seeded dev account (see BE Program.cs
    // SeedDevDataAsync) so Sign In works with a single tap while developing.
    defaultValues:
      process.env.NODE_ENV === 'development'
        ? { email: 'demo@wedproposal.app', password: 'Password123' }
        : undefined,
  });

  const onSubmit = async (values: SignInFormValues) => {
    setFormError(null);
    try {
      const response = await login(values).unwrap();
      dispatch(sessionEstablished(toAuthSession(response)));
      router.push(getPostSignInPath(response.user));
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === 'EMAIL_NOT_VERIFIED') {
        router.push(`/register-verify-otp?email=${encodeURIComponent(values.email)}`);
        return;
      }
      setFormError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    }
  };

  return (
    <AuthShell>
      <h2 className="font-display text-3xl font-semibold text-ink">Welcome back</h2>
      <p className="mt-2 text-sm text-ink-muted">Sign in to continue your search for a life partner.</p>

      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          onClick={() => {
            setValue('email', 'admin@wedproposal.app');
            setValue('password', 'AdminPass123');
          }}
          className="mt-6 flex w-full items-center gap-3 rounded-xl border border-primary-dark/30 bg-primary-tint px-4 py-3 text-left transition-colors hover:border-primary-dark"
        >
          <ShieldCheck size={18} className="shrink-0 text-primary-dark" />
          <span className="text-xs text-ink-muted">
            <span className="font-semibold text-ink">Admin dashboard access:</span> admin@wedproposal.app / AdminPass123
            <span className="block text-primary-dark">Tap to fill</span>
          </span>
        </button>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div>
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <Link href="/forgot-password" className="mt-1.5 inline-block text-xs font-semibold text-primary-dark hover:underline">
            Forgot password?
          </Link>
        </div>

        {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

        <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
          Sign in
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-ink-faint">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-6">
        <GoogleSignInButton />
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-semibold text-primary-dark hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
