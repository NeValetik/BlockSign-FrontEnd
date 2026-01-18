import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    },
  },
  // Security headers configuration
  // Note: Main CSP headers are now set in middleware.ts for nonce support
  // These headers apply to static files that bypass middleware
  async headers() {
    return [
      {
        // Security headers for static files (middleware doesn't run for these)
        source: '/_next/static/:path*',
        headers: [
          // Restrict CORS for static files - only allow same origin
          {
            key: 'Access-Control-Allow-Origin',
            value: '', // Empty value effectively disables CORS
          },
          // X-Content-Type-Options header
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Cache control for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers for API routes
        source: '/api/:path*',
        headers: [
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
