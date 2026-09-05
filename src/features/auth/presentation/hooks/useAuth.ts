import { useAppSelector } from '../../../../core/store/hooks';
import { isAdminUser } from '../../domain/entities/AuthUser';

export function useAuth() {
  const status = useAppSelector((s) => s.auth.status);
  const user = useAppSelector((s) => s.auth.user);
  const tokens = useAppSelector((s) => s.auth.tokens);

  return {
    status,
    user,
    tokens,
    isSignedIn: status === 'signedIn',
    isChecking: status === 'checking',
    isAdmin: isAdminUser(user),
  };
}
