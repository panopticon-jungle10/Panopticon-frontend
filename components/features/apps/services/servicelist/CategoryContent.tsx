// 선택된 카테고리에 맞춰 테이블/카드 콘텐츠를 분기

'use client';

import StateHandler from '@/components/ui/StateHandler';
import ServiceListTable from './Table';
import ServiceMetricGrid from './MetricGrid';
import Pagination from '@/components/features/apps/services/Pagination';

import type { CategoryContentProps, MetricKey, ServiceListCategory } from '@/types/servicelist';

export const serviceListCategoryMeta: Record<
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
    title: 'Latency(P95)',
    subtitle: '서비스별 지연 현황',
    metricKey: 'latency_p95_ms',
    stateType: 'general',
  },
};

export default function CategoryContent({
  category,
  services,
  isLoading,
  isError,
  isEmpty,
  onRowClick,
  pagination,
}: CategoryContentProps) {
  const meta = serviceListCategoryMeta[category];

  return (
    <>
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
      {pagination && category !== 'list' && (
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
