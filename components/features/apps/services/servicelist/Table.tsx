// 서비스 목록 테이블 (+페이지네이션)
'use client';

import Table from '@/components/ui/Table';
import Pagination from '@/components/features/apps/services/Pagination';
import type { ServiceSummary } from '@/types/apm';


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
    render: (value: ServiceSummary[keyof ServiceSummary]) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{value as string}</span>
    ),
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
    render: (value: ServiceSummary[keyof ServiceSummary]) => <span>{value as number}ms</span>,
  },
];

interface PaginationControls {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

interface ServiceListTableProps {
  services: ServiceSummary[];
  pagination?: PaginationControls;
  onRowClick: (service: ServiceSummary) => void;
}

export default function ServiceListTable({ services, pagination, onRowClick }: ServiceListTableProps) {
  return (
    <>
      <Table<ServiceSummary> columns={columns} data={services} showFavorite onRowClick={onRowClick} />
      {pagination && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} onPrev={pagination.onPrev} onNext={pagination.onNext} />
      )}
    </>
  );
}
