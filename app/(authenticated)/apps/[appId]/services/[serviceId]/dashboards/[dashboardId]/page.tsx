'use client';

import { useParams } from 'next/navigation';
import { DashboardEditor } from '@/components/features/apps/dashboard/DashboardEditor';
import { mockDashboards } from '@/components/features/apps/dashboard/mock';

export default function DashboardDetailPage() {
  const { dashboardId } = useParams();
  const dashboard = mockDashboards.find(d => d.id === dashboardId);

  return (
    <DashboardEditor
      mode="edit"
      initialData={dashboard}
    />
  );
}
