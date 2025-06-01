/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Skip specific Node.js modules on the server
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false, // This prevents errors with undici
      };
    }
    return config;
  },
};

module.exports = nextConfig;