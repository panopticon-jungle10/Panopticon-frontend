import { http, HttpResponse } from 'msw';

/**
 * MSW API Mock Handlers
 * 개발 환경에서만 활성화되며, 실제 API 요청을 가로채서 모킹된 응답을 반환합니다.
 */

export const handlers = [
  // Dependencies API - 서비스 의존성 그래프 데이터
  http.get('/api/dependencies', () => {
    return HttpResponse.json({
      nodes: [
        { id: 'current-service', label: '현재 서비스' },
        { id: 'api-gateway', label: 'API Gateway' },
        { id: 'user-service', label: 'User Service' },
        { id: 'order-service', label: 'Order Service' },
        { id: 'payment-service', label: 'Payment Service' },
        { id: 'postgres-db', label: 'PostgreSQL DB' },
        { id: 'redis-cache', label: 'Redis Cache' },
      ],
      links: [
        {
          source: 'current-service',
          target: 'api-gateway',
          value: 1500,
          error_rate: 0.02,
        },
        {
          source: 'current-service',
          target: 'user-service',
          value: 800,
          error_rate: 0.01,
        },
        {
          source: 'current-service',
          target: 'order-service',
          value: 600,
          error_rate: 0.03,
        },
        {
          source: 'current-service',
          target: 'payment-service',
          value: 400,
          error_rate: 0.05,
        },
        {
          source: 'current-service',
          target: 'postgres-db',
          value: 2000,
          error_rate: 0.001,
        },
        {
          source: 'current-service',
          target: 'redis-cache',
          value: 3000,
          error_rate: 0.0005,
        },
      ],
    });
  }),

  // 필요에 따라 추가 API 핸들러를 여기에 정의하세요
  // 예: http.get('/api/services', () => { ... })
  // 예: http.post('/api/traces', () => { ... })
];
