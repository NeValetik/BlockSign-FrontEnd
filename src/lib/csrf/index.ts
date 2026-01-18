/**
 * CSRF Protection Utility
 * 
 * Implements the Double-Submit Cookie pattern for CSRF protection.
 * 
 * How it works:
 * 1. Server generates a random token and sets it in a cookie
 * 2. Client must include this token in the request header (X-CSRF-Token)
 * 3. Server validates that the cookie value matches the header value
 * 
 * Why this works:
 * - Attackers can't read cookies from another origin (Same-Origin Policy)
 * - Attackers can't set custom headers on cross-origin requests
 * - So only legitimate requests from our frontend can include the matching token
 */

import { NextRequest, NextResponse } from 'next/server';

// Configuration
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

// Methods that require CSRF protection (state-changing methods)
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Paths that are exempt from CSRF protection
const EXEMPT_PATHS = [
  '/api/auth', // NextAuth handles its own CSRF
  '/api/csrf/token', // Token generation endpoint
];

/**
 * Generate a cryptographically secure random token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the request path is exempt from CSRF protection
 */
function isExemptPath(pathname: string): boolean {
  return EXEMPT_PATHS.some(path => pathname.startsWith(path));
}

/**
 * Check if the request method requires CSRF protection
 */
function requiresCsrfProtection(method: string): boolean {
  return PROTECTED_METHODS.includes(method.toUpperCase());
}

/**
 * Validate Origin/Referer header
 * Provides additional protection against CSRF attacks
 */
function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // For same-origin requests, Origin might not be present
  if (!origin && !referer) {
    // Allow requests without Origin/Referer if they're from safe methods
    // or if they're not API requests
    return !requiresCsrfProtection(request.method);
  }
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);
  
  if (!requestOrigin) {
    return false;
  }
  
  return allowedOrigins.some(allowed => requestOrigin === allowed);
}

/**
 * CSRF Protection result
 */
export interface CsrfValidationResult {
  valid: boolean;
  error?: string;
  shouldSetToken?: boolean;
  token?: string;
}

/**
 * Validate CSRF token from request
 * Returns validation result with error message if invalid
 */
export function validateCsrfToken(request: NextRequest): CsrfValidationResult {
  const pathname = request.nextUrl.pathname;
  
  // Skip validation for exempt paths
  if (isExemptPath(pathname)) {
    return { valid: true };
  }
  
  // Skip validation for safe methods (GET, HEAD, OPTIONS)
  if (!requiresCsrfProtection(request.method)) {
    // But ensure we have a token cookie for future requests
    const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    if (!existingToken) {
      const newToken = generateCsrfToken();
      return { valid: true, shouldSetToken: true, token: newToken };
    }
    return { valid: true };
  }
  
  // For protected methods, validate the token
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  // Check if both tokens exist
  if (!cookieToken) {
    return { 
      valid: false, 
      error: 'CSRF token cookie missing. Please refresh the page and try again.' 
    };
  }
  
  if (!headerToken) {
    return { 
      valid: false, 
      error: 'CSRF token header missing. Please ensure your request includes the X-CSRF-Token header.' 
    };
  }
  
  // Compare tokens using timing-safe comparison
  if (!timingSafeEqual(cookieToken, headerToken)) {
    return { 
      valid: false, 
      error: 'CSRF token mismatch. Please refresh the page and try again.' 
    };
  }
  
  return { valid: true };
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Set CSRF token cookie on response
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Create CSRF error response
 */
export function createCsrfErrorResponse(message: string): NextResponse {
  return NextResponse.json(
    { error: 'CSRF validation failed', message },
    { status: 403 }
  );
}

/**
 * Validate Origin header for additional security
 */
export function validateRequestOrigin(request: NextRequest): CsrfValidationResult {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  // Skip origin validation for non-mutating requests
  if (!requiresCsrfProtection(request.method)) {
    return { valid: true };
  }
  
  // Skip for exempt paths
  if (isExemptPath(request.nextUrl.pathname)) {
    return { valid: true };
  }
  
  // If Origin header is present, validate it
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const expectedHost = host?.split(':')[0]; // Remove port if present
      const originHost = originUrl.hostname;
      
      if (originHost !== expectedHost && originHost !== 'localhost') {
        return {
          valid: false,
          error: `Origin mismatch: expected ${expectedHost}, got ${originHost}`
        };
      }
    } catch {
      return { valid: false, error: 'Invalid Origin header' };
    }
  }
  
  return { valid: true };
}

// Export constants for use in other modules
export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
