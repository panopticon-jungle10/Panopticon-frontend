export type ServiceListCategory = 'list' | 'request_count' | 'error_rate' | 'latency';
export type MetricKey = 'request_count' | 'error_rate' | 'latency_p95_ms';
export type MetricTone = 'neutral' | 'success' | 'warning' | 'caution' | 'danger';

export interface ServiceListSidebarItem {
  key: ServiceListCategory;
  label: string;
  description: string;
}
