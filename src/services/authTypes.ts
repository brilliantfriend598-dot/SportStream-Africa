export type AuthProviderName = 'mock' | 'firebase';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

export interface AuthSession {
  user: AuthUser;
  idToken?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  getCurrentUser: () => Promise<AuthUser | null>;
  restoreSession: (session: AuthSession) => Promise<AuthUser | null>;
  serializeSession: () => Promise<AuthSession | null>;
  signIn: (credentials: AuthCredentials) => Promise<AuthUser>;
  signUp: (credentials: AuthCredentials) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export class AuthError extends Error {
  code: 'CONFIG' | 'INVALID_CREDENTIALS' | 'NETWORK' | 'UNKNOWN';

  constructor(code: AuthError['code'], message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
