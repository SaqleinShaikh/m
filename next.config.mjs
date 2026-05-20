/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  experimental: {
    turbo: undefined,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  async redirects() {
    // If in development mode, don't perform any redirects
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/:path*',
        missing: [
          {
            type: 'host',
            value: 'saqleinshaikh.in',
          },
          {
            type: 'host',
            value: 'localhost(?::\\d+)?',
          },
          {
            type: 'host',
            value: '127\\.0\\.0\\.1(?::\\d+)?',
          },
        ],
        destination: 'https://saqleinshaikh.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
