'use client';

import Link from 'next/link';
import { HiHeart, HiOutlineStar, HiStar } from 'react-icons/hi2';
import { DashboardTag } from './DashboardTag';
import { Dashboard } from './types';
import { useParams } from 'next/navigation';

export function DashboardListItem({ dashboard }: { dashboard: Dashboard }) {
  const { appId, serviceId } = useParams();
  const detailLink = `/apps/${appId}/services/${serviceId}/dashboards/${dashboard.id}`;

  const heartFill = Math.min((dashboard.popularity / 15) * 100, 100);

  return (
    <tr className="group hover:bg-gray-50 transition cursor-pointer">
      <td className="px-8 py-4">
        {dashboard.isFavorite ? (
          <HiStar className="text-yellow-500 w-5 h-5"/>
        ) : (
          <HiOutlineStar className="text-gray-300 w-5 h-5"/>
        )}
      </td>

      <td className="px-8 py-4">
        <Link href={detailLink} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            {dashboard.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="text-gray-900 truncate group-hover:text-blue-600">
              {dashboard.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {dashboard.description}
            </div>
          </div>
        </Link>
      </td>

      <td className="px-8 py-4">
        {dashboard.author.name}
      </td>

      <td className="px-8 py-4">
        <div className="flex gap-1.5 flex-wrap">
          {dashboard.teams?.slice(0, 2).map(team => (
            <DashboardTag key={team} name={team}/>
          ))}
          {dashboard.teams && dashboard.teams.length > 2 && (
            <span className="text-gray-600 text-xs bg-gray-100 rounded px-2 py-0.5">
              +{dashboard.teams.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <HiHeart className="absolute inset-0 text-gray-200"/>
            <div className="absolute inset-0 overflow-hidden"
                 style={{ clipPath: `inset(${100 - heartFill}% 0 0 0)`}}>
              <HiHeart className="text-red-500 absolute"/>
            </div>
          </div>
          <span className="text-sm text-gray-600">{dashboard.popularity}</span>
        </div>
      </td>
    </tr>
  );
}
