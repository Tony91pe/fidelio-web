import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next'
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://cdn.crisp.chat https://client.crisp.chat https://*.sentry.io https://js.sentry-cdn.com",
      "style-src 'self' 'unsafe-inline' https://cdn.crisp.chat https://client.crisp.chat",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data: https://cdn.crisp.chat",
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.ingest.sentry.io https://client.crisp.chat wss://client.crisp.chat https://*.neon.tech",
      "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev",
      "worker-src 'self' blob:",
      "media-src 'self'",
    ].join('; '),
  },
]

// CORS solo per endpoint pubblici (PWA, checkin, scanner, webhook)
const publicCorsPaths = [
  '/api/app/:path*',
  '/api/customer/:path*',
  '/api/checkin',
  '/api/scanner/:path*',
  '/api/shops',
  '/api/webhooks/:path*',
  '/api/unsubscribe',
  '/api/referral',
  '/api/testimonials',
  '/api/shop/apply-founder',
]
const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
]

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'getfidelio.app' }],
        destination: 'https://www.getfidelio.app/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      // Security headers su tutte le pagine
      { source: '/(.*)', headers: securityHeaders },
      // CORS solo sulle API pubbliche
      ...publicCorsPaths.map(source => ({ source, headers: corsHeaders })),
    ]
  },
}
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "fidelio-um",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
