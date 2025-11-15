// 우측 그래프 위젯 패널

'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { mockWidgets } from './mock-widgets';
import { DashboardWidget } from '../../../../src/types/dashboard';

interface Props {
  onSelectWidget: (widget: DashboardWidget) => void;
}

export function DashboardWidgetPanel({ onSelectWidget }: Props) {
  const [query, setQuery] = useState('');

  const filtered = mockWidgets.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <input
        placeholder="Search widgets..."
        className="w-full border rounded-lg px-3 py-2 mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="text-xs font-semibold text-gray-500 mb-2">GRAPHS</div>

      {filtered.map((widget) => {
        const Item = () => {
          const draggable = useDraggable({
            id: widget.id,
            data: { widget },
          });

          return (
            <div
              ref={draggable.setNodeRef}
              {...draggable.listeners}
              {...draggable.attributes}
              onClick={() => onSelectWidget(widget)}
              className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg mb-3 cursor-move hover:bg-gray-100"
            >
              <widget.icon className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">{widget.name}</div>
                <div className="text-xs text-gray-500">Drag or click to add</div>
              </div>
            </div>
          );
        };

        return <Item key={widget.id} />;
      })}
    </div>
  );
}
