import { firebaseAuthApi } from './firebaseAuthApi';
import { mockAuthApi } from './mockAuthApi';
import type { AuthProviderName, AuthService } from './authTypes';

function normalizeAuthProvider(value?: string): AuthProviderName {
  return value?.trim().toLowerCase() === 'firebase' ? 'firebase' : 'mock';
}

export function getAuthProviderName(): AuthProviderName {
  return normalizeAuthProvider(process.env.EXPO_PUBLIC_AUTH_PROVIDER);
}

export function getAuthService(): AuthService {
  return getAuthProviderName() === 'firebase' ? firebaseAuthApi : mockAuthApi;
}
