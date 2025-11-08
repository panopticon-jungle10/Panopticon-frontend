import Sidebar from '@/components/common/app/Sidebar';

export default function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      {/* 본문: 사이드바 너비(w-64 = 256px)만큼 padding-left */}
      <main className="pl-64 p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
