'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HiPlus, HiMagnifyingGlass } from 'react-icons/hi2';
import { DashboardCard } from './DashboardCard';
import { Dashboard } from './types';

// Mock data - 나중에 API로 교체
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
  },
  {
    id: '2',
    name: 'Postgres - Metrics',
    description: 'PostgreSQL database performance metrics',
    author: { name: 'bhzsk8rzxe' },
    teams: ['Database'],
    popularity: 8,
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

export function DashboardList() {
  const router = useRouter();
  const params = useParams();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate API fetch
  useEffect(() => {
    const fetchDashboards = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDashboards(mockDashboards);
      setIsLoading(false);
    };

    fetchDashboards();
  }, []);

  const filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDashboard = () => {
    const { appId, serviceId } = params;
    router.push(`/apps/${appId}/services/${serviceId}/dashboards/create`);
  };

  const handleSelectDashboard = (dashboard: Dashboard) => {
    const { appId, serviceId } = params;
    router.push(`/apps/${appId}/services/${serviceId}/dashboards/${dashboard.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900">Dashboards</h1>
            <p className="text-gray-600 mt-1">
              {filteredDashboards.length} total
            </p>
          </div>
          <button
            onClick={handleCreateDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            New Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dashboards"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredDashboards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No dashboards found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                onSelect={handleSelectDashboard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
