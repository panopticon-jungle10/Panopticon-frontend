// 기존 대시보드 상세/수정 페이지

'use client';

import { useParams } from 'next/navigation';
import { DashboardEditor } from '@/components/features/apps/dashboard/DashboardEditor';
import { mockDashboards } from '@/components/features/apps/dashboard/mock';

export default function DashboardDetailPage() {
  const { dashboardId } = useParams();
  const dashboard = mockDashboards.find((d) => d.id === dashboardId) ?? null;

  return <DashboardEditor mode="edit" initialData={dashboard} />;
}
