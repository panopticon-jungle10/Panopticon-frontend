'use client';

import { useState, useEffect } from 'react';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiArrowLeft,
  HiChevronDown,
  HiShare,
  HiEye,
  HiCog6Tooth,
  HiXMark,
  HiClock,
  HiPlay,
  HiPause,
  HiOutlineStar,
  HiStar,
  HiHeart,
} from 'react-icons/hi2';
import { DashboardCanvas } from '@/components/features/apps/dashboard/DashboardCanvas';
import { DashboardWidgetPanel } from '@/components/features/apps/dashboard/DashboardWidgetPanel';
import {
  Dashboard,
  DashboardWidget,
  CanvasWidget,
} from '@/components/features/apps/dashboard/types';

// Mock data
const mockDashboards: Dashboard[] = [
  {
    id: '1',
    name: "bhzsk8rzxe's Dashboard Tue, Oct 28, 11...",
    description: 'Main monitoring dashboard for production services',
    author: { name: 'bhzsk8rzxe' },
    teams: ['Platform', 'Backend'],
    popularity: 12,
    createdAt: '2024-10-28T10:00:00Z',
    updatedAt: '2024-10-28T14:30:00Z',
    widgets: [],
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Postgres - Metrics',
    description: 'PostgreSQL database performance metrics',
    author: { name: 'bhzsk8rzxe' },
    teams: ['Database'],
    popularity: 3,
    createdAt: '2024-10-25T10:00:00Z',
    updatedAt: '2024-10-27T09:15:00Z',
    widgets: [],
  },
  {
    id: '3',
    name: 'APM Datadog Agent (Trace Agent)',
    description: 'Trace agent monitoring and performance',
    author: { name: 'robot-datado...' },
    teams: ['APM'],
    popularity: 15,
    createdAt: '2024-10-20T10:00:00Z',
    updatedAt: '2024-10-26T16:45:00Z',
    widgets: [],
  },
  {
    id: '4',
    name: 'Storeding SRE',
    description: 'Site Reliability Engineering dashboard',
    author: { name: 'robot-datado...' },
    teams: ['SRE'],
    popularity: 6,
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-10-25T11:20:00Z',
    widgets: [],
  },
  {
    id: '5',
    name: 'APM Traces Estimated Usage',
    description: 'Estimated usage and costs for APM traces',
    author: { name: 'bhzsk8rzxe' },
    teams: ['APM', 'Finance'],
    popularity: 10,
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2024-10-24T13:00:00Z',
    widgets: [],
  },
  {
    id: '6',
    name: 'Docker - Overview',
    description: 'Container monitoring and metrics',
    author: { name: 'bhzsk8rzxe' },
    teams: ['Platform'],
    popularity: 14,
    createdAt: '2024-10-05T10:00:00Z',
    updatedAt: '2024-10-23T10:30:00Z',
    widgets: [],
  },
];

type DashboardView = 'list' | 'create' | 'view';

