// 더미 데이터

import { ErrorResponse, ErrorTrendSeries } from './types';
import type { StatItem } from '@/components/features/apm/services/[serviceId]/logs/types';

/* 상단 Summary 카드 */
export const mockErrorSummary: StatItem[] = [
  { id: 'error_rate', label: 'Error Rate', value: '2.3%', tone: 'info' },
  { id: 'error_count', label: 'Error Count', value: '1,243', tone: 'danger' },
];

/* 테이블 */
export const mockErrorResponse: ErrorResponse = {
  errors: [
    {
      error_id: 'err_001',
      service_name: 'user-service',
      error_message: 'Timeout while connecting to DB',
      resource: 'GET /api/users/:id',
      count: 234,
      first_seen: '2025-11-11T08:00:00Z',
      last_seen: '2025-11-11T10:45:00Z',
      stack_trace: 'Error: Connection timeout\n at Database.connect (/src/db.js:42:15)',
      sample_trace_ids: ['trace_001', 'trace_002'],
    },
    {
      error_id: 'err_002',
      service_name: 'payment-service',
      error_message: 'Stripe API 401 Unauthorized',
      resource: 'POST /api/payments/charge',
      count: 132,
      first_seen: '2025-11-11T08:15:00Z',
      last_seen: '2025-11-11T10:30:00Z',
      stack_trace: 'Error: Unauthorized request\n at StripeClient.request (/src/stripe.js:77:10)',
      sample_trace_ids: ['trace_010', 'trace_011'],
    },
    {
      error_id: 'err_003',
      service_name: 'order-service',
      error_message: 'Syntax error in SQL query',
      resource: 'GET /api/orders',
      count: 17,
      first_seen: '2025-11-11T07:40:00Z',
      last_seen: '2025-11-11T09:15:00Z',
      stack_trace:
        'SyntaxError: Invalid SQL near "FROM"\n at OrderRepository.findAll (/src/order.js:90:8)',
      sample_trace_ids: ['trace_020', 'trace_021'],
    },
  ],
  total: 3,
  page: 1,
  limit: 20,
};

/* 트렌드 그래프 (현재 시각 기준 직전 24시간) */
export const mockErrorTrendData: ErrorTrendSeries[] = [
  {
    service: 'user-service',
    color: '#3b82f6',
    data: Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i)); // 최근 24시간
      return {
        timestamp: date.toISOString(),
        count: Math.floor(Math.random() * 400 + 150),
      };
    }),
  },
  {
    service: 'payment-service',
    color: '#10b981',
    data: Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i));
      return {
        timestamp: date.toISOString(),
        count: Math.floor(Math.random() * 250 + 50),
      };
    }),
  },
  {
    service: 'order-service',
    color: '#ef4444',
    data: Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i));
      return {
        timestamp: date.toISOString(),
        count: Math.floor(Math.random() * 150 + 30),
      };
    }),
  },
];
