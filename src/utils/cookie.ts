import { cookies } from 'next/headers';

/**
 * Cookie utility functions for BlockSign application
 * Handles both client-side and server-side cookie operations
 */

// Cookie configuration interface
export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Default cookie options
const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// Auth-related cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'blocksign_access_token',
  REFRESH_TOKEN: 'blocksign_refresh_token',
  USER_ID: 'blocksign_user_id',
  SESSION_ID: 'blocksign_session_id',
  THEME: 'blocksign_theme',
  LANGUAGE: 'blocksign_language',
} as const;

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
      : new Date(Date.now() + opts.expires * 1000);
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
export const removeCookie = (
  name: string,
  options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Check if a cookie exists on the client side
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * SERVER-SIDE COOKIE UTILITIES
 * These functions work in Next.js server components and API routes
 */

/**
 * Set a cookie on the server side (Next.js)
 */
export const setServerCookie = async (
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name,
      value,
      ...opts,
    });
  } catch (error) {
    console.error('Failed to set server cookie:', error);
  }
};

/**
 * Get a cookie value on the server side (Next.js)
 */
export const getServerCookie = async (name: string): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value || null;
  } catch (error) {
    console.error('Failed to get server cookie:', error);
    return null;
  }
};

/**
 * Remove a cookie on the server side (Next.js)
 */
export const removeServerCookie = async (name: string): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    console.error('Failed to remove server cookie:', error);
  }
};

/**
 * Check if a cookie exists on the server side
 */
export const hasServerCookie = async (name: string): Promise<boolean> => {
  const value = await getServerCookie(name);
  return value !== null;
};

/**
 * Get all cookies on the server side
 */
export const getAllServerCookies = async (): Promise<Record<string, string>> => {
  try {
    const cookieStore = await cookies();
    const allCookies: Record<string, string> = {};
    
    cookieStore.getAll().forEach((cookie: { name: string; value: string }) => {
      allCookies[cookie.name] = cookie.value;
    });
    
    return allCookies;
  } catch (error) {
    console.error('Failed to get all server cookies:', error);
    return {};
  }
};

/**
 * AUTHENTICATION-SPECIFIC UTILITIES
 */

/**
 * Set authentication tokens
 */
export const setAuthTokens = async (
  accessToken: string,
  refreshToken?: string,
  options: CookieOptions = {}
): Promise<void> => {
  const authOptions: CookieOptions = {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  if (typeof window === 'undefined') {
    // Server side
    await setServerCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      ...authOptions,
      maxAge: 60 * 15, // 15 minutes for access token
    });
    
    if (refreshToken) {
      await setServerCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, authOptions);
    }
  } else {
    // Client side (for non-httpOnly scenarios)
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      ...authOptions,
      httpOnly: false,
      maxAge: 60 * 15,
    });
    
    if (refreshToken) {
      setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        ...authOptions,
        httpOnly: false,
      });
    }
  }
};

/**
 * Get access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  return typeof window === 'undefined'
    ? await getServerCookie(COOKIE_NAMES.ACCESS_TOKEN)
    : getCookie(COOKIE_NAMES.ACCESS_TOKEN);
};

/**
 * Get refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  return typeof window === 'undefined'
    ? await getServerCookie(COOKIE_NAMES.REFRESH_TOKEN)
    : getCookie(COOKIE_NAMES.REFRESH_TOKEN);
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = async (): Promise<void> => {
  const authCookieNames = [
    COOKIE_NAMES.ACCESS_TOKEN,
    COOKIE_NAMES.REFRESH_TOKEN,
    COOKIE_NAMES.USER_ID,
    COOKIE_NAMES.SESSION_ID,
  ];

  if (typeof window === 'undefined') {
    // Server side
    await Promise.all(authCookieNames.map(name => removeServerCookie(name)));
  } else {
    // Client side
    authCookieNames.forEach(name => removeCookie(name));
  }
};

/**
 * Set user preferences
 */
export const setUserPreferences = async (
  theme?: string,
  language?: string
): Promise<void> => {
  const preferenceOptions: CookieOptions = {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  };

  const promises: Promise<void>[] = [];

  if (theme) {
    if (typeof window === 'undefined') {
      promises.push(setServerCookie(COOKIE_NAMES.THEME, theme, preferenceOptions));
    } else {
      setCookie(COOKIE_NAMES.THEME, theme, preferenceOptions);
    }
  }

  if (language) {
    if (typeof window === 'undefined') {
      promises.push(setServerCookie(COOKIE_NAMES.LANGUAGE, language, preferenceOptions));
    } else {
      setCookie(COOKIE_NAMES.LANGUAGE, language, preferenceOptions);
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
};

/**
 * Get user theme preference
 */
export const getThemePreference = async (): Promise<string | null> => {
  return typeof window === 'undefined'
    ? await getServerCookie(COOKIE_NAMES.THEME)
    : getCookie(COOKIE_NAMES.THEME);
};

/**
 * Get user language preference
 */
export const getLanguagePreference = async (): Promise<string | null> => {
  return typeof window === 'undefined'
    ? await getServerCookie(COOKIE_NAMES.LANGUAGE)
    : getCookie(COOKIE_NAMES.LANGUAGE);
};

/**
 * Utility to check if user is authenticated based on tokens
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

/**
 * Parse cookie string (useful for API routes)
 */
export const parseCookieString = (cookieString: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(rest.join('='));
    }
  });
  
  return cookies;
};
