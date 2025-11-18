import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // AWS Amplify 배포 최적화

  // 외부 이미지 호스트 허용 (GitHub, Google 프로필 이미지)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // NEXT_PUBLIC_* 변수는 자동으로 클라이언트에 노출되므로 여기에 명시할 필요 없음
  // 서버 전용 변수(JWT_SECRET, CLIENT_SECRET 등)는 절대 env에 포함하지 말것!
  // Amplify 환경 변수에서 자동으로 로드됨
};

export default nextConfig;
