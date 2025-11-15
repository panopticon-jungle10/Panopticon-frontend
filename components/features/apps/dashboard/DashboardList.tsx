// 대시보드 리스트(검색/즐겨찾기 포함)

'use client';

import { useEffect, useState } from 'react';
import { mockDashboards } from './mock';
import { Dashboard } from './types';
import { DashboardListItem } from './DashboardListItem';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';

export function DashboardList({
  onNavigate,
}: {
  onNavigate: (v: 'list' | 'create' | 'view', id?: string) => void;
}) {
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [search, setSearch] = useState('');

  // 검색 기능
  const filtered = dashboards.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow p-0 w-full">
      <div className="px-8 py-7 border-b">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-base text-gray-600 mt-2">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
      </div>

      <div className="px-8 py-4 border-b flex items-center gap-4">
        <button
          onClick={() => onNavigate('create')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     flex items-center gap-2"
        >
          <HiPlus />
          New Dashboard
        </button>

        <div className="relative ml-auto">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="대시보드 검색…"
            className="w-80 pl-9 pr-3 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-8 py-3 w-12" />
              <th className="px-8 py-3 text-left text-xs text-gray-500 uppercase">대시보드 이름</th>
              <th className="px-8 py-3 text-left text-xs text-gray-500 uppercase">담당자</th>
              <th className="px-8 py-3 text-left text-xs text-gray-500 uppercase">팀</th>
              <th className="px-8 py-3 text-left text-xs text-gray-500 uppercase">인기도</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <DashboardListItem
                key={d.id}
                dashboard={d}
                onSelect={(id) => onNavigate('view', id)}
                // 즐겨찾기 토글
                onToggleFavorite={(id) =>
                  setDashboards((prev) =>
                    prev.map((x) => (x.id === id ? { ...x, isFavorite: !x.isFavorite } : x)),
                  )
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
