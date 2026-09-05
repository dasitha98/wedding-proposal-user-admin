'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateAccountMutation } from '../../../../features/auth/data/api/authApi';
import { useAuth } from '../../../../features/auth/presentation/hooks/useAuth';
import { userUpdated } from '../../../../features/auth/presentation/state/authSlice';
import { editAccountSchema, type EditAccountFormValues } from '../../../../features/auth/presentation/validation/authSchemas';
import { useAppDispatch } from '../../../../core/store/hooks';
import { Button, Input } from '../../../../shared/components';
import { Card } from '../../../../shared/components/Card';

export default function EditAccountPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [updateAccount, { isLoading }] = useUpdateAccountMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email },
  });

  const onSubmit = async (values: EditAccountFormValues) => {
    setFormError(null);
    try {
      const updated = await updateAccount(values).unwrap();
      dispatch(userUpdated(updated));
      router.push('/account');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not update your account. Please try again.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Edit Account</h1>
      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />

          {formError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{formError}</p>}

          <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-2">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
