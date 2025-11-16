'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import SearchInput from '@/components/ui/SearchInput';
import { SelectDate } from '@/components/features/apps/services/SelectDate';
import PageSizeSelect from '@/components/features/apps/services/PageSizeSelect';
import ServiceListSidebar from '@/components/features/apps/services/servicelist/Sidebar';
import CategoryContent from '@/components/features/apps/services/servicelist/CategoryContent';
import { getServices } from '@/src/api/apm';
import type { ServiceSummary } from '@/types/apm';
import type { ServiceListCategory } from '@/types/servicelist';

export default function ServicesPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.appId as string;

  const [category, setCategory] = useState<ServiceListCategory>('list');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const timeRange = useMemo(() => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    return {
      from: twoWeeksAgo.toISOString(),
      to: now.toISOString(),
    };
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['services', appId, timeRange],
    queryFn: () =>
      getServices({
        limit: 1000,
        ...timeRange,
      }),
  });

  const services = data?.services ?? [];

  const filteredServices = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return services;
    return services.filter(
      (service) =>
        service.service_name.toLowerCase().includes(keyword) ||
        service.environment.toLowerCase().includes(keyword),
    );
  }, [services, searchKeyword]);

  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedServices = useMemo(() => {
    if (category !== 'list') {
      return filteredServices;
    }
    const start = (page - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [category, filteredServices, page, pageSize]);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const handleCategoryChange = (nextCategory: ServiceListCategory) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleServiceRowClick = (service: ServiceSummary) => {
    router.push(`/apps/${appId}/services/${service.service_name}`);
  };

  const showPagination = category === 'list';
  const isEmpty = !isLoading && filteredServices.length === 0;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">서비스 목록</h1>
        <p className="text-sm text-gray-500 mt-1">좌측 사이드바에서 원하는 지표를 선택하세요.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={searchKeyword}
          onChange={(event) => {
            setSearchKeyword(event.target.value);
            setPage(1);
          }}
          placeholder="서비스 검색..."
          className="w-full md:w-80 h-10"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <SelectDate />
          {showPagination && (
            <PageSizeSelect
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setPage(1);
              }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-64 shrink-0">
          <ServiceListSidebar value={category} onChange={handleCategoryChange} />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryContent
            category={category}
            services={paginatedServices}
            fullCount={filteredServices.length}
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            onRowClick={handleServiceRowClick}
            pagination={
              showPagination
                ? {
                    page,
                    totalPages,
                    onPrev: handlePrev,
                    onNext: handleNext,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
