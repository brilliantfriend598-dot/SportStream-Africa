import {
  AuthError,
  type AuthCredentials,
  type AuthService,
  type AuthSession,
  type AuthUser,
} from './authTypes';

const FIREBASE_AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1';

let currentUser: AuthUser | null = null;
let currentIdToken = '';

function getFirebaseApiKey() {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim();

  if (!apiKey) {
    throw new AuthError(
      'CONFIG',
      'Set EXPO_PUBLIC_FIREBASE_API_KEY in .env before using Firebase auth.',
    );
  }

  return apiKey;
}

function mapFirebaseError(errorCode?: string) {
  switch (errorCode) {
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
    case 'USER_DISABLED':
      return new AuthError('INVALID_CREDENTIALS', 'Your email or password is incorrect.');
    case 'EMAIL_EXISTS':
      return new AuthError('INVALID_CREDENTIALS', 'That email is already registered.');
    case 'MISSING_EMAIL':
    case 'MISSING_PASSWORD':
    case 'INVALID_EMAIL':
      return new AuthError('INVALID_CREDENTIALS', 'Enter a valid email and password.');
    default:
      return new AuthError('UNKNOWN', 'We could not complete that auth request right now.');
  }
}

function toAuthUser(payload: {
  localId: string;
  email: string;
  displayName?: string;
}): AuthUser {
  return {
    id: payload.localId,
    email: payload.email,
    displayName: payload.displayName || undefined,
  };
}

async function firebaseRequest<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = getFirebaseApiKey();

  let response: Response;

  try {
    response = await fetch(`${FIREBASE_AUTH_BASE_URL}/${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError('NETWORK', 'Check your connection and try again.');
  }

  const payload = (await response.json()) as T & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw mapFirebaseError(payload.error?.message);
  }

  return payload;
}

export const firebaseAuthApi: AuthService = {
  async getCurrentUser() {
    if (currentUser) {
      return currentUser;
    }

    if (!currentIdToken) {
      return null;
    }

    const payload = await firebaseRequest<{
      users?: Array<{
        localId: string;
        email: string;
        displayName?: string;
      }>;
    }>('accounts:lookup', {
      idToken: currentIdToken,
    });

    const user = payload.users?.[0];

    if (!user) {
      return null;
    }

    currentUser = toAuthUser(user);
    return currentUser;
  },
  async restoreSession(session) {
    currentIdToken = session.idToken || '';
    currentUser = session.user;

    if (!currentIdToken) {
      currentUser = null;
      return null;
    }

    return this.getCurrentUser();
  },
  async serializeSession() {
    if (!currentUser || !currentIdToken) {
      return null;
    }

    return {
      user: currentUser,
      idToken: currentIdToken,
    } satisfies AuthSession;
  },
  async signIn(credentials) {
    const payload = await firebaseRequest<{
      localId: string;
      email: string;
      displayName?: string;
      idToken: string;
    }>('accounts:signInWithPassword', {
      ...credentials,
      returnSecureToken: true,
    });

    currentIdToken = payload.idToken;
    currentUser = toAuthUser(payload);
    return currentUser;
  },
  async signUp(credentials) {
    const payload = await firebaseRequest<{
      localId: string;
      email: string;
      displayName?: string;
      idToken: string;
    }>('accounts:signUp', {
      ...credentials,
      returnSecureToken: true,
    });

    currentIdToken = payload.idToken;
    currentUser = toAuthUser(payload);
    return currentUser;
  },
  async signOut() {
    currentIdToken = '';
    currentUser = null;
  },
  async resetPassword(email) {
    if (!email.trim()) {
      throw new AuthError('INVALID_CREDENTIALS', 'Enter your email address first.');
    }

    await firebaseRequest('accounts:sendOobCode', {
      requestType: 'PASSWORD_RESET',
      email,
    });
  },
};
