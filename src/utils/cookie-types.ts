/**
 * Cookie types and constants for BlockSign application
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
export const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};
