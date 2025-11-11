import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 빌드 결과물을 정적 파일로 내보내기
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 프로덕션 빌드에서 MSW 관련 파일 제외
  webpack: (config, { isServer, dev }) => {
    // 프로덕션 빌드 시 MSW 관련 모듈 무시
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // MSW를 빈 모듈로 대체 (프로덕션에서 번들 제외)
        'msw/browser': false,
        msw: false,
      };
    }
    return config;
  },
};

export default nextConfig;
