/** @type {import('next').NextConfig} */
module.exports = {
  // Note: 'eslint' config removed in Next.js 16 - use ESLint CLI directly
  // Explicitly set the workspace root to avoid lockfile detection issues
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};
