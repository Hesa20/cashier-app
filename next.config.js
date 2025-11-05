/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed 'output: export' to enable API rewrites in development
  // For production static export, we'll use env vars to point to Railway backend
  images: {
    unoptimized: true,
  },
  // Enable rewrites for local development API proxy
  async rewrites() {
    // Only use rewrites in development (not in production build)
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4000/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;