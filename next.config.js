/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

// Only add rewrites in development (not compatible with static export)
if (process.env.NODE_ENV === 'development' && !process.env.NETLIFY) {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  };
} else {
  // Use static export for production (Netlify)
  nextConfig.output = 'export';
}

module.exports = nextConfig;