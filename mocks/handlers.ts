import { http, HttpResponse } from 'msw';
import {
  GetServicesResponse,
  GetTraceByIdResponse,
  GetServiceMetricsResponse,
  GetLogsResponse,
  GetSpansResponse,
  GetServiceEndpointsResponse,
  GetServiceTracesResponse,
  ServiceSummary,
  SpanItem,
  LogItem,
  TraceSummary,
  EndpointMetrics,
  MetricTimeSeries,
} from '@/types/apm';

/**
 * MSW API Mock Handlers
 * 새로운 API 명세에 맞춰 재작성되었습니다.
 */

// ==================== 헬퍼 함수 ====================

/**
 * 시간 범위에 따른 데이터 포인트 생성
 */
function generateTimePoints(start: Date, end: Date, intervalMs: number): string[] {
  const points: string[] = [];
  for (let time = start.getTime(); time <= end.getTime(); time += intervalMs) {
    points.push(new Date(time).toISOString());
  }
  return points;
}

/**
 * 랜덤 서비스 이름 생성
 */
const SERVICE_NAMES = [
  'user-service',
  'payment-service',
  'order-service',
  'auth-service',
  'notification-service',
  'inventory-service',
  'shipping-service',
  'analytics-service',
];

export const handlers = [
  // ==================== GET /services ====================
  http.get('/services', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || new Date(Date.now() - 3600000).toISOString();
    const to = url.searchParams.get('to') || new Date().toISOString();
    const environment = url.searchParams.get('environment') || 'prod';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const nameFilter = url.searchParams.get('name_filter')?.toLowerCase();

    let services: ServiceSummary[] = SERVICE_NAMES.map((name, index) => ({
      service_name: name,
      environment: environment,
      request_count: Math.floor(Math.random() * 20000) + 5000,
      latency_p95_ms: Math.floor(Math.random() * 500) + 100,
      error_rate: parseFloat((Math.random() * 0.05).toFixed(3)), // 0~5%
      labels: {
        version: `1.${index}.0`,
        region: 'us-east-1',
      },
    }));

    // 이름 필터링
    if (nameFilter) {
      services = services.filter((s) => s.service_name.toLowerCase().includes(nameFilter));
    }

    // limit 적용
    services = services.slice(0, limit);

    const response: GetServicesResponse = {
      from,
      to,
      services,
    };

    return HttpResponse.json(response);
  }),

  // ==================== GET /traces/{traceId} ====================
  http.get('/traces/:traceId', ({ params, request }) => {
    const { traceId } = params;
    const url = new URL(request.url);
    const environment = url.searchParams.get('environment');

    const spans: SpanItem[] = [
      {
        timestamp: new Date(Date.now() - 1000).toISOString(),
        span_id: 'span-001',
        parent_span_id: null,
        name: 'GET /api/users',
        kind: 'SERVER',
        duration_ms: 234.5,
        status: 'OK',
        service_name: 'api-gateway',
        environment: environment || 'prod',
        http_method: 'GET',
        http_path: '/api/users',
        http_status_code: 200,
        labels: { version: '1.0.0' },
        db_statement: null,
      },
      {
        timestamp: new Date(Date.now() - 950).toISOString(),
        span_id: 'span-002',
        parent_span_id: 'span-001',
        name: 'SELECT users',
        kind: 'CLIENT',
        duration_ms: 180.2,
        status: 'OK',
        service_name: 'user-service',
        environment: environment || 'prod',
        http_method: null,
        http_path: null,
        http_status_code: null,
        labels: null,
        db_statement: 'SELECT * FROM users WHERE id = $1',
      },
      {
        timestamp: new Date(Date.now() - 800).toISOString(),
        span_id: 'span-003',
        parent_span_id: 'span-001',
        name: 'serialize response',
        kind: 'INTERNAL',
        duration_ms: 25.3,
        status: 'OK',
        service_name: 'user-service',
        environment: environment || 'prod',
        http_method: null,
        http_path: null,
        http_status_code: null,
        labels: null,
        db_statement: null,
      },
    ];

    const logs: LogItem[] = [
      {
        timestamp: new Date(Date.now() - 980).toISOString(),
        level: 'INFO',
        message: 'Processing GET request for /api/users',
        service_name: 'api-gateway',
        span_id: 'span-001',
        trace_id: traceId as string,
        labels: { user_id: '12345' },
      },
      {
        timestamp: new Date(Date.now() - 900).toISOString(),
        level: 'INFO',
        message: 'Database query executed successfully',
        service_name: 'user-service',
        span_id: 'span-002',
        trace_id: traceId as string,
        labels: { query_time_ms: '180' },
      },
    ];

    const response: GetTraceByIdResponse = {
      trace_id: traceId as string,
      spans,
      logs,
    };

    return HttpResponse.json(response);
  }),

  // ==================== GET /services/{serviceName}/metrics ====================
  http.get('/services/:serviceName/metrics', ({ params, request }) => {
    const { serviceName } = params;
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || new Date(Date.now() - 3600000).toISOString();
    const to = url.searchParams.get('to') || new Date().toISOString();
    const metric = url.searchParams.get('metric');
    const interval = url.searchParams.get('interval') || '5m';
    const environment = url.searchParams.get('environment') || 'prod';

    const start = new Date(from);
    const end = new Date(to);
    const intervalMs = { '1m': 60000, '5m': 300000, '1h': 3600000 }[interval] || 300000;

    const timePoints = generateTimePoints(start, end, intervalMs);

    // 단일 메트릭 요청인 경우
    if (metric) {
      const metricData: MetricTimeSeries = {
        metric_name: metric,
        service_name: serviceName as string,
        environment,
        points: timePoints.map((timestamp) => ({
          timestamp,
          value:
            metric === 'error_rate'
              ? parseFloat((Math.random() * 0.05).toFixed(3))
              : Math.floor(Math.random() * 500) + 100,
          labels: null,
        })),
      };

      return HttpResponse.json(metricData as GetServiceMetricsResponse);
    }

    // 모든 메트릭 요청인 경우
    const allMetrics: MetricTimeSeries[] = [
      {
        metric_name: 'http_requests_total',
        service_name: serviceName as string,
        environment,
        points: timePoints.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 1000) + 500,
          labels: null,
        })),
      },
      {
        metric_name: 'latency_p95_ms',
        service_name: serviceName as string,
        environment,
        points: timePoints.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 300) + 100,
          labels: null,
        })),
      },
      {
        metric_name: 'error_rate',
        service_name: serviceName as string,
        environment,
        points: timePoints.map((timestamp) => ({
          timestamp,
          value: parseFloat((Math.random() * 0.05).toFixed(3)),
          labels: null,
        })),
      },
    ];

    return HttpResponse.json(allMetrics as GetServiceMetricsResponse);
  }),

  // ==================== GET /logs ====================
  http.get('/logs', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '50');
    const level = url.searchParams.get('level') as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | null;
    const serviceName = url.searchParams.get('service_name');
    const traceId = url.searchParams.get('trace_id');

    const totalLogs = 500;
    const logs: LogItem[] = [];

    for (let i = 0; i < size; i++) {
      const logLevel: LogItem['level'] =
        level ||
        (['DEBUG', 'INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 4)] as LogItem['level']);
      logs.push({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        level: logLevel,
        message: `Sample log message ${i}: ${logLevel} level event occurred`,
        service_name: serviceName || SERVICE_NAMES[Math.floor(Math.random() * SERVICE_NAMES.length)],
        span_id: traceId ? `span-${i}` : null,
        trace_id: traceId || `trace-${Math.random().toString(36).substring(7)}`,
        labels: {
          environment: 'prod',
          region: 'us-east-1',
        },
      });
    }

    const response: GetLogsResponse = {
      total: totalLogs,
      page,
      size,
      logs,
    };

    return HttpResponse.json(response);
  }),

  // ==================== GET /spans ====================
  http.get('/spans', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '50');
    const serviceName = url.searchParams.get('service_name');
    const status = url.searchParams.get('status') as 'OK' | 'ERROR' | null;
    const kind = url.searchParams.get('kind') as 'SERVER' | 'CLIENT' | 'INTERNAL' | null;

    const totalSpans = 300;
    const spans: SpanItem[] = [];

    const spanKinds: Array<'SERVER' | 'CLIENT' | 'INTERNAL'> = ['SERVER', 'CLIENT', 'INTERNAL'];

    for (let i = 0; i < size; i++) {
      const spanKind = kind || spanKinds[Math.floor(Math.random() * spanKinds.length)];
      const spanStatus = status || (Math.random() > 0.1 ? 'OK' : 'ERROR');

      spans.push({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        span_id: `span-${i}`,
        parent_span_id: i > 0 ? `span-${i - 1}` : null,
        name: `Operation ${i}`,
        kind: spanKind,
        duration_ms: Math.floor(Math.random() * 500) + 50,
        status: spanStatus,
        service_name: serviceName || SERVICE_NAMES[Math.floor(Math.random() * SERVICE_NAMES.length)],
        environment: 'prod',
        http_method: spanKind === 'SERVER' ? 'GET' : null,
        http_path: spanKind === 'SERVER' ? `/api/resource/${i}` : null,
        http_status_code: spanKind === 'SERVER' ? (spanStatus === 'OK' ? 200 : 500) : null,
        labels: { version: '1.0.0' },
        db_statement: spanKind === 'CLIENT' ? 'SELECT * FROM table WHERE id = $1' : null,
      });
    }

    const response: GetSpansResponse = {
      total: totalSpans,
      page,
      size,
      spans,
    };

    return HttpResponse.json(response);
  }),

  // ==================== GET /services/{serviceName}/endpoints ====================
  http.get('/services/:serviceName/endpoints', ({ params, request }) => {
    const { serviceName } = params;
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || new Date(Date.now() - 3600000).toISOString();
    const to = url.searchParams.get('to') || new Date().toISOString();
    const environment = url.searchParams.get('environment') || 'prod';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const endpointPaths = [
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/users/:id/profile',
      'GET /api/orders',
      'POST /api/orders',
      'GET /api/products',
      'POST /api/payments',
    ];

    const endpoints: EndpointMetrics[] = endpointPaths.slice(0, limit).map((path) => ({
      endpoint_name: path,
      service_name: serviceName as string,
      environment,
      request_count: Math.floor(Math.random() * 10000) + 1000,
      latency_p95_ms: Math.floor(Math.random() * 400) + 100,
      error_rate: parseFloat((Math.random() * 0.05).toFixed(3)),
      labels: { version: '1.0.0' },
    }));

    const response: GetServiceEndpointsResponse = {
      service_name: serviceName as string,
      environment,
      from,
      to,
      endpoints,
    };

    return HttpResponse.json(response);
  }),

  // ==================== GET /services/{serviceName}/traces ====================
  http.get('/services/:serviceName/traces', ({ params, request }) => {
    const { serviceName } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '20');
    const status = url.searchParams.get('status') as 'OK' | 'ERROR' | null;
    const environment = url.searchParams.get('environment') || 'prod';

    const totalTraces = 150;
    const traces: TraceSummary[] = [];

    for (let i = 0; i < size; i++) {
      const traceStatus = status || (Math.random() > 0.15 ? 'OK' : 'ERROR');
      traces.push({
        trace_id: `trace-${Date.now()}-${i}`,
        root_span_name: `GET /api/resource/${i}`,
        status: traceStatus,
        duration_ms: Math.floor(Math.random() * 1000) + 100,
        start_time: new Date(Date.now() - i * 120000).toISOString(),
        service_name: serviceName as string,
        environment,
        labels: {
          user_id: `user-${Math.floor(Math.random() * 1000)}`,
          version: '1.0.0',
        },
      });
    }

    const response: GetServiceTracesResponse = {
      total: totalTraces,
      page,
      size,
      traces,
    };

    return HttpResponse.json(response);
  }),
];
