'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { hydrate } from '../../features/auth/presentation/state/authSlice';
import { makeStore, type AppStore } from './store';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    store.dispatch(hydrate());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
