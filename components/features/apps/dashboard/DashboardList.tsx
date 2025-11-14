'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { useParams } from 'next/navigation';
import { DashboardListItem } from './DashboardListItem';
import type { Dashboard } from './types';

const mockDashboards: Dashboard[] = [
  {
    id: '1',
    name: "bhzsk8rzxe's Dashboard Tue, Oct 28, 11...",
    description: 'Main monitoring dashboard for production services',
    owner: { name: 'bhzsk8rzxe' },
    tags: ['Platform', 'Backend'],
    likes: 12,
    favorite: true,
  },
  {
    id: '2',
    name: 'Postgres - Metrics',
    description: 'PostgreSQL database performance metrics',
    owner: { name: 'bhzsk8rzxe' },
    tags: ['Database'],
    likes: 3,
    favorite: false,
  },
  {
    id: '3',
    name: 'APM Datadog Agent (Trace Agent)',
    description: 'Trace agent monitoring and performance',
    owner: { name: 'robot-datado...' },
    tags: ['APM'],
    likes: 15,
    favorite: false,
  },
  {
    id: '4',
    name: 'Storeding SRE',
    description: 'Site Reliability Engineering dashboard',
    owner: { name: 'robot-datado...' },
    tags: ['SRE'],
    likes: 6,
    favorite: false,
  },
  {
    id: '5',
    name: 'APM Traces Estimated Usage',
    description: 'Estimated usage and costs for APM traces',
    owner: { name: 'bhzsk8rzxe' },
    tags: ['APM', 'Finance'],
    likes: 10,
    favorite: false,
  },
  {
    id: '6',
    name: 'Docker - Overview',
    description: 'Container monitoring and metrics',
    owner: { name: 'bhzsk8rzxe' },
    tags: ['Platform'],
    likes: 14,
    favorite: false,
  },
];

const fetchDashboards = () => {
  return new Promise<Dashboard[]>((resolve) => setTimeout(() => resolve(mockDashboards), 400));
};

export function DashboardList() {
  const params = useParams();
  const appId = params.appId;
  const serviceId = params.serviceId;
  const createLink =
    appId && serviceId ? `/apps/${appId}/services/${serviceId}/dashboards/create` : null;

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    fetchDashboards().then((items) => {
      setDashboards(items);
      setIsLoading(false);
    });
  }, []);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    dashboards.forEach((dashboard) => dashboard.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [dashboards]);

  const filteredDashboards = useMemo(() => {
    return dashboards.filter((dashboard) => {
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        dashboard.name.toLowerCase().includes(normalizedSearch) ||
        dashboard.description.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (filter === 'favorite') {
        return dashboard.favorite;
      }

      if (filter.startsWith('tag:')) {
        const tagValue = filter.replace('tag:', '');
        return dashboard.tags.includes(tagValue);
      }

      return true;
    });
  }, [dashboards, filter, search]);

  const totalCount = filteredDashboards.length;

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-0.5 text-sm font-semibold text-blue-600">
            총 {totalCount}개
          </span>
          <select
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">필터: 전체</option>
            <option value="favorite">필터: 즐겨찾기</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={'tag:' + tag}>
                필터: {tag}
              </option>
            ))}
          </select>
          {createLink && (
            <Link
              href={createLink}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <HiPlus className="h-4 w-4" />
              + New Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-gray-600">검색</div>
          <input
            type="text"
            placeholder="대시보드 검색..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto_auto-auto] px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
        <span className="col-span-1" />
        <span className="col-span-1">대시보드 이름</span>
        <span className="col-span-1">담당자</span>
        <span className="col-span-1">팀</span>
        <span className="col-span-1">인기도</span>
      </div>

      <div className="space-y-0">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-gray-500">대시보드를 불러오는 중...</div>
        ) : filteredDashboards.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">검색 조건에 맞는 대시보드가 없습니다.</div>
        ) : (
          filteredDashboards.map((dashboard) => {
            const href =
              appId && serviceId
                ? '/apps/' + appId + '/services/' + serviceId + '/dashboards/' + dashboard.id
                : '#';

            return <DashboardListItem key={dashboard.id} dashboard={dashboard} href={href} />;
          })
        )}
      </div>
    </div>
  );
}
