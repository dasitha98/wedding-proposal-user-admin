import type { AuthUser } from './AuthUser';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}
