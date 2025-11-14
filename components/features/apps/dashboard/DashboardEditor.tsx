'use client';

import { useEffect, useState } from 'react';
import { CanvasWidget, DashboardWidget, Dashboard } from './types';
import { DashboardCanvas } from './DashboardCanvas';
import { DashboardWidgetPanel } from './DashboardWidgetPanel';

interface Props {
  mode: 'create' | 'edit';
  initialData?: Dashboard;
}

export function DashboardEditor({ mode, initialData }: Props) {
  const [dashboardName, setDashboardName] = useState(initialData?.name ?? 'New Dashboard');

  const [widgets, setWidgets] = useState<CanvasWidget[]>(initialData?.widgets ?? []);

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const addWidget = (widget: DashboardWidget) => {
    setWidgets((prev) => [
      ...prev,
      {
        ...widget,
        id: widget.id + '-' + Date.now(),
        position: { x: 0, y: prev.length * 2 },
        size: { width: 6, height: 2 },
      },
    ]);
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="h-14 bg-gray-800 text-white flex items-center px-4">
        <input
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
          className="bg-transparent border-none text-xl outline-none flex-1"
        />

        <button
          onClick={() => setIsPanelOpen((v) => !v)}
          className="px-3 py-1.5 bg-blue-600 rounded ml-4"
        >
          {isPanelOpen ? 'Close Widgets' : 'Add Widgets'}
        </button>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardCanvas widgets={widgets} onWidgetRemove={removeWidget} />

        {isPanelOpen && <DashboardWidgetPanel onWidgetSelect={addWidget} />}
      </div>
    </div>
  );
}
