const DIRECT_API_BASE_URL = process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL;
const API_PROXY_URL = process.env.EXPO_PUBLIC_API_PROXY_URL;
const API_KEY = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;

if (!API_PROXY_URL && !DIRECT_API_BASE_URL) {
  console.warn('Missing API base URL. Set EXPO_PUBLIC_API_PROXY_URL or EXPO_PUBLIC_FOOTBALL_API_BASE_URL.');
}

if (!API_PROXY_URL && !API_KEY) {
  console.warn('Missing EXPO_PUBLIC_FOOTBALL_API_KEY');
}

export const apiConfig = {
  baseUrl: API_PROXY_URL ?? DIRECT_API_BASE_URL ?? '',
  apiKey: API_PROXY_URL ? '' : API_KEY ?? '',
  usingProxy: Boolean(API_PROXY_URL),
  defaultSeason: Number(process.env.EXPO_PUBLIC_DEFAULT_SEASON ?? 2025),
  defaultTimezone: process.env.EXPO_PUBLIC_DEFAULT_TIMEZONE ?? 'Africa/Johannesburg',
};
