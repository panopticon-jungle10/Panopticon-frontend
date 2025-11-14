'use client';

import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { DashboardTag } from './DashboardTag';
import type { Dashboard } from './types';

interface DashboardListItemProps {
  dashboard: Dashboard;
  href: string;
}

export function DashboardListItem({ dashboard, href }: DashboardListItemProps) {
  const starClass = dashboard.favorite ? 'text-yellow-400' : 'text-gray-300';

  return (
    <Link
      href={href}
      className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-gray-100 px-4 py-4 transition hover:bg-gray-50"
    >
      <div>
        <FiStar className={'h-5 w-5 ' + starClass} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-gray-900">{dashboard.name}</span>
        <p className="text-sm text-gray-500">{dashboard.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
          {dashboard.owner.name.charAt(0)}
        </span>
        <span className="text-sm font-medium text-gray-600">{dashboard.owner.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {dashboard.tags.map((tag) => (
          <DashboardTag key={tag} name={tag} />
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold text-gray-600">
        <HiHeart className="h-5 w-5 text-red-500" />
        <span>{dashboard.likes}</span>
      </div>
    </Link>
  );
}
