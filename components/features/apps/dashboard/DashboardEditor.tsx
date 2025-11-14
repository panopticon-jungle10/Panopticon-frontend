'use client';

import { useState } from 'react';
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
  HiPlay,
  HiPause,
} from 'react-icons/hi2';
import { DashboardCanvas } from './DashboardCanvas';
import { DashboardWidgetPanel } from './DashboardWidgetPanel';
import {
  DashboardWidget,
  CanvasWidget,
} from './types';

interface Props {
  onNavigate: (view: 'list' | 'create' | 'view') => void;
}

export function DashboardEditor({ onNavigate }: Props) {
  const [dashboardName, setDashboardName] = useState('New Dashboard');
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('Past 1 Hour');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const addWidget = (widget: DashboardWidget) => {
    const newWidget: CanvasWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      position: { x: 0, y: canvasWidgets.length * 220 },
      size: { width: 6, height: 1 },
    };
    setCanvasWidgets((prev) => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setCanvasWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* Top Header */}
      <div className="border-b bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate('list')}
          className="p-1.5 hover:bg-gray-700 rounded"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-1 ml-4">
          <input
            type="text"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="bg-transparent outline-none border-none text-white min-w-[200px]"
          />
          <button className="p-1">
            <HiChevronDown className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded hover:bg-gray-700"> <HiShare /> Share </button>
          <button className="px-3 py-1.5 rounded hover:bg-gray-700"> <HiEye /> Show Overlays </button>
          <button className="px-3 py-1.5 rounded hover:bg-gray-700"> <HiCog6Tooth /> Configure </button>

          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded"
          >
            {isPanelOpen ? <><HiXMark /> Close Widgets</> : <><HiPlus /> Add Widgets</>}
          </button>
        </div>
      </div>

      {/* Second Toolbar */}
      <div className="border-b px-4 py-2 bg-white flex items-center justify-between">
        <button className="px-3 py-1.5 border border-gray-300 rounded flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Variable
        </button>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 border border-gray-300 rounded flex items-center gap-2">
            <HiClock className="w-4 h-4" /> {timeRange}
          </button>

          <button className="p-1.5 border border-gray-300 rounded">
            <HiMagnifyingGlass className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`p-1.5 border rounded ${
              isAutoRefresh ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'
            }`}
          >
            {isAutoRefresh ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardCanvas widgets={canvasWidgets} onWidgetRemove={removeWidget} />

        {isPanelOpen && (
          <DashboardWidgetPanel onWidgetSelect={addWidget} />
        )}
      </div>
    </div>
  );
}
