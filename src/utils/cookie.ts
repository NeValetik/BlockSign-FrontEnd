import { CookieOptions, DEFAULT_OPTIONS } from './cookie-types';

/**
 * Cookie utility functions for BlockSign application
 * Handles both client-side and server-side cookie operations
 */

// Re-export types for backward compatibility
export type { CookieOptions } from './cookie-types';



/**
 * CLIENT-SIDE COOKIE UTILITIES
 * These functions work in the browser environment
 */

/**
 * Set a cookie on the client side
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof window === 'undefined') {
    console.warn('setCookie called on server side, use setServerCookie instead');
    return;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.expires) {
    const expiresDate = opts.expires instanceof Date 
      ? opts.expires 
      : new Date(Date.now() + opts.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  if (opts.maxAge) {
    cookieString += `; max-age=${opts.maxAge}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.secure) {
    cookieString += '; secure';
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value on the client side
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') {
    console.warn('getCookie called on server side, use getServerCookie instead');
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie on the client side
 */
export const removeCookie = async (
  name: string,
  options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}
): Promise<void> => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
};
// Server-side functions are available in ./cookie-server.ts