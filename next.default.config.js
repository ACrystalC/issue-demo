// Required to be renamed per netlify-plugin-nextjs.
// NOTE: Could cause issues when using Nx Next.js migrations.

const withNx = require('@nrwl/next/plugins/with-nx');
// const { withSentryConfig } = require('@sentry/nextjs');

/* --------------------------------------------------------
 * Environment Check
 * ------------------------------------------------------*/

const isNetlify = Boolean(process.env.NETLIFY);
const isPreview = process.env.CONTEXT === 'deploy-preview';

/* --------------------------------------------------------
 * Get the active URL
 *
 * Enables support for dynamic URLs for Netlify
 * deploy previews
 * ------------------------------------------------------*/

const url =
  isNetlify && isPreview
    ? process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL
    : process.env.ROOT_URL;

/* --------------------------------------------------------
 * Content Security Policy Configuration
 *
 * TODO: Lock-down, once sources are known.
 * SEE: https://github.com/vercel/next.js/tree/canary/examples/with-strict-csp
 * ------------------------------------------------------*/

const definedPaths = !url.startsWith('https://') ? 'https: http:' : 'https:';
const csp = `default-src ${definedPaths} 'unsafe-inline' 'unsafe-eval'; script-src ${definedPaths} 'unsafe-inline' 'unsafe-eval'; connect-src ${definedPaths} 'unsafe-inline'; img-src ${definedPaths} data: blob: 'unsafe-inline'; frame-src ${definedPaths}; style-src ${definedPaths} 'unsafe-inline';`;

/* --------------------------------------------------------
 * Headers Configuration
 * ------------------------------------------------------*/

const headers = async () => [
  {
    source: '/(.*?)',
    headers: [
      {
        // Allows all. TODO: Lock down
        key: 'Content-Security-Policy',
        value: csp,
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
    ],
  },
];

/* --------------------------------------------------------
 * Nx Configuration
 * ------------------------------------------------------*/

const nx = {
  nx: {
    svgr: true,
  },
  distDir: '.dist'
};

/* --------------------------------------------------------
 * Environment Variables
 *
 * SEE: https://nextjs.org/docs/api-reference/next.config.js/environment-variables
 * ------------------------------------------------------*/

// Env vars placed here will be interpolated into the code.
// This is incredibly helpful for API routes as Netlify
// doesn't handle provide the CONTEXT env, by default,
// on Functions.

// This relies on the netlify-contextual-env build plugin
// to overwrite environment variables based on the Netlify
// context.

const env = {
  CONTEXT: (process.env.CONTEXT || 'development').replace(/-/g, '_'),
  ROOT_URL: url,
  PORTAL_ENDPOINT:
    process.env.NEXT_PUBLIC_PORTAL_ENDPOINT || process.env.PORTAL_ENDPOINT,
  PROJECT_NAME: process.env.PROJECT_NAME,
  // SENTRY_DEBUG: Boolean(process.env.SENTRY_DEBUG),
  // SENTRY_PROJECT: process.env.SENTRY_PROJECT,
};

/* --------------------------------------------------------
 * Next Configuration
 * ------------------------------------------------------*/

const NextOptions = {
  ...nx,
  poweredByHeader: false,
  target: 'experimental-serverless-trace',
  env,
  headers,
};

/* --------------------------------------------------------
 * Export
 * ------------------------------------------------------*/

module.exports = withNx(NextOptions)
