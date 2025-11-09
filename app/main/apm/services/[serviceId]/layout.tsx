import Sidebar from '@/components/common/app/Sidebar';

// Next.js 정적 export를 위한 함수
export async function generateStaticParams() {
  // 정적으로 빌드할 서비스 목록
  const services = ['auth', 'user', 'frontend', 'backend', 'payment'];
  return services.map((id) => ({
    serviceId: id,
  }));
}

export default function ApmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* 좌측 사이드바 */}
      <Sidebar />

      {/* 본문 */}
      <main className="flex-1 pl-64 p-6 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
