import {
  AuthError,
  type AuthCredentials,
  type AuthService,
  type AuthSession,
  type AuthUser,
} from './authTypes';

const DEMO_EMAIL = 'demo@sportstream.africa';
const DEMO_PASSWORD = 'password123';

let currentUser: AuthUser | null = null;

function createMockUser(email: string): AuthUser {
  return {
    id: 'mock-user',
    email,
    displayName: 'SportStream Fan',
  };
}

function validateCredentials({ email, password }: AuthCredentials) {
  if (!email || !password) {
    throw new AuthError('INVALID_CREDENTIALS', 'Enter both your email and password.');
  }
}

export const mockAuthApi: AuthService = {
  async getCurrentUser() {
    return currentUser;
  },
  async restoreSession(session) {
    currentUser = session.user;
    return currentUser;
  },
  async serializeSession() {
    if (!currentUser) {
      return null;
    }

    return {
      user: currentUser,
    } satisfies AuthSession;
  },
  async signIn(credentials) {
    validateCredentials(credentials);

    if (credentials.email !== DEMO_EMAIL || credentials.password !== DEMO_PASSWORD) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Mock mode uses demo@sportstream.africa / password123.',
      );
    }

    currentUser = createMockUser(credentials.email);
    return currentUser;
  },
  async signUp(credentials) {
    validateCredentials(credentials);
    currentUser = createMockUser(credentials.email);
    return currentUser;
  },
  async signOut() {
    currentUser = null;
  },
  async resetPassword(email) {
    if (!email) {
      throw new AuthError('INVALID_CREDENTIALS', 'Enter your email address first.');
    }
  },
};
