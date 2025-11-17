import type { ServiceSummary } from '@/types/apm';

export type ServiceListCategory = 'list' | 'request_count' | 'error_rate' | 'latency';
export type MetricKey = 'request_count' | 'error_rate' | 'latency_p95_ms';
export type MetricTone = 'neutral' | 'success' | 'warning' | 'caution' | 'danger';

export interface ServiceListSidebarItem {
  key: ServiceListCategory;
  label: string;
  description: string;
}

export interface PaginationControls {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export interface CategoryContentProps {
  category: ServiceListCategory;
  services: ServiceSummary[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRowClick: (service: ServiceSummary) => void;
  pagination?: PaginationControls;
}

export interface ServiceListFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onEditClick?: () => void;
  onCreateClick?: () => void;
}

export interface MetricCardProps {
  serviceName: string;
  environment: string;
  primaryValue: string;
  secondaryValue: string;
  statusLabel?: string;
  tone?: MetricTone;
}

export interface ServiceListSidebarProps {
  value: ServiceListCategory;
  onChange: (category: ServiceListCategory) => void;
}
