'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

const DEV_PASSCODE = 'HIDDEN2026';
const STORAGE_KEY = 'hiddenaitools:has_lifetime_access';

type UnlockSource = 'none' | 'dev';

interface AccessContextValue {
  hasLifetimeAccess: boolean;
  unlockSource: UnlockSource;
  devUnlockWithPasscode: (code: string) => boolean;
  devUnlockAll: () => void;
  devLock: () => void;
}

const AccessContext = createContext<AccessContextValue | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);
  const [unlockSource, setUnlockSource] = useState<UnlockSource>('none');

  // Hydrate from localStorage so the unlock persists across reloads.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'true') {
        setHasLifetimeAccess(true);
        setUnlockSource('dev');
      }
    } catch {
      // ignore
    }
  }, []);

  const persistUnlock = useCallback(() => {
    setHasLifetimeAccess(true);
    setUnlockSource('dev');
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const devUnlockWithPasscode = useCallback(
    (code: string): boolean => {
      if (code.trim().toUpperCase() === DEV_PASSCODE) {
        persistUnlock();
        return true;
      }
      return false;
    },
    [persistUnlock]
  );

  const devUnlockAll = useCallback(() => {
    persistUnlock();
  }, [persistUnlock]);

  const devLock = useCallback(() => {
    setHasLifetimeAccess(false);
    setUnlockSource('none');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AccessContextValue>(
    () => ({
      hasLifetimeAccess,
      unlockSource,
      devUnlockWithPasscode,
      devUnlockAll,
      devLock,
    }),
    [hasLifetimeAccess, unlockSource, devUnlockWithPasscode, devUnlockAll, devLock]
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error('useAccess must be used within AccessProvider');
  return ctx;
}
