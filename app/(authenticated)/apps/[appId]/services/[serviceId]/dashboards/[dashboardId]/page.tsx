'use client';

import { useState } from 'react';
import { DashboardList } from '@/components/features/apps/dashboard/DashboardList';
import { DashboardEditor } from '@/components/features/apps/dashboard/DashboardEditor';

type DashboardView = 'list' | 'create' | 'view';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>('list');
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

  const handleNavigate = (view: DashboardView, dashboardId?: string) => {
    setCurrentView(view);
    if (dashboardId) setSelectedDashboardId(dashboardId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {currentView === 'list' && (
        <DashboardList onNavigate={handleNavigate} />
      )}

      {currentView === 'create' && (
        <DashboardEditor onNavigate={handleNavigate} />
      )}

      {currentView === 'view' && (
        <DashboardEditor
          onNavigate={handleNavigate}
          // 나중에 selectedDashboardId 기반으로 DB에서 불러오기 가능
        />
      )}
    </div>
  );
}
