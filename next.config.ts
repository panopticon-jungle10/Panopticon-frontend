import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // 외부 이미지를 사용하지 않으므로 remotePatterns 제거 : 로컬 이미지만 사용 (public/ 폴더)

  // 개발/프로덕션 환경별 CORS 헤더 설정
  async headers() {
    const allowedOrigin =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEV_ORIGIN || 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_PROD_ORIGIN || 'https://jungle-panopticon.cloud';

    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigin,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
