'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import { DashboardList } from '@/components/features/apps/dashboard/DashboardList';

export default function ServiceDashboardsPage() {
  const params = useParams();
  const appId = params.appId;
  const serviceId = params.serviceId;

  if (!appId || !serviceId) {
    return null;
  }

  const createLink = '/apps/' + appId + '/services/' + serviceId + '/dashboards/create';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
        </div>
        <Link
          href={createLink}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Dashboard
          <FiChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <DashboardList />
    </div>
  );
}
