'use client';

import { HiOutlineStar, HiOutlineClock, HiOutlineUserCircle } from 'react-icons/hi2';
import { Dashboard } from './types';

interface DashboardCardProps {
  dashboard: Dashboard;
  onSelect?: (dashboard: Dashboard) => void;
}

export function DashboardCard({ dashboard, onSelect }: DashboardCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(dashboard);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={handleClick}
      className="group border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 group-hover:text-blue-600 transition-colors">
            {dashboard.name}
          </h3>
          {dashboard.description && (
            <p className="text-gray-500 mt-1 text-sm">{dashboard.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <HiOutlineUserCircle className="w-4 h-4" />
            <span>{dashboard.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineClock className="w-4 h-4" />
            <span>{formatDate(dashboard.updatedAt)}</span>
          </div>
        </div>

        {dashboard.popularity > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <HiOutlineStar className="w-4 h-4" />
            <span>{dashboard.popularity}</span>
          </div>
        )}
      </div>

      {dashboard.teams && dashboard.teams.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Teams:</span>
            <div className="flex gap-1 flex-wrap">
              {dashboard.teams.map((team, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                  {team}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
