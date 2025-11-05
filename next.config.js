/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Note: rewrites() is not compatible with static export
  // API calls should use absolute URLs from environment variables
};

module.exports = nextConfig;