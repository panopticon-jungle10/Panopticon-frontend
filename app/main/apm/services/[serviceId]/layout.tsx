import Sidebar from '@/components/common/app/Sidebar';

export default function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-[64px] w-64 h-[calc(100vh-64px)] border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 pt-[64px] p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
