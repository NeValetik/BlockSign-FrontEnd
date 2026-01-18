'use client';

import { useEffect, useState, useCallback } from 'react';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/lib/csrf';

/**
 * Hook to get the current CSRF token from the cookie
 * 
 * Usage:
 * ```tsx
 * const { csrfToken, csrfHeaders, refreshToken } = useCsrfToken();
 * 
 * // Use with fetch
 * fetch('/api/some-endpoint', {
 *   method: 'POST',
 *   headers: {
 *     ...csrfHeaders,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(data),
 * });
 * ```
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const getTokenFromCookie = useCallback(() => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CSRF_COOKIE_NAME) {
        return value;
      }
    }
    return null;
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/csrf/token');
      const data = await response.json();
      if (data.csrfToken) {
        setCsrfToken(data.csrfToken);
        return data.csrfToken;
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
    return null;
  }, []);

  useEffect(() => {
    // Try to get token from cookie first
    const token = getTokenFromCookie();
    if (token) {
      setCsrfToken(token);
    } else {
      // If no cookie, fetch a new token
      refreshToken();
    }
  }, [getTokenFromCookie, refreshToken]);

  // Headers object ready to spread into fetch options
  const csrfHeaders: Record<string, string> = csrfToken
    ? { [CSRF_HEADER_NAME]: csrfToken }
    : {};

  return {
    csrfToken,
    csrfHeaders,
    refreshToken,
    headerName: CSRF_HEADER_NAME,
  };
}

/**
 * Get CSRF token synchronously from cookie (for non-hook usage)
 * 
 * Usage:
 * ```ts
 * import { getCsrfToken } from '@/hooks/useCsrfToken';
 * 
 * const token = getCsrfToken();
 * ```
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

/**
 * Get CSRF headers object for use with fetch
 * 
 * Usage:
 * ```ts
 * import { getCsrfHeaders } from '@/hooks/useCsrfToken';
 * 
 * fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: {
 *     ...getCsrfHeaders(),
 *     'Content-Type': 'application/json',
 *   },
 * });
 * ```
 */
export function getCsrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { [CSRF_HEADER_NAME]: token } : {};
}
