import { http, HttpResponse } from 'msw';

/**
 * MSW API Mock Handlers
 * 개발 환경에서만 활성화되며, 실제 API 요청을 가로채서 모킹된 응답을 반환합니다.
 */

export const handlers = [
  // 1.1 활성 서비스 목록 조회
  http.get('/api/services', () => {
    return HttpResponse.json({
      total_count: 25,
      page: 1,
      size: 10,
      services: [
        {
          service_name: 'user-service',
          service_type: 'API_GATEWAY',
          request_count: 15234,
          error_rate: 2.3,
          p95_latency_ms: 320,
          issues_count: 1,
        },
        {
          service_name: 'order-processor',
          service_type: 'WORKER',
          request_count: 8765,
          error_rate: 0.1,
          p95_latency_ms: 1500,
          issues_count: 0,
        },
        {
          service_name: 'payment-service',
          service_type: 'API',
          request_count: 12450,
          error_rate: 1.8,
          p95_latency_ms: 450,
          issues_count: 2,
        },
        {
          service_name: 'auth-service',
          service_type: 'API',
          request_count: 9876,
          error_rate: 0.5,
          p95_latency_ms: 180,
          issues_count: 0,
        },
        {
          service_name: 'notification-service',
          service_type: 'WORKER',
          request_count: 5432,
          error_rate: 3.2,
          p95_latency_ms: 2100,
          issues_count: 1,
        },
        {
          service_name: 'inventory-service',
          service_type: 'API',
          request_count: 11234,
          error_rate: 1.5,
          p95_latency_ms: 280,
          issues_count: 0,
        },
        {
          service_name: 'shipping-service',
          service_type: 'API',
          request_count: 7890,
          error_rate: 2.1,
          p95_latency_ms: 520,
          issues_count: 1,
        },
        {
          service_name: 'analytics-worker',
          service_type: 'WORKER',
          request_count: 4567,
          error_rate: 0.8,
          p95_latency_ms: 3200,
          issues_count: 0,
        },
        {
          service_name: 'email-service',
          service_type: 'API',
          request_count: 6543,
          error_rate: 1.2,
          p95_latency_ms: 890,
          issues_count: 0,
        },
        {
          service_name: 'search-service',
          service_type: 'API',
          request_count: 13456,
          error_rate: 0.9,
          p95_latency_ms: 420,
          issues_count: 0,
        },
      ],
    });
  }),

  // 1.2 이슈 목록 조회
  http.get('/api/issues', () => {
    return HttpResponse.json({
      issues: [
        {
          issue_id: 'iss_123',
          service_name: 'payment-service',
          message: 'Error rate exceeded 5%',
          occurred_at: '2025-11-07T10:30:00Z',
          affected_requests: 1234,
        },
        {
          issue_id: 'iss_124',
          service_name: 'user-service',
          message: 'High latency detected (>500ms)',
          occurred_at: '2025-11-07T10:45:00Z',
          affected_requests: 567,
        },
        {
          issue_id: 'iss_125',
          service_name: 'notification-service',
          message: 'Memory usage above 90%',
          occurred_at: '2025-11-07T10:20:00Z',
          affected_requests: 892,
        },
        {
          issue_id: 'iss_126',
          service_name: 'shipping-service',
          message: 'Database connection pool exhausted',
          occurred_at: '2025-11-07T10:15:00Z',
          affected_requests: 345,
        },
        {
          issue_id: 'iss_127',
          service_name: 'payment-service',
          message: 'Circuit breaker opened',
          occurred_at: '2025-11-07T10:50:00Z',
          affected_requests: 678,
        },
      ],
    });
  }),

  // 1.3 전체 서비스맵 조회
  http.get('/api/service-map', () => {
    return HttpResponse.json({
      nodes: [
        {
          service_name: 'api-gateway',
          service_type: 'web',
          request_count: 50000,
          error_rate: 1.2,
          avg_latency_ms: 100,
        },
        {
          service_name: 'user-service',
          service_type: 'api',
          request_count: 25000,
          error_rate: 2.3,
          avg_latency_ms: 150,
        },
        {
          service_name: 'payment-service',
          service_type: 'api',
          request_count: 15000,
          error_rate: 1.8,
          avg_latency_ms: 200,
        },
        {
          service_name: 'order-service',
          service_type: 'api',
          request_count: 18000,
          error_rate: 1.5,
          avg_latency_ms: 180,
        },
        {
          service_name: 'inventory-service',
          service_type: 'api',
          request_count: 12000,
          error_rate: 0.8,
          avg_latency_ms: 120,
        },
        {
          service_name: 'shipping-service',
          service_type: 'api',
          request_count: 8000,
          error_rate: 2.1,
          avg_latency_ms: 250,
        },
        {
          service_name: 'notification-service',
          service_type: 'worker',
          request_count: 20000,
          error_rate: 0.5,
          avg_latency_ms: 80,
        },
        {
          service_name: 'database',
          service_type: 'db',
          request_count: 100000,
          error_rate: 0.1,
          avg_latency_ms: 50,
        },
        {
          service_name: 'cache-redis',
          service_type: 'cache',
          request_count: 80000,
          error_rate: 0.05,
          avg_latency_ms: 10,
        },
        {
          service_name: 'auth-service',
          service_type: 'api',
          request_count: 30000,
          error_rate: 0.3,
          avg_latency_ms: 90,
        },
      ],
      edges: [
        {
          source: 'api-gateway',
          target: 'user-service',
          request_count: 25000,
          avg_latency_ms: 50,
          error_count: 100,
        },
        {
          source: 'api-gateway',
          target: 'payment-service',
          request_count: 15000,
          avg_latency_ms: 80,
          error_count: 50,
        },
        {
          source: 'api-gateway',
          target: 'order-service',
          request_count: 18000,
          avg_latency_ms: 60,
          error_count: 75,
        },
        {
          source: 'api-gateway',
          target: 'auth-service',
          request_count: 30000,
          avg_latency_ms: 40,
          error_count: 30,
        },
        {
          source: 'user-service',
          target: 'database',
          request_count: 50000,
          avg_latency_ms: 30,
          error_count: 20,
        },
        {
          source: 'user-service',
          target: 'cache-redis',
          request_count: 40000,
          avg_latency_ms: 8,
          error_count: 5,
        },
        {
          source: 'payment-service',
          target: 'database',
          request_count: 30000,
          avg_latency_ms: 40,
          error_count: 15,
        },
        {
          source: 'order-service',
          target: 'database',
          request_count: 35000,
          avg_latency_ms: 35,
          error_count: 18,
        },
        {
          source: 'order-service',
          target: 'inventory-service',
          request_count: 12000,
          avg_latency_ms: 70,
          error_count: 40,
        },
        {
          source: 'order-service',
          target: 'shipping-service',
          request_count: 8000,
          avg_latency_ms: 90,
          error_count: 60,
        },
        {
          source: 'order-service',
          target: 'notification-service',
          request_count: 10000,
          avg_latency_ms: 25,
          error_count: 10,
        },
        {
          source: 'inventory-service',
          target: 'database',
          request_count: 20000,
          avg_latency_ms: 45,
          error_count: 12,
        },
        {
          source: 'shipping-service',
          target: 'database',
          request_count: 15000,
          avg_latency_ms: 50,
          error_count: 25,
        },
        {
          source: 'auth-service',
          target: 'cache-redis',
          request_count: 25000,
          avg_latency_ms: 5,
          error_count: 3,
        },
        {
          source: 'auth-service',
          target: 'database',
          request_count: 18000,
          avg_latency_ms: 38,
          error_count: 8,
        },
      ],
    });
  }),

  // 2.1 Service Summary - 메트릭 그래프 데이터
  http.get('/api/services/:serviceName/metrics', () => {
    return HttpResponse.json({
      service_name: 'user-service',
      start_time: '2025-11-06T10:00:00Z',
      end_time: '2025-11-07T10:00:00Z',
      interval: '10m',
      data: {
        requests_and_errors: [
          { timestamp: '2025-11-07T10:00:00Z', hits: 1234, errors: 23 },
          { timestamp: '2025-11-07T10:10:00Z', hits: 1256, errors: 18 },
          { timestamp: '2025-11-07T10:20:00Z', hits: 1198, errors: 31 },
          { timestamp: '2025-11-07T10:30:00Z', hits: 1302, errors: 15 },
          { timestamp: '2025-11-07T10:40:00Z', hits: 1278, errors: 22 },
          { timestamp: '2025-11-07T10:50:00Z', hits: 1345, errors: 19 },
          { timestamp: '2025-11-07T11:00:00Z', hits: 1289, errors: 25 },
          { timestamp: '2025-11-07T11:10:00Z', hits: 1367, errors: 17 },
          { timestamp: '2025-11-07T11:20:00Z', hits: 1245, errors: 28 },
          { timestamp: '2025-11-07T11:30:00Z', hits: 1312, errors: 20 },
          { timestamp: '2025-11-07T11:40:00Z', hits: 1298, errors: 24 },
          { timestamp: '2025-11-07T11:50:00Z', hits: 1356, errors: 16 },
          { timestamp: '2025-11-07T12:00:00Z', hits: 1423, errors: 21 },
          { timestamp: '2025-11-07T12:10:00Z', hits: 1387, errors: 19 },
          { timestamp: '2025-11-07T12:20:00Z', hits: 1401, errors: 27 },
        ],
        errors_by_status: [
          {
            timestamp: '2025-11-07T10:00:00Z',
            status_500: 15,
            status_502: 3,
            status_503: 2,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T10:10:00Z',
            status_500: 12,
            status_502: 2,
            status_503: 1,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T10:20:00Z',
            status_500: 20,
            status_502: 5,
            status_503: 3,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T10:30:00Z',
            status_500: 10,
            status_502: 2,
            status_503: 1,
            status_504: 2,
          },
          {
            timestamp: '2025-11-07T10:40:00Z',
            status_500: 14,
            status_502: 3,
            status_503: 2,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T10:50:00Z',
            status_500: 13,
            status_502: 2,
            status_503: 2,
            status_504: 2,
          },
          {
            timestamp: '2025-11-07T11:00:00Z',
            status_500: 16,
            status_502: 4,
            status_503: 2,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T11:10:00Z',
            status_500: 11,
            status_502: 2,
            status_503: 1,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T11:20:00Z',
            status_500: 18,
            status_502: 5,
            status_503: 3,
            status_504: 2,
          },
          {
            timestamp: '2025-11-07T11:30:00Z',
            status_500: 13,
            status_502: 3,
            status_503: 2,
            status_504: 2,
          },
          {
            timestamp: '2025-11-07T11:40:00Z',
            status_500: 15,
            status_502: 4,
            status_503: 2,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T11:50:00Z',
            status_500: 10,
            status_502: 2,
            status_503: 1,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T12:00:00Z',
            status_500: 14,
            status_502: 3,
            status_503: 2,
            status_504: 2,
          },
          {
            timestamp: '2025-11-07T12:10:00Z',
            status_500: 12,
            status_502: 3,
            status_503: 1,
            status_504: 3,
          },
          {
            timestamp: '2025-11-07T12:20:00Z',
            status_500: 17,
            status_502: 5,
            status_503: 3,
            status_504: 2,
          },
        ],
        latency: [
          { timestamp: '2025-11-07T10:00:00Z', p99_9: 450, p95: 234, p90: 156 },
          { timestamp: '2025-11-07T10:10:00Z', p99_9: 438, p95: 228, p90: 152 },
          { timestamp: '2025-11-07T10:20:00Z', p99_9: 475, p95: 256, p90: 168 },
          { timestamp: '2025-11-07T10:30:00Z', p99_9: 420, p95: 220, p90: 145 },
          { timestamp: '2025-11-07T10:40:00Z', p99_9: 465, p95: 242, p90: 160 },
          { timestamp: '2025-11-07T10:50:00Z', p99_9: 442, p95: 235, p90: 158 },
          { timestamp: '2025-11-07T11:00:00Z', p99_9: 458, p95: 245, p90: 162 },
          { timestamp: '2025-11-07T11:10:00Z', p99_9: 432, p95: 225, p90: 148 },
          { timestamp: '2025-11-07T11:20:00Z', p99_9: 482, p95: 260, p90: 172 },
          { timestamp: '2025-11-07T11:30:00Z', p99_9: 445, p95: 238, p90: 155 },
          { timestamp: '2025-11-07T11:40:00Z', p99_9: 468, p95: 248, p90: 165 },
          { timestamp: '2025-11-07T11:50:00Z', p99_9: 425, p95: 222, p90: 150 },
          { timestamp: '2025-11-07T12:00:00Z', p99_9: 452, p95: 240, p90: 159 },
          { timestamp: '2025-11-07T12:10:00Z', p99_9: 448, p95: 237, p90: 157 },
          { timestamp: '2025-11-07T12:20:00Z', p99_9: 478, p95: 258, p90: 170 },
        ],
      },
    });
  }),

  // 2.2 Resources - 리소스 목록
  http.get('/api/services/:serviceName/resources', () => {
    // 150개의 resource 데이터 동적 생성
    const allResources = [];
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const endpoints = [
      '/api/users',
      '/api/users/:id',
      '/api/users/:id/profile',
      '/api/users/:id/orders',
      '/api/users/:id/avatar',
      '/api/users/:id/settings',
      '/api/users/:id/notifications',
      '/api/users/search',
      '/api/users/batch',
      '/api/orders',
      '/api/orders/:id',
      '/api/orders/:id/items',
      '/api/products',
      '/api/products/:id',
      '/api/products/search',
      '/api/payments',
      '/api/payments/:id',
      '/api/cart',
      '/api/cart/items',
      '/api/reviews',
    ];

    const now = new Date('2025-01-11T15:00:00Z');

    for (let i = 0; i < 150; i++) {
      const method = methods[i % methods.length];
      const endpoint = endpoints[i % endpoints.length];
      const resourceName = `${method} ${endpoint}`;

      const requests = Math.floor(Math.random() * 15000) + 1000; // 1000-16000
      const avgTimeMs = Math.floor(Math.random() * 300) + 50; // 50-350ms
      const totalTimeMs = requests * avgTimeMs;
      const p95LatencyMs = avgTimeMs + Math.floor(Math.random() * 200) + 50; // avg + 50-250ms
      const errors = Math.floor(requests * (Math.random() * 0.05)); // 0-5% error
      const errorRate = (errors / requests) * 100;
      const updatedAt = new Date(now.getTime() - i * 60000); // 1분씩 과거로

      allResources.push({
        resource_name: resourceName,
        requests,
        total_time_ms: totalTimeMs,
        avg_time_ms: avgTimeMs,
        p95_latency_ms: p95LatencyMs,
        errors,
        error_rate: parseFloat(errorRate.toFixed(2)),
        updated_at: updatedAt.toISOString(),
      });
    }

    return HttpResponse.json({
      resources: allResources,
      total: allResources.length,
      page: 1,
      limit: 150,
    });
  }),

  // 2.3 Dependencies - 서비스 의존성 맵
  http.get('/api/services/:serviceName/dependencies', () => {
    return HttpResponse.json({
      service_name: 'user-service',
      incoming_requests: [
        {
          service_name: 'api-gateway',
          total_requests: 54000,
          error_rate: 0.5,
        },
        {
          service_name: 'admin-service',
          total_requests: 12000,
          error_rate: 0.3,
        },
        {
          service_name: 'order-service',
          total_requests: 8500,
          error_rate: 0.4,
        },
        {
          service_name: 'notification-service',
          total_requests: 6200,
          error_rate: 0.2,
        },
      ],
      outgoing_requests: [
        {
          service_name: 'database',
          total_requests: 162000,
          error_rate: 0.1,
        },
        {
          service_name: 'cache-service',
          total_requests: 108000,
          error_rate: 0.05,
        },
        {
          service_name: 'payment-service',
          total_requests: 45000,
          error_rate: 0.8,
        },
        {
          service_name: 'auth-service',
          total_requests: 32000,
          error_rate: 0.3,
        },
        {
          service_name: 'analytics-service',
          total_requests: 18500,
          error_rate: 0.6,
        },
        {
          service_name: 'email-service',
          total_requests: 12300,
          error_rate: 0.4,
        },
      ],
    });
  }),

  // 2.4 Traces - 트레이스 목록
  http.get('/api/services/:serviceName/traces', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '30');
    const page = parseInt(url.searchParams.get('page') || '1');

    // 더 많은 trace 데이터 생성 (100개)
    const allTraces = [];
    const resources = [
      'GET /api/users',
      'POST /api/users',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/users/search',
      'GET /api/users/profile',
      'POST /api/users/batch',
      'GET /api/users/notifications',
      'GET /api/orders',
      'POST /api/orders',
    ];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const statusCodes = [200, 200, 200, 200, 200, 400, 500, 502, 503, 504]; // 성공이 더 많도록

    const now = new Date('2025-11-11T10:00:00Z');

    for (let i = 0; i < 150; i++) {
      const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      const isError = statusCode >= 400;
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const traceDate = new Date(now.getTime() - i * 60000); // 1분씩 과거로

      allTraces.push({
        trace_id: `trace_${i.toString().padStart(5, '0')}`,
        date: traceDate.toISOString(),
        resource,
        service: 'user-service',
        duration_ms: Math.floor(Math.random() * 900) + 50, // 50-950ms
        method: methods[Math.floor(Math.random() * methods.length)],
        status_code: statusCode,
        span_count: Math.floor(Math.random() * 10) + 2,
        error: isError,
      });
    }

    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTraces = allTraces.slice(startIndex, endIndex);

    return HttpResponse.json({
      traces: paginatedTraces,
      total: allTraces.length,
      page,
      limit,
    });
  }),

  // 2.5 Trace 상세 - Span 목록
  http.get('/api/traces/:traceId', () => {
    return HttpResponse.json({
      trace_id: 'trace_abc123',
      start_time: '2025-11-07T10:35:22.000Z',
      duration_ms: 234,
      service_count: 3,
      spans: [
        {
          span_id: 'span_001',
          parent_span_id: null,
          service: 'api-gateway',
          operation: 'http.request',
          resource: 'GET /api/users/123',
          start_time_offset_ms: 0,
          duration_ms: 234,
          status: 'ok',
          tags: {
            'http.method': 'GET',
            'http.status_code': 200,
          },
          error: false,
        },
        {
          span_id: 'span_002',
          parent_span_id: 'span_001',
          service: 'user-service',
          operation: 'database.query',
          resource: 'SELECT * FROM users WHERE id=?',
          start_time_offset_ms: 10,
          duration_ms: 45,
          status: 'ok',
          error: false,
        },
        {
          span_id: 'span_003',
          parent_span_id: 'span_002',
          service: 'database',
          operation: 'db.query',
          resource: 'SELECT',
          start_time_offset_ms: 15,
          duration_ms: 30,
          status: 'ok',
          error: false,
        },
        {
          span_id: 'span_004',
          parent_span_id: 'span_001',
          service: 'cache-service',
          operation: 'cache.get',
          resource: 'GET user:123',
          start_time_offset_ms: 60,
          duration_ms: 10,
          status: 'ok',
          error: false,
        },
        {
          span_id: 'span_005',
          parent_span_id: 'span_001',
          service: 'user-service',
          operation: 'http.request',
          resource: 'GET /api/auth/verify',
          start_time_offset_ms: 75,
          duration_ms: 35,
          status: 'ok',
          error: false,
        },
        {
          span_id: 'span_006',
          parent_span_id: 'span_005',
          service: 'auth-service',
          operation: 'jwt.verify',
          resource: 'JWT verification',
          start_time_offset_ms: 80,
          duration_ms: 20,
          status: 'ok',
          error: false,
        },
        {
          span_id: 'span_007',
          parent_span_id: 'span_001',
          service: 'user-service',
          operation: 'serialize',
          resource: 'JSON serialization',
          start_time_offset_ms: 115,
          duration_ms: 8,
          status: 'ok',
          error: false,
        },
      ],
    });
  }),

  // 2.6 Errors - 에러 목록
  http.get('/api/services/:serviceName/errors', () => {
    return HttpResponse.json({
      errors: [
        {
          error_id: 'err_456',
          service_name: 'user-service',
          error_message: 'Failed to connect to database',
          resource: 'GET /api/users/:id',
          count: 234,
          first_seen: '2025-11-07T09:00:00Z',
          last_seen: '2025-11-07T10:45:00Z',
          stack_trace:
            'Error: Connection timeout\n  at Database.connect (db.js:45)\n  at UserService.getUser (service.js:23)',
          sample_trace_ids: ['trace_123', 'trace_456'],
        },
        {
          error_id: 'err_457',
          service_name: 'user-service',
          error_message: 'Validation error: Invalid user ID format',
          resource: 'GET /api/users/:id',
          count: 156,
          first_seen: '2025-11-07T09:30:00Z',
          last_seen: '2025-11-07T10:40:00Z',
          stack_trace:
            'ValidationError: ID must be numeric\n  at validateId (validator.js:12)\n  at UserController.getUser (controller.js:34)',
          sample_trace_ids: ['trace_789', 'trace_012'],
        },
        {
          error_id: 'err_458',
          service_name: 'user-service',
          error_message: 'Service unavailable',
          resource: 'POST /api/users',
          count: 89,
          first_seen: '2025-11-07T10:00:00Z',
          last_seen: '2025-11-07T10:35:00Z',
          stack_trace:
            'Error: Service temporarily unavailable\n  at ServiceRegistry.getService (registry.js:67)',
          sample_trace_ids: ['trace_345', 'trace_678'],
        },
        {
          error_id: 'err_459',
          service_name: 'user-service',
          error_message: 'Authentication failed',
          resource: 'POST /api/users/login',
          count: 78,
          first_seen: '2025-11-07T09:15:00Z',
          last_seen: '2025-11-07T10:30:00Z',
          stack_trace:
            'AuthError: Invalid credentials\n  at AuthService.authenticate (auth.js:89)\n  at LoginController.handleLogin (login.js:45)',
          sample_trace_ids: ['trace_901', 'trace_234'],
        },
        {
          error_id: 'err_460',
          service_name: 'user-service',
          error_message: 'Rate limit exceeded',
          resource: 'GET /api/users/search',
          count: 67,
          first_seen: '2025-11-07T09:45:00Z',
          last_seen: '2025-11-07T10:38:00Z',
          stack_trace:
            'RateLimitError: Too many requests\n  at RateLimiter.check (limiter.js:34)\n  at Middleware.rateLimitCheck (middleware.js:56)',
          sample_trace_ids: ['trace_567', 'trace_890'],
        },
        {
          error_id: 'err_461',
          service_name: 'user-service',
          error_message: 'Resource not found',
          resource: 'GET /api/users/:id/profile',
          count: 54,
          first_seen: '2025-11-07T09:20:00Z',
          last_seen: '2025-11-07T10:25:00Z',
          stack_trace:
            'NotFoundError: User profile not found\n  at ProfileService.getProfile (profile.js:78)\n  at ProfileController.get (controller.js:23)',
          sample_trace_ids: ['trace_123', 'trace_456'],
        },
      ],
      total: 45,
      page: 1,
      limit: 20,
    });
  }),

  // 2.7.1 로그 통계 조회
  http.get('/api/services/:serviceName/logs/stats', () => {
    return HttpResponse.json({
      service_name: 'user-service',
      start_time: '2025-11-06T10:00:00Z',
      end_time: '2025-11-07T10:00:00Z',
      total_logs: 15234,
      error_count: 567,
      warning_count: 1234,
      info_count: 13433,
      breakdown: [
        {
          level: 'error',
          count: 567,
          percentage: 3.72,
        },
        {
          level: 'warning',
          count: 1234,
          percentage: 8.1,
        },
        {
          level: 'info',
          count: 13433,
          percentage: 88.18,
        },
      ],
    });
  }),

  // 2.7.2 로그 목록 조회
  http.get('/api/services/:serviceName/logs', ({ request }) => {
    const url = new URL(request.url);
    const level = url.searchParams.get('level') || 'error';

    return HttpResponse.json({
      logs: [
        {
          log_id: 'log_789',
          timestamp: '2025-11-07T10:45:30.123Z',
          level: level,
          service: 'user-service',
          message: 'Database connection timeout',
          trace_id: 'trace_abc123',
          span_id: 'span_002',
          attributes: {
            'error.type': 'TimeoutError',
            'database.host': 'db-primary',
          },
        },
        {
          log_id: 'log_790',
          timestamp: '2025-11-07T10:44:15.456Z',
          level: level,
          service: 'user-service',
          message: 'Failed to process user request',
          trace_id: 'trace_def456',
          span_id: 'span_003',
          attributes: {
            'error.type': 'ProcessingError',
            'user.id': '12345',
          },
        },
        {
          log_id: 'log_791',
          timestamp: '2025-11-07T10:43:22.789Z',
          level: level,
          service: 'user-service',
          message: 'Invalid input parameters',
          trace_id: 'trace_ghi789',
          span_id: 'span_004',
          attributes: {
            'error.type': 'ValidationError',
            'request.path': '/api/users/invalid',
          },
        },
      ],
      total: 567,
      page: 1,
      limit: 50,
      filtered_level: level,
    });
  }),
];
