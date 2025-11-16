'use client';

import type { ServiceListCategory, ServiceListSidebarItem } from '@/types/servicelist';
import { FiAlertTriangle, FiClock, FiList, FiTrendingUp } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const sidebarItems: (ServiceListSidebarItem & { icon: IconType })[] = [
  { key: 'list', label: '리스트', description: '기본 테이블 뷰', icon: FiList },
  { key: 'request_count', label: '요청수', description: 'Request Count', icon: FiTrendingUp },
  { key: 'error_rate', label: '에러율', description: 'Error Rate', icon: FiAlertTriangle },
  { key: 'latency', label: '레이턴시', description: 'Latency P95', icon: FiClock },
];

interface ServiceListSidebarProps {
  value: ServiceListCategory;
  onChange: (category: ServiceListCategory) => void;
}

export default function ServiceListSidebar({ value, onChange }: ServiceListSidebarProps) {
  return (
    <aside className="sticky top-6">
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col gap-1 p-3">
          {sidebarItems.map(({ key, label, description, icon: Icon }) => {
            const active = key === value;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={`w-full px-3 py-2.5 text-left rounded-lg transition flex items-center gap-3 ${
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
    </aside>
  );
}
