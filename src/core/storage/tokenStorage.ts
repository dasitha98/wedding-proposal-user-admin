const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const USER_KEY = 'auth.user';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export interface StoredSession<TUser> extends StoredTokens {
  user: TUser;
}

function hasStorage(): boolean {
  return typeof window !== 'undefined';
}

export const tokenStorage = {
  save<TUser>(session: StoredSession<TUser>): void {
    if (!hasStorage()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  },

  saveTokens(tokens: StoredTokens): void {
    if (!hasStorage()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  load<TUser>(): StoredSession<TUser> | null {
    if (!hasStorage()) return null;
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    const userJson = window.localStorage.getItem(USER_KEY);
    if (!accessToken || !refreshToken || !userJson) return null;

    try {
      return { accessToken, refreshToken, user: JSON.parse(userJson) as TUser };
    } catch {
      return null;
    }
  },

  clear(): void {
    if (!hasStorage()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};
