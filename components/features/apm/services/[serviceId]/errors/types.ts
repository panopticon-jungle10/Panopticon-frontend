// API 응답 타입

export interface ErrorItem {
  error_id: string;
  service_name: string;
  error_message: string;
  resource: string;
  count: number;
  first_seen: string;
  last_seen: string;
  stack_trace?: string;
  sample_trace_ids?: string[];
}

export interface ErrorResponse {
  errors: ErrorItem[];
  total: number;
  page: number;
  limit: number;
}

/* 시간별 에러 트렌드용 */
export interface ErrorTrendPoint {
  timestamp: string;
  count: number;
}

export interface ErrorTrendSeries {
  service: string;
  color: string;
  data: ErrorTrendPoint[];
}
