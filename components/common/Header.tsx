'use client';

import Logo from '../icons/Logo';
import Button from '../ui/Button';

export default function UnAuthenticatedHeader({ handleNavigate }: { handleNavigate: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <Logo textSize="text-lg" iconSize="w-7 h-7" />

        <nav className="flex items-center gap-10 text-gray-700">
          <a href="#introduction" className="hover:text-gray-900 transition">
            소개
          </a>
          <a href="#pricing" className="hover:text-gray-900 transition">
            가격
          </a>
          <a href="#docs" className="hover:text-gray-900 transition">
            문서
          </a>
        </nav>

        <Button
          onClick={handleNavigate}
          variant="default"
          className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition"
        >
          회원가입 / 로그인
        </Button>
      </div>
    </header>
  );
}
