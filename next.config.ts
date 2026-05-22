import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  /**
   * Dev: keep webpack cache ON (faster repeat navigations).
   * compression: false avoids corrupt .pack.gz on some Windows setups.
   * If you see missing chunk / routes-manifest errors: npm run dev:reset
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        compression: false,
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
};

export default nextConfig;
