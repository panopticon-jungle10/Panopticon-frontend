'use client';

import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { DashboardCanvas } from '@/components/features/apps/dashboard/DashboardCanvas';
import { DashboardWidgetPanel } from '@/components/features/apps/dashboard/DashboardWidgetPanel';
import { CanvasWidget, DashboardWidget } from '@/components/features/apps/dashboard/types';

export default function CreateDashboardPage() {
  const [widgets, setWidgets] = useState<CanvasWidget[]>([]);

  const handleWidgetSelect = (widget: DashboardWidget) => {
    setWidgets((current) => [
      ...current,
      {
        ...widget,
        id: widget.id + '-' + current.length,
        position: {
          x: (current.length % 3) * 4,
          y: Math.floor(current.length / 3) * 2,
        },
        size: { width: 4, height: 2 },
      },
    ]);
  };

  const handleWidgetRemove = (widgetId: string) => {
    setWidgets((current) => current.filter((item) => item.id !== widgetId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Dashboards</p>
          <h1 className="text-3xl font-bold text-gray-900">Create dashboard</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700">
          <HiPlus className="w-4 h-4" />
          Create new widget
        </button>
      </div>

      <div className="grid grid-cols-[1fr,280px] gap-6">
        <DashboardCanvas widgets={widgets} onWidgetRemove={handleWidgetRemove} />
        <DashboardWidgetPanel onWidgetSelect={handleWidgetSelect} />
      </div>
    </div>
  );
}
