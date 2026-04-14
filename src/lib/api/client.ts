import { apiConfig } from './config';

type QueryValue = string | number | undefined | null;

function toQueryString(params: Record<string, QueryValue>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value));
    }
  });
  return search.toString();
}

export async function apiGet<T>(
  path: string,
  params: Record<string, QueryValue> = {},
): Promise<T> {
  if (!apiConfig.baseUrl) {
    throw new Error('Missing API configuration');
  }

  const qs = toQueryString(params);
  const url = `${apiConfig.baseUrl}${path}${qs ? `?${qs}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(apiConfig.apiKey ? { 'x-apisports-key': apiConfig.apiKey } : {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API request failed: ${response.status} ${message}`);
  }

  return response.json() as Promise<T>;
}
