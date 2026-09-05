import { configureStore } from '@reduxjs/toolkit';

import { adminApi } from '../../features/admin/data/api/adminApi';
import { authApi } from '../../features/auth/data/api/authApi';
import { authReducer } from '../../features/auth/presentation/state/authSlice';
import { discoverApi } from '../../features/discover/data/api/discoverApi';
import { messagesApi } from '../../features/messages/data/api/messagesApi';
import { profileApi } from '../../features/profile/data/api/profileApi';
import { usersApi } from '../../features/users/data/api/usersApi';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [discoverApi.reducerPath]: discoverApi.reducer,
      [messagesApi.reducerPath]: messagesApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        profileApi.middleware,
        discoverApi.middleware,
        messagesApi.middleware,
        adminApi.middleware,
        usersApi.middleware
      ),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
