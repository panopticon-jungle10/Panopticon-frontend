'use client';

import { useEffect, useState } from 'react';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import { Dashboard } from './types';
import { DashboardListItem } from './DashboardListItem';

interface Props {
  onNavigate: (view: 'list' | 'create' | 'view', dashboardId?: string) => void;
}

export function DashboardList({ onNavigate }: Props) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      const { mockDashboards } = await import('./mock');
      setDashboards(mockDashboards);
      setIsLoading(false);
    };
    load();
  }, []);

  const filtered = dashboards.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleFavorite = (id: string) => {
    setDashboards((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-0 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-7 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-base text-gray-600 mt-2">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
          hover:bg-blue-700 transition font-medium"
        >
          <HiPlus className="w-5 h-5" />
          New Dashboard
        </button>

        <div className="relative ml-auto">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="대시보드 검색…"
            className="w-80 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full">
          {/* THEAD  */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-8 py-3 w-12"></th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                대시보드 이름
              </th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                담당자
              </th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                팀
              </th>
              <th className="px-8 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                인기도
              </th>
            </tr>
          </thead>

          {/* TBODY */}
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  Loading dashboards…
                </td>
              </tr>
            ) : (
              paginated.map((d) => (
                <DashboardListItem
                  key={d.id}
                  dashboard={d}
                  onSelect={(id) => onNavigate('view', id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
