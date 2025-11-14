'use client';

import { HiHeart, HiOutlineStar, HiStar } from 'react-icons/hi2';
import { DashboardTag } from './DashboardTag';
import type { Dashboard } from './types';

interface DashboardListItemProps {
  dashboard: Dashboard;
  onSelect: (dashboardId: string) => void;
  onToggleFavorite: (dashboardId: string) => void;
}

export function DashboardListItem({
  dashboard,
  onSelect,
  onToggleFavorite,
}: DashboardListItemProps) {
  const heartFillPercentage = Math.min((dashboard.popularity / 15) * 100, 100);

  return (
    <tr
      className="group hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer"
      onClick={() => onSelect(dashboard.id)}
    >
      <td className="px-6 py-4 w-12">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(dashboard.id);
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

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm">{dashboard.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {dashboard.name}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">{dashboard.description}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs">
            {dashboard.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{dashboard.author.name}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-1.5 flex-wrap">
          {dashboard.teams.slice(0, 2).map((team) => (
            <DashboardTag key={team} name={team} />
          ))}
          {dashboard.teams.length > 2 && (
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border">
              +{dashboard.teams.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <HiHeart className="w-5 h-5 text-gray-200 absolute" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(${100 - heartFillPercentage}% 0 0 0)` }}
            >
              <HiHeart className="w-5 h-5 text-red-500 absolute" />
            </div>
          </div>
          <span className="text-sm text-gray-600">{dashboard.popularity}</span>
        </div>
      </td>
    </tr>
  );
}
