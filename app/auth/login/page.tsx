'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Logo from '@/components/icons/Logo';

export default function LoginPage() {
  const router = useRouter();

  const handleGithubLogin = () => {
    // TODO: GitHub OAuth 연동
    router.push('/main');
  };

  const handleGoogleLogin = () => {
    // TODO: Google OAuth 연동
    router.push('/main');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* 로고 + 제목 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo iconSize="w-14 h-14" textSize="text-3xl" />
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
        </div>

        {/* 버튼 */}
        <div className="rounded-2xl border shadow-sm p-6 bg-white">
          <div className="space-y-4">
            <Button
              onClick={handleGithubLogin}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              {/* GitHub 아이콘 */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385..." />
              </svg>
              Continue with GitHub
            </Button>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              {/* Google 아이콘 */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
