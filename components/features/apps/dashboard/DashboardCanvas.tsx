'use client';

import { useDroppable } from '@dnd-kit/core';
import type { CanvasWidget } from './types';

interface Props {
  widgets: CanvasWidget[];
  removeWidget: (id: string) => void;
}

export function DashboardCanvas({ widgets, removeWidget }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  return (
    <div className="flex-1 overflow-auto p-6">
      <div
        ref={setNodeRef}
        className={`min-h-[420px] rounded-2xl border-2 border-dashed p-6 transition-colors ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50/30'
        }`}
      >
        {widgets.length === 0 ? (
          <div className="flex h-full min-h-[280px] items-center justify-center text-blue-600">
            Drag widgets here
          </div>
        ) : (
          <div className="grid auto-rows-[240px] grid-cols-12 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="relative col-span-4 rounded-xl border bg-white p-4 shadow-sm"
              >
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>

                <div className="text-lg font-semibold text-gray-900">{widget.name}</div>
                <div className="mt-6 text-sm text-gray-500">Widget content (preview)</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
