'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { DashboardCanvas } from './DashboardCanvas';
import { DashboardWidgetPanel } from './DashboardWidgetPanel';
import type { CanvasWidget, DashboardWidget } from './types';

export function DashboardEditor() {
  const [widgets, setWidgets] = useState<CanvasWidget[]>([]);
  const [activeWidget, setActiveWidget] = useState<DashboardWidget | null>(null);

  const addWidget = (widget: DashboardWidget) => {
    const newWidget: CanvasWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      position: { x: 0, y: 0 },
      size: { width: 4, height: 2 },
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const widget = event.active.data.current?.widget as DashboardWidget | undefined;
    if (widget) setActiveWidget(widget);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const widget = event.active.data.current?.widget as DashboardWidget | undefined;
    if (widget) addWidget(widget);
    setActiveWidget(null);
  };

  const handleDragCancel = () => setActiveWidget(null);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex min-h-[calc(100vh-140px)] bg-gray-50">
        <DashboardCanvas widgets={widgets} removeWidget={removeWidget} />
        <DashboardWidgetPanel onSelectWidget={addWidget} />

        <DragOverlay dropAnimation={null}>
          {activeWidget ? (
            <div className="w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="text-lg font-semibold text-gray-900">
                {activeWidget.name}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Widget content (preview)
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
