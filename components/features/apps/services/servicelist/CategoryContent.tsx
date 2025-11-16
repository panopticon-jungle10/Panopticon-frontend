'use client';

import StateHandler from '@/components/ui/StateHandler';
import type { ServiceSummary } from '@/types/apm';
import ServiceListTable from './Table';
import ServiceMetricGrid from './MetricGrid';
import type { MetricKey, ServiceListCategory } from '@/types/servicelist';

interface PaginationControls {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

interface CategoryContentProps {
  category: ServiceListCategory;
  services: ServiceSummary[];
  fullCount: number;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRowClick: (service: ServiceSummary) => void;
  pagination?: PaginationControls;
}

const categoryMeta: Record<
  ServiceListCategory,
  { title: string; subtitle: string; metricKey?: MetricKey; stateType: 'table' | 'general' }
> = {
  list: {
    title: '리스트',
    subtitle: '서비스 테이블 뷰',
    stateType: 'table',
  },
  request_count: {
    title: '요청수 (Request Count)',
    subtitle: '서비스별 트래픽 규모',
    metricKey: 'request_count',
    stateType: 'general',
  },
  error_rate: {
    title: '에러율 (Error Rate)',
    subtitle: '서비스별 장애 상태',
    metricKey: 'error_rate',
    stateType: 'general',
  },
  latency: {
    title: '레이턴시 (P95 Latency)',
    subtitle: '서비스별 지연 현황',
    metricKey: 'latency_p95_ms',
    stateType: 'general',
  },
};

export default function CategoryContent({
  category,
  services,
  fullCount,
  isLoading,
  isError,
  isEmpty,
  onRowClick,
  pagination,
}: CategoryContentProps) {
  const meta = categoryMeta[category];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">{meta.subtitle}</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{meta.title}</h2>
          <span className="text-xs text-gray-400">{fullCount}개 서비스</span>
        </div>
      </div>

      {category === 'list' ? (
        <StateHandler
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          type="table"
          height={500}
          loadingMessage="서비스 목록을 불러오는 중..."
          errorMessage="서비스 목록을 불러올 수 없습니다"
          emptyMessage="표시할 서비스가 없습니다"
        >
          <ServiceListTable services={services} pagination={pagination} onRowClick={onRowClick} />
        </StateHandler>
      ) : (
        <StateHandler
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          type="general"
          height={420}
          loadingMessage="서비스 지표를 불러오는 중..."
          errorMessage="서비스 지표를 불러올 수 없습니다"
          emptyMessage="표시할 서비스가 없습니다"
        >
          {meta.metricKey && <ServiceMetricGrid services={services} metric={meta.metricKey} />}
        </StateHandler>
      )}
    </section>
  );
}
