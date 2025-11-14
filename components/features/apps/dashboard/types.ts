// Dashboard types
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  author: {
    name: string;
    avatar?: string;
  };
  teams?: string[];
  popularity: number;
  createdAt: string;
  updatedAt: string;
  widgets: DashboardWidget[];
  isFavorite?: boolean;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  name: string;
  description?: string;
  icon?: string;
  category: 'recently-used' | 'graphs' | 'other';
  isNew?: boolean;
}

export type WidgetType =
  | 'query-value'
  | 'timeseries'
  | 'top-list'
  | 'table'
  | 'list'
  | 'pie-chart'
  | 'bar-chart'
  | 'treemap'
  | 'distribution'
  | 'heatmap'
  | 'geomap'
  | 'scatter-plot'
  | 'change'
  | 'sankey'
  | 'pivot-table'
  | 'wildcard';

export interface CanvasWidget extends DashboardWidget {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}
