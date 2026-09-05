import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { sessionExpired, tokensRefreshed } from '../../../../core/api/sessionEvents';
import { tokenStorage } from '../../../../core/storage/tokenStorage';
import type { AuthSession } from '../../domain/entities/AuthTokens';
import type { AuthUser } from '../../domain/entities/AuthUser';

type AuthStatus = 'checking' | 'signedOut' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  tokens: { accessToken: string; refreshToken: string } | null;
}

const initialState: AuthState = {
  status: 'checking',
  user: null,
  tokens: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Runs once on app start — restores a session from localStorage, if any. */
    hydrate: (state) => {
      const stored = tokenStorage.load<AuthUser>();
      if (stored) {
        state.status = 'signedIn';
        state.user = stored.user;
        state.tokens = { accessToken: stored.accessToken, refreshToken: stored.refreshToken };
      } else {
        state.status = 'signedOut';
      }
    },
    sessionEstablished: (state, action: PayloadAction<AuthSession>) => {
      state.status = 'signedIn';
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      tokenStorage.save({ ...action.payload.tokens, user: action.payload.user });
    },
    userUpdated: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      if (state.tokens) tokenStorage.save({ ...state.tokens, user: action.payload });
    },
    signedOut: (state) => {
      state.status = 'signedOut';
      state.user = null;
      state.tokens = null;
      tokenStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tokensRefreshed, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(sessionExpired, (state) => {
        state.status = 'signedOut';
        state.user = null;
        state.tokens = null;
        tokenStorage.clear();
      });
  },
});

export const { hydrate, sessionEstablished, userUpdated, signedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
