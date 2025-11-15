'use client';

import { useState } from 'react';
import { DashboardList } from '@/components/features/apps/dashboard/DashboardList';
import { DashboardEditor } from '@/components/features/apps/dashboard/DashboardEditor';

type View = 'list' | 'create' | 'view';

export default function DashboardsPage() {
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const go = (next: View, id?: string) => {
    setView(next);
    if (id) setSelectedId(id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {view === 'list' && <DashboardList onNavigate={go} />}

      {view === 'create' && <DashboardEditor mode="create" onBack={() => setView('list')} />}

      {view === 'view' && (
        <DashboardEditor
          mode="edit"
          initialData={{ name: 'Loaded Dashboard' }}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
}