function DashboardRow({
  dashboard,
  onSelect,
  onToggleFavorite,
}: {
  dashboard: Dashboard;
  onSelect?: (dashboard: Dashboard) => void;
  onToggleFavorite?: (dashboardId: string) => void;
}) {
  // Calculate heart fill percentage based on popularity
  const getHeartFill = (popularity: number) => {
    // Convert popularity (0-20+) to percentage (0-100)
    const percentage = Math.min((popularity / 15) * 100, 100);
    return percentage;
  };

  const heartFillPercentage = getHeartFill(dashboard.popularity);

  return (
    <tr className="group hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer">
      <td className="px-6 py-4 w-12">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(dashboard.id);
          }}
          className="text-gray-300 hover:text-yellow-500 transition-colors"
        >
          {dashboard.isFavorite ? (
            <HiStar className="w-5 h-5 text-yellow-500" />
          ) : (
            <HiOutlineStar className="w-5 h-5" />
          )}
        </button>
      </td>
      <td className="px-6 py-4" onClick={() => onSelect?.(dashboard)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">{dashboard.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {dashboard.name}
            </div>
            {dashboard.description && (
              <div className="text-xs text-gray-500 truncate mt-0.5">{dashboard.description}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs flex-shrink-0">
            {dashboard.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{dashboard.author.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1.5 flex-wrap">
          {dashboard.teams?.slice(0, 2).map((team, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
            >
              {team}
            </span>
          ))}
          {dashboard.teams && dashboard.teams.length > 2 && (
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
              +{dashboard.teams.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            {/* Background heart (gray) */}
            <HiHeart className="w-5 h-5 text-gray-200 absolute inset-0" />

            {/* Filled heart with clip path */}
            <div
              className="overflow-hidden absolute inset-0 transition-all duration-300"
              style={{ clipPath: `inset(${100 - heartFillPercentage}% 0 0 0)` }}
            >
              <HiHeart className="w-5 h-5 text-red-500 absolute inset-0" />
            </div>
          </div>
          <span className="text-sm text-gray-600">{dashboard.popularity}</span>
        </div>
      </td>
    </tr>
  );
}

function DashboardListView({
  onNavigate,
}: {
  onNavigate: (view: DashboardView, dashboardId?: string) => void;
}) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDashboards = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDashboards(mockDashboards);
      setIsLoading(false);
    };

    fetchDashboards();
  }, []);

  const handleToggleFavorite = (dashboardId: string) => {
    setDashboards(
      dashboards.map((dashboard) =>
        dashboard.id === dashboardId
          ? { ...dashboard, isFavorite: !dashboard.isFavorite }
          : dashboard,
      ),
    );
  };

  const filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDashboards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDashboards = filteredDashboards.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 mb-1">대시보드</h1>
              <p className="text-gray-600 text-sm">팀의 모니터링 대시보드를 관리하고 생성하세요</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('create')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiPlus className="w-5 h-5" />
                  New Dashboard
                </button>
                <div className="text-sm text-gray-600">
                  총 <span className="text-gray-900">{filteredDashboards.length}</span>개
                </div>
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="대시보드 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 w-12"></th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      대시보드 이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      담당자
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      팀
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      인기도
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4" colSpan={5}>
                          <div className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredDashboards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {searchQuery ? '검색 결과가 없습니다' : '대시보드가 없습니다'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedDashboards.map((dashboard) => (
                      <DashboardRow
                        key={dashboard.id}
                        dashboard={dashboard}
                        onSelect={() => onNavigate('view', dashboard.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  이전
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardEditorView({ onNavigate }: { onNavigate: (view: DashboardView) => void }) {
  const [dashboardName, setDashboardName] = useState("bhzsk8rzxe's Dashboard Tue, Oct 28, ...");
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('Past 1 Hour');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const handleWidgetSelect = (widget: DashboardWidget) => {
    const newWidget: CanvasWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      position: { x: 0, y: canvasWidgets.length * 220 },
      size: { width: 6, height: 1 },
    };
    setCanvasWidgets([...canvasWidgets, newWidget]);
  };

  const handleWidgetRemove = (widgetId: string) => {
    setCanvasWidgets(canvasWidgets.filter((w) => w.id !== widgetId));
  };

  const handleSave = () => {
    console.log('Saving dashboard...', { name: dashboardName, widgets: canvasWidgets });
    onNavigate('list');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <div className="border-b border-gray-200 bg-gray-800 text-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => onNavigate('list')}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 min-w-[300px]"
              />
              <button className="p-1 hover:bg-gray-700 rounded">
                <HiChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiShare className="w-4 h-4" />
              Share
            </button>
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiEye className="w-4 h-4" />
              Show Overlays
            </button>
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiCog6Tooth className="w-4 h-4" />
              Configure
            </button>
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm flex items-center gap-2"
            >
              {isPanelOpen ? (
                <>
                  <HiXMark className="w-4 h-4" />
                  Close Widgets
                </>
              ) : (
                <>
                  <HiPlus className="w-4 h-4" />
                  Add Widgets
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded text-sm flex items-center gap-2 transition-colors">
              <HiPlus className="w-4 h-4" />
              Add Variable
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded text-sm flex items-center gap-2 transition-colors">
              <HiClock className="w-4 h-4" />
              {timeRange}
            </button>
            <button className="p-1.5 border border-gray-300 hover:border-gray-400 rounded transition-colors">
              <HiMagnifyingGlass className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`p-1.5 border rounded transition-colors ${
                isAutoRefresh
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              {isAutoRefresh ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardCanvas widgets={canvasWidgets} onWidgetRemove={handleWidgetRemove} />
        {isPanelOpen && <DashboardWidgetPanel onWidgetSelect={handleWidgetSelect} />}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onNavigate('list')}
            className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Save Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>('list');
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

  const handleNavigate = (view: DashboardView, dashboardId?: string) => {
    setCurrentView(view);
    if (dashboardId) {
      setSelectedDashboardId(dashboardId);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {currentView === 'list' && <DashboardListView onNavigate={handleNavigate} />}
      {currentView === 'create' && <DashboardEditorView onNavigate={handleNavigate} />}
      {currentView === 'view' && <DashboardEditorView onNavigate={handleNavigate} />}
    </div>
  );
}
