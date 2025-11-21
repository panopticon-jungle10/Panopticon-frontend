'use client';

import StateHandler from '@/components/ui/StateHandler';
import ServiceListTable from './Table';
import ServiceCardGrid from './cards/ServiceCardGrid';

import type { CategoryContentProps, ServiceListCategory } from '@/types/servicelist';

export const serviceListCategoryMeta: Record<
  ServiceListCategory,
  { title: string; subtitle: string; stateType: 'table' | 'general' }
> = {
  list: {
    title: 'List',
    subtitle: '테이블 뷰',
    stateType: 'table',
  },
  card: {
    title: 'Card',
    subtitle: '요약 카드',
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
  onCardClick,
  onCreateClick,
  pagination,
}: CategoryContentProps) {
  const cardClickHandler = onCardClick ?? onRowClick;

  if (category === 'list') {
    return (
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
    );
  }

  return (
    <StateHandler
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty}
      type="general"
      height={420}
      loadingMessage="서비스 목록을 불러오는 중..."
      errorMessage="서비스 목록을 불러올 수 없습니다"
      emptyMessage="표시할 서비스가 없습니다"
    >
      <ServiceCardGrid
        services={services}
        onCardClick={cardClickHandler}
        onCreateClick={onCreateClick}
      />
    </StateHandler>
  );
}
