'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BiBug, BiGridAlt } from 'react-icons/bi';
import SearchInput from '@/components/ui/SearchInput';
import Table from '@/components/ui/Table';
import { getServices } from '@/src/api/apm';
import { ServiceSummary } from '@/types/apm';
import StateHandler from '@/components/ui/StateHandler';

// Table Column 정의 (API 응답 기반)
const columns = [
  {
    key: 'service_name' as keyof ServiceSummary,
    header: 'Service',
    width: '35%',
  },
  {
    key: 'request_count' as keyof ServiceSummary,
    header: 'Requests',
    width: '25%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => (value as number).toLocaleString(),
  },
  {
    key: 'latency_p95_ms' as keyof ServiceSummary,
    header: 'P95 Latency',
    width: '20%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => (
      <span className="flex items-center gap-1">{value as number}ms</span>
    ),
  },
  {
    key: 'error_rate' as keyof ServiceSummary,
    header: 'Error Rate',
    width: '20%',
    render: (value: ServiceSummary[keyof ServiceSummary]) => (
      <span className={(value as number) > 0.02 ? 'text-red-600 font-semibold' : ''}>
        {((value as number) * 100).toFixed(2)}%
      </span>
    ),
  },
];

export default function ApmPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 타임스탬프는 useMemo로 안정화
  const timeRange = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return {
      from: oneHourAgo.toISOString(),
      to: now.toISOString(),
    };
  }, []);

  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ['services', timeRange],
    queryFn: () => getServices(timeRange),
  });

  // 검색 필터링
  const filteredServices =
    servicesData?.services.filter((service) =>
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const isServicesEmpty = filteredServices.length === 0;

  // 테이블 행 클릭 핸들러
  const handleServiceRowClick = (service: ServiceSummary) => {
    router.push(`/apm/services/${service.service_name}`);
  };

  return (
    <>
      <div className="p-8 bg-gray-50 h-full space-y-6">
        {/* APM Services */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <BiGridAlt className="w-5 h-5 text-purple-500" />
              <h3 className="text-gray-900 text-sm">APM Services</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">1h</span>
              <span className="text-gray-500 text-xs">Past 1 Hour</span>
            </div>

            {/* 검색창 + 필터 드롭다운 */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services"
                />
              </div>
              <select className="text-xs border border-gray-300 rounded px-3 py-2 text-gray-600">
                <option>env:sre-in-practice</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <StateHandler
            isLoading={servicesLoading}
            isError={servicesError}
            isEmpty={isServicesEmpty}
            type="table"
            height={400}
            loadingMessage="서비스 목록을 불러오는 중..."
            errorMessage="서비스 목록을 불러올 수 없습니다"
            emptyMessage={
              searchQuery ? '검색 조건에 맞는 서비스가 없습니다' : '표시할 서비스가 없습니다'
            }
          >
            <Table<ServiceSummary>
              columns={columns}
              data={filteredServices}
              showFavorite={true}
              className="w-full"
              onRowClick={handleServiceRowClick}
            />
          </StateHandler>
        </div>

        {/* Issues Section - Temporarily hidden (API endpoint not available in new spec) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BiBug className="w-4 h-4 text-purple-500" />
              <h3 className="text-gray-900 text-sm">Issues</h3>
            </div>
          </div>

          {/* Content */}
          <StateHandler
            isLoading={false}
            isError={false}
            isEmpty={true}
            type="general"
            height={200}
            emptyMessage="감지된 이슈가 없습니다"
          >
            {/* TODO : Issues content will be rendered here when API is available */}
            <div />
          </StateHandler>
        </div>
      </div>
    </>
  );
}
