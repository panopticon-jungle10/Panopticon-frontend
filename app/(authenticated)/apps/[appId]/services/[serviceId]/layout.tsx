'use client';

import { ServiceHeaderNav } from '@/components/common/ServiceHeaderNav';
import Sidebar from '@/components/features/apps/services/[serviceId]/Sidebar';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export const dynamicParams = true;

export default function ApmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname?.includes('/dashboards');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 px-8 py-6">
        <ServiceHeaderNav />
        <div className="flex gap-6">
          {showSidebar && <Sidebar />}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
