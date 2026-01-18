import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, setCsrfTokenCookie, CSRF_COOKIE_NAME } from '@/lib/csrf';

/**
 * GET /api/csrf/token
 * 
 * Returns the current CSRF token or generates a new one.
 * This endpoint is exempt from CSRF protection itself.
 */
export async function GET(request: NextRequest) {
  // Check if we already have a valid token
  let token = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  
  // Generate a new token if none exists
  if (!token) {
    token = generateCsrfToken();
  }
  
  const response = NextResponse.json({ 
    csrfToken: token,
    headerName: 'X-CSRF-Token',
  });
  
  // Set/refresh the cookie
  setCsrfTokenCookie(response, token);
  
  return response;
}
