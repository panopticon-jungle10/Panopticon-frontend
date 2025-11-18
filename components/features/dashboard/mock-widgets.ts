//위젯 유형 더미 데이터

import {
  HiOutlineChartBarSquare,
  HiOutlineChartPie,
  HiOutlineTableCells,
  HiOutlineListBullet,
  HiOutlinePresentationChartBar,
  HiOutlineChartBar,
  HiOutlineRectangleStack,
  HiOutlineMap,
} from 'react-icons/hi2';

import type { DashboardWidget } from '../../../src/types/dashboard';

export interface WidgetIcon {
  icon: React.ComponentType<{ className?: string }>;
}

export const mockWidgets: (DashboardWidget & WidgetIcon)[] = [
  {
    id: 'w-timeseries',
    name: 'Timeseries',
    type: 'timeseries',
    category: 'graphs',
    icon: HiOutlinePresentationChartBar,
  },
  {
    id: 'w-query-value',
    name: 'Query Value',
    type: 'query-value',
    category: 'graphs',
    icon: HiOutlineChartBarSquare,
  },
  {
    id: 'w-top-list',
    name: 'Top List',
    type: 'top-list',
    category: 'graphs',
    icon: HiOutlineListBullet,
  },
  {
    id: 'w-table',
    name: 'Table',
    type: 'table',
    category: 'graphs',
    icon: HiOutlineTableCells,
  },
  {
    id: 'w-pie-chart',
    name: 'Pie Chart',
    type: 'pie-chart',
    category: 'graphs',
    icon: HiOutlineChartPie,
  },
  {
    id: 'w-bar-chart',
    name: 'Bar Chart',
    type: 'bar-chart',
    category: 'graphs',
    icon: HiOutlinePresentationChartBar,
  },

  {
    id: 'w-distribution',
    name: 'Distribution',
    type: 'distribution',
    category: 'graphs',
    icon: HiOutlineChartBar,
  },
  {
    id: 'w-heatmap',
    name: 'Heatmap',
    type: 'heatmap',
    category: 'graphs',
    icon: HiOutlineRectangleStack,
  },
  {
    id: 'w-geomap',
    name: 'Geomap',
    type: 'geomap',
    category: 'graphs',
    icon: HiOutlineMap,
  },
  {
    id: 'w-scatter',
    name: 'Scatter Plot',
    type: 'scatter-plot',
    category: 'graphs',
    icon: HiOutlineChartBarSquare,
  },
];
