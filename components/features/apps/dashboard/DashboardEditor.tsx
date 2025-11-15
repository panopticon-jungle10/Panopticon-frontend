// 대시보드 편집기(드래그·추가·삭제 전부 관리)

'use client';

import { useState } from 'react';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';

import { DashboardCanvas } from './DashboardCanvas';
import { DashboardWidgetPanel } from './DashboardWidgetPanel';
import type { CanvasWidget, Dashboard, DashboardWidget } from './types';

type DashboardEditorProps = {
  mode: 'create' | 'edit';
  initialData?: Dashboard | null;
  onBack?: () => void;
};

export function DashboardEditor({ mode, initialData = null, onBack }: DashboardEditorProps) {
  const [widgets, setWidgets] = useState<CanvasWidget[]>(initialData?.widgets ?? []);
  const [activeWidget, setActiveWidget] = useState<DashboardWidget | null>(null);

  /*위젯 추가*/
  const addWidget = (widget: DashboardWidget) => {
    const newWidget: CanvasWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      position: { x: 0, y: 0 },
      size: { width: 4, height: 2 },
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  /* 위젯 삭제*/
  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

/* 드래그 시작/종료 처리 이벤트 */
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
        {/* 전체 편집 UI 구성 */}
      <div className="flex min-h-[calc(100vh-140px)] bg-gray-50">
        <DashboardCanvas widgets={widgets} removeWidget={removeWidget} />
        <DashboardWidgetPanel onSelectWidget={addWidget} />

        <DragOverlay dropAnimation={null}>
          {activeWidget ? (
            <div className="w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="text-lg font-semibold text-gray-900">{activeWidget.name}</div>
              <div className="mt-2 text-sm text-gray-500">Widget content (preview)</div>
            </div>
          ) : null}
        </DragOverlay>
      </div>

      {onBack ? (
        <div className="mt-4 flex items-center justify-between px-6">
          <span className="text-sm text-gray-500">
            {mode === 'create' ? '새 대시보드 작성 중' : '대시보드 수정 중'}
          </span>
          <button
            onClick={onBack}
            className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : null}
    </DndContext>
  );
}
