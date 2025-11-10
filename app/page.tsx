'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/icons/Logo';

export default function LandingPage() {
  const router = useRouter();
  const handleNavigate = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Logo textSize="text-lg" iconSize="w-7 h-7" />

          <nav className="flex items-center gap-10">
            <a href="#introduction" className="text-gray-700 hover:text-gray-900 transition">
              Introduction
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition">
              Pricing
            </a>
            <a href="#docs" className="text-gray-700 hover:text-gray-900 transition">
              Docs
            </a>
          </nav>

          <button
            onClick={handleNavigate}
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition"
          >
            회원가입 / 로그인
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20 text-center">
        <h1
          className="text-gray-900 font-serif mb-20"
          style={{
            fontSize: '6rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            fontFamily: 'Georgia, serif',
          }}
        >
          Monitor everything.
        </h1>

        {/* 그래프형 대시보드 Mockup */}
        <div className="relative max-w-5xl mx-auto rounded-[2rem] border border-black overflow-hidden shadow-xl bg-[#f9f9f9]">
          <div className="p-8 text-left">
            <div className="text-sm text-gray-600 mb-4">Reports / Overview</div>
            <div className="mb-10">
              <div className="text-5xl text-gray-900 mb-1">78%</div>
              <div className="text-gray-600">Efficiency Improvements</div>
            </div>

            {/* Requests & Errors */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="font-medium text-gray-800 mb-2">Requests & Errors</div>
                <div className="flex items-end justify-between h-24">
                  {[80, 65, 72, 50, 85, 75, 90].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 bg-blue-400/70 rounded-t"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="font-medium text-gray-800 mb-2">Errors</div>
                <div className="flex items-end justify-between h-24">
                  {[20, 35, 10, 25, 45, 30, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 bg-red-400/70 rounded-t"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latency */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="font-medium text-gray-800 mb-4">Latency (ms)</div>
              <svg viewBox="0 0 100 30" className="w-full h-24">
                <path
                  d="M0,20 Q20,10 40,15 T80,10 T100,20"
                  stroke="#335ef7"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M0,24 Q20,16 40,18 T80,15 T100,22"
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M0,26 Q20,22 40,25 T80,28 T100,26"
                  stroke="#f97316"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* 상단 우측 버튼 */}
          <div className="absolute top-6 right-8 bg-white border border-gray-300 text-xs px-4 py-2 rounded-full shadow-sm text-gray-700">
            All Regions (33) ▼
          </div>
        </div>
      </section>

      {/* 하단 회색 배경 블록 */}
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-[#e5e7eb] rounded-t-[2.5rem]" />
    </div>
  );
}
