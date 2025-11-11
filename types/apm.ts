/**
 * APM 페이지 API 타입 정의
 */

// 서비스 타입
export type ServiceType = 'API_GATEWAY' | 'API' | 'WORKER' | 'DB' | 'CACHE' | 'WEB';

// 1.1 활성 서비스 목록
export interface ApmService {
  service_name: string;
  service_type: ServiceType;
  request_count: number;
  error_rate: number;
  p95_latency_ms: number;
  issues_count: number;
}

export interface ServicesResponse {
  total_count: number;
  page: number;
  size: number;
  services: ApmService[];
}

// 1.2 이슈 목록
export interface Issue {
  issue_id: string;
  service_name: string;
  message: string;
  occurred_at: string;
  affected_requests: number;
}

export interface IssuesResponse {
  issues: Issue[];
}

// 1.3 서비스맵
export interface ServiceNode {
  service_name: string;
  service_type: string;
  request_count: number;
  error_rate: number;
  avg_latency_ms: number;
}

export interface ServiceEdge {
  source: string;
  target: string;
  request_count: number;
  avg_latency_ms: number;
  error_count: number;
}

export interface ServiceMapResponse {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
}
