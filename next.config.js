/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // ⭐ PENTING: Export sebagai static site
  images: {
    unoptimized: true, // ⭐ PENTING: Required untuk static export
  },
  // Proxy `/api/*` to the Hapi backend server during development
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:4000/api/:path*',
          },
        ]
      : [];
  },
};

module.exports = nextConfig;