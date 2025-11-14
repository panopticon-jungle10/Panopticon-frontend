'use client';

import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { CanvasWidget, DashboardWidget } from './types';

interface DashboardCanvasProps {
  widgets: CanvasWidget[];
  onWidgetAdd?: (widget: DashboardWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
}

export function DashboardCanvas({ widgets, onWidgetAdd, onWidgetRemove }: DashboardCanvasProps) {
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Widget drop logic will be implemented when needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 p-6 bg-gray-50 overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-6xl mx-auto">
        {widgets.length === 0 ? (
          // Empty state
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 bg-blue-50/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <HiPlus className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-blue-600 text-lg mb-2">
                Click a tray item to add it here
              </p>
              <p className="text-gray-500 text-sm">
                Drag and drop widgets from the right panel to create your dashboard
              </p>
            </div>
          </div>
        ) : (
          // Widget grid
          <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`col-span-${widget.size.width} row-span-${widget.size.height} bg-white border border-gray-200 rounded-lg p-4 relative group hover:border-blue-500 transition-colors`}
                onMouseEnter={() => setHoveredWidget(widget.id)}
                onMouseLeave={() => setHoveredWidget(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-900">{widget.name}</h3>
                  {hoveredWidget === widget.id && (
                    <button
                      onClick={() => onWidgetRemove?.(widget.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">Widget content will appear here</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
