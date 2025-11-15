export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  author: { name: string; avatar?: string };
  teams: string[];
  popularity: number;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

export type WidgetType =
  | 'timeseries'
  | 'query-value'
  | 'top-list'
  | 'table'
  | 'pie-chart'
  | 'bar-chart'
  | 'distribution'
  | 'heatmap'
  | 'geomap'
  | 'scatter-plot';

export interface DashboardWidget {
  id: string;
  name: string;
  type: WidgetType;
  category: 'graphs';
}

export interface CanvasWidget extends DashboardWidget {
  position: { x: number; y: number };
  size: { width: number; height: number };
}
