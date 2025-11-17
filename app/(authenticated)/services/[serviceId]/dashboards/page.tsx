'use client';

import { useState } from 'react';
import { DashboardList } from '@/components/features/apps/dashboard/DashboardList';
import { DashboardEditor } from '@/components/features/apps/dashboard/DashboardEditor';
import { mockDashboards } from '@/components/features/apps/dashboard/mock';

type View = 'list' | 'create' | 'view';

export default function DashboardsPage() {
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const go = (next: View, id?: string) => {
    setView(next);
    if (id) setSelectedId(id);
  };

  const selectedDashboard = selectedId
    ? mockDashboards.find((d) => d.id === selectedId) ?? null
    : null;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {view === 'list' && <DashboardList onNavigate={go} />}

      {view === 'create' && <DashboardEditor mode="create" onBack={() => go('list')} />}

      {view === 'view' && (
        <DashboardEditor mode="edit" initialData={selectedDashboard} onBack={() => go('list')} />
      )}
    </div>
  );
}
