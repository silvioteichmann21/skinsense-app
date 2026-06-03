import { getApiBaseUrl } from '@/config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiPost<TResponse>(
  path: string,
  body: unknown,
  token?: string | null,
): Promise<TResponse> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError('API_BASE_URL is not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Version': '1.0.0',
    'X-Platform': 'ios',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(text || `Request failed (${res.status})`, res.status);
  }

  return res.json() as Promise<TResponse>;
}
