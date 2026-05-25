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
    // If running locally or in development, never perform production redirects
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ||
      process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost') ||
      process.env.NEXT_PUBLIC_APP_URL?.includes('127.0.0.1') ||
      process.env.NEXT_PUBLIC_BASE_URL?.includes('127.0.0.1')
    ) {
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
