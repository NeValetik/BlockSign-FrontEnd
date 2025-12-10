import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    },
  },
  // Security headers configuration
  async headers() {
    // Get API URL from environment variable for CSP
    const apiUrl = process.env.API_URL;
    const apiOrigin = apiUrl ? new URL(apiUrl).origin : '';
    
    // Build connect-src directive for CSP
    const connectSrc = apiOrigin 
      ? `'self' ${apiOrigin}`
      : "'self'";
    
    // Build img-src directive - allow API origin for images if needed, but no wildcard
    const imgSrc = apiOrigin
      ? `'self' data: ${apiOrigin}`
      : "'self' data:";
    
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Content Security Policy (CSP) - strict configuration
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js 15 uses nonces for scripts - strict-dynamic allows scripts loaded by trusted scripts
              "script-src 'self' 'strict-dynamic'",
              // Styles - removed unsafe-inline for better security
              // If styles break, you may need to add 'unsafe-inline' back
              "style-src 'self'",
              // Images from self, data URIs, and specific API origin (no wildcard)
              `img-src ${imgSrc}`,
              "font-src 'self' data:",
              `connect-src ${connectSrc}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Anti-clickjacking header (X-Frame-Options)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options header
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-XSS-Protection header
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer-Policy header
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy header
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
            ].join(', '),
          },
          // Strict-Transport-Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  // Remove X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
