// 서비스 목록 테이블 (+페이징)
'use client';

import { useEffect, useMemo, useState } from 'react';
import Table, { type TableColumn } from '@/components/ui/Table';
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
  vmec2: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  baremetal: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const getEnvironmentBadgeClass = (environment: string) =>
  environmentBadgeStyles[normalizeEnvironmentKey(environment)] ??
  'bg-gray-100 text-gray-700 border border-gray-200';

type ServiceTableRow = ServiceSummary & { isFavorite: boolean };

const columns: TableColumn<ServiceTableRow>[] = [
  {
    key: 'service_name',
    header: 'Name',
    width: '30%',
  },
  {
    key: 'environment',
    header: 'Environment',
    width: '15%',
    render: (value) => {
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
    key: 'request_count',
    header: 'Requests',
    width: '15%',
    render: (value) => (value as number).toLocaleString(),
  },
  {
    key: 'error_rate',
    header: 'Error Rate',
    width: '15%',
    render: (value) => {
      const rate = ((value as number) * 100).toFixed(2);
      return <span>{rate}%</span>;
    },
  },
  {
    key: 'latency_p95_ms',
    header: 'P95 Latency',
    width: '15%',
    render: (value) => {
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
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFavoriteMap((prev) => {
      const next = { ...prev };
      services.forEach((service) => {
        if (next[service.service_name] === undefined) {
          next[service.service_name] = false;
        }
      });
      return next;
    });
  }, [services]);

  const handleFavoriteClick = (row: ServiceTableRow, _index?: number) => {
    setFavoriteMap((prev) => ({
      ...prev,
      [row.service_name]: !prev[row.service_name],
    }));
  };

  const tableData: ServiceTableRow[] = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        isFavorite: favoriteMap[service.service_name] ?? false,
      })),
    [favoriteMap, services],
  );

  return (
    <>
      <Table<ServiceTableRow>
        columns={columns}
        data={tableData}
        showFavorite
        onFavoriteClick={handleFavoriteClick}
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
