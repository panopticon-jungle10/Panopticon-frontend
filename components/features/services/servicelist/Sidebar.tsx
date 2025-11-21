'use client';

import type { ServiceListSidebarItem, ServiceListSidebarProps } from '@/types/servicelist';
import { FiGrid, FiList } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const sidebarItems: (ServiceListSidebarItem & { icon: IconType })[] = [
  { key: 'card', label: 'Card', description: '요약 카드', icon: FiGrid },
  { key: 'list', label: 'List', description: '테이블 뷰', icon: FiList },
];

export default function ServiceListSidebar({ value, onChange }: ServiceListSidebarProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col gap-1 p-3">
        {sidebarItems.map(({ key, label, description, icon: Icon }) => {
          const active = key === value;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`w-full px-3 py-2.5 text-left rounded-lg transition flex items-center gap-3 hover:cursor-pointer ${
                active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <div>
                <div className="text-sm">{label}</div>
                <div className="text-xs text-gray-400">{description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
