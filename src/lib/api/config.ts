const API_BASE_URL = process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;

if (!API_BASE_URL) {
  console.warn('Missing EXPO_PUBLIC_FOOTBALL_API_BASE_URL');
}

if (!API_KEY) {
  console.warn('Missing EXPO_PUBLIC_FOOTBALL_API_KEY');
}

export const apiConfig = {
  baseUrl: API_BASE_URL ?? '',
  apiKey: API_KEY ?? '',
  defaultSeason: Number(process.env.EXPO_PUBLIC_DEFAULT_SEASON ?? 2025),
  defaultTimezone: process.env.EXPO_PUBLIC_DEFAULT_TIMEZONE ?? 'Africa/Johannesburg',
};
