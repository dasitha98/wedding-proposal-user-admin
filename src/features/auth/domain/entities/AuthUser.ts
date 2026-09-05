export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  roles: string[];
}

export function isAdminUser(user: AuthUser | null): boolean {
  return user?.roles.some((role) => role === 'Admin' || role === 'SuperAdmin') ?? false;
}

/// Where a freshly-signed-in (or already-signed-in) user should land: Admin/SuperAdmin
/// accounts go straight to the admin dashboard, everyone else to the regular app.
export function getPostSignInPath(user: AuthUser | null): string {
  return isAdminUser(user) ? '/admin' : '/';
}

export function getUserFullName(user: AuthUser): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function getUserInitials(user: AuthUser): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
