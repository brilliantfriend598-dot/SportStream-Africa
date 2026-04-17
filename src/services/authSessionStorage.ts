import * as SecureStore from 'expo-secure-store';
import type { AuthProviderName, AuthSession } from './authTypes';

const AUTH_SESSION_KEY = 'sportstream-auth-session';

interface StoredAuthSession {
  provider: AuthProviderName;
  session: AuthSession;
}

function canUseWebStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

async function readRawValue() {
  if (canUseWebStorage()) {
    return window.localStorage.getItem(AUTH_SESSION_KEY);
  }

  return SecureStore.getItemAsync(AUTH_SESSION_KEY);
}

async function writeRawValue(value: string) {
  if (canUseWebStorage()) {
    window.localStorage.setItem(AUTH_SESSION_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, value);
}

async function clearRawValue() {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}

export async function readStoredAuthSession(): Promise<StoredAuthSession | null> {
  const rawValue = await readRawValue();

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredAuthSession;
  } catch {
    await clearRawValue();
    return null;
  }
}

export async function writeStoredAuthSession(
  provider: AuthProviderName,
  session: AuthSession,
): Promise<void> {
  await writeRawValue(
    JSON.stringify({
      provider,
      session,
    } satisfies StoredAuthSession),
  );
}

export async function clearStoredAuthSession(): Promise<void> {
  await clearRawValue();
}
