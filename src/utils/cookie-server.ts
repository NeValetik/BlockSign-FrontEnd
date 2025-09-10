'use server'

import { cookies } from 'next/headers';
import { CookieOptions, DEFAULT_OPTIONS } from './cookie-types';

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
