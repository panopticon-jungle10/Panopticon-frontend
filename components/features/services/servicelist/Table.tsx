// 서비스 목록 테이블 (+페이지네이션)
'use client';

import Table from '@/components/ui/Table';
import Pagination from '@/components/features/services/Pagination';
import type { ServiceSummary } from '@/types/apm';
import type { PaginationControls } from '@/types/servicelist';

const normalizeEnvironmentKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const environmentBadgeStyles: Record<string, string> = {
  production: 'bg-red-50 text-red-700 border border-red-100',
  prod: 'bg-red-50 text-red-700 border border-red-100',
  staging: 'bg-amber-50 text-amber-700 border border-amber-100',
  stage: 'bg-amber-50 text-amber-700 border border-amber-100',
  development: 'bg-blue-50 text-blue-700 border border-blue-100',
  dev: 'bg-blue-50 text-blue-700 border border-blue-100',
  qa: 'bg-purple-50 text-purple-700 border border-purple-100',
  docker: 'bg-sky-50 text-sky-700 border border-sky-100',
  kubernetes: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  k8s: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  vm: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  vmec2등: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  baremetal: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const getEnvironmentBadgeClass = (environment: string) => {
  const normalized = normalizeEnvironmentKey(environment);
  return (
    environmentBadgeStyles[normalized] ?? 'bg-gray-100 text-gray-700 border border-gray-200'
  );
};

const columns = [
  {
    key: 'service_name' as keyof ServiceSummary,
    header: 'Name',
    width: '30%',
  },
  {
    key: 'environment' as keyof ServiceSummary,
    header: 'Environment',
    width: '15%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => {
      const environment = value as string;
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getEnvironmentBadgeClass(
            environment,
          )}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          {environment}
        </span>
      );
    },
  },
  {
    key: 'request_count' as keyof ServiceSummary,
    header: 'Requests',
    width: '15%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => (value as number).toLocaleString(),
  },
  {
    key: 'error_rate' as keyof ServiceSummary,
    header: 'Error Rate',
    width: '15%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => {
      const rate = ((value as number) * 100).toFixed(2);
      return <span>{rate}%</span>;
    },
  },
  {
    key: 'latency_p95_ms' as keyof ServiceSummary,
    header: 'P95 Latency',
    width: '15%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => {
      const latency = (value as number).toFixed(2);
      return <span>{latency}ms</span>;
    },
  },
];

interface ServiceListTableProps {
  services: ServiceSummary[];
  pagination?: PaginationControls;
  onRowClick: (service: ServiceSummary) => void;
}

export default function ServiceListTable({
  services,
  pagination,
  onRowClick,
}: ServiceListTableProps) {
  return (
    <>
      <Table<ServiceSummary>
        columns={columns}
        data={services}
        showFavorite
        onRowClick={onRowClick}
      />
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={pagination.onPrev}
          onNext={pagination.onNext}
        />
      )}
    </>
  );
}
