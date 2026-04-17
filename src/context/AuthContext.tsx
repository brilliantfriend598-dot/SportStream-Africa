import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getAuthProviderName, getAuthService } from '@/src/services/authProvider';
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from '@/src/services/authSessionStorage';
import type { AuthCredentials, AuthProviderName, AuthUser } from '@/src/services/authTypes';

interface AuthContextValue {
  provider: AuthProviderName;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authService = getAuthService();
const provider = getAuthProviderName();

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const storedSession = await readStoredAuthSession();

      if (storedSession?.provider === provider) {
        const restoredUser = await authService.restoreSession(storedSession.session);

        if (isMounted) {
          setUser(restoredUser);
        }
      } else {
        const nextUser = await authService.getCurrentUser();

        if (isMounted) {
          setUser(nextUser);
        }
      }

      if (storedSession && storedSession.provider !== provider) {
        await clearStoredAuthSession();
      }
    }

    loadSession()
      .catch(async () => {
        await clearStoredAuthSession();

        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      provider,
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      async signIn(credentials) {
        const nextUser = await authService.signIn(credentials);
        const session = await authService.serializeSession();
        if (session) {
          await writeStoredAuthSession(provider, session);
        }
        setUser(nextUser);
      },
      async signUp(credentials) {
        const nextUser = await authService.signUp(credentials);
        const session = await authService.serializeSession();
        if (session) {
          await writeStoredAuthSession(provider, session);
        }
        setUser(nextUser);
      },
      async signOut() {
        await authService.signOut();
        await clearStoredAuthSession();
        setUser(null);
      },
      async resetPassword(email) {
        await authService.resetPassword(email);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
