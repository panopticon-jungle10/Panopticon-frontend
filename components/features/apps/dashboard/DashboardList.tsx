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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleFavorite = (id: string) => {
    setDashboards((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow border rounded-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h1 className="text-gray-900">대시보드</h1>
          <p className="text-gray-600 text-sm">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center gap-4 border-b bg-white">
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <HiPlus className="w-5 h-5" />
            New Dashboard
          </button>

          <div className="relative ml-auto">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="대시보드 검색…"
              className="w-80 pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 w-12" />
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">대시보드 이름</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">담당자</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">팀</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">인기도</th>
              </tr>
            </thead>

            <tbody>
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
    </div>
  );
}
