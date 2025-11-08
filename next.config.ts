import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // 빌드 결과물을 정적 파일로 내보내기
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
