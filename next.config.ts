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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://*.getfidelio.app https://cdn.crisp.chat https://client.crisp.chat https://*.sentry.io https://js.sentry-cdn.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://cdn.crisp.chat https://client.crisp.chat https://fonts.googleapis.com",
      // img-src: rimosso http: (solo HTTPS), specificati domini noti
      "img-src 'self' data: blob: https://images.clerk.dev https://*.clerk.com https://img.crisp.chat https://client.crisp.chat https://www.getfidelio.app https://app.fidelio.app",
      "font-src 'self' data: https://cdn.crisp.chat https://client.crisp.chat https://fonts.gstatic.com",
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.getfidelio.app https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://client.crisp.chat wss://client.crisp.chat wss://client.relay.crisp.chat https://*.neon.tech https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
      "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev",
      "worker-src 'self' blob:",
      "media-src 'self'",
      // Direttive mancanti segnalate da ZAP
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
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
// CORS ristretto alle origini note invece di wildcard *
const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: 'https://app.fidelio.app' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
  { key: 'Vary', value: 'Origin' },
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
