'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRegisterMutation } from '../../../features/auth/data/api/authApi';
import { AuthShell } from '../../../features/auth/presentation/components/AuthShell';
import { GoogleSignInButton } from '../../../features/auth/presentation/components/GoogleSignInButton';
import { PasswordStrengthMeter } from '../../../features/auth/presentation/components/PasswordStrengthMeter';
import { signUpSchema, type SignUpFormValues } from '../../../features/auth/presentation/validation/authSchemas';
import { Button, Input } from '../../../shared/components';

export default function SignUpPage() {
  const router = useRouter();
  const [register_, { isLoading }] = useRegisterMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    // Dev-only prefill so Sign Up can be exercised with a single tap. Uses a different email
    // than the backend's seeded demo account (see BE Program.cs SeedDevDataAsync) since that
    // one already exists and would fail with EMAIL_IN_USE.
    defaultValues:
      process.env.NODE_ENV === 'development'
        ? {
            firstName: 'New',
            lastName: 'User',
            email: 'newuser@wedproposal.app',
            password: 'Password123',
            confirmPassword: 'Password123',
          }
        : undefined,
  });

  const password = watch('password', '');

  const onSubmit = async (values: SignUpFormValues) => {
    setFormError(null);
    try {
      const { email } = await register_(values).unwrap();
      router.push(`/register-verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not create your account. Please try a different email.');
    }
  };

  return (
    <AuthShell tagline="Begin a new chapter — create your profile in minutes.">
      <h2 className="font-display text-3xl font-semibold text-ink">Create your account</h2>
      <p className="mt-2 text-sm text-ink-muted">It only takes a minute to get started.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" icon={<User size={16} />} error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" icon={<User size={16} />} error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email address" type="email" icon={<Mail size={16} />} error={errors.email?.message} {...register('email')} />
        <div className="flex flex-col gap-1.5">
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <PasswordStrengthMeter password={password} />
        </div>
        <Input
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

        <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
          Create account
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
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-primary-dark hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
