import Sidebar from '@/components/features/apm/services/service_id/Sidebar';

export async function generateStaticParams() {
  const services = ['auth', 'user', 'frontend', 'backend', 'payment'];
  return services.map((id) => ({ serviceId: id }));
}

export default function ApmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64 p-6 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
