'use client';

import { useState } from 'react';
import {
  HiMagnifyingGlass,
  HiChartBar,
  HiChartPie,
  HiTableCells,
  HiListBullet,
  HiClock,
  HiSquares2X2,
} from 'react-icons/hi2';
import { DashboardWidget, WidgetType } from './types';

// Mock widget data
const mockWidgets: DashboardWidget[] = [
  {
    id: 'w1',
    type: 'query-value',
    name: 'Query Value',
    category: 'recently-used',
    icon: 'chart-bar',
  },
  {
    id: 'w2',
    type: 'timeseries',
    name: 'Timeseries',
    category: 'graphs',
    icon: 'chart-line',
  },
  {
    id: 'w3',
    type: 'query-value',
    name: 'Query Value',
    category: 'graphs',
    icon: 'chart-bar',
  },
  {
    id: 'w4',
    type: 'top-list',
    name: 'Top List',
    category: 'graphs',
    icon: 'list',
  },
  {
    id: 'w5',
    type: 'table',
    name: 'Table',
    category: 'graphs',
    icon: 'table',
  },
  {
    id: 'w6',
    type: 'list',
    name: 'List',
    category: 'graphs',
    icon: 'list-bullet',
  },
  {
    id: 'w7',
    type: 'pie-chart',
    name: 'Pie Chart',
    category: 'graphs',
    icon: 'chart-pie',
  },
  {
    id: 'w8',
    type: 'bar-chart',
    name: 'Bar Chart',
    category: 'graphs',
    icon: 'chart-bar',
  },
  {
    id: 'w9',
    type: 'treemap',
    name: 'Treemap',
    category: 'graphs',
    icon: 'squares',
  },
  {
    id: 'w10',
    type: 'distribution',
    name: 'Distribution',
    category: 'graphs',
    icon: 'chart-bar',
  },
  {
    id: 'w11',
    type: 'heatmap',
    name: 'Heatmap',
    category: 'graphs',
    icon: 'squares',
  },
  {
    id: 'w12',
    type: 'geomap',
    name: 'Geomap',
    category: 'graphs',
    icon: 'map',
  },
  {
    id: 'w13',
    type: 'scatter-plot',
    name: 'Scatter Plot',
    category: 'graphs',
    icon: 'chart-scatter',
  },
  {
    id: 'w14',
    type: 'change',
    name: 'Change',
    category: 'graphs',
    icon: 'arrow-trending',
  },
  {
    id: 'w15',
    type: 'sankey',
    name: 'Sankey',
    category: 'graphs',
    icon: 'chart-flow',
  },
  {
    id: 'w16',
    type: 'pivot-table',
    name: 'Pivot Table',
    category: 'graphs',
    icon: 'table',
  },
  {
    id: 'w17',
    type: 'wildcard',
    name: 'Wildcard',
    category: 'graphs',
    icon: 'star',
  },
];

interface DashboardWidgetPanelProps {
  onWidgetSelect: (widget: DashboardWidget) => void;
}

export function DashboardWidgetPanel({ onWidgetSelect }: DashboardWidgetPanelProps) {
  const [activeTab, setActiveTab] = useState<'widgets' | 'powerpacks' | 'apps'>('widgets');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWidgets = mockWidgets.filter((widget) =>
    widget.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsedWidgets = filteredWidgets.filter((w) => w.category === 'recently-used');
  const graphWidgets = filteredWidgets.filter((w) => w.category === 'graphs');

  const getWidgetIcon = (type: WidgetType) => {
    switch (type) {
      case 'query-value':
      case 'bar-chart':
      case 'distribution':
        return HiChartBar;
      case 'pie-chart':
        return HiChartPie;
      case 'table':
      case 'pivot-table':
        return HiTableCells;
      case 'list':
      case 'top-list':
        return HiListBullet;
      case 'timeseries':
        return HiClock;
      default:
        return HiSquares2X2;
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {(['widgets', 'powerpacks', 'apps'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search widgets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'widgets' && (
          <>
            {/* Recently Used */}
            {recentlyUsedWidgets.length > 0 && (
              <div className="p-4">
                <h3 className="text-xs text-gray-500 uppercase mb-3">
                  Recently Used
                </h3>
                <div className="space-y-1">
                  {recentlyUsedWidgets.map((widget) => {
                    const Icon = getWidgetIcon(widget.type);
                    return (
                      <button
                        key={widget.id}
                        onClick={() => onWidgetSelect(widget)}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-blue-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-900 group-hover:text-blue-600">
                          {widget.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Graphs */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-xs text-gray-500 uppercase mb-3">
                Graphs
              </h3>
              <div className="space-y-1">
                {graphWidgets.map((widget) => {
                  const Icon = getWidgetIcon(widget.type);
                  return (
                    <button
                      key={widget.id}
                      onClick={() => onWidgetSelect(widget)}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-blue-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-900 group-hover:text-blue-600 flex-1">
                        {widget.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'powerpacks' && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Powerpacks will be available soon
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Apps will be available soon
          </div>
        )}
      </div>
    </div>
  );
}
