'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  HiArrowLeft,
  HiChevronDown,
  HiShare,
  HiEye,
  HiCog6Tooth,
  HiXMark,
  HiPlus,
  HiClock,
  HiMagnifyingGlass,
  HiPause,
  HiPlay,
} from 'react-icons/hi2';
import { DashboardCanvas } from './DashboardCanvas';
import { DashboardWidgetPanel } from './DashboardWidgetPanel';
import { DashboardWidget, CanvasWidget } from './types';

export function DashboardEditor() {
  const router = useRouter();
  const params = useParams();
  const [dashboardName, setDashboardName] = useState("bhzsk8rzxe's Dashboard Tue, Oct 28, ...");
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('Past 1 Hour');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const handleWidgetSelect = (widget: DashboardWidget) => {
    // Add widget to canvas with default position and size
    const newWidget: CanvasWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      position: { x: 0, y: canvasWidgets.length * 220 },
      size: { width: 6, height: 1 },
    };
    setCanvasWidgets([...canvasWidgets, newWidget]);
  };

  const handleWidgetRemove = (widgetId: string) => {
    setCanvasWidgets(canvasWidgets.filter((w) => w.id !== widgetId));
  };

  const handleBack = () => {
    const { appId, serviceId } = params;
    router.push(`/apps/${appId}/services/${serviceId}/dashboards`);
  };

  const handleSave = () => {
    // Save logic will be implemented with API
    console.log('Saving dashboard...', { name: dashboardName, widgets: canvasWidgets });
    handleBack();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <div className="border-b border-gray-200 bg-gray-800 text-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 min-w-[300px]"
              />
              <button className="p-1 hover:bg-gray-700 rounded">
                <HiChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiShare className="w-4 h-4" />
              Share
            </button>
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiEye className="w-4 h-4" />
              Show Overlays
            </button>
            <button className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors text-sm flex items-center gap-2">
              <HiCog6Tooth className="w-4 h-4" />
              Configure
            </button>
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm flex items-center gap-2"
            >
              {isPanelOpen ? (
                <>
                  <HiXMark className="w-4 h-4" />
                  Close Widgets
                </>
              ) : (
                <>
                  <HiPlus className="w-4 h-4" />
                  Add Widgets
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded text-sm flex items-center gap-2 transition-colors">
              <HiPlus className="w-4 h-4" />
              Add Variable
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded text-sm flex items-center gap-2 transition-colors">
              <HiClock className="w-4 h-4" />
              {timeRange}
            </button>
            <button className="p-1.5 border border-gray-300 hover:border-gray-400 rounded transition-colors">
              <HiMagnifyingGlass className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`p-1.5 border rounded transition-colors ${
                isAutoRefresh
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              {isAutoRefresh ? (
                <HiPlay className="w-5 h-5" />
              ) : (
                <HiPause className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardCanvas
          widgets={canvasWidgets}
          onWidgetRemove={handleWidgetRemove}
        />

        {isPanelOpen && (
          <DashboardWidgetPanel onWidgetSelect={handleWidgetSelect} />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Save Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
