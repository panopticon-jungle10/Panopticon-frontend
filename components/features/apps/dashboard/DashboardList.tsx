'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import { DashboardListItem } from './DashboardListItem';
import { Dashboard } from './types';
import { mockDashboards } from './mock';
import { useParams } from 'next/navigation';

export function DashboardList() {
  const { appId, serviceId } = useParams();
  const createPath = `/apps/${appId}/services/${serviceId}/dashboards/create`;

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDashboards(mockDashboards);
      setIsLoading(false);
    }, 400);
  }, []);

  const filtered = dashboards.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200">

      {/* Header */}
      <div className="px-8 py-7 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-base text-gray-600">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 flex items-center gap-4 border-b border-gray-200">
        <Link
          href={createPath}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <HiPlus className="w-5 h-5" />
          New Dashboard
        </Link>

        <div className="relative ml-auto">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="w-80 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
            placeholder="대시보드 검색…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-12 px-8 py-3"></th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500">대시보드 이름</th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500">담당자</th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500">팀</th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500">인기도</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>
            ) : (
              filtered.map(d => (
                <DashboardListItem
                  key={d.id}
                  dashboard={d}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
