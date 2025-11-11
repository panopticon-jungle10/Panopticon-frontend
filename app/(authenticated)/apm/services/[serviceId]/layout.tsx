import Sidebar from '@/components/features/apm/services/[serviceId]/Sidebar';

export async function generateStaticParams() {
  // Align with the service names used in the list page
  const services = ['user-service', 'payment-db', 'web-app', 'notification-service'];
  return services.map((id) => ({ serviceId: id }));
}

export default function ApmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
