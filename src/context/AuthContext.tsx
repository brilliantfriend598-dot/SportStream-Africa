import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { getAuthProviderName, getAuthService } from '@/src/services/authProvider';
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

    authService
      .getCurrentUser()
      .then((nextUser) => {
        if (isMounted) {
          setUser(nextUser);
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
        setUser(nextUser);
      },
      async signUp(credentials) {
        const nextUser = await authService.signUp(credentials);
        setUser(nextUser);
      },
      async signOut() {
        await authService.signOut();
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
