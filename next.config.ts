import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 필요한 경우 특정 도메인으로 제한
      },
    ],
  },
};

export default nextConfig;
