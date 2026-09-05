'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { useRequestPasswordResetOtpMutation, useVerifyPasswordResetOtpMutation } from '../../../features/auth/data/api/authApi';
import { AuthShell } from '../../../features/auth/presentation/components/AuthShell';
import { OtpInput } from '../../../features/auth/presentation/components/OtpInput';
import { Button } from '../../../shared/components';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  const [verifyOtp, { isLoading }] = useVerifyPasswordResetOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useRequestPasswordResetOtpMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!email) router.replace('/forgot-password');
  }, [email, router]);

  const onSubmit = async () => {
    setError(null);
    try {
      const { resetToken } = await verifyOtp({ email, code }).unwrap();
      router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code is invalid or has expired. Please try again.');
    }
  };

  const onResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not resend the code. Please try again shortly.');
    }
  };

  return (
    <AuthShell tagline="Almost there — verify your identity to continue.">
      <h2 className="font-display text-3xl font-semibold text-ink">Enter verification code</h2>
      <p className="mt-2 text-sm text-ink-muted">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <OtpInput value={code} onChange={setCode} />

        {error && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{error}</p>}

        <Button onClick={onSubmit} loading={isLoading} disabled={code.length < 6} fullWidth size="lg" className="mt-2">
          Verify code
        </Button>

        <div className="text-center text-sm text-ink-muted">
          {cooldown > 0 ? (
            <span>Resend code in {cooldown}s</span>
          ) : (
            <button onClick={onResend} disabled={isResending} className="font-semibold text-primary-dark hover:underline">
              Resend code
            </button>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        <Link href="/sign-in" className="font-semibold text-primary-dark hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
