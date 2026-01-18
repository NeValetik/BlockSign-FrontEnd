import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  validateCsrfToken, 
  validateRequestOrigin, 
  setCsrfTokenCookie, 
  createCsrfErrorResponse,
  generateCsrfToken,
  CSRF_COOKIE_NAME
} from '@/lib/csrf';

/**
 * Security middleware for CSP, CSRF protection, and other security headers.
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 * CSRF PROTECTION
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * This middleware implements the Double-Submit Cookie pattern:
 * 1. A CSRF token is set in a cookie (readable by JavaScript)
 * 2. Client must send the token in the X-CSRF-Token header
 * 3. Server validates that cookie and header values match
 * 
 * Protected: POST, PUT, PATCH, DELETE requests to /api/* (except /api/auth/*)
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 * IMPORTANT: CSP CONFIGURATION FOR NEXT.JS APPLICATIONS
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * This CSP configuration balances security with Next.js/React compatibility.
 * Some directives require specific values due to framework requirements:
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SCRIPT-SRC: 'unsafe-inline' + 'strict-dynamic'                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ • Next.js injects inline scripts for hydration and React state             │
 * │ • 'strict-dynamic' mitigates this in modern browsers (Chrome 52+, FF 52+)  │
 * │ • In modern browsers, 'unsafe-inline' is IGNORED when 'strict-dynamic' is  │
 * │   present - only scripts loaded by trusted scripts can execute             │
 * │ • 'unsafe-inline' serves as fallback for older browsers only               │
 * │ • 'unsafe-eval' has been REMOVED (not required by Next.js 15 in prod)      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STYLE-SRC: 'unsafe-inline' (REQUIRED - ACCEPTED TRADE-OFF)                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ • Framer Motion: Injects inline styles via JS for animations               │
 * │ • Radix UI: Injects positioning styles dynamically for accessibility       │
 * │ • Tailwind CSS: Uses @theme inline for CSS custom properties               │
 * │                                                                             │
 * │ WHY NONCES DON'T WORK FOR STYLES:                                           │
 * │ • These libraries mutate element.style directly via JavaScript              │
 * │ • Nonces must be known at render time, but styles are injected at runtime  │
 * │ • Every animation frame would violate CSP with nonces                       │
 * │                                                                             │
 * │ SECURITY IMPACT: LOW                                                        │
 * │ • CSS cannot execute JavaScript or directly steal data                      │
 * │ • Main CSS attacks (exfiltration, UI redress) are mitigated by:            │
 * │   - frame-ancestors 'none' (prevents clickjacking)                          │
 * │   - No vulnerable attribute selector patterns in codebase                   │
 * │ • This is the industry-standard approach for React + animation libraries   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * Reference: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ══════════════════════════════════════════════════════════════════════════
  // CSRF Protection for API routes
  // ══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith('/api/')) {
    // Validate Origin header first
    const originValidation = validateRequestOrigin(request);
    if (!originValidation.valid) {
      console.warn(`CSRF Origin validation failed: ${originValidation.error}`);
      return createCsrfErrorResponse(originValidation.error || 'Origin validation failed');
    }
    
    // Validate CSRF token
    const csrfValidation = validateCsrfToken(request);
    if (!csrfValidation.valid) {
      console.warn(`CSRF Token validation failed: ${csrfValidation.error}`);
      return createCsrfErrorResponse(csrfValidation.error || 'CSRF validation failed');
    }
    
    // If we need to set a new token, do it on the response
    if (csrfValidation.shouldSetToken && csrfValidation.token) {
      const response = NextResponse.next();
      setCsrfTokenCookie(response, csrfValidation.token);
      return response;
    }
  }
  
  // ══════════════════════════════════════════════════════════════════════════
  // Ensure CSRF token cookie exists for all page requests
  // ══════════════════════════════════════════════════════════════════════════
  const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const shouldSetCsrfToken = !existingToken;
  const newCsrfToken = shouldSetCsrfToken ? generateCsrfToken() : undefined;
  // Get API URL from environment variable for CSP
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const apiOrigin = apiUrl ? new URL(apiUrl).origin : '';

  // Build connect-src directive for CSP
  const connectSrc = apiOrigin
    ? `'self' ${apiOrigin}`
    : "'self'";

  // Build img-src directive - RESTRICTED to address OWASP finding #2
  // Only allow images from: self, data URIs, blob URIs, and the API server
  const imgSrc = apiOrigin
    ? `'self' data: blob: ${apiOrigin}`
    : "'self' data: blob:";

  // Build the CSP header
  // CHANGES made to address OWASP findings:
  // - Removed 'unsafe-eval' from script-src (finding #3)
  // - Added 'strict-dynamic' to mitigate 'unsafe-inline' (finding #4)
  // - Restricted img-src from 'https:' to specific sources (finding #2)
  const cspHeader = [
    "default-src 'self'",
    // Scripts: 'strict-dynamic' makes 'unsafe-inline' ignored in modern browsers
    // Only scripts loaded by trusted scripts can execute (see header comment for details)
    "script-src 'self' 'unsafe-inline' 'strict-dynamic'",
    // Styles: 'unsafe-inline' required for Framer Motion, Radix UI, Tailwind
    // This is an accepted LOW-SEVERITY trade-off (see header comment for details)
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  // Create the response
  const response = NextResponse.next();

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Set CSRF token cookie if needed
  if (shouldSetCsrfToken && newCsrfToken) {
    setCsrfTokenCookie(response, newCsrfToken);
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files - have their own headers in next.config.ts)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (svg, png, jpg, etc.)
     * 
     * NOTE: API routes are NOW included for CSRF protection
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
