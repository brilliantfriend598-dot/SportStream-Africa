import { apiConfig } from './config';
import type { ApiErrorCode } from './types';

type QueryValue = string | number | undefined | null;

export class ApiClientError extends Error {
  code: ApiErrorCode;

  constructor(message: string, code: ApiErrorCode = 'UNKNOWN') {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
  }
}

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
    throw new ApiClientError('Missing API configuration.', 'CONFIG');
  }

  const qs = toQueryString(params);
  const url = `${apiConfig.baseUrl}${path}${qs ? `?${qs}` : ''}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(apiConfig.apiKey ? { 'x-apisports-key': apiConfig.apiKey } : {}),
      },
    });
  } catch (error) {
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Network request failed.',
      'NETWORK',
    );
  }

  if (!response.ok) {
    const message = await response.text();
    throw new ApiClientError(buildErrorMessage(response.status, message), classifyApiError(response.status, message));
  }

  return response.json() as Promise<T>;
}

function classifyApiError(status: number, message: string): ApiErrorCode {
  const normalized = message.toLowerCase();

  if (status === 404) {
    return 'NOT_FOUND';
  }

  if (
    status === 401 ||
    status === 403 ||
    normalized.includes('subscription') ||
    normalized.includes('plan') ||
    normalized.includes('not allowed') ||
    normalized.includes('access denied')
  ) {
    return 'SUBSCRIPTION';
  }

  return 'UNKNOWN';
}

function buildErrorMessage(status: number, message: string) {
  const details = message.trim();
  return details ? `API request failed (${status}): ${details}` : `API request failed (${status}).`;
}
